'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error icon */}
        <div className="mx-auto mb-6 w-12 h-12 rounded-full bg-[var(--error)]/10 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-[var(--error)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1
          className="text-2xl font-semibold text-[var(--headline)] mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Something went wrong
        </h1>

        <p className="text-sm text-[var(--muted)] mb-6 leading-relaxed">
          An unexpected error occurred. You can try again, or return to the dashboard.
        </p>

        {/* Error details */}
        {error?.message && (
          <div
            className="mb-6 rounded-lg border bg-[var(--paper)] px-4 py-3 text-left"
            style={{ borderColor: 'rgba(90, 120, 99, 0.15)' }}
          >
            <p className="text-xs font-mono text-[var(--muted)] break-words opacity-60">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-[var(--muted)] mt-1 opacity-40">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center bg-[var(--accent)] text-white px-6 py-3 rounded-md text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
          >
            Try again
          </button>
          <a
            href="/app"
            className="inline-flex items-center justify-center text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors px-4 py-3"
          >
            Back to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
