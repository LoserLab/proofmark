"use client";

import { useEffect, useRef, useState } from "react";

/* ─── Hex characters used in the typing animation ─── */
const HEX = "0123456789abcdef";

function randomHex(len: number) {
  return Array.from({ length: len }, () => HEX[Math.floor(Math.random() * 16)]).join("");
}

export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hashText, setHashText] = useState("a7f3b2c1e9d045fa82bb6c1907ea3d21");
  const [showSeal, setShowSeal] = useState(false);
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Typewriter hash cycling */
  useEffect(() => {
    if (prefersReducedMotion) return;
    let frame = 0;
    const target = "a7f3b2c1e9d045fa82bb6c1907ea3d21";
    let revealed = 0;
    const interval = setInterval(() => {
      frame++;
      if (revealed < target.length && frame % 2 === 0) revealed++;
      const stable = target.slice(0, revealed);
      const noise = randomHex(target.length - revealed);
      setHashText(stable + noise);
      if (revealed >= target.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  /* Staggered reveal timers */
  useEffect(() => {
    if (prefersReducedMotion) {
      setShowTimestamp(true);
      setShowSeal(true);
      setShowCheck(true);
      return;
    }
    const t1 = setTimeout(() => setShowTimestamp(true), 1600);
    const t2 = setTimeout(() => setShowSeal(true), 2200);
    const t3 = setTimeout(() => setShowCheck(true), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [prefersReducedMotion]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto lg:max-w-lg">
      {/* ── Keyframe definitions ── */}
      <style>{`
        @keyframes dl-fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dl-stampIn {
          0%   { opacity: 0; transform: scale(1.4) rotate(-6deg); }
          60%  { opacity: 1; transform: scale(0.95) rotate(1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes dl-checkDraw {
          from { stroke-dashoffset: 24; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes dl-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes dl-pulse {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 0.7; }
        }
        @keyframes dl-hashGlow {
          0%, 100% { text-shadow: 0 0 0px transparent; }
          50%      { text-shadow: 0 0 6px rgba(90,120,99,0.25); }
        }
        @media (prefers-reduced-motion: reduce) {
          .dl-anim { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* ── Outer document card ── */}
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          background: "#FEFDF8",
          border: "1px solid rgba(90,120,99,0.2)",
          boxShadow: "0 8px 40px rgba(14,17,22,0.08), 0 1px 3px rgba(14,17,22,0.06)",
        }}
      >
        {/* Paper grain texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
            zIndex: 1,
          }}
        />

        {/* Top accent bar */}
        <div
          className="h-1"
          style={{
            background: "linear-gradient(90deg, #5A7863 0%, #90AB8B 50%, #5A7863 100%)",
          }}
        />

        {/* Document content */}
        <div className="relative px-7 pt-6 pb-7 md:px-9 md:pt-8 md:pb-9" style={{ zIndex: 2 }}>
          {/* Header row */}
          <div
            className="dl-anim flex items-center justify-between mb-5"
            style={{
              animation: prefersReducedMotion ? "none" : "dl-fadeUp 0.5s ease-out 0.2s both",
            }}
          >
            <div>
              <div
                className="text-xs uppercase tracking-[0.2em] font-semibold"
                style={{ color: "#5A7863", fontFamily: "var(--font-body)" }}
              >
                Proof of Existence
              </div>
              <div
                className="text-[10px] mt-0.5 tracking-wide"
                style={{ color: "rgba(14,17,22,0.4)", fontFamily: "var(--font-body)" }}
              >
                Certificate of Record
              </div>
            </div>
            {/* ProofMark mark */}
            <div
              className="flex items-center gap-1.5"
              style={{ color: "rgba(90,120,99,0.5)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-[10px] font-medium tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
                PROOFMARK
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px mb-5" style={{ background: "rgba(90,120,99,0.15)" }} />

          {/* Title field */}
          <div
            className="dl-anim mb-5"
            style={{
              animation: prefersReducedMotion ? "none" : "dl-fadeUp 0.5s ease-out 0.5s both",
            }}
          >
            <div
              className="text-[10px] uppercase tracking-[0.15em] mb-1.5"
              style={{ color: "rgba(14,17,22,0.4)", fontFamily: "var(--font-body)" }}
            >
              Title
            </div>
            <div
              className="text-base md:text-lg font-normal"
              style={{
                color: "#0E1116",
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                letterSpacing: "0.01em",
              }}
            >
              My_Screenplay_Final_v3.pdf
            </div>
          </div>

          {/* SHA-256 hash field */}
          <div
            className="dl-anim mb-5"
            style={{
              animation: prefersReducedMotion ? "none" : "dl-fadeUp 0.5s ease-out 0.8s both",
            }}
          >
            <div
              className="text-[10px] uppercase tracking-[0.15em] mb-1.5"
              style={{ color: "rgba(14,17,22,0.4)", fontFamily: "var(--font-body)" }}
            >
              SHA-256 Fingerprint
            </div>
            <div
              className="dl-anim font-mono text-[11px] md:text-xs tracking-wider break-all leading-relaxed"
              style={{
                color: "#5A7863",
                animation: prefersReducedMotion ? "none" : "dl-hashGlow 3s ease-in-out infinite",
              }}
            >
              {hashText}...
            </div>
          </div>

          {/* Timestamp field */}
          <div
            className="dl-anim mb-5"
            style={{
              animation: prefersReducedMotion ? "none" : "dl-fadeUp 0.5s ease-out 1.1s both",
            }}
          >
            <div
              className="text-[10px] uppercase tracking-[0.15em] mb-1.5"
              style={{ color: "rgba(14,17,22,0.4)", fontFamily: "var(--font-body)" }}
            >
              Timestamp
            </div>
            <div
              className="text-sm"
              style={{
                color: "#0E1116",
                fontFamily: "var(--font-body)",
                opacity: showTimestamp ? 1 : 0,
                transform: showTimestamp ? "none" : "translateY(4px)",
                transition: prefersReducedMotion ? "none" : "all 0.4s ease-out",
              }}
            >
              2026-02-05T14:32:07Z
            </div>
          </div>

          {/* Block number */}
          <div
            className="dl-anim mb-6"
            style={{
              animation: prefersReducedMotion ? "none" : "dl-fadeUp 0.5s ease-out 1.4s both",
            }}
          >
            <div
              className="text-[10px] uppercase tracking-[0.15em] mb-1.5"
              style={{ color: "rgba(14,17,22,0.4)", fontFamily: "var(--font-body)" }}
            >
              Block
            </div>
            <div
              className="font-mono text-sm"
              style={{
                color: "#0E1116",
                opacity: showTimestamp ? 1 : 0,
                transform: showTimestamp ? "none" : "translateY(4px)",
                transition: prefersReducedMotion ? "none" : "all 0.4s ease-out 0.15s",
              }}
            >
              #48,291,337
            </div>
          </div>

          {/* Bottom divider */}
          <div className="h-px mb-5" style={{ background: "rgba(90,120,99,0.15)" }} />

          {/* Status row with seal */}
          <div className="flex items-center justify-between">
            {/* Verified badge */}
            <div
              className="flex items-center gap-2"
              style={{
                opacity: showCheck ? 1 : 0,
                transform: showCheck ? "none" : "translateY(6px)",
                transition: prefersReducedMotion ? "none" : "all 0.5s ease-out",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#1F9D55" }}
              >
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeDasharray="24"
                  className="dl-anim"
                  style={{
                    strokeDashoffset: showCheck ? 0 : 24,
                    transition: prefersReducedMotion ? "none" : "stroke-dashoffset 0.6s ease-out",
                  }}
                />
              </svg>
              <span
                className="text-xs font-medium tracking-wide"
                style={{ color: "#1F9D55", fontFamily: "var(--font-body)" }}
              >
                Permanently Sealed
              </span>
            </div>

            {/* Seal */}
            <div
              className="dl-anim"
              style={{
                animation: showSeal
                  ? prefersReducedMotion
                    ? "none"
                    : "dl-stampIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                  : "none",
                opacity: showSeal ? undefined : 0,
              }}
            >
              <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                {/* Outer ring */}
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#5A7863"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.5"
                />
                {/* Inner ring */}
                <circle
                  cx="32"
                  cy="32"
                  r="22"
                  stroke="#5A7863"
                  strokeWidth="1"
                  opacity="0.3"
                />
                {/* Center lock */}
                <g transform="translate(24, 22)" stroke="#5A7863" strokeWidth="1.2" fill="none" opacity="0.6">
                  <rect x="1" y="8" width="14" height="10" rx="1.5" />
                  <path d="M4 8V5.5a4 4 0 0 1 8 0V8" />
                </g>
                {/* Top text arc */}
                <text
                  fontSize="5"
                  fill="#5A7863"
                  opacity="0.5"
                  fontFamily="var(--font-body)"
                  letterSpacing="0.08em"
                >
                  <textPath href="#sealArc" startOffset="50%" textAnchor="middle">
                    VERIFIED RECORD
                  </textPath>
                </text>
                <defs>
                  <path
                    id="sealArc"
                    d="M 10,32 a 22,22 0 1,1 44,0"
                  />
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Subtle shimmer stripe */}
        {!prefersReducedMotion && (
          <div
            className="dl-anim absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              animation: "dl-shimmer 6s ease-in-out infinite",
              zIndex: 3,
            }}
          />
        )}
      </div>

    </div>
  );
}
