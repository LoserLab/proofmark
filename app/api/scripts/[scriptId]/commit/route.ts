import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { sha256Hex } from "@/lib/crypto";
import { buildReceiptText } from "@/lib/receipt";
import { config } from "@/lib/config";
import { registerHashOnChain } from "@/lib/blockchain/register";
import { isBlockchainEnabled } from "@/lib/blockchain/client";

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
    console.error("[api/scripts/commit] Version fetch error:", verErr.message);
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

  const bucket = config.storage.bucket;
  const { data: file, error: dlErr } = await supabase.storage.from(bucket).download(version.storage_path);
  if (dlErr) {
    console.error("[api/scripts/commit] File download error:", dlErr.message);
    return NextResponse.json({ error: "Failed to retrieve file" }, { status: 500 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const sha = await sha256Hex(buf);
  const committedAt = new Date().toISOString();

  const { data: script, error: sErr } = await supabase
    .from("scripts")
    .select("title, work_type")
    .eq("id", scriptId)
    .eq("user_id", userId)
    .single();

  if (sErr) {
    console.error("[api/scripts/commit] Script fetch error:", sErr.message);
    return NextResponse.json({ error: "Script not found" }, { status: 404 });
  }

  const chainEnabled = isBlockchainEnabled();

  await supabase
    .from("script_versions")
    .update({
      sha256: sha,
      committed_at: committedAt,
      status: "committed",
      ...(chainEnabled ? { chain_status: "pending" } : {}),
    })
    .eq("id", versionId)
    .eq("user_id", userId);

  await supabase.from("audit_log").insert({
    user_id: userId,
    script_id: scriptId,
    script_version_id: versionId,
    action: "committed",
    metadata: { sha256: sha, committedAt },
  });

  // Fire-and-forget blockchain registration (non-blocking)
  if (chainEnabled) {
    const workType = script.work_type || "other";
    registerHashOnChain(sha, versionId, workType)
      .then(async (result) => {
        if (result.success && result.txHash) {
          await supabase
            .from("script_versions")
            .update({
              tx_hash: result.txHash,
              block_number: result.blockNumber,
              chain_status: "confirmed",
              chain_registered_at: new Date().toISOString(),
            })
            .eq("id", versionId);
          console.log(`[blockchain] Registered version ${versionId} on-chain: ${result.txHash}`);
        } else if (!result.success) {
          await supabase
            .from("script_versions")
            .update({ chain_status: "failed" })
            .eq("id", versionId);
          console.error(`[blockchain] Failed for version ${versionId}:`, result.error);
        }
      })
      .catch(async (err) => {
        await supabase
          .from("script_versions")
          .update({ chain_status: "failed" })
          .eq("id", versionId);
        console.error(`[blockchain] Unexpected error for version ${versionId}:`, err);
      });
  }

  const receipt = buildReceiptText({
    title: script.title ?? "Untitled screenplay",
    draftId: scriptId,
    versionId,
    filename: version.original_filename,
    byteSize: Number(version.byte_size),
    sha256: sha,
    timestampUtc: committedAt,
  });

  return NextResponse.json({
    sha256: sha,
    committedAt,
    receiptText: receipt,
    chainStatus: chainEnabled ? "pending" : null,
  });
}
