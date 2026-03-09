import { NextRequest, NextResponse } from "next/server";
import { sha256Hex } from "@/lib/crypto";
import { supabaseServerService } from "@/lib/supabase/server";
import { unauthorized } from "@/lib/v1/errors";

export interface AuthContext {
  userId: string;
  apiKeyId: string;
  mirraUserId: string | null;
  mirraSessionId: string | null;
}

/**
 * Validates the X-ProofMark-Key header against the api_keys table.
 * Returns AuthContext on success, or a 401 NextResponse on failure.
 */
export async function authenticateApiKey(
  req: NextRequest
): Promise<AuthContext | NextResponse> {
  const rawKey = req.headers.get("x-proofmark-key");
  if (!rawKey) {
    return unauthorized("Missing X-ProofMark-Key header");
  }

  const keyHash = await sha256Hex(Buffer.from(rawKey));
  const supabase = supabaseServerService();

  const { data: row, error } = await supabase
    .from("api_keys")
    .select("id, user_id, mirra_user_id, revoked_at")
    .eq("key_hash", keyHash)
    .is("revoked_at", null)
    .single();

  if (error || !row) {
    return unauthorized("Invalid or revoked API key");
  }

  // Fire-and-forget: update last_used_at
  supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", row.id)
    .then(() => {});

  return {
    userId: row.user_id,
    apiKeyId: row.id,
    mirraUserId:
      req.headers.get("x-mirra-user-id") || row.mirra_user_id || null,
    mirraSessionId: req.headers.get("x-mirra-session-id") || null,
  };
}
