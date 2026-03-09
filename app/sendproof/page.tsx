import Link from 'next/link'
import type { Metadata } from 'next'
import { sendProofCopy } from '@/lib/copy/sendproof'

export const metadata: Metadata = {
  title: "SendProof",
  description: "Generate durable proof that something was sent or submitted at a specific moment. Timestamped and verifiable.",
  openGraph: {
    title: "SendProof by ProofMark",
    description: "Generate durable proof that something was sent or submitted at a specific moment.",
  },
};

export default function SendProofPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-[var(--text)] mb-6">
            {sendProofCopy.name} (Preview)
          </h1>

          <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
            SendProof is not yet live. When available, it will create a timestamped record when you send or submit something.
          </p>

          <p className="text-lg text-[var(--muted)] leading-relaxed mb-4">
            SendProof will record actions, not outcomes. It will not verify receipt or responses.
          </p>

          <p className="text-sm text-[var(--muted)] leading-relaxed mb-8">
            {sendProofCopy.actionClarifier}
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/how#sendproof"
              className="px-6 py-3 rounded-md bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            >
              Learn how it works
            </Link>

            <Link
              href="/app/settings"
              className="px-6 py-3 rounded-md border border-[var(--stroke)] text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            >
              Back to settings
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
