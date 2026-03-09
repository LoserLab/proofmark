import { NextRequest, NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { authenticateApiKey } from "@/lib/v1/auth";
import { internalError } from "@/lib/v1/errors";
import { isValidWorkType } from "@/lib/v1/validation";
import { mapScriptSummary } from "@/lib/v1/mappers";
import type { ScriptList } from "@/lib/v1/types";

export async function GET(req: NextRequest) {
  const auth = await authenticateApiKey(req);
  if (auth instanceof NextResponse) return auth;
  const { userId } = auth;

  const url = new URL(req.url);
  const workType = url.searchParams.get("workType");
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 100);
  const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);

  const supabase = supabaseServerService();

  // Build query
  let query = supabase
    .from("scripts")
    .select("*", { count: "exact" })
    .eq("user_id", userId);

  if (workType && isValidWorkType(workType)) {
    query = query.eq("work_type", workType);
  }

  query = query
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data: scripts, count, error } = await query;

  if (error) {
    console.error("[api/v1/scripts] Query error:", error.message);
    return internalError();
  }

  if (!scripts || scripts.length === 0) {
    const result: ScriptList = { scripts: [], total: 0, limit, offset };
    return NextResponse.json(result);
  }

  // Batch-fetch latest committed version for each script
  const scriptIds = scripts.map((s) => s.id);
  const { data: versions } = await supabase
    .from("script_versions")
    .select("id, script_id, version_number, sha256, committed_at, chain_status, byte_size, page_count")
    .in("script_id", scriptIds)
    .eq("status", "committed")
    .order("version_number", { ascending: false });

  // Group by script_id, take first (latest) per group
  const latestByScript = new Map<string, (typeof versions extends (infer T)[] | null ? T : never)>();
  if (versions) {
    for (const v of versions) {
      if (!latestByScript.has(v.script_id)) {
        latestByScript.set(v.script_id, v);
      }
    }
  }

  const result: ScriptList = {
    scripts: scripts.map((s) => mapScriptSummary(s, latestByScript.get(s.id) ?? null)),
    total: count ?? 0,
    limit,
    offset,
  };

  return NextResponse.json(result);
}
