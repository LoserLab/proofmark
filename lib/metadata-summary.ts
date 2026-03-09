/**
 * Metadata summary text generation
 */

export function buildMetadataSummary(data: {
  script: any;
  version: any;
}): string {
  const explorerBase = process.env.AVALANCHE_CHAIN_ID === '43114'
    ? 'https://snowtrace.io'
    : 'https://testnet.snowtrace.io';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://proofmark.xyz";

  const lines = [
    "═══════════════════════════════════════════════════════════════════════════════",
    "                        PROOFMARK EVIDENCE RECORD",
    "═══════════════════════════════════════════════════════════════════════════════",
    "",
    "This document contains timestamps, fingerprints, and metadata for a protected",
    "version registered with ProofMark.",
    "",
  ];

  // If blockchain verified, show prominently at top
  if (data.version.tx_hash && data.version.chain_status === 'confirmed') {
    lines.push(
      "┌─────────────────────────────────────────────────────────────────────────────┐",
      "│  ✓ INDEPENDENTLY VERIFIED ON BLOCKCHAIN                                    │",
      "└─────────────────────────────────────────────────────────────────────────────┘",
      "",
      `  Verify this record independently at:`,
      `  ${explorerBase}/tx/${data.version.tx_hash}`,
      "",
    );
  }

  lines.push(
    "───────────────────────────────────────────────────────────────────────────────",
    "WORK DETAILS",
    "───────────────────────────────────────────────────────────────────────────────",
    "",
    `  Title:          ${data.script.title || "Untitled"}`,
    `  Work Type:      ${data.script.work_type || "N/A"}`,
    `  Script ID:      ${data.script.id}`,
    `  Created:        ${data.script.created_at ? new Date(data.script.created_at).toISOString() : "N/A"}`,
    "",
    "───────────────────────────────────────────────────────────────────────────────",
    "VERSION DETAILS",
    "───────────────────────────────────────────────────────────────────────────────",
    "",
    `  Version ID:     ${data.version.id}`,
    `  Filename:       ${data.version.original_filename || "N/A"}`,
    `  File Size:      ${data.version.byte_size ? `${data.version.byte_size} bytes` : "N/A"}`,
    `  MIME Type:      ${data.version.mime_type || "N/A"}`,
  );

  if (data.version.page_count !== null && data.version.page_count !== undefined) {
    lines.push(`  Page Count:     ${data.version.page_count} ${data.version.page_count === 1 ? "page" : "pages"}`);
  }

  lines.push(
    "",
    "───────────────────────────────────────────────────────────────────────────────",
    "CRYPTOGRAPHIC FINGERPRINT",
    "───────────────────────────────────────────────────────────────────────────────",
    "",
    `  Algorithm:      SHA-256`,
    `  Hash:           ${data.version.sha256 || "N/A"}`,
    `  Committed At:   ${data.version.committed_at ? new Date(data.version.committed_at).toISOString() : "N/A"}`,
    "",
    "  This fingerprint uniquely identifies the exact contents of your file.",
    "  Any modification, no matter how small, would produce a different hash.",
  );

  if (data.version.snapshot_path) {
    lines.push(
      "",
      "  Snapshot:       Included (snapshot.pdf)",
      "                  A static PDF snapshot of the uploaded file at protection time.",
    );
  }

  // Blockchain verification section
  if (data.version.tx_hash) {
    lines.push(
      "",
      "───────────────────────────────────────────────────────────────────────────────",
      "BLOCKCHAIN VERIFICATION",
      "───────────────────────────────────────────────────────────────────────────────",
      "",
      `  Network:        Avalanche C-Chain`,
      `  Status:         ${data.version.chain_status === 'confirmed' ? '✓ Confirmed' : data.version.chain_status || 'N/A'}`,
      `  Transaction:    ${data.version.tx_hash}`,
      `  Block Number:   ${data.version.block_number ?? "Pending"}`,
      `  Registered:     ${data.version.chain_registered_at ? new Date(data.version.chain_registered_at).toISOString() : "N/A"}`,
      "",
      "  VERIFY INDEPENDENTLY:",
      "",
      `  Block Explorer: ${explorerBase}/tx/${data.version.tx_hash}`,
      `  ProofMark:      ${appUrl}/verify?hash=${data.version.sha256}`,
      "",
      "  The fingerprint above has been permanently recorded on the Avalanche",
      "  blockchain. This provides a tamper-proof, publicly verifiable timestamp",
      "  that exists independently of ProofMark's systems. Anyone can verify this",
      "  record using the block explorer link above.",
    );
  }

  lines.push(
    "",
    "───────────────────────────────────────────────────────────────────────────────",
    "NOTES",
    "───────────────────────────────────────────────────────────────────────────────",
    "",
    `  ${data.script.notes || "No notes provided."}`,
    "",
    "═══════════════════════════════════════════════════════════════════════════════",
    "",
    "ProofMark provides proof of existence and authorship timestamps.",
    "ProofMark is not a law firm and does not provide legal advice.",
    "",
    `Generated: ${new Date().toISOString()}`,
  );

  return lines.join("\n");
}
