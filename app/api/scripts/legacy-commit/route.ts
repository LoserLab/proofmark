import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { sha256Hex } from "@/lib/crypto";
import { buildReceiptText } from "@/lib/receipt";
import { config } from "@/lib/config";

export async function POST(req: Request) {
  // Authenticate user from session
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const supabase = supabaseServerService();
  const { scriptId, versionId } = await req.json();

  if (!scriptId || !versionId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data: version, error: verErr } = await supabase
    .from("script_versions")
    .select("*")
    .eq("id", versionId)
    .eq("user_id", userId)
    .single();

  if (verErr) {
    console.error("[api/scripts/legacy-commit] Version fetch error:", verErr.message);
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

  const bucket = config.storage.bucket;
  const { data: file, error: dlErr } = await supabase.storage
    .from(bucket)
    .download(version.file_path);

  if (dlErr) {
    console.error("[api/scripts/legacy-commit] File download error:", dlErr.message);
    return NextResponse.json({ error: "Failed to retrieve file" }, { status: 500 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const sha = await sha256Hex(buf);
  const committedAt = new Date().toISOString();

  const { data: script, error: sErr } = await supabase
    .from("scripts")
    .select("title")
    .eq("id", scriptId)
    .eq("user_id", userId)
    .single();

  if (sErr) {
    console.error("[api/scripts/legacy-commit] Script fetch error:", sErr.message);
    return NextResponse.json({ error: "Script not found" }, { status: 404 });
  }

  // Use RPC to bypass PostgREST schema cache issues
  const { error: updateErr } = await supabase.rpc('commit_version', {
    p_version_id: versionId,
    p_user_id: userId,
    p_sha256: sha,
    p_committed_at: committedAt,
    p_chain_status: null,
  });

  if (updateErr) {
    console.error("[api/scripts/legacy-commit] commit_version RPC error:", updateErr.message);
    return NextResponse.json({ error: "Failed to commit version" }, { status: 500 });
  }

  await supabase.from("audit_log").insert({
    user_id: userId,
    script_id: scriptId,
    script_version_id: versionId,
    action: "upload_committed",
    metadata: { sha256: sha, committedAt },
  });

  const receipt = buildReceiptText({
    title: script.title ?? "Untitled screenplay",
    draftId: scriptId,
    versionId,
    filename: version.original_filename,
    byteSize: Number(version.byte_size),
    sha256: sha,
    timestampUtc: committedAt,
  });

  return NextResponse.json({ sha256: sha, committedAt, receiptText: receipt });
}
