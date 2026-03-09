import { NextResponse } from "next/server";
import { createClient, supabaseServerService } from "@/lib/supabase/server";
import { randomToken } from "@/lib/crypto";

export async function POST(req: Request) {
  // Authenticate from session (never trust userId from body)
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const supabase = supabaseServerService();
  const { scriptId, versionId, viewerLabel } = await req.json();

  if (!scriptId || !versionId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Verify ownership: script must belong to authenticated user
  const { data: script, error: sErr } = await supabase
    .from("scripts")
    .select("id, user_id")
    .eq("id", scriptId)
    .eq("user_id", userId)
    .single();

  if (sErr || !script) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 });
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

  const { data: link, error: lErr } = await supabase
    .from("share_links")
    .insert({
      created_by: userId,
      script_id: scriptId,
      version_id: versionId,
      token,
      viewer_label: viewerLabel ?? null,
    })
    .select("*")
    .single();

  if (lErr) {
    console.error("[share/create] Insert error:", lErr.message);
    return NextResponse.json({ error: "Failed to create share link" }, { status: 500 });
  }

  await supabase.from("audit_log").insert({
    user_id: userId,
    script_id: scriptId,
    script_version_id: versionId,
    action: "shared",
    metadata: { token, viewerLabel: viewerLabel ?? null },
  });

  return NextResponse.json({ token, shareUrl: `/s/${token}` });
}
