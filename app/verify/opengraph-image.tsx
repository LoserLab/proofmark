import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Verify a Record: ProofMark";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#080b0f",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient mesh background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(90,120,99,0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 30%, rgba(144,171,139,0.1), transparent)",
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "80px",
            height: "100%",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Verification icon */}
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "rgba(90,120,99,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "40px",
              border: "2px solid rgba(90,120,99,0.4)",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5A7863"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          {/* Technical label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                letterSpacing: "0.2em",
                color: "rgba(144,171,139,0.7)",
                fontFamily: "monospace",
              }}
            >
              PUBLIC VERIFICATION
            </span>
          </div>

          {/* Main headline */}
          <div
            style={{
              fontSize: "56px",
              fontWeight: 400,
              color: "#F6F6F3",
              lineHeight: 1.1,
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            Verify a ProofMark Record
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "20px",
              color: "rgba(246,246,243,0.6)",
              textAlign: "center",
              maxWidth: "600px",
              lineHeight: 1.5,
            }}
          >
            Check the authenticity of any file against ProofMark&apos;s timestamped
            records. No account required.
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(90deg, transparent, rgba(90,120,99,0.6) 20%, rgba(144,171,139,0.4) 50%, rgba(90,120,99,0.6) 80%, transparent)",
          }}
        />

        {/* Corner accent */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "80px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 400,
              color: "rgba(246,246,243,0.4)",
              letterSpacing: "-0.02em",
            }}
          >
            ProofMark
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
