import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { generateSnapshotPDF } from "@/lib/snapshot";

/**
 * GET /api/scripts/[scriptId]/versions/[versionId]/snapshot
 * 
 * Generates and returns a PDF snapshot of the script version evidence record.
 * This is a single-page PDF containing the key metadata and fingerprint.
 */
export async function GET(
  req: Request,
  { params }: { params: { scriptId: string; versionId: string } }
) {
  try {
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

    const { scriptId, versionId } = params;

    // Verify script ownership
    const { data: script, error: sErr } = await supabase
      .from("scripts")
      .select("*")
      .eq("id", scriptId)
      .eq("user_id", userId)
      .single();

    if (sErr || !script) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    // Verify version ownership and get version data
    const { data: version, error: vErr } = await supabase
      .from("script_versions")
      .select("*")
      .eq("id", versionId)
      .eq("user_id", userId)
      .eq("script_id", scriptId)
      .single();

    if (vErr || !version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    if (!version.sha256 || !version.committed_at) {
      return NextResponse.json(
        { error: "Version not committed yet" },
        { status: 400 }
      );
    }

    // Generate PDF snapshot using shared utility
    const pdfBuffer = await generateSnapshotPDF({
      title: script.title,
      scriptId,
      versionId,
      filename: version.original_filename || "file",
      byteSize: version.byte_size ? Number(version.byte_size) : null,
      pageCount: version.page_count,
      sha256: version.sha256,
      committedAt: new Date(version.committed_at).toISOString(),
    });

    // Log snapshot generation
    await supabase.from("audit_log").insert({
      user_id: userId,
      script_id: scriptId,
      version_id: versionId,
      action: "snapshot_generated",
      metadata: { versionId },
    });

    // Return PDF with appropriate headers
    return new NextResponse(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="DraftLock_Snapshot_${scriptId}_${versionId}.pdf"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (e: any) {
    console.error("Error generating snapshot:", e);
    return NextResponse.json(
      { error: e?.message || "Failed to generate snapshot" },
      { status: 500 }
    );
  }
}
