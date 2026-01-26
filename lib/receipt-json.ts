/**
 * JSON receipt generation
 */

export function buildReceiptJSON(data: {
  title: string;
  scriptId: string;
  versionId: string;
  filename: string;
  byteSize: number | null;
  pageCount: number | null;
  sha256: string;
  timestampUtc: string;
  workType?: string | null;
  mimeType?: string | null;
}): object {
  return {
    generated_by: "DraftLock",
    generated_at_utc: new Date().toISOString(),
    receipt_type: "authorship_record",
    work: {
      title: data.title,
      work_type: data.workType || null,
    },
    identifiers: {
      script_id: data.scriptId,
      version_id: data.versionId,
    },
    file: {
      original_filename: data.filename,
      byte_size: data.byteSize,
      page_count: data.pageCount,
      mime_type: data.mimeType || null,
    },
    fingerprint: {
      algorithm: "SHA-256",
      hash: data.sha256,
    },
    timestamp: {
      committed_at_utc: data.timestampUtc,
    },
    disclaimer: "DraftLock is not a law firm and does not provide legal advice.",
  };
}
