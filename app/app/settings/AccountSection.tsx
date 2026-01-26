'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AccountSection({ initialUsername, userEmail }: { initialUsername: string; userEmail: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  
  const [username, setUsername] = useState(initialUsername)
  const [usernameLoading, setUsernameLoading] = useState(false)
  const [usernameSuccess, setUsernameSuccess] = useState(false)
  const [usernameError, setUsernameError] = useState<string | null>(null)

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError(null)
    setEmailSuccess(false)
    setEmailLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ email })

      if (error) throw error

      setEmailSuccess(true)
      setEmail('')
    } catch (err: any) {
      setEmailError(err.message || 'Failed to update email')
    } finally {
      setEmailLoading(false)
    }
  }

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setUsernameError(null)
    setUsernameSuccess(false)
    setUsernameLoading(true)

    // Client-side validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,24}$/
    if (!usernameRegex.test(username)) {
      setUsernameError('Username must be 3–24 characters. Letters, numbers, and underscores only.')
      setUsernameLoading(false)
      return
    }

    try {
      const res = await fetch('/api/account/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update username')
      }

      setUsernameSuccess(true)
      router.refresh()
    } catch (err: any) {
      setUsernameError(err.message || 'Failed to update username')
    } finally {
      setUsernameLoading(false)
    }
  }

  return (
    <section className="bg-[var(--white)] rounded-lg border p-6 shadow-sm" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
      <h2 className="text-xl font-semibold text-[var(--text)] mb-4">Account</h2>

      {/* Password */}
      <div className="flex items-start justify-between gap-6 py-4 border-b border-[var(--stroke)]">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-[var(--headline)] mb-2">Password</h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Reset your password using an email link.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/auth/forgot-password"
            className="inline-block px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
          >
            Forgot password
          </Link>
        </div>
      </div>

      {/* Email */}
      <div className="py-4 border-b border-[var(--stroke)]">
        <div className="flex items-start justify-between gap-6 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-[var(--headline)] mb-2">Email</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Update the email address used to sign in.
            </p>
          </div>
        </div>
        <form onSubmit={handleEmailChange} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text)] mb-2">
              New email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              required
              className="w-full px-3 py-2 rounded-md border border-[var(--stroke)] bg-white text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] sm:text-sm"
              style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={emailLoading}
              className="px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:opacity-50"
            >
              {emailLoading ? 'Updating...' : 'Change email'}
            </button>
            {emailSuccess && (
              <p className="text-sm text-[var(--accent)]">Check your email to confirm the change.</p>
            )}
            {emailError && (
              <p className="text-sm text-red-600">{emailError}</p>
            )}
          </div>
          <p className="text-xs text-[var(--muted)]">We will email you a confirmation link.</p>
        </form>
      </div>

      {/* Username */}
      <div className="py-4">
        <div className="flex items-start justify-between gap-6 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-[var(--headline)] mb-2">Username</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              This name appears on your records and account pages.
            </p>
          </div>
        </div>
        <form onSubmit={handleUsernameChange} className="space-y-3">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[var(--text)] mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md border border-[var(--stroke)] bg-white text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] sm:text-sm"
              style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={usernameLoading}
              className="px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:opacity-50"
            >
              {usernameLoading ? 'Saving...' : 'Save'}
            </button>
            {usernameSuccess && (
              <p className="text-sm text-[var(--accent)]">Username updated.</p>
            )}
            {usernameError && (
              <p className="text-sm text-red-600">{usernameError}</p>
            )}
          </div>
          <p className="text-xs text-[var(--muted)]">3–24 characters. Letters, numbers, and underscores.</p>
        </form>
      </div>
    </section>
  )
}
