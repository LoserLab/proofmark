import { NextRequest, NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { randomToken } from "@/lib/crypto";
import { authenticateApiKey } from "@/lib/v1/auth";
import { notFound, invalidRequest, internalError } from "@/lib/v1/errors";
import { isValidUuid } from "@/lib/v1/validation";
import type { ShareResponse } from "@/lib/v1/types";

export async function POST(
  req: NextRequest,
  { params }: { params: { scriptId: string } }
) {
  const auth = await authenticateApiKey(req);
  if (auth instanceof NextResponse) return auth;
  const { userId } = auth;

  if (!isValidUuid(params.scriptId)) {
    return invalidRequest("Invalid scriptId format");
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return invalidRequest("Invalid JSON body");
  }

  const { versionId, viewerLabel, expiresInDays, allowDownload } = body;

  if (!versionId) {
    return invalidRequest("Missing required field: versionId");
  }
  if (!isValidUuid(versionId)) {
    return invalidRequest("Invalid versionId format");
  }

  const supabase = supabaseServerService();

  // Verify script ownership
  const { data: script, error: sErr } = await supabase
    .from("scripts")
    .select("id")
    .eq("id", params.scriptId)
    .eq("user_id", userId)
    .single();

  if (sErr || !script) return notFound("Script not found");

  // Verify version belongs to this script
  const { data: version, error: vErr } = await supabase
    .from("script_versions")
    .select("id, script_id")
    .eq("id", versionId)
    .eq("user_id", userId)
    .single();

  if (vErr || !version) return notFound("Version not found");
  if (version.script_id !== params.scriptId) {
    return invalidRequest("Version does not belong to this script");
  }

  // Generate token (10 bytes = 20 hex chars)
  const token = randomToken(10);

  // Calculate expiration
  let expiresAt: string | null = null;
  if (expiresInDays && expiresInDays > 0) {
    const d = new Date();
    d.setDate(d.getDate() + Math.min(expiresInDays, 365));
    expiresAt = d.toISOString();
  }

  const { error: insertErr } = await supabase.from("share_links").insert({
    script_id: params.scriptId,
    version_id: versionId,
    token,
    created_by: userId,
    viewer_label: viewerLabel ?? null,
    allow_download: allowDownload !== false,
    expires_at: expiresAt,
  });

  if (insertErr) {
    console.error("[api/v1/share] Insert error:", insertErr.message);
    return internalError("Failed to create share link");
  }

  // Audit log
  supabase.from("audit_log").insert({
    user_id: userId,
    script_id: params.scriptId,
    script_version_id: versionId,
    action: "share_created",
    metadata: { token, viewerLabel, expiresInDays, source: "api_v1" },
  }).then(() => {});

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://proofmark.xyz";

  const response: ShareResponse = {
    token,
    shareUrl: `${appUrl}/s/${token}`,
  };

  return NextResponse.json(response);
}
