import { sendProofCopy } from '@/lib/copy/sendproof'

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-[var(--headline)]">
            How DraftLock works
          </h1>
          <p className="mt-4 text-lg text-[var(--muted)] leading-relaxed">
            DraftLock helps you create clear, timestamped records of your work and actions. It&apos;s designed to support creative workflows without getting in the way.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section id="draft-protection" className="max-w-6xl mx-auto px-6 pb-24 border-t pt-24" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-[var(--white)] rounded-lg border p-8 shadow-sm" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
            <div className="text-xs uppercase tracking-wider text-[var(--structure)]">
              Step 1
            </div>
            <h2 className="mt-2 text-xl font-medium text-[var(--headline)]">
              Upload a draft or define an action
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
              Choose what you want to document. This might be a draft you&apos;ve written, a version you&apos;re sharing, an email you sent, a link you submitted, or a file or application you delivered.
            </p>
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
              DraftLock does not change how you work. It records only what&apos;s needed to establish a clear record.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[var(--white)] rounded-lg border p-8 shadow-sm" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
            <div className="text-xs uppercase tracking-wider text-[var(--structure)]">
              Step 2
            </div>
            <h2 className="mt-2 text-xl font-medium text-[var(--headline)]">
              Create a timestamped record
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
              DraftLock generates a timestamp, a cryptographic fingerprint, and core metadata tied to that moment.
            </p>
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
              Your original files and tools remain unchanged. DraftLock stores documentation, not ownership.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[var(--white)] rounded-lg border p-8 shadow-sm" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
            <div className="text-xs uppercase tracking-wider text-[var(--structure)]">
              Step 3
            </div>
            <h2 className="mt-2 text-xl font-medium text-[var(--headline)]">
              Track versions when work evolves
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
              If your work changes, you can record a new version. Versions are linked together so the evolution is easy to follow, without forcing you to change how you write or collaborate.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="mt-8 max-w-3xl">
          <div className="bg-[var(--white)] rounded-lg border p-8 shadow-sm" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
            <div className="text-xs uppercase tracking-wider text-[var(--structure)]">
              Step 4
            </div>
            <h2 className="mt-2 text-xl font-medium text-[var(--headline)]">
              Generate an evidence packet
            </h2>
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
              When needed, DraftLock generates a clean, neutral evidence packet designed for archiving, sharing, or reference.
            </p>
          </div>
        </div>

        {/* Trust note */}
        <div className="mt-16 max-w-3xl">
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            DraftLock is designed to support documentation and organization of creative
            work. It is not a law firm and does not provide legal advice.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12">
          <a
            href="/protect"
            className="inline-block px-6 py-3 rounded-md bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
          >
            Create a record
          </a>
        </div>
      </section>

      {/* Copyright Support section */}
      <section id="copyright" className="max-w-6xl mx-auto px-6 pb-24 border-t pt-24" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-[var(--headline)] mb-4">
            Copyright support
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
            DraftLock&apos;s copyright support features help you organize your evidence packets
            for U.S. copyright registration. The guided worksheet provides plain-language prompts
            and organizes your records for future filing.
          </p>
          <div className="space-y-3 text-sm text-[var(--muted)] leading-relaxed mt-4">
            <div>• Guided worksheet for U.S. registration</div>
            <div>• Plain-language prompts</div>
            <div>• Organized records for future filing</div>
            <div>• Optional WGA assistance</div>
          </div>
          <p className="mt-6 text-xs text-[var(--muted)] leading-relaxed">
            DraftLock is not a law firm and does not provide legal advice.
          </p>
        </div>
      </section>

      {/* SendProof section */}
      <section id="sendproof" className="max-w-6xl mx-auto px-6 pb-24 border-t pt-24" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-[var(--headline)] mb-4">
            Proof beyond creation
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
            SendProof is currently in preview.
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
            DraftLock creates durable proof when a draft is created or updated. SendProof extends that system to moments when something is sent or submitted.
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
            SendProof records actions, not outcomes. Each proof is created intentionally and stands alone.
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
            DraftLock does not send messages, monitor conversations, provide legal advice, or determine outcomes. It creates documentation so you don&apos;t have to reconstruct history later.
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            You don&apos;t need to use DraftLock constantly. If you never need to reference a record again, that&apos;s normal.
          </p>
        </div>
      </section>
    </main>
  );
}
