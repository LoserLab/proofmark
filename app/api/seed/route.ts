import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { randomToken } from "@/lib/crypto";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const supabase = supabaseServerService();

  // Use auth.users id in real flow; for seed we fake a UUID-like value won't work due to FK.
  // So we must use a real user id. If you haven't implemented auth yet, skip this route.
  return NextResponse.json({
    error: "Seed route requires a real auth user id. Implement auth or pass userId via body."
  }, { status: 400 });
}
