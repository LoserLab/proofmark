import EvidencePacketPreview from "@/components/EvidencePacketPreview";
import HeroVisual from "@/components/HeroVisual";
import BreathStrip from "@/components/BreathStrip";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-48 pb-32">
        <div className="grid lg:grid-cols-12 gap-24 items-center">
          {/* Left: Editorial copy */}
          <div className="lg:col-span-6 space-y-8">
            <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight text-[var(--headline)]">
              Clear proof for your work, when it matters.
            </h1>

            <p className="text-lg leading-relaxed text-[var(--muted)] max-w-xl">
              DraftLock creates timestamped records of your drafts and actions. Track versions, generate neutral evidence, and keep clean documentation you can archive or reference later.
            </p>

            <div className="text-sm text-[var(--muted)] leading-relaxed">
              Built for creatives who want clarity without legal complexity.
            </div>

            {/* What DraftLock creates - simple list */}
            <div className="space-y-2 text-sm text-[var(--text)]">
              <div>• Timestamped authorship record</div>
              <div>• Cryptographic file fingerprint</div>
              <div>• Version lineage and sharing log</div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-6">
              <a
                href="/protect"
                className="px-6 py-3.5 rounded-md bg-[var(--accent)] text-white text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
              >
                Create a record
              </a>
              <a
                href="#what-you-receive"
                className="px-6 py-3 rounded-md border border-[var(--stroke)] text-sm font-medium hover:border-[var(--structure)] hover:text-[var(--structure)] hover:bg-[var(--highlight)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
              >
                View an example packet
              </a>
            </div>
          </div>

          {/* Right: Modern abstract visual */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Breath strip */}
      <BreathStrip />

      {/* Example packet section */}
      <section id="what-you-receive" className="bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: Preview */}
            <div className="lg:sticky lg:top-24">
              <div className="mx-auto w-full max-w-md">
                <EvidencePacketPreview size="default" />
              </div>
            </div>

            {/* Right: Copy */}
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--headline)]">
                What you receive
              </h2>

              <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
                Each record is a complete, timestamped snapshot of a moment. That moment might be when a draft was created, or when something was sent or submitted.
              </p>

              <ul className="mt-8 space-y-4 text-sm">
                <li className="flex gap-3">
                  <svg className="mt-1 w-4 h-4 flex-shrink-0" style={{ color: 'rgba(90, 120, 99, 0.7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <div>
                    <div className="font-medium text-[var(--text)]">Authorship record</div>
                    <div className="text-[var(--muted)]">
                      Timestamp, record ID, and core metadata tied to your submission.
                    </div>
                  </div>
                </li>

                <li className="flex gap-3">
                  <svg className="mt-1 w-4 h-4 flex-shrink-0" style={{ color: 'rgba(90, 120, 99, 0.7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <div>
                    <div className="font-medium text-[var(--text)]">Fingerprint</div>
                    <div className="text-[var(--muted)]">
                      A cryptographic hash that proves integrity without exposing your content.
                    </div>
                  </div>
                </li>

                <li className="flex gap-3">
                  <svg className="mt-1 w-4 h-4 flex-shrink-0" style={{ color: 'rgba(90, 120, 99, 0.7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <div>
                    <div className="font-medium text-[var(--text)]">Version trail</div>
                    <div className="text-[var(--muted)]">
                      Optional entries that show how a document evolved over time.
                    </div>
                  </div>
                </li>

                <li className="flex gap-3">
                  <svg className="mt-1 w-4 h-4 flex-shrink-0" style={{ color: 'rgba(90, 120, 99, 0.7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <div>
                    <div className="font-medium text-[var(--text)]">Sharing log</div>
                    <div className="text-[var(--muted)]">
                      Controlled access with view counts when sharing is needed.
                    </div>
                  </div>
                </li>
              </ul>

              <p className="mt-10 text-xs text-[var(--muted)]">
                DraftLock does not provide legal advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works preview */}
      <section id="how" className="py-24 border-t" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[var(--headline)] mb-3">
              One system for protecting creative work
            </h2>
            <p className="text-[var(--muted)] leading-relaxed">
              Draft documentation creates the authorship record. SendProof captures proof of submission. Copyright support turns both into organized materials that are easy to file and archive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 items-start">
            <div>
              <h3 className="text-xl font-medium text-[var(--headline)] mb-4">Draft documentation</h3>
              <div className="space-y-3 text-sm text-[var(--muted)] leading-relaxed">
                <div>• Timestamped authorship records</div>
                <div>• Cryptographic fingerprints</div>
                <div>• Version history with clear lineage</div>
                <div>• Controlled sharing when needed</div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-[var(--headline)] mb-4">Proof of action</h3>
              <div className="space-y-3 text-sm text-[var(--muted)] leading-relaxed">
                <div>• Proof that something was sent or submitted</div>
                <div>• Timestamped snapshots</div>
                <div>• Permanent proof pages</div>
                <div>• Clean, downloadable PDFs</div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-[var(--headline)] mb-4">Copyright support</h3>
              <div className="space-y-3 text-sm text-[var(--muted)] leading-relaxed">
                <div>• Guided worksheet for U.S. registration</div>
                <div>• Plain-language prompts</div>
                <div>• Organized records for future filing</div>
                <div>• Optional WGA assistance</div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="/how"
              className="inline-block px-6 py-3 rounded-md border text-sm font-medium text-[var(--text)] hover:border-[var(--structure)] hover:text-[var(--structure)] hover:bg-[var(--highlight)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
              style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}
            >
              Learn more
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
