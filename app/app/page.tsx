import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ErrorNotice from '@/components/ErrorNotice'
import ChainStatusBadge from '@/components/ChainStatusBadge'
import { Errors } from '@/lib/copy/errors'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth-required?from=/app')
  }

  const { data: scripts, error } = await supabase
    .from('scripts')
    .select('*, script_versions(chain_status, tx_hash, committed_at)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Page Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1
              className="text-3xl md:text-4xl tracking-tight mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--headline)' }}
            >
              Your Records
            </h1>
            <p className="text-sm" style={{ color: 'var(--ink)', opacity: 0.45 }}>
              Blockchain-verified proof of your creative work.
            </p>
          </div>
          {scripts && scripts.length > 0 && (
            <Link
              href="/protect"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-md text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New record
            </Link>
          )}
        </div>

        {error && (
          <ErrorNotice
            title={Errors.general.loadFailed.title}
            body={Errors.general.loadFailed.body}
            recovery={Errors.general.loadFailed.recovery}
          />
        )}

        {scripts && scripts.length === 0 ? (
          <div
            className="rounded-lg border p-16 text-center"
            style={{
              borderColor: 'rgba(90, 120, 99, 0.2)',
              background: 'var(--white)',
            }}
          >
            <div className="mx-auto mb-6" style={{ opacity: 0.15 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <h2
              className="text-2xl mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--headline)' }}
            >
              No records yet
            </h2>
            <p className="text-sm leading-relaxed mb-8 max-w-sm mx-auto" style={{ color: 'var(--ink)', opacity: 0.45 }}>
              Create your first record to generate blockchain-verified proof of your creative work on Avalanche.
            </p>
            <Link
              href="/protect"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-3 rounded-md text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Lock your first draft
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {scripts?.map((script) => {
              const versions = (script as any).script_versions as Array<{
                chain_status: string | null;
                tx_hash: string | null;
                committed_at: string | null;
              }> | null;
              const latestChain = versions?.find(v => v.committed_at && v.chain_status);
              const isVerified = latestChain?.chain_status === 'confirmed';

              return (
                <Link
                  key={script.id}
                  href={`/app/scripts/${script.id}`}
                  className="group rounded-lg border p-6 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
                  style={{
                    borderColor: isVerified ? 'rgba(31, 157, 85, 0.2)' : 'rgba(90, 120, 99, 0.2)',
                    background: 'var(--white)',
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2
                        className="text-lg font-semibold mb-1 truncate group-hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--headline)' }}
                      >
                        {script.title}
                      </h2>
                      <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--ink)', opacity: 0.4 }}>
                        <span>
                          {new Date(script.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        {versions && versions.length > 0 && (
                          <>
                            <span style={{ opacity: 0.5 }}>·</span>
                            <span>{versions.length} version{versions.length !== 1 ? 's' : ''}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      {latestChain ? (
                        <ChainStatusBadge
                          chainStatus={latestChain.chain_status}
                          txHash={latestChain.tx_hash}
                          compact
                        />
                      ) : (
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                          style={{
                            background: 'rgba(0,0,0,0.04)',
                            color: 'var(--ink)',
                            opacity: 0.4,
                          }}
                        >
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  )
}
