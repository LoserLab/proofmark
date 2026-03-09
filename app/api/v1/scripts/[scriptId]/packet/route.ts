import { NextRequest, NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { authenticateApiKey } from "@/lib/v1/auth";
import { notFound, invalidRequest, versionNotCommitted, internalError } from "@/lib/v1/errors";
import { isValidUuid } from "@/lib/v1/validation";
import { config } from "@/lib/config";
import { buildMetadataSummary } from "@/lib/metadata-summary";
import { buildReceiptJSON } from "@/lib/receipt-json";
import { generateCertificatePdf } from "@/lib/certificate-pdf";
import JSZip from "jszip";

export async function GET(
  req: NextRequest,
  { params }: { params: { scriptId: string } }
) {
  const auth = await authenticateApiKey(req);
  if (auth instanceof NextResponse) return auth;
  const { userId } = auth;

  if (!isValidUuid(params.scriptId)) {
    return invalidRequest("Invalid scriptId format");
  }

  const url = new URL(req.url);
  const versionId = url.searchParams.get("versionId");

  const supabase = supabaseServerService();

  // Fetch script with ownership check
  const { data: script, error: sErr } = await supabase
    .from("scripts")
    .select("*")
    .eq("id", params.scriptId)
    .eq("user_id", userId)
    .single();

  if (sErr || !script) return notFound("Script not found");

  // Fetch version — specific or latest committed
  let version;
  if (versionId) {
    if (!isValidUuid(versionId)) return invalidRequest("Invalid versionId format");

    const { data, error } = await supabase
      .from("script_versions")
      .select("*")
      .eq("id", versionId)
      .eq("user_id", userId)
      .single();

    if (error || !data) return notFound("Version not found");
    version = data;
  } else {
    const { data, error } = await supabase
      .from("script_versions")
      .select("*")
      .eq("script_id", params.scriptId)
      .eq("user_id", userId)
      .eq("status", "committed")
      .order("version_number", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return notFound("No committed version found");
    version = data;
  }

  if (!version.sha256 || !version.committed_at) {
    return versionNotCommitted();
  }

  // Check cache
  const bucket = config.storage.bucket;
  if (version.packet_path) {
    const { data: cached, error: cacheErr } = await supabase.storage
      .from(bucket)
      .download(version.packet_path);

    if (!cacheErr && cached) {
      const buf = Buffer.from(await cached.arrayBuffer());
      return new NextResponse(buf as unknown as BodyInit, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="ProofMark_Evidence_Pack_${script.id}.zip"`,
        },
      });
    }
  }

  // Download original file
  let originalFileBuffer: Buffer | null = null;
  const storagePath = version.file_path || version.storage_path;
  if (storagePath) {
    const { data: fileData, error: fileErr } = await supabase.storage
      .from(bucket)
      .download(storagePath);
    if (!fileErr && fileData) {
      originalFileBuffer = Buffer.from(await fileData.arrayBuffer());
    }
  }

  // Download snapshot
  let snapshotBuffer: Buffer | null = null;
  if (version.snapshot_path) {
    const { data, error } = await supabase.storage.from(bucket).download(version.snapshot_path);
    if (!error && data) snapshotBuffer = Buffer.from(await data.arrayBuffer());
  }

  // Download worksheet
  let worksheetBuffer: Buffer | null = null;
  if (version.worksheet_path) {
    const { data, error } = await supabase.storage.from(bucket).download(version.worksheet_path);
    if (!error && data) worksheetBuffer = Buffer.from(await data.arrayBuffer());
  }

  // Build ZIP
  const metadataSummary = buildMetadataSummary({ script, version });
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
    txHash: version.tx_hash,
    blockNumber: version.block_number ? Number(version.block_number) : null,
    chainStatus: version.chain_status,
    chainRegisteredAt: version.chain_registered_at,
  });

  const { data: auditEntries } = await supabase
    .from("audit_log")
    .select("*")
    .eq("script_id", script.id)
    .eq("script_version_id", version.id)
    .order("created_at", { ascending: true });

  const zip = new JSZip();
  const folder = zip.folder("evidence");
  if (!folder) return internalError("Failed to create evidence folder");

  if (originalFileBuffer) {
    const isPdf = version.mime_type?.includes("pdf") || version.original_filename?.toLowerCase().endsWith(".pdf");
    if (!isPdf && version.original_filename?.includes(".")) {
      const ext = version.original_filename.split(".").pop()?.toLowerCase();
      folder.file(`original_file.${ext || "bin"}`, originalFileBuffer);
    } else {
      folder.file(isPdf ? "original_file.pdf" : "original_file", originalFileBuffer);
    }
  }
  if (snapshotBuffer) folder.file("snapshot.pdf", snapshotBuffer);
  folder.file("metadata_summary.txt", metadataSummary);
  if (worksheetBuffer) folder.file("registration_worksheet.pdf", worksheetBuffer);
  folder.file("receipt.json", JSON.stringify(receiptJson, null, 2));
  folder.file(
    "audit_log.json",
    JSON.stringify({
      generated_at_utc: new Date().toISOString(),
      script_id: script.id,
      script_version_id: version.id,
      entries: auditEntries || [],
    }, null, 2)
  );

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://proofmark.xyz";
    const certBytes = await generateCertificatePdf({
      title: script.title || "Untitled Work",
      workType: script.work_type || "Document",
      sha256: version.sha256,
      committedAt: version.committed_at,
      versionId: version.id,
      filename: version.original_filename || "file",
      txHash: version.tx_hash,
      blockNumber: version.block_number ? Number(version.block_number) : undefined,
      verificationUrl: `${appUrl}/verify?hash=${version.sha256}`,
    });
    folder.file("certificate.pdf", certBytes);
  } catch (err) {
    console.warn("[api/v1/packet] Certificate generation failed, skipping:", err);
  }

  const zipBuf = await zip.generateAsync({ type: "nodebuffer" });

  // Cache the packet
  const packetPath = `scripts/${script.id}/versions/${version.id}/packet.zip`;
  const { error: uploadErr } = await supabase.storage
    .from(bucket)
    .upload(packetPath, zipBuf, { contentType: "application/zip", upsert: true });

  if (!uploadErr) {
    supabase
      .from("script_versions")
      .update({ packet_path: packetPath })
      .eq("id", version.id)
      .then(() => {});
  }

  // Audit log on first generation
  if (!version.packet_path) {
    supabase.from("audit_log").insert({
      user_id: userId,
      script_id: script.id,
      script_version_id: version.id,
      action: "packet_generated",
      metadata: { source: "api_v1" },
    }).then(() => {});
  }

  return new NextResponse(zipBuf as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="ProofMark_Evidence_Pack_${script.id}.zip"`,
    },
  });
}
