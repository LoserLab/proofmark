export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-3xl font-semibold text-[var(--text)]">Terms of Service</h1>

        <div className="mt-8 space-y-8 text-sm text-[var(--muted)] leading-relaxed">
          <p>
            ProofMark provides tools to help creators organize, timestamp, and document
            versions of their work. By using ProofMark, you agree to the terms below.
          </p>

          <section>
            <h2 className="text-[var(--text)] font-medium">Use of the service</h2>
            <p className="mt-2">
              You may use ProofMark to upload, manage, and generate records for content
              you own or are authorized to handle. You are responsible for ensuring that
              your use of the service complies with applicable laws and agreements.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text)] font-medium">Content ownership</h2>
            <p className="mt-2">
              You retain ownership of your content. ProofMark does not claim ownership of
              uploaded files or generated records.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text)] font-medium">Records and evidence packs</h2>
            <p className="mt-2">
              ProofMark generates records based on the information provided and the time
              of submission. These records are informational and organizational in nature.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text)] font-medium">No legal advice</h2>
            <p className="mt-2">
              ProofMark is not a law firm and does not provide legal advice. Use of the
              service does not create an attorney-client relationship.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text)] font-medium">Service availability</h2>
            <p className="mt-2">
              ProofMark is provided on an &quot;as is&quot; basis. We may update, suspend, or
              discontinue features at any time.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text)] font-medium">Limitation of liability</h2>
            <p className="mt-2">
              To the extent permitted by law, ProofMark is not liable for indirect or
              consequential damages arising from use of the service.
            </p>
          </section>

          <p className="text-xs text-[var(--muted)]">
            These terms may be updated from time to time. Continued use of ProofMark
            constitutes acceptance of the current terms.
          </p>
        </div>
      </section>
    </main>
  );
}
