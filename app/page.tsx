import EvidencePacketPreview from "@/components/EvidencePacketPreview";
import BreathStrip from "@/components/BreathStrip";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   ProofMark Landing Page
   "Prove you made it first."
   Dark mode + weird gradient (dusty rose / amber / sage)
   ───────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <style>{`
        @keyframes dl-fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dl-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dl-slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes dl-scaleIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes dl-lineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes dl-gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dl-anim { animation: none !important; opacity: 1 !important; }
        }
        .dl-gradient-text {
          background: linear-gradient(135deg, #6B4C6E, #3D5A6E, #5A6E5C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .dl-gradient-btn {
          background: linear-gradient(135deg, #6B4C6E, #3D5A6E 50%, #5A6E5C);
          background-size: 150% 150%;
          transition: all 0.3s ease;
        }
        .dl-gradient-btn:hover {
          background-size: 200% 200%;
          animation: dl-gradientShift 4s ease infinite;
          transform: scale(1.02);
        }
        .dl-gradient-line {
          background: linear-gradient(90deg, #6B4C6E, #3D5A6E, #5A6E5C);
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════════════ */}
      <section
        className="relative flex flex-col justify-center overflow-hidden"
        style={{
          minHeight: "100vh",
          background: "var(--brand-dark)",
        }}
      >
        {/* Atmospheric gradient orb */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "900px",
            height: "700px",
            right: "-12%",
            top: "10%",
            background: "radial-gradient(ellipse at center, rgba(196,132,122,0.06) 0%, rgba(201,169,110,0.04) 35%, rgba(123,142,106,0.05) 65%, transparent 85%)",
            filter: "blur(80px)",
          }}
        />

        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.2]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-40 md:pt-48 pb-24 md:pb-32 relative z-10 w-full">
          {/* Label */}
          <div
            className="dl-anim mb-10 md:mb-14"
            style={{ animation: "dl-fadeIn 0.8s ease-out 0.1s both" }}
          >
            <span
              className="inline-flex items-center gap-3 text-[10px] md:text-[11px] tracking-[0.3em] uppercase"
              style={{
                color: "rgba(255,255,255,0.3)",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
              }}
            >
              <span
                className="dl-anim dl-gradient-line inline-block h-px w-8"
                style={{
                  opacity: 0.6,
                  animation: "dl-lineGrow 0.6s ease-out 0.3s both",
                  transformOrigin: "left",
                }}
              />
              Creation Receipts
            </span>
          </div>

          {/* Headline */}
          <h1
            className="dl-anim mb-10 md:mb-14"
            style={{
              fontFamily: "var(--font-display)",
              animation: "dl-fadeUp 0.8s ease-out 0.2s both",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
            }}
          >
            <span
              className="block text-[3rem] sm:text-[4.5rem] md:text-[6.5rem] lg:text-[8.5rem]"
              style={{ color: "#FFFFFF" }}
            >
              Prove you
            </span>
            <span
              className="block text-[3rem] sm:text-[4.5rem] md:text-[6.5rem] lg:text-[8.5rem]"
              style={{ color: "#FFFFFF" }}
            >
              made it{" "}
              <span className="dl-gradient-text" style={{ fontStyle: "italic" }}>
                first.
              </span>
            </span>
          </h1>

          {/* Subtitle + CTAs */}
          <div className="max-w-lg">
            <p
              className="dl-anim text-base md:text-lg leading-relaxed mb-10"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "var(--font-body)",
                animation: "dl-slideRight 0.6s ease-out 0.45s both",
              }}
            >
              Before you pitch it, send it, or share it. ProofMark creates
              permanent, blockchain-verified proof of your creative work
              on Avalanche in under 60 seconds.
            </p>

            <div
              className="dl-anim flex flex-wrap gap-4"
              style={{ animation: "dl-fadeUp 0.6s ease-out 0.6s both" }}
            >
              <Link
                href="/protect"
                className="dl-gradient-btn inline-flex items-center gap-2.5 px-7 py-3.5 rounded text-sm font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-[var(--brand-ink-blue)] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
                style={{
                  color: "#FFFFFF",
                  fontFamily: "var(--font-body)",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Lock Your First Draft
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded text-sm font-medium tracking-wide border transition-all duration-200 hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.2)] focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
                style={{
                  borderColor: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "var(--font-body)",
                }}
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px dl-gradient-line"
          style={{ opacity: 0.25 }}
        />
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — THE VILLAIN
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-28 md:py-40"
        style={{ background: "var(--brand-light)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h2
            className="dl-anim text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] tracking-tight leading-[1.05] mb-16 md:mb-20"
            style={{
              fontFamily: "var(--font-display)",
              color: "#0A0A0A",
              animation: "dl-fadeUp 0.7s ease-out 0.1s both",
            }}
          >
            You create. They take.
            <br />
            <span style={{ color: "rgba(10,10,10,0.2)" }}>
              You can&apos;t prove a thing.
            </span>
          </h2>

          {/* Scenario blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-16 md:mb-20">
            {[
              {
                label: "The Screenplay",
                text: "A screenwriter shares a script with a producer. Six months later, a suspiciously similar movie gets greenlit.",
                accent: "var(--brand-plum)",
              },
              {
                label: "The Song",
                text: "A songwriter demos a hook in a session. It shows up on someone else\u2019s album. No proof who wrote it first.",
                accent: "var(--brand-ink-blue)",
              },
              {
                label: "The Pitch",
                text: "A founder pitches an idea to investors. The VC passes, then funds a clone three months later.",
                accent: "var(--brand-ashen)",
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className="dl-anim p-8 md:p-10"
                style={{
                  borderTop: "1px solid rgba(10,10,10,0.08)",
                  borderRight: i < 2 ? "1px solid rgba(10,10,10,0.08)" : "none",
                  animation: `dl-fadeUp 0.5s ease-out ${0.25 + i * 0.1}s both`,
                }}
              >
                <div
                  className="text-[10px] font-medium tracking-[0.2em] uppercase mb-5"
                  style={{
                    color: item.accent,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {item.label}
                </div>
                <p
                  className="text-sm md:text-base leading-relaxed"
                  style={{
                    color: "rgba(10,10,10,0.55)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div
            className="dl-anim max-w-2xl"
            style={{ animation: "dl-fadeUp 0.6s ease-out 0.55s both" }}
          >
            <p
              className="text-base md:text-lg leading-relaxed mb-6"
              style={{
                color: "rgba(10,10,10,0.45)",
                fontFamily: "var(--font-body)",
              }}
            >
              It happens every day. And the creator almost never wins. Not
              because they weren&apos;t first. Because they can&apos;t prove they
              were first.
            </p>
            <p
              className="text-2xl md:text-3xl"
              style={{
                fontFamily: "var(--font-display)",
                color: "#0A0A0A",
              }}
            >
              ProofMark changes that.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS
          ═══════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="py-28 md:py-40 relative overflow-hidden"
        style={{ background: "var(--brand-dark)" }}
      >
        {/* Subtle gradient glow bottom-left */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "600px",
            height: "400px",
            left: "-5%",
            bottom: "0",
            background: "radial-gradient(ellipse at center, rgba(123,142,106,0.05) 0%, rgba(201,169,110,0.03) 50%, transparent 80%)",
            filter: "blur(60px)",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
          <div className="mb-20 md:mb-28 max-w-xl">
            <h2
              className="dl-anim text-3xl md:text-4xl lg:text-5xl tracking-tight mb-5"
              style={{
                fontFamily: "var(--font-display)",
                color: "#FFFFFF",
                animation: "dl-fadeUp 0.6s ease-out 0.1s both",
              }}
            >
              Three steps. Sixty seconds.
            </h2>
            <p
              className="dl-anim text-base leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "var(--font-body)",
                animation: "dl-fadeUp 0.6s ease-out 0.2s both",
              }}
            >
              No technical expertise needed. Just your file and half a minute.
            </p>
          </div>

          <div className="space-y-20 md:space-y-28">
            {[
              {
                num: "01",
                title: "Drop",
                desc: "Drop your file. ProofMark computes a unique SHA-256 fingerprint and securely stores your work for evidence generation.",
                color: "var(--brand-plum)",
              },
              {
                num: "02",
                title: "Lock",
                desc: "Your fingerprint is registered on the Avalanche blockchain with a permanent, tamper-proof timestamp. Immutable. Verifiable. Yours.",
                color: "var(--brand-ink-blue)",
              },
              {
                num: "03",
                title: "Prove",
                desc: "Download your certificate, share a verification link, or embed a badge. Anyone can confirm your proof independently.",
                color: "var(--brand-ashen)",
              },
            ].map((step, i) => (
              <div
                key={step.num}
                className="dl-anim grid grid-cols-12 gap-6 md:gap-10 items-start"
                style={{
                  animation: `dl-fadeUp 0.6s ease-out ${0.25 + i * 0.15}s both`,
                }}
              >
                <div className="col-span-4 md:col-span-3 lg:col-span-2">
                  <span
                    className="dl-anim block font-mono text-[4rem] md:text-[6rem] lg:text-[7rem] tracking-tighter font-light leading-none"
                    style={{
                      color: step.color,
                      opacity: 0.15,
                      animation: `dl-scaleIn 0.5s ease-out ${0.3 + i * 0.15}s both`,
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                <div className="col-span-8 md:col-span-9 lg:col-span-10 pt-3 md:pt-5">
                  <h3
                    className="text-2xl md:text-3xl mb-4"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#FFFFFF",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm md:text-base leading-relaxed max-w-lg"
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — BREATH STRIP
          ═══════════════════════════════════════════════════════ */}
      <BreathStrip />

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — LOCK IT BEFORE...
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-28 md:py-40"
        style={{ background: "var(--brand-light)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="mb-16 md:mb-20 max-w-xl">
            <h2
              className="dl-anim text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4"
              style={{
                fontFamily: "var(--font-display)",
                color: "#0A0A0A",
                animation: "dl-fadeUp 0.6s ease-out 0.1s both",
              }}
            >
              Lock it before...
            </h2>
            <p
              className="dl-anim text-base leading-relaxed"
              style={{
                color: "rgba(10,10,10,0.4)",
                fontFamily: "var(--font-body)",
                animation: "dl-fadeUp 0.6s ease-out 0.2s both",
              }}
            >
              60 seconds between vulnerability and proof.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {[
              {
                title: "The pitch meeting",
                desc: "Your deck, your concept, your strategy. Timestamped before you walk in the room.",
              },
              {
                title: "The collaboration",
                desc: "You brought the hook. Prove it was yours before the session started.",
              },
              {
                title: "The query letter",
                desc: "Your manuscript, your synopsis. Proof that predates every submission.",
              },
              {
                title: 'Hitting "send"',
                desc: "Any file, any format, any creative work. 60 seconds to permanent proof.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="dl-anim p-8 md:p-10 transition-colors duration-300 hover:bg-[rgba(10,10,10,0.02)]"
                style={{
                  borderTop: "1px solid rgba(10,10,10,0.08)",
                  borderRight: i % 2 === 0 ? "1px solid rgba(10,10,10,0.08)" : "none",
                  borderBottom: i >= 2 ? "1px solid rgba(10,10,10,0.08)" : "none",
                  animation: `dl-fadeUp 0.5s ease-out ${0.15 + i * 0.08}s both`,
                }}
              >
                <h3
                  className="text-lg md:text-xl mb-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#0A0A0A",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "rgba(10,10,10,0.45)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 — EVIDENCE PACKET
          ═══════════════════════════════════════════════════════ */}
      <section
        id="what-you-receive"
        className="relative overflow-hidden"
        style={{ background: "var(--brand-dark)" }}
      >
        {/* Gradient accent top line */}
        <div
          className="absolute top-0 left-0 right-0 h-px dl-gradient-line"
          style={{ opacity: 0.3 }}
        />

        <div className="mx-auto max-w-6xl px-6 md:px-12 py-28 md:py-40 relative z-10">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left: Preview */}
            <div className="lg:sticky lg:top-24 flex justify-center">
              <div
                className="dl-anim mx-auto w-full max-w-md"
                style={{ animation: "dl-slideRight 0.7s ease-out 0.1s both" }}
              >
                <EvidencePacketPreview size="default" />
              </div>
            </div>

            {/* Right: Copy */}
            <div className="max-w-xl">
              <h2
                className="dl-anim text-3xl md:text-4xl tracking-tight mb-5"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#FFFFFF",
                  animation: "dl-fadeUp 0.6s ease-out 0.1s both",
                }}
              >
                What you receive
              </h2>

              <p
                className="dl-anim text-base leading-relaxed mb-10"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "var(--font-body)",
                  animation: "dl-fadeUp 0.6s ease-out 0.2s both",
                }}
              >
                Each record is a complete, independently verifiable proof package
                tied to a specific moment in time.
              </p>

              <ul className="space-y-7">
                {[
                  {
                    label: "Avalanche blockchain record",
                    desc: "Your fingerprint is sealed on the Avalanche C-Chain. Tamper-proof and publicly verifiable on Snowtrace.",
                    color: "var(--brand-plum)",
                  },
                  {
                    label: "Digital fingerprint",
                    desc: "A unique hash that proves integrity without exposing your content.",
                    color: "var(--brand-ink-blue)",
                  },
                  {
                    label: "Timestamped certificate",
                    desc: "A downloadable proof document with all record metadata and verification instructions.",
                    color: "var(--brand-ashen)",
                  },
                  {
                    label: "Verification link",
                    desc: "A shareable URL where anyone can confirm your record independently.",
                    color: "var(--brand-plum)",
                  },
                ].map((item, i) => (
                  <li
                    key={item.label}
                    className="dl-anim flex gap-4"
                    style={{
                      animation: `dl-fadeUp 0.5s ease-out ${0.3 + i * 0.1}s both`,
                    }}
                  >
                    <div
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: item.color }}
                    />
                    <div>
                      <div
                        className="text-sm font-medium mb-1"
                        style={{
                          color: "#FFFFFF",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        className="text-sm leading-relaxed"
                        style={{
                          color: "rgba(255,255,255,0.35)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 7 — TRUST
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-28 md:py-40"
        style={{ background: "var(--brand-light)" }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="mb-16 md:mb-20 max-w-xl">
            <h2
              className="dl-anim text-3xl md:text-4xl lg:text-5xl tracking-tight mb-5"
              style={{
                fontFamily: "var(--font-display)",
                color: "#0A0A0A",
                animation: "dl-fadeUp 0.6s ease-out 0.1s both",
              }}
            >
              Built on math, not trust.
            </h2>
            <p
              className="dl-anim text-base leading-relaxed"
              style={{
                color: "rgba(10,10,10,0.4)",
                fontFamily: "var(--font-body)",
                animation: "dl-fadeUp 0.6s ease-out 0.2s both",
              }}
            >
              Your proof doesn&apos;t depend on us. It depends on mathematics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {[
              {
                title: "Digital fingerprinting",
                desc: "SHA-256, the same security standard used by banks and governments worldwide.",
              },
              {
                title: "Registered on Avalanche",
                desc: "Your proof is written to the Avalanche C-Chain. Sub-second finality. Publicly verifiable on Snowtrace.",
              },
              {
                title: "Independent verification",
                desc: "Anyone can verify your proof, anytime, without an account or our involvement.",
              },
              {
                title: "Privacy-preserving",
                desc: "Only your file's cryptographic fingerprint goes on-chain. Your actual content stays private and secure.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="dl-anim p-8 md:p-10"
                style={{
                  borderTop: "1px solid rgba(10,10,10,0.08)",
                  borderRight: i % 2 === 0 ? "1px solid rgba(10,10,10,0.08)" : "none",
                  animation: `dl-fadeUp 0.5s ease-out ${0.2 + i * 0.1}s both`,
                }}
              >
                <h3
                  className="text-base font-medium mb-2"
                  style={{
                    color: "#0A0A0A",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "rgba(10,10,10,0.45)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 8 — FINAL CTA
          ═══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--brand-dark)" }}
      >
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-px dl-gradient-line"
          style={{ opacity: 0.25 }}
        />

        {/* Atmospheric glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "700px",
            height: "500px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(ellipse at center, rgba(196,132,122,0.04) 0%, rgba(201,169,110,0.03) 40%, rgba(123,142,106,0.04) 70%, transparent 90%)",
            filter: "blur(80px)",
          }}
        />

        <div className="max-w-4xl mx-auto px-6 md:px-12 py-32 md:py-44 text-center relative z-10">
          <h2
            className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] tracking-tight mb-8 leading-[1.05]"
            style={{
              fontFamily: "var(--font-display)",
              color: "#FFFFFF",
            }}
          >
            Your next draft
            <br />
            deserves a{" "}
            <span className="dl-gradient-text" style={{ fontStyle: "italic" }}>
              receipt.
            </span>
          </h2>
          <p
            className="text-base leading-relaxed mb-12 max-w-md mx-auto"
            style={{
              color: "rgba(255,255,255,0.35)",
              fontFamily: "var(--font-body)",
            }}
          >
            Create your first permanent proof in under 60 seconds. Free. No
            credit card.
          </p>
          <Link
            href="/protect"
            className="dl-gradient-btn inline-flex items-center gap-2.5 px-8 py-4 rounded text-sm font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-[var(--brand-ink-blue)] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-body)",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Lock Your First Draft
          </Link>
        </div>
      </section>
    </main>
  );
}
