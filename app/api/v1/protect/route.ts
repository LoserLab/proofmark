import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseServerService } from "@/lib/supabase/server";
import { sha256Hex } from "@/lib/crypto";
import { authenticateApiKey } from "@/lib/v1/auth";
import {
  invalidRequest,
  unsupportedFileType,
  fileTooLarge,
  internalError,
} from "@/lib/v1/errors";
import {
  isValidMimeType,
  isValidWorkType,
  validateBase64File,
  sanitizeFilename,
} from "@/lib/v1/validation";
import { config } from "@/lib/config";
import { buildReceiptText } from "@/lib/receipt";
import { registerHashOnChain } from "@/lib/blockchain/register";
import { isBlockchainEnabled } from "@/lib/blockchain/client";
import type { ProtectResponse } from "@/lib/v1/types";

export async function POST(req: NextRequest) {
  const auth = await authenticateApiKey(req);
  if (auth instanceof NextResponse) return auth;
  const { userId } = auth;

  // Parse body
  let body;
  try {
    body = await req.json();
  } catch {
    return invalidRequest("Invalid JSON body");
  }

  const { title, workType, fileBase64, filename, mimeType } = body;

  // Validate required fields
  if (!title || !workType || !fileBase64 || !filename || !mimeType) {
    return invalidRequest("Missing required fields: title, workType, fileBase64, filename, mimeType");
  }

  if (!isValidWorkType(workType)) {
    return invalidRequest(
      "Invalid workType. Must be one of: screenplay, manuscript, treatment, pitch_deck, research, other"
    );
  }

  if (!isValidMimeType(mimeType)) {
    return unsupportedFileType();
  }

  // Decode and validate file
  const fileResult = validateBase64File(fileBase64);
  if (!fileResult.valid) {
    if (fileResult.error.includes("too large")) return fileTooLarge();
    return invalidRequest(fileResult.error);
  }
  const fileBuffer = fileResult.buffer;

  const safeFilename = sanitizeFilename(filename);
  const supabase = supabaseServerService();

  // 1. Create script
  const { data: script, error: scriptErr } = await supabase
    .from("scripts")
    .insert({
      user_id: userId,
      title,
      work_type: workType,
      notes: body.notes ?? null,
      authors_count: body.authorsCount ?? 1,
      publication_status: body.publicationStatus ?? "unpublished",
      work_made_for_hire: body.workMadeForHire ?? "no",
      preexisting_material: body.preexistingMaterial ?? "no",
    })
    .select("id")
    .single();

  if (scriptErr || !script) {
    console.error("[api/v1/protect] Script insert error:", scriptErr?.message);
    return internalError("Failed to create script");
  }

  const scriptId = script.id;

  // 2. Compute hash
  const sha = await sha256Hex(fileBuffer);

  // 3. Upload to storage
  const storagePath = `${userId}/${scriptId}/${crypto.randomUUID()}-${safeFilename}`;
  const bucket = config.storage.bucket;

  const { error: uploadErr } = await supabase.storage
    .from(bucket)
    .upload(storagePath, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadErr) {
    console.error("[api/v1/protect] Storage upload error:", uploadErr.message);
    // Cleanup: delete the script row
    await supabase.from("scripts").delete().eq("id", scriptId).eq("user_id", userId);
    return internalError("Failed to upload file");
  }

  // 4. Create committed version
  const committedAt = new Date().toISOString();
  const chainEnabled = isBlockchainEnabled() && body.blockchain === true;

  const { data: version, error: verErr } = await supabase
    .from("script_versions")
    .insert({
      script_id: scriptId,
      user_id: userId,
      version_number: 1,
      file_path: storagePath,
      original_filename: filename,
      mime_type: mimeType,
      byte_size: fileBuffer.byteLength,
      hash_sha256: sha,
      committed_at: committedAt,
      status: "committed",
      ...(chainEnabled ? { chain_status: "pending" } : {}),
    })
    .select("id")
    .single();

  if (verErr || !version) {
    console.error("[api/v1/protect] Version insert error:", verErr?.message);
    // Cleanup
    await supabase.storage.from(bucket).remove([storagePath]);
    await supabase.from("scripts").delete().eq("id", scriptId).eq("user_id", userId);
    return internalError("Failed to create version");
  }

  const versionId = version.id;

  // 5. Audit log
  supabase.from("audit_log").insert({
    user_id: userId,
    script_id: scriptId,
    script_version_id: versionId,
    action: "committed",
    metadata: { sha256: sha, committedAt, source: "api_v1" },
  }).then(() => {});

  // 6. Build receipt
  const receiptText = buildReceiptText({
    title,
    draftId: scriptId,
    versionId,
    filename,
    byteSize: fileBuffer.byteLength,
    sha256: sha,
    timestampUtc: committedAt,
  });

  // 7. Fire-and-forget blockchain registration
  if (chainEnabled) {
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
        } else if (!result.success) {
          await supabase
            .from("script_versions")
            .update({ chain_status: "failed" })
            .eq("id", versionId);
        }
      })
      .catch(async () => {
        await supabase
          .from("script_versions")
          .update({ chain_status: "failed" })
          .eq("id", versionId);
      });
  }

  // 8. Response
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://proofmark.xyz";

  const response: ProtectResponse = {
    scriptId,
    versionId,
    sha256: sha,
    committedAt,
    receiptText,
    chainStatus: chainEnabled ? "pending" : null,
    badgeUrl: `${appUrl}/api/v1/badge/${sha}`,
    verifyUrl: `${appUrl}/verify?hash=${sha}`,
  };

  return NextResponse.json(response);
}
