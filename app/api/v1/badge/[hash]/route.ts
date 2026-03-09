import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { makeBadge } from "@/lib/badge-svg";

export async function GET(
  _req: Request,
  { params }: { params: { hash: string } }
) {
  const sha256 = params.hash.replace(/\.svg$/i, "");

  if (!/^[a-f0-9]{64}$/i.test(sha256)) {
    return new NextResponse(
      makeBadge({ label: "ProofMark", message: "invalid hash", labelColor: "#555", messageColor: "#9f9f9f" }),
      { status: 400, headers: { "Content-Type": "image/svg+xml", "Cache-Control": "no-cache" } }
    );
  }

  const supabase = supabaseServerService();

  const { data: version } = await supabase
    .from("script_versions")
    .select("sha256, committed_at, chain_status, tx_hash")
    .eq("sha256", sha256)
    .eq("status", "committed")
    .order("committed_at", { ascending: true })
    .limit(1)
    .single();

  if (!version) {
    return new NextResponse(
      makeBadge({ label: "ProofMark", message: "not found", labelColor: "#555", messageColor: "#9f9f9f" }),
      { status: 404, headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=300, s-maxage=300" } }
    );
  }

  if (version.chain_status === "confirmed") {
    const date = version.committed_at ? new Date(version.committed_at).toISOString().split("T")[0] : "verified";
    return new NextResponse(
      makeBadge({ label: "ProofMark", message: `verified ${date}`, labelColor: "#5A7863", messageColor: "#1F9D55" }),
      { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=3600, s-maxage=3600" } }
    );
  }

  if (version.chain_status === "pending") {
    return new NextResponse(
      makeBadge({ label: "ProofMark", message: "pending", labelColor: "#5A7863", messageColor: "#B45309" }),
      { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=30, s-maxage=30" } }
    );
  }

  const date = version.committed_at ? new Date(version.committed_at).toISOString().split("T")[0] : "recorded";
  return new NextResponse(
    makeBadge({ label: "ProofMark", message: `recorded ${date}`, labelColor: "#5A7863", messageColor: "#3B4953" }),
    { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=3600, s-maxage=3600" } }
  );
}
