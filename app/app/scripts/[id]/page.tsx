import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ScriptDetailClient from './ScriptDetailClient'
import RecordHistorySection from './RecordHistorySection'
import ShareLinkRow from './ShareLinkRow'
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
  const latestCommittedVersion = versions?.find(v => v.sha256 && v.committed_at)
  
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
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-[var(--headline)] mb-2">
              {script.title}
            </h1>
            <p className="text-sm text-[var(--muted)] mb-1">
              {statusText}
            </p>
            {statusDate && (
              <p className="text-xs text-[var(--muted)]">
                {new Date(statusDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>

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
                        <p className="font-medium text-[var(--text)] mb-1">
                          {formatVersionLabel({
                            versionNumber: version.version_number,
                            createdAt: version.committed_at || version.created_at,
                            includeTime: false,
                          })}
                        </p>
                        <p className="text-sm text-[var(--muted)]">
                          {version.committed_at 
                            ? new Date(version.committed_at).toLocaleDateString()
                            : new Date(version.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {version.snapshot_path && (
                        <a
                          href={`/api/scripts/${script.id}/versions/${version.id}/snapshot`}
                          className="text-xs text-[var(--muted)] hover:text-[var(--text)] underline transition-colors"
                          download
                        >
                          Download snapshot
                        </a>
                      )}
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
