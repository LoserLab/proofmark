import { NextRequest, NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { authenticateApiKey } from "@/lib/v1/auth";
import { notFound, invalidRequest, internalError } from "@/lib/v1/errors";
import { isValidUuid } from "@/lib/v1/validation";
import { mapScriptDetail } from "@/lib/v1/mappers";

export async function GET(
  req: NextRequest,
  { params }: { params: { scriptId: string } }
) {
  const auth = await authenticateApiKey(req);
  if (auth instanceof NextResponse) return auth;
  const { userId } = auth;

  if (!isValidUuid(params.scriptId)) {
    return invalidRequest("Invalid scriptId format");
  }

  const supabase = supabaseServerService();

  const { data: script, error: sErr } = await supabase
    .from("scripts")
    .select("*")
    .eq("id", params.scriptId)
    .eq("user_id", userId)
    .single();

  if (sErr || !script) return notFound("Script not found");

  const { data: versions, error: vErr } = await supabase
    .from("script_versions")
    .select("*")
    .eq("script_id", script.id)
    .order("version_number", { ascending: true });

  if (vErr) {
    console.error("[api/v1/scripts/detail] Versions query error:", vErr.message);
    return internalError();
  }

  const { data: shareLinks } = await supabase
    .from("share_links")
    .select("*")
    .eq("script_id", script.id)
    .order("created_at", { ascending: false });

  return NextResponse.json(
    mapScriptDetail(script, versions ?? [], shareLinks ?? [])
  );
}
