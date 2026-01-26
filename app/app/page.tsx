import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ErrorNotice from '@/components/ErrorNotice'
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
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <h1 className="text-3xl font-bold text-[var(--text)] mb-8">My Scripts</h1>

        {error && (
          <ErrorNotice
            title={Errors.general.loadFailed.title}
            body={Errors.general.loadFailed.body}
            recovery={Errors.general.loadFailed.recovery}
          />
        )}

        {scripts && scripts.length === 0 ? (
          <div className="bg-[var(--white)] rounded-lg border p-12 text-center shadow-sm" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
            <h2 className="text-xl font-semibold text-[var(--headline)] mb-3">
              Your records will appear here
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-2 max-w-md mx-auto">
              Create a record to generate a timestamped evidence packet for your work. Each record preserves authorship, versions, and sharing history.
            </p>
            <p className="text-xs text-[var(--muted)] mb-6">
              You can upload drafts, revisions, or finished work.
            </p>
            <Link
              href="/protect"
              className="inline-block bg-[var(--accent)] text-white px-6 py-3 rounded-md text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            >
              Create a record
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <Link
                href="/protect"
                className="bg-[var(--accent)] text-white px-6 py-3 rounded-md text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
              >
                Create a record
              </Link>
            </div>
            <p className="text-xs text-[var(--muted)] mb-6 leading-relaxed">
              Your recorded work is stored securely and can be accessed at any time.
            </p>
            <div className="grid grid-cols-1 gap-6">
              {scripts?.map((script) => (
                <Link
                  key={script.id}
                  href={`/app/scripts/${script.id}`}
                  className="bg-[var(--white)] rounded-lg border p-6 shadow-sm hover:shadow transition-shadow focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
                  style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}
                >
                  <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
                    {script.title}
                  </h2>
                  <p className="text-sm text-[var(--muted)]">
                    Created {new Date(script.created_at).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
