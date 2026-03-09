import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="text-center">
        {/* Large 404 number */}
        <h1
          className="text-[8rem] sm:text-[10rem] font-normal leading-none text-[var(--structure)] select-none"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          404
        </h1>

        <h2
          className="text-xl font-semibold text-[var(--headline)] mb-3 -mt-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Page not found
        </h2>

        <p className="text-sm text-[var(--muted)] mb-8 max-w-sm mx-auto leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center bg-[var(--accent)] text-white px-6 py-3 rounded-md text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
