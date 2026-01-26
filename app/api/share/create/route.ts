import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { randomToken } from "@/lib/crypto";

export async function POST(req: Request) {
  const supabase = supabaseServerService();
  const { userId, scriptId, versionId, viewerLabel } = await req.json();

  if (!userId || !scriptId || !versionId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

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

  if (lErr) return NextResponse.json({ error: lErr.message }, { status: 500 });

  await supabase.from("audit_log").insert({
    user_id: userId,
    script_id: scriptId,
    script_version_id: versionId,
    action: "shared",
    metadata: { token, viewerLabel: viewerLabel ?? null },
  });

  return NextResponse.json({ token, shareUrl: `/s/${token}` });
}
