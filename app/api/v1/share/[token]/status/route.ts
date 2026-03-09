import { NextRequest, NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { authenticateApiKey } from "@/lib/v1/auth";
import { notFound } from "@/lib/v1/errors";
import { mapShareStatus } from "@/lib/v1/mappers";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const auth = await authenticateApiKey(req);
  if (auth instanceof NextResponse) return auth;
  const { userId } = auth;

  const supabase = supabaseServerService();

  const { data: link, error } = await supabase
    .from("share_links")
    .select("*")
    .eq("token", params.token)
    .eq("created_by", userId)
    .single();

  if (error || !link) return notFound("Share link not found");

  return NextResponse.json(mapShareStatus(link));
}
