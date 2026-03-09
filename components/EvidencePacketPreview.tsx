export default function EvidencePacketPreview({ size = "default" }: { size?: "default" | "small" }) {
  const isSmall = size === "small";
  const width = isSmall ? "280px" : "360px";
  const padding = isSmall ? "28px" : "36px";

  // Generate consistent demo data
  const demoId = "DL-A1B2C3D4";
  const demoHash = "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456";
  const demoToken = "x7k9m2p4q6";

  return (
    <div className="relative">
      {/* Paper document - looks like a printed page */}
      <div
        className="rounded-sm shadow-sm"
        style={{
          width,
          padding,
          backgroundColor: "#FEFDF9",
          border: "1px solid rgba(18, 18, 18, 0.10)",
        }}
      >
        {/* Top rule - warm accent */}
        <div className="mb-4 h-px bg-[var(--warm)]"></div>
        
        {/* Document header - minimal, archival */}
        <div className="mb-5 pb-3 border-b border-[var(--stroke)]">
          <div className="text-[11px] uppercase tracking-wider text-[var(--warm)] font-medium">
            ProofMark Evidence Record
          </div>
          <div className="text-[9px] text-[var(--muted)] mt-1.5">
            Generated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>

        {/* Sections - clean, document-like */}
        <div className="space-y-4">
          {/* Authorship record */}
          <div>
            <div className="text-[11px] font-medium text-[var(--text)] mb-1.5 tracking-tight">
              Authorship record
            </div>
            <div className="text-[10px] text-[var(--muted)] space-y-0.5 leading-relaxed">
              <div className="text-[var(--warm)]">Timestamp: {new Date().toISOString().split("T")[0]}</div>
              <div className="font-mono text-[9px] tracking-tight">{demoId}</div>
            </div>
          </div>

          {/* Fingerprint */}
          <div>
            <div className="text-[11px] font-medium text-[var(--text)] mb-1.5 tracking-tight">
              Fingerprint
            </div>
            <div className="text-[10px] text-[var(--muted)]">
              <div className="font-mono text-[9px] break-all leading-tight">
                SHA-256: {demoHash.substring(0, 48)}...
              </div>
            </div>
          </div>

          {/* Version trail */}
          <div>
            <div className="text-[11px] font-medium text-[var(--text)] mb-1.5 tracking-tight">
              Version trail
            </div>
            <div className="text-[10px] text-[var(--muted)] space-y-0.5 leading-relaxed">
              <div>• Version 1.0: Initial draft</div>
              <div className="opacity-70">• Version 1.1: Revised</div>
            </div>
          </div>

          {/* Sharing log */}
          <div>
            <div className="text-[11px] font-medium text-[var(--text)] mb-1.5 tracking-tight">
              Sharing log
            </div>
            <div className="text-[10px] text-[var(--muted)] space-y-0.5 leading-relaxed">
              <div className="font-mono text-[9px]">Token: {demoToken}</div>
              <div>Views: 0</div>
            </div>
          </div>
        </div>

        {/* Footer line - minimal */}
        <div className="mt-5 pt-3 border-t border-[var(--stroke)] text-[9px] text-[var(--muted)] text-center leading-relaxed">
          ProofMark is not a law firm and does not provide legal advice.
        </div>
      </div>

      {/* Caption - only show on default size */}
      {!isSmall && (
        <div className="mt-4 text-xs text-[var(--muted)] text-center max-w-[360px] leading-relaxed">
          Representative example. Your packet contains your exact metadata.
        </div>
      )}
    </div>
  );
}
