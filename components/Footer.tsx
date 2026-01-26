export default function Footer() {
  return (
    <footer className="border-t bg-[var(--white)]" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: About & Disclaimer */}
          <div className="space-y-2">
            <div className="text-xs text-[var(--muted)] leading-relaxed">
              DraftLock creates timestamped authorship records and generates evidence packs for creative work.
            </div>
            <div className="text-[10px] italic text-[var(--muted)]/70 leading-relaxed mt-3 pt-3 border-t" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
              DraftLock creates neutral documentation and proof of existence. It does not provide legal advice, notarization, or enforcement.
            </div>
          </div>

          {/* Column 2: Empty for future use */}
          <div></div>

          {/* Column 3: Navigation Links */}
          <div className="flex md:justify-end">
            <nav className="grid grid-cols-2 gap-x-14 gap-y-3 text-sm items-start">
              {/* Left Column */}
              <div className="flex flex-col gap-3">
                <a 
                  href="/how" 
                  className="text-[var(--muted)] hover:text-[var(--headline)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 rounded"
                >
                  How it works
                </a>
                <a 
                  href="/pricing" 
                  className="text-[var(--muted)] hover:text-[var(--headline)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 rounded"
                >
                  Pricing
                </a>
                <a 
                  href="/support" 
                  className="text-[var(--muted)] hover:text-[var(--headline)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 rounded"
                >
                  Support
                </a>
              </div>
              {/* Right Column */}
              <div className="flex flex-col gap-3">
                <a 
                  href="/privacy" 
                  className="text-[var(--muted)] hover:text-[var(--headline)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 rounded"
                >
                  Privacy
                </a>
                <a 
                  href="/terms" 
                  className="text-[var(--muted)] hover:text-[var(--headline)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 rounded"
                >
                  Terms
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="border-t bg-[var(--white)]" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center text-xs text-[var(--muted)]">
            © 2026 DraftLock | All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
