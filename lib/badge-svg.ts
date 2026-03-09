const BADGE_HEIGHT = 28;
const FONT = "Verdana,Geneva,DejaVu Sans,sans-serif";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function makeBadge({
  label,
  message,
  labelColor,
  messageColor,
  labelTextColor = "#fff",
  messageTextColor = "#fff",
}: {
  label: string;
  message: string;
  labelColor: string;
  messageColor: string;
  labelTextColor?: string;
  messageTextColor?: string;
}): string {
  const charWidth = 6.8;
  const padding = 12;
  const labelWidth = Math.round(label.length * charWidth + padding * 2);
  const messageWidth = Math.round(message.length * charWidth + padding * 2);
  const totalWidth = labelWidth + messageWidth;

  const labelX = labelWidth / 2;
  const messageX = labelWidth + messageWidth / 2;
  const textY = BADGE_HEIGHT / 2 + 4;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${BADGE_HEIGHT}" role="img" aria-label="${escapeXml(label)}: ${escapeXml(message)}">
  <title>${escapeXml(label)}: ${escapeXml(message)}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="${BADGE_HEIGHT}" rx="4" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="${BADGE_HEIGHT}" fill="${labelColor}"/>
    <rect x="${labelWidth}" width="${messageWidth}" height="${BADGE_HEIGHT}" fill="${messageColor}"/>
    <rect width="${totalWidth}" height="${BADGE_HEIGHT}" fill="url(#s)"/>
  </g>
  <g fill="${labelTextColor}" text-anchor="middle" font-family="${FONT}" text-rendering="geometricPrecision" font-size="11">
    <text x="${labelX}" y="${textY}" fill="#010101" fill-opacity=".3">${escapeXml(label)}</text>
    <text x="${labelX}" y="${textY - 1}">${escapeXml(label)}</text>
  </g>
  <g fill="${messageTextColor}" text-anchor="middle" font-family="${FONT}" text-rendering="geometricPrecision" font-size="11">
    <text x="${messageX}" y="${textY}" fill="#010101" fill-opacity=".3">${escapeXml(message)}</text>
    <text x="${messageX}" y="${textY - 1}">${escapeXml(message)}</text>
  </g>
</svg>`;
}
