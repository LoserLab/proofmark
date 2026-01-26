import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import JSZip from "jszip";
import { config } from "@/lib/config";
import { buildMetadataSummary } from "@/lib/metadata-summary";
import { buildReceiptJSON } from "@/lib/receipt-json";

async function generatePacket(req: Request, { params }: { params: { scriptId: string } }) {
  // Get userId from auth session
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const supabase = supabaseServerService();
  
  // Support both GET (query params) and POST (body)
  let versionId: string | null = null;
  
  if (req.method === "POST") {
    const body = await req.json();
    versionId = body.versionId;
  } else {
    const url = new URL(req.url);
    versionId = url.searchParams.get("versionId");
  }

  if (!versionId) {
    return NextResponse.json({ error: "Missing versionId" }, { status: 400 });
  }

  const { data: script, error: sErr } = await supabase
    .from("scripts")
    .select("*")
    .eq("id", params.scriptId)
    .eq("user_id", userId)
    .single();

  if (sErr) {
    console.error("[api/scripts/packet] Script fetch error:", sErr.message);
    return NextResponse.json({ error: "Script not found" }, { status: 404 });
  }

  const { data: version, error: vErr } = await supabase
    .from("script_versions")
    .select("*")
    .eq("id", versionId)
    .eq("user_id", userId)
    .single();

  if (vErr) {
    console.error("[api/scripts/packet] Version fetch error:", vErr.message);
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }
  if (!version.sha256 || !version.committed_at) {
    return NextResponse.json({ error: "Version not committed yet" }, { status: 400 });
  }

  // Check if packet already exists in storage
  if (version.packet_path) {
    const bucket = config.storage.bucket;
    const { data: packetData, error: packetErr } = await supabase.storage
      .from(bucket)
      .download(version.packet_path);

    if (!packetErr && packetData) {
      // Packet exists, stream it directly
      const packetBuffer = Buffer.from(await packetData.arrayBuffer());
      
      return new NextResponse(packetBuffer as any, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="DraftLock_Evidence_Pack_${script.id}.zip"`,
        },
      });
    }
    // If download fails, continue to generate new packet (packet_path might be stale)
  }

  // Download original file from storage
  const bucket = config.storage.bucket;
  let originalFileBuffer: Buffer | null = null;
  if (version.file_path) {
    const { data: fileData, error: fileErr } = await supabase.storage
      .from(bucket)
      .download(version.file_path);
    
    if (!fileErr && fileData) {
      originalFileBuffer = Buffer.from(await fileData.arrayBuffer());
    }
  }

  // Download script snapshot PDF from storage (if available)
  // This is the static snapshot of the uploaded PDF, not the evidence record PDF
  let scriptSnapshotBuffer: Buffer | null = null;
  if (version.snapshot_path) {
    const { data: snapshotData, error: snapshotErr } = await supabase.storage
      .from(bucket)
      .download(version.snapshot_path);
    
    if (!snapshotErr && snapshotData) {
      scriptSnapshotBuffer = Buffer.from(await snapshotData.arrayBuffer());
    }
  }

  // Download registration worksheet PDF from storage (if available)
  // Use stored worksheet_path from database, or construct path as fallback
  let registrationWorksheetBuffer: Buffer | null = null;
  const worksheetPath = version.worksheet_path || `scripts/${script.id}/versions/${version.id}/registration_worksheet.pdf`;
  
  if (version.worksheet_path) {
    const { data: worksheetData, error: worksheetErr } = await supabase.storage
      .from(bucket)
      .download(worksheetPath);
    
    if (!worksheetErr && worksheetData) {
      registrationWorksheetBuffer = Buffer.from(await worksheetData.arrayBuffer());
    }
  }

  // Note: We no longer generate the evidence record PDF here
  // The snapshot.pdf is the static snapshot of the uploaded PDF (if available)
  // The metadata_summary.txt contains the readable summary

  // Build metadata summary
  const metadataSummary = buildMetadataSummary({ script, version });

  // Build receipt JSON
  const receiptJson = buildReceiptJSON({
    title: script.title,
    scriptId: script.id,
    versionId: version.id,
    filename: version.original_filename || "file",
    byteSize: version.byte_size ? Number(version.byte_size) : null,
    pageCount: version.page_count,
    sha256: version.sha256,
    timestampUtc: new Date(version.committed_at).toISOString(),
    workType: script.work_type,
    mimeType: version.mime_type,
  });

  // Fetch audit log entries for this version
  const { data: auditEntries, error: auditErr } = await supabase
    .from("audit_log")
    .select("*")
    .eq("script_id", script.id)
    .eq("version_id", version.id)
    .order("created_at", { ascending: true });

  // Create the evidence pack in /evidence/ folder structure
  const finalZip = new JSZip();
  const evidenceFolder = finalZip.folder("evidence");

  if (!evidenceFolder) {
    return NextResponse.json({ error: "Failed to create evidence folder" }, { status: 500 });
  }

  // Add original file (if available)
  // Always name it original_file.pdf if it's a PDF, otherwise preserve extension
  if (originalFileBuffer) {
    const isPdf = version.mime_type?.includes("pdf") || version.original_filename?.toLowerCase().endsWith(".pdf");
    const originalName = isPdf ? "original_file.pdf" : "original_file";
    
    // If not PDF, try to preserve extension
    if (!isPdf && version.original_filename?.includes(".")) {
      const ext = version.original_filename.split(".").pop()?.toLowerCase();
      if (ext) {
        evidenceFolder.file(`original_file.${ext}`, originalFileBuffer);
      } else {
        evidenceFolder.file(originalName, originalFileBuffer);
      }
    } else {
      evidenceFolder.file(originalName, originalFileBuffer);
    }
  }

  // Add script snapshot PDF (static snapshot of uploaded PDF, if available)
  // This is the re-saved version of the uploaded PDF, not the evidence record
  if (scriptSnapshotBuffer) {
    evidenceFolder.file("snapshot.pdf", scriptSnapshotBuffer);
  }

  // Add metadata summary
  evidenceFolder.file("metadata_summary.txt", metadataSummary);

  // Add registration worksheet PDF (if available)
  if (registrationWorksheetBuffer) {
    evidenceFolder.file("registration_worksheet.pdf", registrationWorksheetBuffer);
  }

  // Add receipt JSON
  evidenceFolder.file("receipt.json", JSON.stringify(receiptJson, null, 2));

  // Add audit log JSON
  evidenceFolder.file("audit_log.json", JSON.stringify({
    generated_at_utc: new Date().toISOString(),
    script_id: script.id,
    version_id: version.id,
    entries: auditEntries || [],
  }, null, 2));

  const zipBuf = await finalZip.generateAsync({ type: "nodebuffer" });

  // Store packet in storage
  const packetPath = `scripts/${script.id}/versions/${version.id}/packet.zip`;
  
  const { error: uploadErr } = await supabase.storage
    .from(bucket)
    .upload(packetPath, zipBuf, {
      contentType: "application/zip",
      upsert: true, // Overwrite if exists
    });

  // Save packet_path to database (non-blocking - if it fails, packet still works)
  if (!uploadErr) {
    await supabase
      .from("script_versions")
      .update({ packet_path: packetPath })
      .eq("id", version.id);
  }

  // Log packet generation (only on first generation, not re-downloads)
  if (!version.packet_path) {
    await supabase.from("audit_log").insert({
      user_id: userId,
      script_id: script.id,
      version_id: version.id,
      action: "packet_generated",
      details: { versionId: version.id, packetPath },
    });
  }

  return new NextResponse(zipBuf as any, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="DraftLock_Evidence_Pack_${script.id}.zip"`
    }
  });
}

export async function GET(req: Request, { params }: { params: { scriptId: string } }) {
  return generatePacket(req, { params });
}

export async function POST(req: Request, ctx: { params: { scriptId: string } }) {
  return generatePacket(req, ctx);
}
