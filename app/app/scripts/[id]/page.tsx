import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ScriptDetailClient from './ScriptDetailClient'
import RecordHistorySection from './RecordHistorySection'
import ShareLinkRow from './ShareLinkRow'
import ChainStatusBadge from '@/components/ChainStatusBadge'
import { formatVersionLabel } from '@/src/lib/format/versionLabel'

export default async function ScriptDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth-required?from=/app/scripts')
  }

  const { data: script, error: scriptError } = await supabase
    .from('scripts')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (scriptError || !script) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--headline)] mb-4">
            Script Not Found
          </h1>
          <Link
            href="/app"
            className="text-[var(--accent)] hover:opacity-80 transition-opacity"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const { data: versions } = await supabase
    .from('script_versions')
    .select('*')
    .eq('script_id', script.id)
    .order('created_at', { ascending: false })

  // Get share links for this script
  const { data: shareLinks } = await supabase
    .from('share_links')
    .select('*')
    .eq('script_id', script.id)
    .order('created_at', { ascending: false })

  // Get audit log entries
  const { data: auditLog } = await supabase
    .from('audit_log')
    .select('*')
    .eq('script_id', script.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Get latest committed version for packet download
  const latestCommittedVersion = versions?.find(v => (v.hash_sha256 || v.sha256) && v.committed_at)
  
  // Determine status and date
  const hasCommittedVersion = !!latestCommittedVersion
  const hasShareLinks = shareLinks && shareLinks.length > 0
  const latestVersion = versions?.[0]
  
  let statusText = 'Draft created'
  let statusDate: string | null = null
  
  if (latestCommittedVersion) {
    statusText = 'Recorded'
    statusDate = latestCommittedVersion.committed_at || latestCommittedVersion.created_at
  } else if (latestVersion) {
    statusText = 'Draft created'
    statusDate = latestVersion.created_at
  } else {
    statusDate = script.created_at
  }
  
  // Check if packet can be generated (has committed version)
  const hasPacket = !!latestCommittedVersion

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="bg-[var(--white)] rounded-lg border p-8 shadow-sm" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/app"
                className="text-xs hover:opacity-70 transition-opacity"
                style={{ color: 'var(--ink)', opacity: 0.4 }}
              >
                Records
              </Link>
              <span className="text-xs" style={{ color: 'var(--ink)', opacity: 0.2 }}>/</span>
            </div>
            <h1
              className="text-3xl md:text-4xl tracking-tight mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--headline)' }}
            >
              {script.title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm" style={{ color: 'var(--ink)', opacity: 0.45 }}>
                {statusText}
              </span>
              {statusDate && (
                <>
                  <span className="text-xs" style={{ color: 'var(--ink)', opacity: 0.2 }}>·</span>
                  <span className="text-sm" style={{ color: 'var(--ink)', opacity: 0.45 }}>
                    {new Date(statusDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Blockchain Proof Card */}
          {latestCommittedVersion?.chain_status === 'confirmed' && latestCommittedVersion?.tx_hash && (
            <div
              className="mb-8 rounded-lg p-6 border"
              style={{
                background: 'rgba(31, 157, 85, 0.03)',
                borderColor: 'rgba(31, 157, 85, 0.15)',
              }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F9D55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span className="text-sm font-semibold" style={{ color: '#1F9D55' }}>
                      Verified on Avalanche
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs" style={{ color: 'var(--ink)' }}>
                    <div>
                      <div className="font-medium opacity-50 mb-1">Transaction</div>
                      <code className="font-mono text-[11px]">
                        {latestCommittedVersion.tx_hash.slice(0, 14)}...{latestCommittedVersion.tx_hash.slice(-8)}
                      </code>
                    </div>
                    {latestCommittedVersion.block_number && (
                      <div>
                        <div className="font-medium opacity-50 mb-1">Block</div>
                        <code className="font-mono text-[11px]">
                          {latestCommittedVersion.block_number.toLocaleString()}
                        </code>
                      </div>
                    )}
                    {latestCommittedVersion.chain_registered_at && (
                      <div>
                        <div className="font-medium opacity-50 mb-1">Chain Timestamp</div>
                        <span className="text-[11px]">
                          {new Date(latestCommittedVersion.chain_registered_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <a
                  href={`${(process.env.NEXT_PUBLIC_AVALANCHE_CHAIN_ID || '43113') === '43114' ? 'https://snowtrace.io' : 'https://testnet.snowtrace.io'}/tx/${latestCommittedVersion.tx_hash}`}
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
          )}

          {/* Primary Action */}
          <div className="mb-12">
            {hasPacket && latestCommittedVersion ? (
              <ScriptDetailClient scriptId={script.id} versionId={latestCommittedVersion.id} />
            ) : (
              <Link
                href="/protect"
                className="inline-block bg-[var(--accent)] text-white px-6 py-3.5 rounded-md text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
              >
                Record this draft
              </Link>
            )}
          </div>

          {/* Versions Section */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-[var(--headline)] mb-4">
              Versions
            </h2>
            {versions && versions.length > 0 ? (
              <div className="space-y-3">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className="border rounded-lg p-4" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-[var(--text)]">
                            {formatVersionLabel({
                              versionNumber: version.version_number,
                              createdAt: version.committed_at || version.created_at,
                              includeTime: false,
                            })}
                          </p>
                          <ChainStatusBadge
                            chainStatus={version.chain_status}
                            txHash={version.tx_hash}
                            compact
                          />
                        </div>
                        <p className="text-sm text-[var(--muted)]">
                          {version.committed_at
                            ? new Date(version.committed_at).toLocaleDateString()
                            : new Date(version.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {version.chain_status === 'confirmed' && version.tx_hash && (
                          <a
                            href={`/api/scripts/${script.id}/certificate?versionId=${version.id}`}
                            className="text-xs text-[var(--accent)] hover:opacity-80 underline transition-opacity"
                            download
                          >
                            Certificate
                          </a>
                        )}
                        {version.snapshot_path && (
                          <a
                            href={`/api/scripts/${script.id}/versions/${version.id}/snapshot`}
                            className="text-xs text-[var(--muted)] hover:text-[var(--text)] underline transition-colors"
                            download
                          >
                            Snapshot
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">No versions yet</p>
            )}
          </div>

          {/* Sharing Section */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-[var(--headline)] mb-4">
              Sharing
            </h2>
            {shareLinks && shareLinks.length > 0 ? (
              <div className="space-y-3">
                {shareLinks.map((link) => (
                  <ShareLinkRow key={link.id} link={link} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">No share links yet</p>
            )}
          </div>

          {/* Record History Section (Collapsed) */}
          <div className="mb-8">
            <RecordHistorySection auditLog={auditLog || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
