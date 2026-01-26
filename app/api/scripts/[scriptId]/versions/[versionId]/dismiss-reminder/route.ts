import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/scripts/[scriptId]/versions/[versionId]/dismiss-reminder
 * 
 * Dismisses the revision reminder for a specific version
 */
export async function POST(
  req: Request,
  { params }: { params: { scriptId: string; versionId: string } }
) {
  try {
    // Get userId from auth session
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const { scriptId, versionId } = params;

    if (!scriptId || !versionId) {
      return NextResponse.json(
        { ok: false, error: "scriptId and versionId are required" },
        { status: 400 }
      );
    }

    const supabase = supabaseServerService();

    // Verify script ownership
    const { data: script, error: scriptErr } = await supabase
      .from("scripts")
      .select("id, user_id")
      .eq("id", scriptId)
      .single();

    if (scriptErr || !script) {
      return NextResponse.json({ ok: false, error: "Script not found" }, { status: 404 });
    }

    if (script.user_id !== userId) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    // Verify version ownership
    const { data: version, error: versionErr } = await supabase
      .from("script_versions")
      .select("id, user_id")
      .eq("id", versionId)
      .eq("script_id", scriptId)
      .single();

    if (versionErr || !version) {
      return NextResponse.json({ ok: false, error: "Version not found" }, { status: 404 });
    }

    if (version.user_id !== userId) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    // Update version to mark reminder as dismissed
    const { error: updateErr } = await supabase
      .from("script_versions")
      .update({
        reminder_dismissed_at: new Date().toISOString(),
      })
      .eq("id", versionId);

    if (updateErr) {
      return NextResponse.json({ ok: false, error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
