export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-semibold leading-tight text-[var(--headline)]">
            <span className="text-3xl md:text-4xl font-normal">Simple pricing.</span>
            <br />
            Built for real work.
          </h1>

          <p className="mt-5 text-lg text-[var(--muted)] leading-relaxed">
            Choose the approach that fits how you work. Subscriptions keep documentation in place. One-time records cover a specific moment.
          </p>
        </div>
      </section>

      {/* SUBSCRIPTION PLANS */}
      <section className="max-w-6xl mx-auto px-6 pb-16">

        {/* PRICING TIERS */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* TIER 1: Individual */}
          <div className="bg-[var(--white)] rounded-lg border py-6 px-8 shadow-sm flex flex-col" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
            <div>
              <h2 className="text-2xl font-medium text-[var(--headline)]">
                Individual
              </h2>

              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                For individual writers and solo projects.
              </p>

              <div className="mt-4">
                <div className="text-3xl font-semibold text-[var(--text)] leading-tight">
                  $8
                </div>
                <div className="text-base text-[var(--text)] mt-0.5 leading-tight">
                  / month
                </div>
                <div className="text-xs text-[var(--muted)] mt-1 leading-tight">
                  billed annually
                </div>
                <div className="text-sm text-[var(--muted)] mt-2 pt-2 border-t" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
                  $9 month-to-month
                </div>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-[var(--text)] leading-[1.5]">
                <li>Private records</li>
                <li>Timestamped snapshots</li>
                <li>Cryptographic hashes</li>
                <li>Version history</li>
                <li>Evidence packet generation</li>
                <li>Registration-ready exports</li>
                <li>SendProof (Preview)</li>
              </ul>

              <p className="mt-6 text-xs text-[var(--muted)] leading-relaxed">
                Designed to document your work without pressure or lock-in.
              </p>
            </div>

            <div className="mt-auto pt-6 space-y-3">
              <a
                href="/protect"
                className="block w-full text-center px-6 py-3 rounded-md bg-[var(--accent)] text-white text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
              >
                Create record
              </a>
              <a
                href="/support"
                className="block w-full text-center px-6 py-3 rounded-md border text-[var(--text)] text-sm font-medium tracking-wide hover:bg-[var(--highlight)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
                style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}
              >
                Questions
              </a>
            </div>
          </div>

          {/* TIER 2: Professional (Recommended) */}
          <div className="bg-[var(--white)] rounded-lg border-2 border-[var(--accent)] py-6 px-8 shadow-sm flex flex-col relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-[var(--accent)] text-white text-xs px-3 py-1 rounded-full font-medium">
                Recommended
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-[var(--headline)]">
                Professional
              </h2>

              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                For writers sharing work, collaborating, or submitting regularly.
              </p>

              <div className="mt-4">
                <div className="text-3xl font-semibold text-[var(--text)] leading-tight">
                  $18
                </div>
                <div className="text-base text-[var(--text)] mt-0.5 leading-tight">
                  / month
                </div>
                <div className="text-xs text-[var(--muted)] mt-1 leading-tight">
                  billed annually
                </div>
                <div className="text-sm text-[var(--muted)] mt-2 pt-2 border-t" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
                  $19 month-to-month
                </div>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-[var(--text)] leading-[1.5]">
                <li>Watermarked sharing links</li>
                <li>Viewer identifiers</li>
                <li>Expanded version history</li>
                <li>Priority support</li>
                <li>Everything in Individual</li>
                <li>SendProof (Preview)</li>
              </ul>
            </div>

            <div className="mt-auto pt-6 space-y-3">
              <a
                href="/protect"
                className="block w-full text-center px-6 py-3 rounded-md bg-[var(--accent)] text-white text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
              >
                Create record
              </a>
              <a
                href="/support"
                className="block w-full text-center px-6 py-3 rounded-md border text-[var(--text)] text-sm font-medium tracking-wide hover:bg-[var(--highlight)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
                style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}
              >
                Questions
              </a>
            </div>
          </div>

          {/* TIER 3: Studio / Team */}
          <div className="bg-[var(--white)] rounded-lg border py-6 px-8 shadow-sm flex flex-col" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
            <div>
              <h2 className="text-2xl font-medium text-[var(--headline)]">
                Studio / Team
              </h2>

              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                For teams, collectives, or production environments.
              </p>

              <div className="mt-4">
                <div className="text-3xl font-semibold text-[var(--text)] leading-tight">
                  $35
                </div>
                <div className="text-base text-[var(--text)] mt-0.5 leading-tight">
                  / month
                </div>
                <div className="text-xs text-[var(--muted)] mt-1 leading-tight">
                  billed annually
                </div>
                <div className="text-sm text-[var(--muted)] mt-2 pt-2 border-t" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
                  $39 month-to-month
                </div>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-[var(--text)] leading-[1.5]">
                <li>Shared project spaces</li>
                <li>Multiple collaborators</li>
                <li>Team access controls</li>
                <li>Administrative visibility</li>
                <li>Extended retention</li>
                <li>Everything in Professional</li>
                <li>SendProof (Preview)</li>
              </ul>
            </div>

            <div className="mt-auto pt-6 space-y-3">
              <a
                href="/protect"
                className="block w-full text-center px-6 py-3 rounded-md bg-[var(--accent)] text-white text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
              >
                Create record
              </a>
              <a
                href="/support"
                className="block w-full text-center px-6 py-3 rounded-md border text-[var(--text)] text-sm font-medium tracking-wide hover:bg-[var(--highlight)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
                style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}
              >
                Questions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ONE-TIME OPTION */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 border-t" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Left column: Framing copy */}
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-wider text-[var(--warm)]">
              One-time option
            </p>
            <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">
              Best when you need a dated record for a specific moment. Plans are for ongoing documentation.
            </p>
          </div>

          {/* Right column: Card */}
          <div className="md:col-span-8">
            <div className="bg-[var(--white)] rounded-lg border p-8 shadow-sm" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
              <h3 className="text-xl font-medium text-[var(--headline)]">
                One-time record
              </h3>

              <p className="mt-2 text-sm text-[var(--muted)] max-w-md leading-relaxed">
                A complete, timestamped record for a specific moment. Best when you need documentation once, without ongoing tracking.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-[var(--text)] leading-[1.5]">
                <li>Timestamped authorship record</li>
                <li>Cryptographic file fingerprint (SHA-256)</li>
                <li>Version history with traceable lineage</li>
                <li>Controlled sharing with view tracking</li>
                <li>Downloadable evidence pack (PDF + metadata)</li>
              </ul>

              <div className="mt-6 flex items-end gap-6">
                <div>
                  <div className="text-3xl font-semibold text-[var(--text)] leading-tight">$29</div>
                  <div className="text-xs text-[var(--muted)] mt-0.5 leading-tight">
                    per one-time record
                  </div>
                </div>

                <a
                  href="/protect"
                  className="px-6 py-3.5 rounded-md bg-[var(--accent)] text-white text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                >
                  Create a record
                </a>
              </div>

              <p className="mt-4 text-xs text-[var(--muted)] leading-relaxed">
                Most creators generate a packet only when they need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LEGAL DISCLAIMER */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="max-w-3xl">
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            DraftLock creates neutral documentation and proof of existence. It does not provide legal advice, notarization, or enforcement.
          </p>
        </div>
      </section>
    </main>
  );
}
