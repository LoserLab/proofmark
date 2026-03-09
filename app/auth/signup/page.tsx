'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import ErrorNotice from '@/components/ErrorNotice'
import { Errors } from '@/lib/copy/errors'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // If no session exists, email confirmation is required
      if (!data.session) {
        setShowSuccess(true)
        return
      }

      // If session exists, redirect to app
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Sign up successful, session:', data.session ? 'present' : 'missing')
      }
      router.replace('/app')
      router.refresh()
    } catch (err) {
      setError(Errors.auth.signupFailed.body)
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
              Check your email
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-2">
              We sent a confirmation link to your email. Open it to finish creating your account, then come back to sign in.
            </p>
            <p className="text-xs text-[var(--muted)] leading-relaxed mb-6">
              If you do not see it, check spam.
            </p>
            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-block px-6 py-3 rounded-md bg-[var(--accent)] text-white text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
              >
                Back to sign in
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
            Create your ProofMark account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <ErrorNotice
              title={Errors.auth.signupFailed.title}
              body={error}
              recovery={Errors.auth.signupFailed.recovery}
            />
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 bg-white/70 backdrop-blur-[14px] border placeholder-[var(--muted)] text-[var(--text)] rounded-t-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] focus:z-10 sm:text-sm"
                style={{ borderColor: 'rgba(90, 120, 99, 0.2)' }}
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 bg-white/70 backdrop-blur-[14px] border placeholder-[var(--muted)] text-[var(--text)] rounded-b-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] focus:z-10 sm:text-sm"
                style={{ borderColor: 'rgba(90, 120, 99, 0.2)' }}
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--accent)] hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-[var(--accent)] hover:opacity-90 transition-opacity text-sm"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
