import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
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

    const body = await req.json();

    const {
      title,
      workType,
      notes = null,
      authorsCount = null,
      publicationStatus = null,
      workMadeForHire = null,
      preexistingMaterial = null,
    } = body ?? {};

    if (!title || !workType) {
      return NextResponse.json(
        { ok: false, error: "title and workType are required" },
        { status: 400 }
      );
    }

    const supabase = supabaseServerService();

    const { data, error } = await supabase
      .from("scripts")
      .insert({
        user_id: userId,
        title,
        work_type: workType,
        notes,
        authors_count: authorsCount,
        publication_status: publicationStatus,
        work_made_for_hire: workMadeForHire,
        preexisting_material: preexistingMaterial,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[api/scripts/create] Insert error:", error.message);
      return NextResponse.json({ ok: false, error: "Failed to create script" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, scriptId: data.id });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
