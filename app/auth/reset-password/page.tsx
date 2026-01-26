'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ErrorNotice from '@/components/ErrorNotice'
import { Errors } from '@/lib/copy/errors'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      setHasSession(!!session)
    }
    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw error

      setShowSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-[var(--white)] rounded-lg border p-8 shadow-sm" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
            <h2 className="text-2xl font-semibold text-[var(--headline)] mb-4 text-center">
              Password updated
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
              Your password has been successfully updated.
            </p>
            <div className="text-center">
              <Link
                href="/app"
                className="inline-block px-6 py-3 rounded-md bg-[var(--accent)] text-white text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
              >
                Go to dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-[var(--white)] rounded-lg border p-8 shadow-sm" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
            <h2 className="text-2xl font-semibold text-[var(--headline)] mb-4 text-center">
              Invalid reset link
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <div className="text-center">
              <Link
                href="/auth/forgot-password"
                className="inline-block px-6 py-3 rounded-md bg-[var(--accent)] text-white text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
              >
                Request new reset link
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--text)]">
            Choose a new password
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <ErrorNotice
              title="Failed to update password"
              body={error}
              recovery={Errors.auth.loginFailed.recovery}
            />
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 bg-white/70 backdrop-blur-[14px] border placeholder-[var(--muted)] text-[var(--text)] rounded-t-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] focus:z-10 sm:text-sm"
                style={{ borderColor: 'rgba(90, 120, 99, 0.2)' }}
                placeholder="New password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 bg-white/70 backdrop-blur-[14px] border placeholder-[var(--muted)] text-[var(--text)] rounded-b-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] focus:z-10 sm:text-sm"
                style={{ borderColor: 'rgba(90, 120, 99, 0.2)' }}
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--accent)] hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
