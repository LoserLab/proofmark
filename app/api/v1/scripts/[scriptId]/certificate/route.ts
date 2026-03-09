import { NextRequest, NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { authenticateApiKey } from "@/lib/v1/auth";
import { notFound, invalidRequest, versionNotCommitted, internalError } from "@/lib/v1/errors";
import { isValidUuid } from "@/lib/v1/validation";
import { generateCertificatePdf } from "@/lib/certificate-pdf";

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

  // Fetch version
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

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://proofmark.xyz";
    const pdfBytes = await generateCertificatePdf({
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

    // Audit log
    supabase.from("audit_log").insert({
      user_id: userId,
      script_id: script.id,
      script_version_id: version.id,
      action: "certificate_generated",
      metadata: { source: "api_v1" },
    }).then(() => {});

    return new NextResponse(pdfBytes as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ProofMark_Certificate_${script.id}.pdf"`,
      },
    });
  } catch (err) {
    console.error("[api/v1/certificate] PDF generation failed:", err);
    return internalError("Certificate generation failed");
  }
}
