import { getExplorerTxUrl } from "@/lib/blockchain/client";
import type {
  ScriptSummary,
  ScriptDetail,
  VersionDetail,
  ShareStatus,
  ShareLinkStatus,
  AuditLogEntry,
  VerifyFoundResponse,
  ChainStatus,
} from "./types";

export function mapVersionDetail(v: any): VersionDetail {
  return {
    versionId: v.id,
    versionNumber: v.version_number,
    sha256: v.sha256 ?? null,
    committedAt: v.committed_at ?? null,
    status: v.status,
    filename: v.original_filename,
    byteSize: v.byte_size != null ? Number(v.byte_size) : null,
    pageCount: v.page_count ?? null,
    chainStatus: (v.chain_status as ChainStatus) ?? null,
    txHash: v.tx_hash ?? null,
    blockNumber: v.block_number != null ? Number(v.block_number) : null,
    explorerUrl: v.tx_hash ? getExplorerTxUrl(v.tx_hash) : null,
    detectedAsRevisionOf: v.detected_as_revision_of ?? null,
  };
}

function resolveShareLinkStatus(link: {
  revoked_at: string | null;
  expires_at: string | null;
}): ShareLinkStatus {
  if (link.revoked_at) return "revoked";
  if (link.expires_at && new Date(link.expires_at) < new Date()) return "expired";
  return "active";
}

export function mapShareStatus(link: any): ShareStatus {
  return {
    token: link.token,
    status: resolveShareLinkStatus(link),
    viewerLabel: link.viewer_label ?? null,
    allowDownload: link.allow_download ?? true,
    createdAt: link.created_at,
    expiresAt: link.expires_at ?? null,
    firstViewedAt: link.first_viewed_at ?? null,
    viewCount: link.view_count ?? 0,
  };
}

export function mapScriptSummary(script: any, latestVersion: any): ScriptSummary {
  return {
    scriptId: script.id,
    title: script.title,
    workType: script.work_type,
    createdAt: script.created_at,
    updatedAt: script.updated_at,
    latestVersion: latestVersion
      ? {
          versionId: latestVersion.id,
          versionNumber: latestVersion.version_number,
          sha256: latestVersion.sha256,
          committedAt: latestVersion.committed_at,
          chainStatus: (latestVersion.chain_status as ChainStatus) ?? null,
          byteSize: latestVersion.byte_size != null ? Number(latestVersion.byte_size) : 0,
          pageCount: latestVersion.page_count ?? null,
        }
      : null,
  };
}

export function mapScriptDetail(
  script: any,
  versions: any[],
  shareLinks: any[]
): ScriptDetail {
  return {
    scriptId: script.id,
    title: script.title,
    workType: script.work_type,
    notes: script.notes ?? null,
    authorsCount: script.authors_count ?? 1,
    publicationStatus: script.publication_status ?? null,
    workMadeForHire: script.work_made_for_hire ?? null,
    preexistingMaterial: script.preexisting_material ?? null,
    createdAt: script.created_at,
    updatedAt: script.updated_at,
    versions: versions.map(mapVersionDetail),
    shareLinks: shareLinks.map(mapShareStatus),
  };
}

export function mapAuditLogEntry(entry: any): AuditLogEntry {
  return {
    action: entry.action,
    createdAt: entry.created_at,
    metadata: entry.metadata ?? {},
  };
}

export function mapVerifyResponse(version: any, script: any): VerifyFoundResponse {
  return {
    found: true,
    sha256: version.sha256,
    committedAt: version.committed_at,
    title: script?.title ?? null,
    workType: script?.work_type ?? null,
    filename: version.original_filename,
    byteSize: version.byte_size != null ? Number(version.byte_size) : null,
    pageCount: version.page_count ?? null,
    txHash: version.tx_hash ?? null,
    blockNumber: version.block_number != null ? Number(version.block_number) : null,
    chainStatus: version.chain_status ?? null,
    chainRegisteredAt: version.chain_registered_at ?? null,
    explorerUrl: version.tx_hash ? getExplorerTxUrl(version.tx_hash) : null,
  };
}
