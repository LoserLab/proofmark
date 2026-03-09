'use client';

import { useEffect, useState } from 'react';

type ChainProofBannerProps = {
  scriptId: string;
  versionId: string;
};

type ChainData = {
  chainStatus: string | null;
  txHash: string | null;
  blockNumber: number | null;
  explorerUrl: string | null;
};

export default function ChainProofBanner({ scriptId, versionId }: ChainProofBannerProps) {
  const [chain, setChain] = useState<ChainData | null>(null);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 20; // ~60 seconds of polling

    async function checkChainStatus() {
      try {
        const res = await fetch(`/api/scripts/${scriptId}/chain-status?versionId=${versionId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setChain(data);
          if (data.chainStatus === 'confirmed' || data.chainStatus === 'failed') {
            setPolling(false);
          }
        }
      } catch {
        // Silently retry
      }
    }

    checkChainStatus();

    const interval = setInterval(() => {
      attempts++;
      if (attempts >= maxAttempts || !polling) {
        clearInterval(interval);
        setPolling(false);
        return;
      }
      checkChainStatus();
    }, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [scriptId, versionId, polling]);

  if (!chain) return null;

  // Pending state
  if (chain.chainStatus === 'pending') {
    return (
      <div
        className="rounded-lg border p-5 flex items-center gap-4"
        style={{
          background: 'rgba(245, 158, 11, 0.04)',
          borderColor: 'rgba(245, 158, 11, 0.15)',
        }}
      >
        <div className="shrink-0">
          <span
            className="inline-block w-3 h-3 rounded-full animate-pulse"
            style={{ background: '#F59E0B' }}
          />
        </div>
        <div>
          <div className="text-sm font-medium" style={{ color: '#D97706' }}>
            Registering on Avalanche...
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#D97706', opacity: 0.7 }}>
            Your fingerprint is being written to the Avalanche C-Chain. This usually takes a few seconds.
          </div>
        </div>
      </div>
    );
  }

  // Confirmed state
  if (chain.chainStatus === 'confirmed' && chain.txHash) {
    const explorerUrl = chain.explorerUrl || `https://testnet.snowtrace.io/tx/${chain.txHash}`;

    return (
      <div
        className="rounded-lg border p-5"
        style={{
          background: 'rgba(31, 157, 85, 0.04)',
          borderColor: 'rgba(31, 157, 85, 0.15)',
        }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F9D55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-sm font-semibold" style={{ color: '#1F9D55' }}>
                Verified on Avalanche
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--ink)', opacity: 0.6 }}>
              <span className="font-mono">
                tx: {chain.txHash.slice(0, 10)}...{chain.txHash.slice(-6)}
              </span>
              {chain.blockNumber && (
                <span>
                  block: {chain.blockNumber.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-opacity hover:opacity-80 shrink-0"
            style={{
              background: 'rgba(31, 157, 85, 0.1)',
              color: '#1F9D55',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View on Snowtrace
          </a>
        </div>
      </div>
    );
  }

  // Failed state
  if (chain.chainStatus === 'failed') {
    return (
      <div
        className="rounded-lg border p-5 flex items-center gap-4"
        style={{
          background: 'rgba(220, 38, 38, 0.03)',
          borderColor: 'rgba(220, 38, 38, 0.12)',
        }}
      >
        <div className="text-xs" style={{ color: '#B91C1C' }}>
          Blockchain registration pending. Your off-chain record is still valid and timestamped.
        </div>
      </div>
    );
  }

  return null;
}
