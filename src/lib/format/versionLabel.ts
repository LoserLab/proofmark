/**
 * Version label formatting utility
 * Formats version numbers and dates into consistent labels
 * Format: "Version {n} · {MMM d, yyyy}" or "Version {n} · {MMM d, yyyy} · {h:mm AM/PM}" if includeTime is true
 */

export function formatVersionLabel(input: {
  versionNumber?: number | null;
  createdAt?: string | Date | null;
  includeTime?: boolean;
}) {
  const n = input.versionNumber;
  const dt = input.createdAt ? new Date(input.createdAt) : null;

  const labelParts: string[] = [];

  if (typeof n === "number" && Number.isFinite(n)) {
    labelParts.push(`Version ${n}`);
  } else {
    labelParts.push("Version");
  }

  if (dt && !Number.isNaN(dt.getTime())) {
    const dateStr = dt.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    labelParts.push(dateStr);

    if (input.includeTime) {
      const timeStr = dt.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });
      labelParts.push(timeStr);
    }
  }

  return labelParts.join(" · ");
}
