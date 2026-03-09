import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { isValidSha256 } from "@/lib/v1/validation";
import { invalidRequest } from "@/lib/v1/errors";
import { mapVerifyResponse } from "@/lib/v1/mappers";

export async function GET(
  _req: Request,
  { params }: { params: { hash: string } }
) {
  const sha256 = params.hash;

  if (!isValidSha256(sha256)) {
    return invalidRequest("Invalid hash format. Expected 64-character hex string.");
  }

  const supabase = supabaseServerService();

  const { data: version, error } = await supabase
    .from("script_versions")
    .select(
      "id, sha256, committed_at, tx_hash, block_number, chain_status, chain_registered_at, original_filename, byte_size, page_count, script_id"
    )
    .eq("sha256", sha256)
    .eq("status", "committed")
    .order("committed_at", { ascending: true })
    .limit(1)
    .single();

  if (error || !version) {
    return NextResponse.json({ found: false, sha256 }, { status: 404 });
  }

  const { data: script } = await supabase
    .from("scripts")
    .select("title, work_type")
    .eq("id", version.script_id)
    .single();

  return NextResponse.json(mapVerifyResponse(version, script));
}
