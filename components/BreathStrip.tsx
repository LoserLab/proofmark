export default function BreathStrip() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 min-h-[420px]">
        {/* Panel 1 — Private (black) */}
        <div
          className="p-12 md:p-14 relative flex flex-col"
          style={{
            backgroundColor: "var(--brand-dark)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex justify-between items-start mb-auto">
            <svg
              className="w-10 h-10"
              style={{ color: "var(--brand-plum)", opacity: 0.15 }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
            <span
              className="text-[10px] font-light tracking-[0.2em] font-mono"
              style={{ color: "rgba(255,255,255,0.1)" }}
            >
              01
            </span>
          </div>
          <div className="mt-auto">
            <h3
              className="mb-4"
              style={{
                color: "#FFFFFF",
                fontSize: "28px",
                fontFamily: "var(--font-display)",
              }}
            >
              Private
            </h3>
            <p
              className="leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "14px",
                fontFamily: "var(--font-body)",
              }}
            >
              Only your file&apos;s cryptographic fingerprint is recorded.
              Your actual content stays private.
            </p>
          </div>
        </div>

        {/* Panel 2 — Permanent (dark surface) */}
        <div
          className="p-12 md:p-14 relative flex flex-col"
          style={{
            backgroundColor: "var(--brand-dark-surface)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex justify-between items-start mb-auto">
            <svg
              className="w-10 h-10"
              style={{ color: "var(--brand-ink-blue)", opacity: 0.15 }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <span
              className="text-[10px] font-light tracking-[0.2em] font-mono"
              style={{ color: "rgba(255,255,255,0.1)" }}
            >
              02
            </span>
          </div>
          <div className="mt-auto">
            <h3
              className="mb-4"
              style={{
                color: "#FFFFFF",
                fontSize: "28px",
                fontFamily: "var(--font-display)",
              }}
            >
              Permanent
            </h3>
            <p
              className="leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "14px",
                fontFamily: "var(--font-body)",
              }}
            >
              Once sealed, your proof can&apos;t be altered, backdated, or
              deleted. Ever.
            </p>
          </div>
        </div>

        {/* Panel 3 — Verifiable (light) */}
        <div
          className="p-12 md:p-14 relative flex flex-col"
          style={{ backgroundColor: "var(--brand-light)" }}
        >
          <div className="flex justify-between items-start mb-auto">
            <svg
              className="w-10 h-10"
              style={{ color: "var(--brand-ashen)", opacity: 0.2 }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M22 11.08V12a10 10 0 11-5.93-9.14"
              />
              <polyline
                strokeLinecap="round"
                strokeLinejoin="round"
                points="22 4 12 14.01 9 11.01"
              />
            </svg>
            <span
              className="text-[10px] font-light tracking-[0.2em] font-mono"
              style={{ color: "rgba(10,10,10,0.1)" }}
            >
              03
            </span>
          </div>
          <div className="mt-auto">
            <h3
              className="mb-4"
              style={{
                color: "#0A0A0A",
                fontSize: "28px",
                fontFamily: "var(--font-display)",
              }}
            >
              Verifiable
            </h3>
            <p
              className="leading-relaxed"
              style={{
                color: "rgba(10,10,10,0.45)",
                fontSize: "14px",
                fontFamily: "var(--font-body)",
              }}
            >
              Anyone, anywhere can confirm your proof independently. No
              ProofMark account needed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
