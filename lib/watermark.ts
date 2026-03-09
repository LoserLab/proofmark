export type WatermarkInput = {
  viewerLabel?: string | null;   // "Agent", "Producer", "Contest", or a name
  sharedAtUtcISO: string;        // ISO timestamp
  token: string;                 // share token for traceability
};

export function buildWatermarkText(input: WatermarkInput) {
  const viewer = (input.viewerLabel ?? "Private share").trim();
  const date = new Date(input.sharedAtUtcISO).toISOString().slice(0, 10); // YYYY-MM-DD
  const tokenShort = input.token.slice(0, 10);

  return `PROOFMARK VIEW COPY • Shared with: ${viewer} • ${date} • Link: ${tokenShort}`;
}

export const WATERMARK_PLACEMENT = {
  // Footer placement
  footer: {
    xMargin: 36,            // 0.5 inch at 72 dpi
    yFromBottom: 18,        // quarter inch
    fontSize: 9,
    opacity: 0.65
  },

  // Optional diagonal placement (off by default)
  diagonal: {
    enabled: false,
    fontSize: 42,
    opacity: 0.08,
    rotationDegrees: 35
  }
};
