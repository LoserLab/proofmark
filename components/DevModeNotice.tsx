"use client";

/**
 * Small, non-intrusive development-mode notice
 * Only shows when NODE_ENV !== "production"
 * Note: process.env.NODE_ENV is replaced at build time by Next.js
 */
export default function DevModeNotice() {
  // This will be replaced at build time - in production builds, this will be "production"
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs">
      <div className="bg-[var(--surface)] border border-[var(--stroke)] rounded-lg p-3 shadow-sm">
        <div className="text-xs font-medium text-[var(--text)] mb-1">Development Mode</div>
        <div className="text-xs text-[var(--muted)] leading-relaxed">
          Some pages require sign-in. See{" "}
          <a
            href="/__routes"
            className="text-[var(--accent)] hover:underline"
          >
            all routes
          </a>
          .
        </div>
      </div>
    </div>
  );
}
