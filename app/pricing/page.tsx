import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="overflow-x-hidden">
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .dl-fadeUp {
            animation: dlFadeUp 0.7s ease-out both;
          }
          .dl-fadeIn {
            animation: dlFadeIn 0.6s ease-out both;
          }
          .dl-scaleIn {
            animation: dlScaleIn 0.5s ease-out both;
          }
        }
        @keyframes dlFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dlFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes dlScaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* HERO (Dark) */}
      <section className="relative overflow-hidden" style={{ background: "#080b0f" }}>
        {/* Mesh gradient background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 40%, rgba(90,120,99,0.15), transparent),
              radial-gradient(ellipse 60% 40% at 80% 30%, rgba(144,171,139,0.1), transparent),
              radial-gradient(ellipse 50% 60% at 60% 80%, rgba(90,120,99,0.08), transparent)
            `,
          }}
        />

        {/* Grain texture */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]">
          <filter id="pricingGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#pricingGrain)" />
        </svg>

        {/* Dot grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="max-w-5xl mx-auto px-6 pt-48 md:pt-56 pb-20 md:pb-28 relative z-10">
          {/* Monospace label */}
          <div
            className="dl-fadeIn flex items-center gap-3 mb-6"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-8 h-px" style={{ background: "rgba(144,171,139,0.5)" }} />
            <span
              className="font-mono text-[10px] tracking-[0.2em] uppercase"
              style={{ color: "rgba(144,171,139,0.7)" }}
            >
              Pricing
            </span>
          </div>

          {/* Headline */}
          <h1
            className="dl-fadeUp text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] leading-[1.05] tracking-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "#F6F6F3",
              animationDelay: "0.15s",
            }}
          >
            Simple pricing.
            <br />
            <span style={{ color: "#5A7863" }}>Built for real work.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="dl-fadeUp mt-6 text-base sm:text-lg max-w-xl leading-relaxed"
            style={{ color: "rgba(246,246,243,0.6)", animationDelay: "0.25s" }}
          >
            Choose the approach that fits how you work. Subscriptions keep documentation
            in place. One-time records cover a specific moment.
          </p>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(90,120,99,0.4) 20%, rgba(144,171,139,0.3) 50%, rgba(90,120,99,0.4) 80%, transparent)",
          }}
        />
      </section>

      {/* PRICING TIERS */}
      <section className="bg-[var(--bg)] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* TIER 1: Individual */}
            <div
              className="dl-scaleIn bg-[var(--white)] rounded-2xl border p-8 flex flex-col hover:border-[var(--structure)] transition-colors duration-300"
              style={{ borderColor: "rgba(90, 120, 99, 0.2)", animationDelay: "0.1s" }}
            >
              <div>
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--structure)] mb-3">
                  01
                </div>
                <h2 className="text-xl font-medium text-[var(--headline)]">
                  Individual
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                  For individual writers and solo projects.
                </p>

                <div className="mt-6 pb-6 border-b" style={{ borderColor: "rgba(90, 120, 99, 0.15)" }}>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-[var(--headline)]">$8</span>
                    <span className="text-sm text-[var(--muted)]">/ month</span>
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1">
                    billed annually ($9 month-to-month)
                  </div>
                </div>

                <ul className="mt-6 space-y-3 text-sm text-[var(--text)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--structure)] mt-0.5">+</span>
                    Private records
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--structure)] mt-0.5">+</span>
                    Timestamped snapshots
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--structure)] mt-0.5">+</span>
                    Cryptographic hashes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--structure)] mt-0.5">+</span>
                    Version history
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--structure)] mt-0.5">+</span>
                    Evidence packet generation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--structure)] mt-0.5">+</span>
                    Registration-ready exports
                  </li>
                </ul>
              </div>

              <div className="mt-auto pt-8">
                <Link
                  href="/protect"
                  className="block w-full text-center px-6 py-3.5 rounded-xl border text-sm font-medium text-[var(--text)] hover:bg-[var(--highlight)] hover:border-[var(--structure)] transition-all duration-200"
                  style={{ borderColor: "rgba(90, 120, 99, 0.25)" }}
                >
                  Get started
                </Link>
              </div>
            </div>

            {/* TIER 2: Professional (Recommended) */}
            <div
              className="dl-scaleIn bg-[var(--white)] rounded-2xl border-2 border-[var(--accent)] p-8 flex flex-col relative shadow-lg"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
                <span className="bg-[var(--accent)] text-white text-[10px] tracking-wider uppercase px-4 py-1.5 rounded-full font-medium">
                  Recommended
                </span>
              </div>

              <div>
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--structure)] mb-3">
                  02
                </div>
                <h2 className="text-xl font-medium text-[var(--headline)]">
                  Professional
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                  For writers sharing work or submitting regularly.
                </p>

                <div className="mt-6 pb-6 border-b" style={{ borderColor: "rgba(90, 120, 99, 0.15)" }}>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-[var(--headline)]">$18</span>
                    <span className="text-sm text-[var(--muted)]">/ month</span>
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1">
                    billed annually ($19 month-to-month)
                  </div>
                </div>

                <ul className="mt-6 space-y-3 text-sm text-[var(--text)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent)] mt-0.5">+</span>
                    Everything in Individual
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent)] mt-0.5">+</span>
                    Watermarked sharing links
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent)] mt-0.5">+</span>
                    Viewer identifiers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent)] mt-0.5">+</span>
                    Expanded version history
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent)] mt-0.5">+</span>
                    Priority support
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent)] mt-0.5">+</span>
                    SendProof (Preview)
                  </li>
                </ul>
              </div>

              <div className="mt-auto pt-8">
                <Link
                  href="/protect"
                  className="block w-full text-center px-6 py-3.5 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity duration-200"
                >
                  Get started
                </Link>
              </div>
            </div>

            {/* TIER 3: Studio / Team */}
            <div
              className="dl-scaleIn bg-[var(--white)] rounded-2xl border p-8 flex flex-col hover:border-[var(--structure)] transition-colors duration-300"
              style={{ borderColor: "rgba(90, 120, 99, 0.2)", animationDelay: "0.3s" }}
            >
              <div>
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--structure)] mb-3">
                  03
                </div>
                <h2 className="text-xl font-medium text-[var(--headline)]">
                  Studio / Team
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                  For teams, collectives, or production environments.
                </p>

                <div className="mt-6 pb-6 border-b" style={{ borderColor: "rgba(90, 120, 99, 0.15)" }}>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-[var(--headline)]">$35</span>
                    <span className="text-sm text-[var(--muted)]">/ month</span>
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1">
                    billed annually ($39 month-to-month)
                  </div>
                </div>

                <ul className="mt-6 space-y-3 text-sm text-[var(--text)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--structure)] mt-0.5">+</span>
                    Everything in Professional
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--structure)] mt-0.5">+</span>
                    Shared project spaces
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--structure)] mt-0.5">+</span>
                    Multiple collaborators
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--structure)] mt-0.5">+</span>
                    Team access controls
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--structure)] mt-0.5">+</span>
                    Administrative visibility
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--structure)] mt-0.5">+</span>
                    Extended retention
                  </li>
                </ul>
              </div>

              <div className="mt-auto pt-8">
                <Link
                  href="/protect"
                  className="block w-full text-center px-6 py-3.5 rounded-xl border text-sm font-medium text-[var(--text)] hover:bg-[var(--highlight)] hover:border-[var(--structure)] transition-all duration-200"
                  style={{ borderColor: "rgba(90, 120, 99, 0.25)" }}
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ONE-TIME OPTION */}
      <section className="bg-[var(--bg)] pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto px-6">
          {/* Divider with label */}
          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px" style={{ background: "rgba(90, 120, 99, 0.15)" }} />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--structure)]">
              Or
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(90, 120, 99, 0.15)" }} />
          </div>

          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
            {/* Left: Framing copy */}
            <div className="md:col-span-4">
              <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--structure)] mb-3">
                One-time option
              </div>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Best when you need a dated record for a specific moment.
                Plans are for ongoing documentation.
              </p>
            </div>

            {/* Right: Card */}
            <div className="md:col-span-8">
              <div
                className="bg-[var(--white)] rounded-2xl border p-8 md:p-10 hover:border-[var(--structure)] transition-colors duration-300"
                style={{ borderColor: "rgba(90, 120, 99, 0.2)" }}
              >
                <h3 className="text-2xl font-medium text-[var(--headline)]">
                  One-time record
                </h3>
                <p className="mt-3 text-sm text-[var(--muted)] max-w-md leading-relaxed">
                  A complete, timestamped record for a specific moment. Best when you need
                  documentation once, without ongoing tracking.
                </p>

                <div className="mt-8 flex flex-wrap items-end gap-6">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-semibold text-[var(--headline)]">$29</span>
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-1">
                      per one-time record
                    </div>
                  </div>

                  <Link
                    href="/protect"
                    className="px-8 py-3.5 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity duration-200"
                  >
                    Create a record
                  </Link>
                </div>

                <div className="mt-8 pt-6 border-t" style={{ borderColor: "rgba(90, 120, 99, 0.15)" }}>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-[var(--text)]">
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--structure)] mt-0.5">+</span>
                      Timestamped authorship record
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--structure)] mt-0.5">+</span>
                      Cryptographic fingerprint (SHA-256)
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--structure)] mt-0.5">+</span>
                      Downloadable evidence pack
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--structure)] mt-0.5">+</span>
                      Controlled sharing with tracking
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Questions section */}
      <section className="bg-[var(--bg)] pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto px-6">
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{ background: "rgba(235,244,221,0.3)", border: "1px solid rgba(90,120,99,0.1)" }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-lg font-medium text-[var(--headline)]">
                  Questions about which plan fits?
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                  We are happy to help you figure out the right approach for your work.
                </p>
              </div>
              <Link
                href="/support"
                className="shrink-0 px-6 py-3 rounded-xl border text-sm font-medium text-[var(--text)] hover:bg-white hover:border-[var(--structure)] transition-all duration-200"
                style={{ borderColor: "rgba(90, 120, 99, 0.25)" }}
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LEGAL DISCLAIMER */}
      <section className="bg-[var(--bg)] pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs text-[var(--muted)] leading-relaxed max-w-2xl">
            ProofMark creates neutral documentation and proof of existence. It does not
            provide legal advice, notarization, or enforcement.
          </p>
        </div>
      </section>
    </main>
  );
}
