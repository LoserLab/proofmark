import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const supabase = supabaseServerService();

  const checks = await Promise.all([
    supabase.from("scripts").select("id").limit(1),
    supabase.from("script_versions").select("id").limit(1),
    supabase.from("share_links").select("id").limit(1),
    supabase.from("audit_log").select("id").limit(1),
  ]);

  const result = {
    scripts: checks[0].error ? checks[0].error.message : "ok",
    script_versions: checks[1].error ? checks[1].error.message : "ok",
    share_links: checks[2].error ? checks[2].error.message : "ok",
    audit_log: checks[3].error ? checks[3].error.message : "ok",
  };

  const ok =
    result.scripts === "ok" &&
    result.script_versions === "ok" &&
    result.share_links === "ok" &&
    result.audit_log === "ok";

  return NextResponse.json({ ok, result });
}
