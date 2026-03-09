export default function SupportPage() {
  return (
    <main className="min-h-screen">
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-3xl font-semibold text-[var(--text)]">Support</h1>

        {/* Contact Block */}
        <div className="mt-8 bg-[var(--white)] rounded-lg border p-6 shadow-sm" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
          <h2 className="text-lg font-medium text-[var(--headline)] mb-3">Contact</h2>
          <p className="text-sm text-[var(--text)] mb-2">
            Email: <span className="font-medium">support@proofmark.xyz</span>
          </p>
          <p className="text-xs text-[var(--muted)]">
            We usually reply within 1–2 business days.
          </p>
          <p className="mt-4 text-xs text-[var(--muted)] leading-relaxed">
            If something isn&apos;t working, include the page you were on and what you were trying to do.
          </p>
        </div>

        {/* FAQs */}
        <div className="mt-12 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-[var(--headline)] mb-4">Frequently asked questions</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-[var(--text)] mb-2">What does ProofMark do?</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  ProofMark creates timestamped authorship records and generates evidence packs for creative work. It tracks version history, creates cryptographic fingerprints, and organizes documentation you can archive or reference later.
                </p>
              </div>

              <div>
                <h3 className="text-base font-medium text-[var(--text)] mb-2">What doesn&apos;t ProofMark do?</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  ProofMark does not provide legal advice, notarization, or enforcement. It does not send messages, monitor conversations, or determine legal outcomes. ProofMark creates neutral documentation and proof of existence only.
                </p>
              </div>

              <div>
                <h3 className="text-base font-medium text-[var(--text)] mb-2">What&apos;s included in an evidence packet?</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Each packet contains a timestamped authorship record with record ID and core metadata, a cryptographic hash (SHA-256) that proves integrity without exposing content, optional version trail entries showing document evolution, and a sharing log with controlled access and view counts when sharing is used.
                </p>
              </div>

              <div>
                <h3 className="text-base font-medium text-[var(--text)] mb-2">Privacy and data retention</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  ProofMark uses secure storage providers to store files and metadata. Access controls limit exposure. Data is retained while your account remains active or as needed to provide the service. You may remove content at your discretion.
                </p>
              </div>

              <div>
                <h3 className="text-base font-medium text-[var(--text)] mb-2">Sharing links</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Share links are token-based and can be configured with optional expiration dates and download permissions. Access is recorded as view counts and access times. Shared views are controlled by token-based links. Links can be revoked if your system supports it.
                </p>
              </div>

              <div>
                <h3 className="text-base font-medium text-[var(--text)] mb-2">Revisions and versions</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Each time you update your work, you can record a new version. ProofMark links versions together so the evolution is easy to follow. This creates a clean lineage without forcing you to change how you write or collaborate.
                </p>
              </div>

              <div>
                <h3 className="text-base font-medium text-[var(--text)] mb-2">Legal disclaimer</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  ProofMark is not a law firm and does not provide legal advice. Use of the service does not create an attorney-client relationship. Evidence packets are informational and organizational in nature. ProofMark helps creators maintain records of their work. It does not replace copyright registration or legal counsel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
