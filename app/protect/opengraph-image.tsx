import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Create a Record: ProofMark";
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
              GET STARTED
            </span>
          </div>

          {/* Logo / Brand */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: 400,
              color: "rgba(246,246,243,0.6)",
              marginBottom: "40px",
              letterSpacing: "-0.02em",
            }}
          >
            ProofMark
          </div>

          {/* Main headline */}
          <div
            style={{
              fontSize: "64px",
              fontWeight: 400,
              color: "#F6F6F3",
              lineHeight: 1.1,
              maxWidth: "700px",
              marginBottom: "24px",
            }}
          >
            Create a record
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "22px",
              color: "rgba(246,246,243,0.6)",
              maxWidth: "600px",
              lineHeight: 1.5,
            }}
          >
            Upload your file, confirm details, and generate a timestamped
            evidence pack with fingerprints and version lineage.
          </div>

          {/* Feature badges */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "40px",
            }}
          >
            {["SHA-256 Fingerprint", "Instant Timestamp", "Evidence Pack"].map(
              (feature) => (
                <div
                  key={feature}
                  style={{
                    padding: "10px 20px",
                    background: "rgba(90,120,99,0.15)",
                    border: "1px solid rgba(90,120,99,0.3)",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "rgba(246,246,243,0.8)",
                  }}
                >
                  {feature}
                </div>
              )
            )}
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
            proofmark.xyz/protect
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
