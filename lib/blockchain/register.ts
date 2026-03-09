import { registerOnChain, isBlockchainEnabled } from './client';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

export type ChainRegistrationResult = {
  success: boolean;
  txHash?: string;
  blockNumber?: number;
  error?: string;
};

export async function registerHashOnChain(
  sha256Hex: string,
  versionId: string,
  workType: string
): Promise<ChainRegistrationResult> {
  if (!isBlockchainEnabled()) {
    return { success: false, error: 'Blockchain integration not configured' };
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await registerOnChain(sha256Hex, versionId, workType);
      return {
        success: true,
        txHash: result.txHash,
        blockNumber: result.blockNumber,
      };
    } catch (err: any) {
      const message = err?.message || String(err);

      // Don't retry if hash already registered (not a real error)
      if (message.includes('Already registered')) {
        return { success: true, error: 'Already registered on-chain' };
      }

      // Don't retry if insufficient funds
      if (message.includes('insufficient funds')) {
        console.error('[blockchain] Relayer wallet out of funds');
        return { success: false, error: 'Relayer funding issue' };
      }

      if (attempt < MAX_RETRIES) {
        console.warn(`[blockchain] Attempt ${attempt} failed, retrying in ${RETRY_DELAY_MS * attempt}ms...`, message);
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt));
      } else {
        console.error(`[blockchain] All ${MAX_RETRIES} attempts failed:`, message);
        return { success: false, error: 'On-chain registration failed after retries' };
      }
    }
  }

  return { success: false, error: 'Unexpected state' };
}
