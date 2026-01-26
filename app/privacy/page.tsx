export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-3xl font-semibold text-[var(--text)]">Privacy Policy</h1>

        <div className="mt-8 space-y-8 text-sm text-[var(--muted)] leading-relaxed">
          <p>
            DraftLock respects your privacy. This policy explains what information we
            collect and how it is used.
          </p>

          <section>
            <h2 className="text-[var(--text)] font-medium">Information you provide</h2>
            <p className="mt-2">
              We collect information you choose to provide when using DraftLock, such as
              uploaded files, metadata, and account-related details.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text)] font-medium">How information is used</h2>
            <p className="mt-2">
              Information is used to operate the service, generate records, and improve
              reliability. DraftLock does not sell personal data.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text)] font-medium">Shared views</h2>
            <p className="mt-2">
              If you create a share link, access may be recorded as view counts or access
              times. Shared views are controlled by token-based links.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text)] font-medium">Data storage</h2>
            <p className="mt-2">
              DraftLock uses secure storage providers to store files and metadata. Access
              controls are applied to limit exposure.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text)] font-medium">Data retention</h2>
            <p className="mt-2">
              Data is retained while your account remains active or as needed to provide
              the service. You may remove content at your discretion.
            </p>
          </section>

          <section>
            <h2 className="text-[var(--text)] font-medium">Changes</h2>
            <p className="mt-2">
              This policy may be updated as the service evolves.
            </p>
          </section>

          <p className="text-xs text-[var(--muted)]">
            If you have questions about privacy, contact DraftLock support.
          </p>
        </div>
      </section>
    </main>
  );
}
