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
  txHash?: string | null;
  blockNumber?: number | null;
  chainStatus?: string | null;
  chainRegisteredAt?: string | null;
}): object {
  const explorerBase = process.env.AVALANCHE_CHAIN_ID === '43114'
    ? 'https://snowtrace.io'
    : 'https://testnet.snowtrace.io';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://proofmark.xyz";
  const isMainnet = process.env.AVALANCHE_CHAIN_ID === '43114';

  return {
    "$schema": "https://proofmark.xyz/schemas/receipt-v1.json",
    "generated_by": "ProofMark",
    "generated_at_utc": new Date().toISOString(),
    "receipt_version": "1.0",
    "receipt_type": "proof_of_existence",

    "work": {
      "title": data.title,
      "work_type": data.workType || null,
    },

    "identifiers": {
      "script_id": data.scriptId,
      "version_id": data.versionId,
    },

    "file": {
      "original_filename": data.filename,
      "byte_size": data.byteSize,
      "page_count": data.pageCount,
      "mime_type": data.mimeType || null,
    },

    "fingerprint": {
      "algorithm": "SHA-256",
      "hash": data.sha256,
      "description": "Cryptographic hash uniquely identifying file contents"
    },

    "timestamp": {
      "committed_at_utc": data.timestampUtc,
      "timezone": "UTC",
    },

    "blockchain": data.txHash ? {
      "verified": data.chainStatus === "confirmed",
      "network": {
        "name": "Avalanche C-Chain",
        "chain_id": parseInt(process.env.AVALANCHE_CHAIN_ID || '43113'),
        "environment": isMainnet ? "mainnet" : "testnet",
      },
      "transaction": {
        "hash": data.txHash,
        "block_number": data.blockNumber,
        "status": data.chainStatus || "confirmed",
        "registered_at_utc": data.chainRegisteredAt,
      },
      "contract": {
        "address": process.env.PROOFMARK_REGISTRY_ADDRESS || null,
        "name": "ProofMarkRegistry",
      },
      "verification": {
        "explorer_url": `${explorerBase}/tx/${data.txHash}`,
        "explorer_name": isMainnet ? "Snowtrace" : "Snowtrace Testnet",
        "proofmark_url": `${appUrl}/verify?hash=${data.sha256}`,
      },
      "description": "This fingerprint has been permanently recorded on the Avalanche blockchain, providing independent, tamper-proof verification."
    } : null,

    "verification_instructions": {
      "step_1": "The SHA-256 hash above uniquely identifies the exact file contents",
      "step_2": data.txHash
        ? "Visit the explorer_url to verify the blockchain record independently"
        : "This record is stored in ProofMark's database",
      "step_3": `Visit ${appUrl}/verify to check any file against ProofMark records`,
    },

    "legal": {
      "disclaimer": "ProofMark provides proof of existence and authorship timestamps. ProofMark is not a law firm and does not provide legal advice.",
      "jurisdiction_note": "Blockchain timestamps provide evidence of existence at a point in time. Legal recognition may vary by jurisdiction.",
    },
  };
}
