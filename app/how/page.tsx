import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <main className="overflow-x-hidden">
      {/* ── Animation keyframes ── */}
      <style>{`
        @keyframes dl-fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dl-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dl-scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes dl-slideRight {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .dl-anim { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════
          HERO (Dark)
          ═══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#080b0f" }}
      >
        {/* Mesh gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              "radial-gradient(ellipse at 20% 30%, rgba(90,120,99,0.12) 0%, transparent 50%)",
              "radial-gradient(ellipse at 70% 60%, rgba(59,73,83,0.15) 0%, transparent 45%)",
              "radial-gradient(ellipse at 50% 90%, rgba(90,120,99,0.06) 0%, transparent 40%)",
            ].join(", "),
          }}
        />

        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(144,171,139,0.07) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="max-w-5xl mx-auto px-6 pt-48 md:pt-56 pb-20 md:pb-28 relative z-10">
          {/* Monospace label */}
          <div
            className="dl-anim font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase mb-8"
            style={{
              color: "rgba(144,171,139,0.35)",
              animation: "dl-fadeIn 0.8s ease-out 0.1s both",
            }}
          >
            THE PROCESS
          </div>

          {/* Headline */}
          <h1
            className="dl-anim text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] leading-[0.95] tracking-tight mb-6"
            style={{
              fontFamily: "var(--font-display)",
              color: "#F6F6F3",
              animation: "dl-fadeUp 0.7s ease-out 0.15s both",
            }}
          >
            How ProofMark works
          </h1>

          {/* Subtitle */}
          <p
            className="dl-anim text-base md:text-lg leading-relaxed max-w-xl"
            style={{
              color: "rgba(246,246,243,0.55)",
              fontFamily: "var(--font-body)",
              animation: "dl-slideRight 0.6s ease-out 0.3s both",
            }}
          >
            Clear, timestamped records of your creative work. Designed to
            support your workflow without getting in the way.
          </p>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 5%, rgba(90,120,99,0.25) 30%, rgba(90,120,99,0.4) 50%, rgba(90,120,99,0.25) 70%, transparent 95%)",
          }}
        />
      </section>

      {/* ═══════════════════════════════════════════════════════
          STEPS - Editorial numbered rows
          ═══════════════════════════════════════════════════════ */}
      <section id="draft-protection" className="py-28 md:py-36">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-14 md:space-y-16">
            {[
              {
                num: "01",
                title: "Upload a draft or define an action",
                desc: "Choose what you want to document. This might be a draft you\u2019ve written, a version you\u2019re sharing, an email you sent, a link you submitted, or a file you delivered.",
                note: "ProofMark does not change how you work. It records only what\u2019s needed to establish a clear record.",
              },
              {
                num: "02",
                title: "Create a timestamped record",
                desc: "ProofMark generates a timestamp, a cryptographic fingerprint, and core metadata tied to that moment.",
                note: "Your original files and tools remain unchanged. ProofMark stores documentation, not ownership.",
              },
              {
                num: "03",
                title: "Track versions when work evolves",
                desc: "If your work changes, you can record a new version. Versions are linked together so the evolution is easy to follow, without forcing you to change how you write or collaborate.",
                note: null,
              },
              {
                num: "04",
                title: "Generate an evidence packet",
                desc: "When needed, ProofMark generates a clean, neutral evidence packet designed for archiving, sharing, or reference.",
                note: null,
              },
            ].map((step, i) => (
              <div
                key={step.num}
                className="dl-anim grid grid-cols-12 gap-6 md:gap-8 items-start"
                style={{
                  animation: `dl-fadeUp 0.6s ease-out ${0.1 + i * 0.1}s both`,
                }}
              >
                {/* Large monospace number */}
                <div className="col-span-3 md:col-span-2">
                  <span
                    className="dl-anim font-mono text-5xl md:text-7xl tracking-tight font-light"
                    style={{
                      color: "rgba(90,120,99,0.15)",
                      animation: `dl-scaleIn 0.5s ease-out ${0.15 + i * 0.1}s both`,
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                {/* Content with left border */}
                <div
                  className="col-span-9 md:col-span-10 pl-6 md:pl-8"
                  style={{
                    borderLeft: "1px solid rgba(90,120,99,0.15)",
                  }}
                >
                  <h2
                    className="text-xl md:text-2xl mb-3"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--headline)",
                    }}
                  >
                    {step.title}
                  </h2>
                  <p
                    className="text-sm md:text-base leading-relaxed max-w-lg"
                    style={{
                      color: "rgba(14,17,22,0.55)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {step.desc}
                  </p>
                  {step.note && (
                    <p
                      className="text-sm leading-relaxed max-w-lg mt-3"
                      style={{
                        color: "rgba(14,17,22,0.4)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {step.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className="dl-anim mt-16"
            style={{ animation: "dl-fadeUp 0.6s ease-out 0.5s both" }}
          >
            <Link
              href="/protect"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold tracking-wide transition-all duration-200 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
              style={{
                background: "#5A7863",
                color: "#FFFFFF",
                fontFamily: "var(--font-body)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Create a Record
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          COPYRIGHT SUPPORT
          ═══════════════════════════════════════════════════════ */}
      <section
        id="copyright"
        className="py-20 md:py-28"
        style={{
          borderTop: "1px solid rgba(90,120,99,0.12)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-8 md:gap-16">
            {/* Left - heading */}
            <div className="md:col-span-4">
              <div
                className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4"
                style={{ color: "rgba(90,120,99,0.4)" }}
              >
                FEATURE
              </div>
              <h2
                className="text-2xl md:text-3xl tracking-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--headline)",
                }}
              >
                Copyright support
              </h2>
            </div>

            {/* Right - content */}
            <div className="md:col-span-8">
              <p
                className="text-sm md:text-base leading-relaxed mb-6"
                style={{
                  color: "rgba(14,17,22,0.55)",
                  fontFamily: "var(--font-body)",
                }}
              >
                ProofMark&apos;s copyright support features help you organize
                your evidence packets for U.S. copyright registration. The
                guided worksheet provides plain-language prompts and organizes
                your records for future filing.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Guided worksheet for U.S. registration",
                  "Plain-language prompts",
                  "Organized records for future filing",
                  "Optional WGA assistance",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm"
                    style={{
                      color: "rgba(14,17,22,0.55)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <svg
                      className="mt-0.5 w-4 h-4 flex-shrink-0"
                      style={{ color: "#5A7863" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <p
                className="text-xs"
                style={{
                  color: "rgba(14,17,22,0.35)",
                  fontFamily: "var(--font-body)",
                }}
              >
                ProofMark is not a law firm and does not provide legal advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SENDPROOF
          ═══════════════════════════════════════════════════════ */}
      <section
        id="sendproof"
        className="py-20 md:py-28"
        style={{
          borderTop: "1px solid rgba(90,120,99,0.12)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-8 md:gap-16">
            {/* Left - heading */}
            <div className="md:col-span-4">
              <div
                className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4"
                style={{ color: "rgba(90,120,99,0.4)" }}
              >
                PREVIEW
              </div>
              <h2
                className="text-2xl md:text-3xl tracking-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--headline)",
                }}
              >
                Proof beyond creation
              </h2>
            </div>

            {/* Right - content */}
            <div className="md:col-span-8 space-y-4">
              {[
                "SendProof is currently in preview.",
                "ProofMark creates durable proof when a draft is created or updated. SendProof extends that system to moments when something is sent or submitted.",
                "SendProof records actions, not outcomes. Each proof is created intentionally and stands alone.",
                "ProofMark does not send messages, monitor conversations, provide legal advice, or determine outcomes. It creates documentation so you don\u2019t have to reconstruct history later.",
                "You don\u2019t need to use ProofMark constantly. If you never need to reference a record again, that\u2019s normal.",
              ].map((text, i) => (
                <p
                  key={i}
                  className="text-sm md:text-base leading-relaxed"
                  style={{
                    color:
                      i === 0
                        ? "rgba(14,17,22,0.4)"
                        : "rgba(14,17,22,0.55)",
                    fontFamily: "var(--font-body)",
                    fontStyle: i === 0 ? "italic" : "normal",
                  }}
                >
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA (Dark bookend)
          ═══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#080b0f" }}
      >
        {/* Mesh gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              "radial-gradient(ellipse at 50% 15%, rgba(90,120,99,0.12) 0%, transparent 45%)",
              "radial-gradient(ellipse at 25% 70%, rgba(59,73,83,0.14) 0%, transparent 40%)",
            ].join(", "),
          }}
        />

        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 5%, rgba(90,120,99,0.25) 30%, rgba(90,120,99,0.4) 50%, rgba(90,120,99,0.25) 70%, transparent 95%)",
          }}
        />

        <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 text-center relative z-10">
          <h2
            className="text-3xl md:text-4xl tracking-tight mb-5"
            style={{
              fontFamily: "var(--font-display)",
              color: "#F6F6F3",
            }}
          >
            Ready to protect your work?
          </h2>
          <p
            className="text-base leading-relaxed mb-10 max-w-lg mx-auto"
            style={{
              color: "rgba(246,246,243,0.5)",
              fontFamily: "var(--font-body)",
            }}
          >
            Create your first permanent proof in under a minute.
          </p>
          <Link
            href="/protect"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-semibold tracking-wide transition-all duration-200 hover:shadow-[0_0_24px_rgba(90,120,99,0.3)] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#90AB8B] focus:ring-offset-2 focus:ring-offset-[#0c1117]"
            style={{
              background: "#5A7863",
              color: "#FFFFFF",
              fontFamily: "var(--font-body)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Protect Your Work
          </Link>
        </div>
      </section>
    </main>
  );
}
