import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { sendProofCopy } from '@/lib/copy/sendproof'
import AccountSection from './AccountSection'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth-required?from=/app/settings')
  }

  // Get user profile/username if it exists
  let username = user.email?.split('@')[0] || ''
  try {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('username, display_name')
      .eq('user_id', user.id)
      .single()
    
    if (profile) {
      username = profile.username || profile.display_name || username
    }
  } catch {
    // Table might not exist yet, use email prefix as fallback
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <h1 className="text-3xl font-bold text-[var(--headline)] mb-8">Settings</h1>

        <section className="bg-[var(--white)] rounded-lg border p-6 shadow-sm mb-6" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-4">Proof tools</h2>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-[var(--headline)] mb-2">
                {sendProofCopy.name}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">
                {sendProofCopy.shortDescription}
              </p>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                {sendProofCopy.helper}
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <Link
                href="/how#sendproof"
                className="text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] underline transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 rounded"
              >
                Learn more
              </Link>
              <Link
                href="/sendproof"
                className="text-sm text-[var(--muted)] hover:text-[var(--text)] underline transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 rounded"
              >
                Preview SendProof
              </Link>
            </div>
          </div>
        </section>

        <AccountSection initialUsername={username} userEmail={user.email || ''} />
      </main>
    </div>
  )
}
