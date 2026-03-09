import crypto from "crypto";

export async function sha256Hex(buf: Buffer): Promise<string> {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

export function randomToken(bytes = 24): string {
  return crypto.randomBytes(bytes).toString("hex");
}

// Legacy aliases for backward compatibility
export function computeSHA256(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export function generateToken(): string {
  return randomToken(32);
}

export function buildReceiptText(input: {
  scriptTitle: string;
  scriptId: string;
  versionId: string;
  sha256: string;
  byteSize: number;
  originalFilename: string;
  committedAtISO: string;
}) {
  return [
    "PROOFMARK AUTHORSHIP RECEIPT",
    "",
    `Title: ${input.scriptTitle}`,
    `Script ID: ${input.scriptId}`,
    `Version ID: ${input.versionId}`,
    `Original filename: ${input.originalFilename}`,
    `Bytes: ${input.byteSize}`,
    `SHA-256: ${input.sha256}`,
    `Committed at (UTC): ${input.committedAtISO}`,
    "",
    "This receipt records the file fingerprint and commit timestamp for this version.",
    "It does not constitute legal advice or a government registration.",
  ].join("\n");
}

import JSZip from "jszip";

export async function buildPacketZip(files: Array<{ name: string; content: string | Buffer }>) {
  const zip = new JSZip();
  for (const f of files) zip.file(f.name, f.content);
  return await zip.generateAsync({ type: "nodebuffer" });
}
