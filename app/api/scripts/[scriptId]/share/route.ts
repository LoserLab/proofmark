import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { randomToken } from "@/lib/crypto";
import { generateViewerId } from "@/lib/viewer-id";

export async function POST(
  req: Request,
  { params }: { params: { scriptId: string } }
) {
  const supabase = supabaseServerService();
  const body = await req.json();
  const { versionId, expiresInDays, allowDownload } = body;

  if (!versionId) {
    return NextResponse.json({ error: "Missing versionId" }, { status: 400 });
  }

  const scriptId = params.scriptId;

  // Get userId from auth session
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  // Verify ownership: script must belong to this user
  const { data: script, error: sErr } = await supabase
    .from("scripts")
    .select("id, user_id")
    .eq("id", scriptId)
    .single();

  if (sErr || !script) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  }

  if (script.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Verify version belongs to script
  const { data: version, error: vErr } = await supabase
    .from("script_versions")
    .select("id, script_id")
    .eq("id", versionId)
    .single();

  if (vErr || !version) {
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

  if (version.script_id !== scriptId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const token = randomToken(20);
  const viewerId = generateViewerId(); // Generate viewer ID at creation

  // Calculate expiration date if provided
  let expiresAt: string | null = null;
  if (expiresInDays && expiresInDays > 0) {
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + expiresInDays);
    expiresAt = expiresDate.toISOString();
  }

  const { data: link, error: lErr } = await supabase
    .from("share_links")
    .insert({
      created_by: userId,
      script_id: scriptId,
      version_id: versionId,
      token,
      expires_at: expiresAt,
      viewer_label: null, // Can be set later if needed
      viewer_id: viewerId, // Store viewer ID at creation
      allow_download: allowDownload ?? true,
    })
    .select("*")
    .single();

  if (lErr) {
    console.error("[api/scripts/share] Share link creation error:", lErr.message);
    return NextResponse.json({ error: "Failed to create share link" }, { status: 500 });
  }

  // Construct share URL
  const url = new URL(req.url);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${url.protocol}//${url.host}`;
  const shareUrl = `${baseUrl}/s/${token}`;

  // Log to audit
  await supabase.from("audit_log").insert({
    user_id: userId,
    script_id: scriptId,
    script_version_id: versionId,
    action: "share_created",
    metadata: { token, expiresAt, allowDownload },
  });

  return NextResponse.json({
    token,
    url: shareUrl,
    shareUrl,
  });
}
