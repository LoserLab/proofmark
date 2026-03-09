/**
 * ChainStatusBadge - Shows Avalanche blockchain verification status.
 *
 * States:
 *  - null/undefined: not shown (verification not attempted)
 *  - "pending": amber pulsing indicator
 *  - "confirmed": green badge with Avalanche branding + Snowtrace link
 *  - "failed": muted red indicator
 */

type ChainStatusBadgeProps = {
  chainStatus?: string | null;
  txHash?: string | null;
  /** Compact mode for list views (smaller text, inline) */
  compact?: boolean;
};

function getExplorerUrl(txHash: string): string {
  const chainId = process.env.NEXT_PUBLIC_AVALANCHE_CHAIN_ID || '43113';
  const base = chainId === '43114'
    ? 'https://snowtrace.io'
    : 'https://testnet.snowtrace.io';
  return `${base}/tx/${txHash}`;
}

export default function ChainStatusBadge({
  chainStatus,
  txHash,
  compact = false,
}: ChainStatusBadgeProps) {
  if (!chainStatus) return null;

  if (chainStatus === 'confirmed') {
    return (
      <div className={compact ? 'inline-flex items-center gap-2' : 'flex flex-col gap-2'}>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
            compact
              ? 'px-2.5 py-0.5 text-[10px]'
              : 'px-3 py-1 text-xs'
          }`}
          style={{
            background: 'rgba(31, 157, 85, 0.08)',
            color: '#1F9D55',
          }}
        >
          <svg
            width={compact ? '10' : '12'}
            height={compact ? '10' : '12'}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Verified on Avalanche
        </span>
        {txHash && !compact && (
          <a
            href={getExplorerUrl(txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono hover:opacity-70 transition-opacity"
            style={{ color: 'var(--structure-green, #5A7863)' }}
            title="View on Snowtrace"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            {txHash.slice(0, 10)}...{txHash.slice(-6)}
          </a>
        )}
      </div>
    );
  }

  if (chainStatus === 'pending') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
          compact
            ? 'px-2.5 py-0.5 text-[10px]'
            : 'px-3 py-1 text-xs'
        }`}
        style={{
          background: 'rgba(245, 158, 11, 0.08)',
          color: '#D97706',
        }}
      >
        <span
          className="inline-block rounded-full animate-pulse"
          style={{
            width: compact ? 6 : 8,
            height: compact ? 6 : 8,
            background: '#F59E0B',
          }}
        />
        Registering on Avalanche...
      </span>
    );
  }

  if (chainStatus === 'failed') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
          compact
            ? 'px-2.5 py-0.5 text-[10px]'
            : 'px-3 py-1 text-xs'
        }`}
        style={{
          background: 'rgba(220, 38, 38, 0.06)',
          color: '#B91C1C',
        }}
      >
        <svg
          width={compact ? '10' : '12'}
          height={compact ? '10' : '12'}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        Verification pending
      </span>
    );
  }

  return null;
}
