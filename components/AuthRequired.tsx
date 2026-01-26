"use client";

import Link from "next/link";

/**
 * Component to display when authentication is required
 * Shows a clear message with navigation options instead of silent redirect
 */
export default function AuthRequired({
  title = "Sign in required",
  message = "This page requires you to be signed in.",
  showSignUp = true,
}: {
  title?: string;
  message?: string;
  showSignUp?: boolean;
}) {
  return (
    <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-[var(--surface)] rounded-lg border border-[var(--stroke)] p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-[var(--text)] mb-3">{title}</h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">{message}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/login"
              className="px-6 py-3 rounded-md bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            >
              Sign in
            </Link>
            {showSignUp && (
              <Link
                href="/auth/signup"
                className="px-6 py-3 rounded-md border border-[var(--stroke)] text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
              >
                Create account
              </Link>
            )}
            <Link
              href="/"
              className="px-6 py-3 rounded-md border border-[var(--stroke)] text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
