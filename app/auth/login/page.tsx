'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import ErrorNotice from '@/components/ErrorNotice'
import { Errors } from '@/lib/copy/errors'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Verify session exists
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Sign in successful, session:', data.session ? 'present' : 'missing')
      }

      // Use replace to avoid adding to history, then refresh to trigger middleware
      router.replace('/app')
      router.refresh()
    } catch (err) {
      setError('Check your email and password. If you just signed up, you may need to confirm your email before signing in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--text)]">
            Sign in to DraftLock
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <ErrorNotice
              title="Sign in failed"
              body={error}
              recovery={Errors.auth.loginFailed.recovery}
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
                autoComplete="current-password"
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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/signup"
              className="text-[var(--accent)] hover:opacity-90 transition-opacity text-sm"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
