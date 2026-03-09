import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { buildWatermarkText } from "@/lib/watermark";
import { watermarkPdfBuffer } from "@/lib/pdf/watermarkPdf";
import { config } from "@/lib/config";

export async function GET(req: Request, { params }: { params: { token: string } }) {
  const supabase = supabaseServerService();
  const token = params.token;

  const { data: link, error: linkErr } = await supabase
    .from("share_links")
    .select("token, viewer_label, revoked_at, script_id, version_id, created_at")
    .eq("token", token)
    .single();

  if (linkErr || !link || link.revoked_at) {
    return new NextResponse("Link unavailable.", { status: 404 });
  }

  const { data: version, error: vErr } = await supabase
    .from("script_versions")
    .select("storage_path, mime_type, original_filename")
    .eq("id", link.version_id)
    .single();

  if (vErr || !version) return new NextResponse("Not found.", { status: 404 });

  // Only watermark PDFs for now
  if (!String(version.mime_type).includes("pdf")) {
    return new NextResponse("View copy is only available for PDF in this MVP.", { status: 400 });
  }

  const bucket = config.storage.bucket;
  const { data: file, error: dlErr } = await supabase.storage
    .from(bucket)
    .download(version.storage_path);

  if (dlErr || !file) return new NextResponse("Failed to load file.", { status: 500 });

  const pdfBytes = Buffer.from(await file.arrayBuffer());

  const watermarkText = buildWatermarkText({
    viewerLabel: link.viewer_label,
    sharedAtUtcISO: new Date(link.created_at).toISOString(),
    token: link.token
  });

  const watermarked = await watermarkPdfBuffer({ pdfBytes, watermarkText });

  return new NextResponse(watermarked, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="ProofMark_ViewCopy.pdf"`
    }
  });
}
