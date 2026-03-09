import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ProofMark: Proof of Origin for Creative Work";
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
              "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(90,120,99,0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 30%, rgba(144,171,139,0.1), transparent), radial-gradient(ellipse 50% 60% at 60% 80%, rgba(90,120,99,0.08), transparent)",
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "80px",
            height: "100%",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Technical label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "1px",
                background: "rgba(144,171,139,0.5)",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                letterSpacing: "0.2em",
                color: "rgba(144,171,139,0.7)",
                fontFamily: "monospace",
              }}
            >
              PROOF OF EXISTENCE
            </span>
          </div>

          {/* Logo / Brand */}
          <div
            style={{
              fontSize: "32px",
              fontWeight: 400,
              color: "#F6F6F3",
              marginBottom: "40px",
              letterSpacing: "-0.02em",
            }}
          >
            ProofMark
          </div>

          {/* Main headline */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: 400,
              color: "#F6F6F3",
              lineHeight: 1.1,
              maxWidth: "900px",
              marginBottom: "24px",
            }}
          >
            Proof of creation,
          </div>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 400,
              fontStyle: "italic",
              color: "#5A7863",
              lineHeight: 1.1,
            }}
          >
            sealed forever.
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "20px",
              color: "rgba(246,246,243,0.6)",
              marginTop: "40px",
              maxWidth: "600px",
              lineHeight: 1.5,
            }}
          >
            Timestamped, permanent proof that you created it first. Protect
            screenplays, manuscripts, and creative work.
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
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#5A7863",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              color: "rgba(144,171,139,0.5)",
              fontFamily: "monospace",
            }}
          >
            proofmark.xyz
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
