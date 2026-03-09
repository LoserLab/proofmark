import { NextRequest, NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { authenticateApiKey } from "@/lib/v1/auth";
import { notFound, invalidRequest, internalError } from "@/lib/v1/errors";
import { isValidUuid } from "@/lib/v1/validation";
import { mapAuditLogEntry } from "@/lib/v1/mappers";
import type { AuditLog } from "@/lib/v1/types";

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

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 200);
  const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);

  const supabase = supabaseServerService();

  // Verify ownership
  const { data: script, error: sErr } = await supabase
    .from("scripts")
    .select("id")
    .eq("id", params.scriptId)
    .eq("user_id", userId)
    .single();

  if (sErr || !script) return notFound("Script not found");

  const { data: entries, count, error } = await supabase
    .from("audit_log")
    .select("action, metadata, created_at", { count: "exact" })
    .eq("script_id", params.scriptId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[api/v1/audit] Query error:", error.message);
    return internalError();
  }

  const result: AuditLog = {
    entries: (entries ?? []).map(mapAuditLogEntry),
    total: count ?? 0,
    limit,
    offset,
  };

  return NextResponse.json(result);
}
