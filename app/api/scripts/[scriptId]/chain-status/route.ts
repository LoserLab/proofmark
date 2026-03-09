import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  req: Request,
  { params }: { params: { scriptId: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify script ownership
  const { data: script } = await supabase
    .from('scripts')
    .select('id')
    .eq('id', params.scriptId)
    .eq('user_id', user.id)
    .single();

  if (!script) {
    return NextResponse.json({ chainStatus: null }, { status: 200 });
  }

  const { searchParams } = new URL(req.url);
  const versionId = searchParams.get('versionId');

  let query = supabase
    .from('script_versions')
    .select('chain_status, tx_hash, block_number, chain_registered_at')
    .eq('script_id', params.scriptId);

  if (versionId) {
    query = query.eq('id', versionId);
  } else {
    query = query.order('created_at', { ascending: false }).limit(1);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return NextResponse.json({ chainStatus: null }, { status: 200 });
  }

  const chainId = process.env.NEXT_PUBLIC_AVALANCHE_CHAIN_ID || '43113';
  const explorerBase = chainId === '43114'
    ? 'https://snowtrace.io'
    : 'https://testnet.snowtrace.io';

  return NextResponse.json({
    chainStatus: data.chain_status,
    txHash: data.tx_hash,
    blockNumber: data.block_number,
    chainRegisteredAt: data.chain_registered_at,
    explorerUrl: data.tx_hash ? `${explorerBase}/tx/${data.tx_hash}` : null,
  });
}
