import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: { hash: string } }
) {
  const sha256 = params.hash;

  // Validate hash format
  if (!/^[a-f0-9]{64}$/i.test(sha256)) {
    return NextResponse.json(
      { error: "Invalid hash format" },
      { status: 400 }
    );
  }

  const supabase = supabaseServerService();

  // Look up the hash - use service role to bypass RLS
  const { data: version, error } = await supabase
    .from("script_versions")
    .select(
      `
      id,
      sha256,
      committed_at,
      tx_hash,
      block_number,
      chain_status,
      chain_registered_at,
      original_filename,
      byte_size,
      page_count,
      script_id
    `
    )
    .eq("sha256", sha256)
    .eq("status", "committed")
    .order("committed_at", { ascending: true })
    .limit(1)
    .single();

  if (error || !version) {
    return NextResponse.json({ found: false, sha256 }, { status: 404 });
  }

  // Get script metadata (title, work_type - non-sensitive)
  const { data: script } = await supabase
    .from("scripts")
    .select("title, work_type")
    .eq("id", version.script_id)
    .single();

  const explorerBaseUrl =
    process.env.AVALANCHE_CHAIN_ID === "43114"
      ? "https://snowtrace.io"
      : "https://testnet.snowtrace.io";

  return NextResponse.json({
    found: true,
    sha256: version.sha256,
    committedAt: version.committed_at,
    title: script?.title || null,
    workType: script?.work_type || null,
    filename: version.original_filename,
    byteSize: version.byte_size ? Number(version.byte_size) : null,
    pageCount: version.page_count,
    // Blockchain proof
    txHash: version.tx_hash || null,
    blockNumber: version.block_number ? Number(version.block_number) : null,
    chainStatus: version.chain_status || null,
    chainRegisteredAt: version.chain_registered_at || null,
    explorerUrl: version.tx_hash
      ? `${explorerBaseUrl}/tx/${version.tx_hash}`
      : null,
  });
}
