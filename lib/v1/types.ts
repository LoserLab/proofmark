// ── Enums ──

export type WorkType =
  | "screenplay"
  | "manuscript"
  | "treatment"
  | "pitch_deck"
  | "research"
  | "other";

export type ChainStatus = "pending" | "confirmed" | "failed" | null;

export type ShareLinkStatus = "active" | "revoked" | "expired";

export type AllowedMimeType =
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "text/plain";

export type ErrorCode =
  | "invalid_request"
  | "unauthorized"
  | "not_found"
  | "file_too_large"
  | "unsupported_file_type"
  | "version_not_committed"
  | "internal_error";

// ── Request Bodies ──

export interface ProtectRequest {
  title: string;
  workType: WorkType;
  fileBase64: string;
  filename: string;
  mimeType: AllowedMimeType;
  notes?: string;
  authorsCount?: number;
  publicationStatus?: string;
  workMadeForHire?: string;
  preexistingMaterial?: string;
  blockchain?: boolean;
}

export interface ProtectVersionRequest {
  fileBase64: string;
  filename: string;
  mimeType: AllowedMimeType;
  notes?: string;
  blockchain?: boolean;
}

export interface ShareRequest {
  versionId: string;
  viewerLabel?: string;
  expiresInDays?: number;
  allowDownload?: boolean;
}

// ── Response Bodies ──

export interface ProtectResponse {
  scriptId: string;
  versionId: string;
  sha256: string;
  committedAt: string;
  receiptText: string;
  chainStatus: ChainStatus;
  badgeUrl: string;
  verifyUrl: string;
}

export interface ScriptSummary {
  scriptId: string;
  title: string;
  workType: string;
  createdAt: string;
  updatedAt: string;
  latestVersion: {
    versionId: string;
    versionNumber: number;
    sha256: string;
    committedAt: string;
    chainStatus: ChainStatus;
    byteSize: number;
    pageCount: number | null;
  } | null;
}

export interface ScriptList {
  scripts: ScriptSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface VersionDetail {
  versionId: string;
  versionNumber: number;
  sha256: string | null;
  committedAt: string | null;
  status: string;
  filename: string;
  byteSize: number | null;
  pageCount: number | null;
  chainStatus: ChainStatus;
  txHash: string | null;
  blockNumber: number | null;
  explorerUrl: string | null;
  detectedAsRevisionOf: string | null;
}

export interface ScriptDetail {
  scriptId: string;
  title: string;
  workType: string;
  notes: string | null;
  authorsCount: number;
  publicationStatus: string | null;
  workMadeForHire: string | null;
  preexistingMaterial: string | null;
  createdAt: string;
  updatedAt: string;
  versions: VersionDetail[];
  shareLinks: ShareStatus[];
}

export interface ShareResponse {
  token: string;
  shareUrl: string;
}

export interface ShareStatus {
  token: string;
  status: ShareLinkStatus;
  viewerLabel: string | null;
  allowDownload: boolean;
  createdAt: string;
  expiresAt: string | null;
  firstViewedAt: string | null;
  viewCount: number;
}

export interface VerifyFoundResponse {
  found: true;
  sha256: string;
  committedAt: string;
  title: string | null;
  workType: string | null;
  filename: string;
  byteSize: number | null;
  pageCount: number | null;
  txHash: string | null;
  blockNumber: number | null;
  chainStatus: string | null;
  chainRegisteredAt: string | null;
  explorerUrl: string | null;
}

export interface VerifyNotFoundResponse {
  found: false;
  sha256: string;
}

export interface AuditLogEntry {
  action: string;
  createdAt: string;
  metadata: Record<string, unknown>;
}

export interface AuditLog {
  entries: AuditLogEntry[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApiError {
  error: string;
  code: ErrorCode;
}
