import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import {
  generateCertificatePdf,
  CertificateData,
} from "@/lib/certificate-pdf";

export async function GET(
  req: Request,
  { params }: { params: { scriptId: string } }
) {
  // Auth check - same pattern as packet route
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const supabase = supabaseServerService();

  // Optional versionId query param; defaults to latest committed version
  const url = new URL(req.url);
  const versionIdParam = url.searchParams.get("versionId");

  // Fetch script (must belong to user)
  const { data: script, error: sErr } = await supabase
    .from("scripts")
    .select("id, title, work_type")
    .eq("id", params.scriptId)
    .eq("user_id", userId)
    .single();

  if (sErr || !script) {
    return NextResponse.json({ error: "Script not found" }, { status: 404 });
  }

  // Fetch version - either by ID or latest committed
  let versionQuery = supabase
    .from("script_versions")
    .select(
      "id, sha256, committed_at, tx_hash, block_number, original_filename, status"
    )
    .eq("script_id", script.id)
    .eq("user_id", userId)
    .eq("status", "committed");

  if (versionIdParam) {
    versionQuery = versionQuery.eq("id", versionIdParam);
  } else {
    versionQuery = versionQuery
      .order("committed_at", { ascending: false })
      .limit(1);
  }

  const { data: versions, error: vErr } = await versionQuery;

  if (vErr || !versions || versions.length === 0) {
    return NextResponse.json(
      { error: "No committed version found" },
      { status: 404 }
    );
  }

  const version = versions[0];

  if (!version.sha256 || !version.committed_at) {
    return NextResponse.json(
      { error: "Version not committed yet" },
      { status: 400 }
    );
  }

  // Build verification URL
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.proofmark.xyz";
  const verificationUrl = `${appUrl}/verify?hash=${version.sha256}`;

  const certificateData: CertificateData = {
    title: script.title || "Untitled Work",
    workType: script.work_type || "Document",
    sha256: version.sha256,
    committedAt: version.committed_at,
    versionId: version.id,
    filename: version.original_filename || "Unknown",
    txHash: version.tx_hash || null,
    blockNumber: version.block_number
      ? Number(version.block_number)
      : null,
    verificationUrl,
  };

  const pdfBytes = await generateCertificatePdf(certificateData);

  // Log certificate generation
  await supabase.from("audit_log").insert({
    user_id: userId,
    script_id: script.id,
    script_version_id: version.id,
    action: "certificate_generated",
    metadata: { versionId: version.id },
  });

  return new NextResponse(pdfBytes as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="ProofMark_Certificate_${script.id}.pdf"`,
    },
  });
}
