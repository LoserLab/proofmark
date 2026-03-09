export default function Footer() {
  const linkClasses =
    "text-[rgba(255,255,255,0.3)] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[var(--brand-dark)] rounded";

  return (
    <footer className="relative" style={{ background: "var(--brand-dark)" }}>
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, #6B4C6E, #3D5A6E, #5A6E5C)",
          opacity: 0.2,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">
          {/* Column 1: Brand & About */}
          <div className="md:col-span-5 space-y-4">
            <div
              className="text-lg tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: "#FFFFFF",
              }}
            >
              ProofMark
            </div>
            <div
              className="text-xs leading-relaxed max-w-sm"
              style={{
                color: "rgba(255,255,255,0.25)",
                fontFamily: "var(--font-body)",
              }}
            >
              Permanent proof of creation for creative work.
              Lock your work before you share it.
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-4">
            <div
              className="text-[10px] uppercase tracking-[0.15em] mb-4 font-medium"
              style={{
                color: "rgba(255,255,255,0.15)",
                fontFamily: "var(--font-body)",
              }}
            >
              Navigate
            </div>
            <nav
              className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <a href="/how" className={linkClasses}>
                How it works
              </a>
              <a href="/privacy" className={linkClasses}>
                Privacy
              </a>
              <a href="/pricing" className={linkClasses}>
                Pricing
              </a>
              <a href="/terms" className={linkClasses}>
                Terms
              </a>
              <a href="/verify" className={linkClasses}>
                Verify a Record
              </a>
              <a href="/support" className={linkClasses}>
                Support
              </a>
            </nav>
          </div>

          {/* Column 3: Trust badge */}
          <div className="md:col-span-3 flex md:justify-end">
            <div className="space-y-3">
              <div
                className="text-[10px] uppercase tracking-[0.15em] mb-4 font-medium"
                style={{
                  color: "rgba(255,255,255,0.15)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Trust Layer
              </div>
              <div className="flex items-start gap-2.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mt-[3px] shrink-0"
                  aria-hidden="true"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span
                  className="text-xs leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.18)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Tamper-proof records of<br />existence and authorship
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.04)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <div
            className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px]"
            style={{
              color: "rgba(255,255,255,0.15)",
              fontFamily: "var(--font-body)",
            }}
          >
            <span>&copy; {new Date().getFullYear()} ProofMark. All rights reserved.</span>
            <span className="hidden sm:inline" aria-hidden="true">&middot;</span>
            <span>Prove you made it first</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
