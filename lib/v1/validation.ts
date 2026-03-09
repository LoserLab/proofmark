export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const;

export const VALID_WORK_TYPES = [
  "screenplay",
  "manuscript",
  "treatment",
  "pitch_deck",
  "research",
  "other",
] as const;

export function isValidMimeType(mime: string): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mime);
}

export function isValidWorkType(wt: string): boolean {
  return (VALID_WORK_TYPES as readonly string[]).includes(wt);
}

export function isValidSha256(hash: string): boolean {
  return /^[a-f0-9]{64}$/i.test(hash);
}

export function isValidUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

/** Sanitize filename to prevent path traversal and invalid characters */
export function sanitizeFilename(filename: string): string {
  let sanitized = filename.replace(/[/\\:\x00]/g, "_");
  sanitized = sanitized.replace(/^\.+/, "");
  if (sanitized.length > 255) {
    const ext = sanitized.split(".").pop() || "";
    const base = sanitized.slice(0, 250 - ext.length);
    sanitized = ext ? `${base}.${ext}` : base;
  }
  return sanitized || "file";
}

/** Decode base64 file content and validate size */
export function validateBase64File(
  base64: string
): { valid: true; buffer: Buffer } | { valid: false; error: string } {
  try {
    const buffer = Buffer.from(base64, "base64");
    if (buffer.byteLength === 0) {
      return { valid: false, error: "File content is empty" };
    }
    if (buffer.byteLength > MAX_FILE_SIZE) {
      return { valid: false, error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` };
    }
    return { valid: true, buffer };
  } catch {
    return { valid: false, error: "Invalid base64 encoding" };
  }
}
