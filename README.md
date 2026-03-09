# ProofMark

**Proof-of-origin for creative work, powered by Avalanche.**

ProofMark creates permanent, blockchain-verified proof that you created something first. Upload your screenplay, manuscript, song, pitch deck, or any creative file. ProofMark generates a SHA-256 fingerprint and registers it on the Avalanche C-Chain with a tamper-proof timestamp. Anyone can verify your proof independently, forever.

**Live:** [proofmark.io](https://proofmark.io)
**Contract (Fuji):** [Snowtrace](https://testnet.snowtrace.io)

---

## Why ProofMark Exists

Creators share work constantly: scripts with producers, demos with collaborators, pitches with investors. When someone copies their idea, they almost never win. Not because they weren't first, but because they can't prove they were first.

ProofMark solves this with a 60-second workflow: upload your file, get a permanent blockchain receipt.

---

## Technical Architecture

### Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14 (App Router) | Server components for auth-gated pages, API routes for backend logic |
| Auth | Supabase Auth (SSR) | Email/password with `@supabase/ssr` cookie-based sessions |
| Database | Supabase PostgreSQL | RLS for reads, service role for writes. 6 tables with audit trail |
| Storage | Supabase Storage | Signed upload URLs for direct client-to-storage uploads |
| Blockchain | Avalanche C-Chain (viem) | On-chain hash registration via custom smart contract |
| PDF Generation | pdf-lib | Pure JS certificate generation (works in serverless) |
| Evidence Packing | JSZip | Assembles downloadable proof packages |

### System Flow

```
User uploads file
       │
       ▼
┌─────────────────┐
│  Next.js API     │──► Supabase Storage (signed upload URL)
│  /api/scripts/   │
│  upload          │──► Supabase DB (script + version records)
└─────────────────┘
       │
       ▼ (user commits)
┌─────────────────┐
│  Next.js API     │──► SHA-256 hash computed server-side
│  /api/scripts/   │
│  [id]/commit     │──► chain_status = "pending"
└─────────────────┘
       │
       ▼ (async, non-blocking)
┌─────────────────┐
│  Blockchain      │──► viem wallet client signs tx
│  Registration    │──► registerHash() on ProofMarkRegistry
│  (lib/blockchain)│──► Wait for 1 confirmation
└─────────────────┘──► chain_status = "confirmed"
       │                tx_hash + block_number saved
       ▼
┌─────────────────┐
│  Evidence Packet │──► PDF certificate with chain proof
│  Generation      │──► receipt.json (hash, tx, block)
│                  │──► Original file snapshot
└─────────────────┘──► Downloadable ZIP
       │
       ▼
┌─────────────────┐
│  Public Verify   │──► Anyone can verify by hash or file drop
│  /verify         │──► Checks Supabase + on-chain state
│  /api/verify/    │──► Returns chain proof + Snowtrace link
└─────────────────┘
```

---

## Avalanche Integration

### Smart Contract: ProofMarkRegistry.sol

Deployed on Avalanche Fuji C-Chain (Solidity 0.8.20, OpenZeppelin Ownable).

```solidity
contract ProofMarkRegistry is Ownable {
    struct Record {
        bytes32 contentHash;
        uint64  timestamp;    // block.timestamp
        uint8   workType;     // 0-5 (screenplay, manuscript, song, etc.)
        address registeredBy;
    }

    mapping(bytes32 => Record) public records;        // versionId → Record
    mapping(bytes32 => bytes32) public hashToVersion;  // contentHash → versionId
    uint256 public totalRecords;

    function registerHash(bytes32 versionId, bytes32 contentHash, uint8 workType) external onlyOwner;
    function verifyHash(bytes32 contentHash) external view returns (bool, bytes32, uint64, uint8);
    function getRecord(bytes32 versionId) external view returns (bytes32, uint64, uint8, address);
}
```

**Key design decisions:**

- **Struct packing:** `uint64 timestamp + uint8 workType + address registeredBy` fits in a single 32-byte storage slot, minimizing gas costs
- **Dual-index lookups:** Both `records[versionId]` and `hashToVersion[contentHash]` allow verification from either direction
- **Indexed events:** `HashRegistered` event indexes both `versionId` and `contentHash` for efficient off-chain filtering
- **Input validation:** Duplicate prevention, empty hash guard, work type bounds check
- **Gas cost:** ~$0.04-0.07 per registration on Avalanche C-Chain

### Why Avalanche C-Chain

- **Sub-second finality:** Registrations confirm in under 2 seconds. Users don't wait.
- **Low gas costs:** Fractions of a cent per registration makes it viable for individual creators, not just enterprises.
- **EVM compatibility:** Standard Solidity tooling (Hardhat, viem) with no custom SDK required.
- **Public verifiability:** Any registration can be independently verified on Snowtrace without needing a ProofMark account.

### Relayer Architecture

Users never need a wallet or AVAX tokens. ProofMark uses a server-side relayer pattern:

1. Server holds an EOA private key (`RELAYER_PRIVATE_KEY`)
2. On commit, the server signs and broadcasts the `registerHash()` transaction
3. viem's `waitForTransactionReceipt` waits for 1 confirmation
4. On success: `tx_hash`, `block_number`, `chain_status: "confirmed"` are saved
5. On failure: `chain_status: "failed"` (graceful degradation; off-chain record still valid)

Retry logic: 3 attempts with exponential backoff (2s, 4s, 6s). Smart error handling for "Already registered" (not retried) and "insufficient funds" (fails immediately with alert).

---

## Database Schema

6 tables with full audit trail:

| Table | Purpose |
|-------|---------|
| `user_profiles` | User metadata |
| `scripts` | Top-level work records (title, work type) |
| `script_versions` | Per-version records with SHA-256, chain status, tx hash, block number |
| `audit_log` | Immutable log of all actions (uploads, commits, downloads, shares) |
| `receipts` | Generated evidence packet metadata |
| `share_links` | Tokenized share links with expiry and access tracking |

**Chain status state machine:** `NULL → pending → confirmed | failed`

All database writes use a Supabase service role client (bypasses RLS). Reads use standard RLS policies scoped to `auth.uid()`.

---

## Key Features

### 1. Protect (Upload + Commit)
Multi-step wizard: Upload → Details → Review → Generate. File is uploaded to Supabase Storage via signed URL, SHA-256 is computed server-side, and the hash is registered on Avalanche.

### 2. Verify
Public verification page at `/verify`. Two modes:
- **Paste a hash:** Manual SHA-256 input with validation
- **Drop a file:** Browser-side hashing via `crypto.subtle.digest` (file never leaves the browser for verification). Auto-verifies if `?hash=` is in the URL.

Verification checks both the Supabase database and the on-chain state, returning chain proof with Snowtrace link.

### 3. Evidence Packet
Downloadable ZIP containing:
- **PDF Certificate:** Formal proof document with registration timestamp, SHA-256, transaction hash, block number, and verification URL
- **receipt.json:** Machine-readable proof metadata
- **Original file snapshot:** The exact file that was registered

### 4. Certificate PDF
Generated with pdf-lib (pure JavaScript, serverless-compatible). Includes blockchain transaction hash and block number when available, plus a verification URL for independent confirmation.

### 5. Share Links
Tokenized, expirable share links for controlled distribution. Each access is logged in the audit trail, creating a paper trail of who received what and when.

### 6. Public REST API (v1)
API key-authenticated endpoints for third-party integrations:
- `GET /api/v1/scripts` (paginated, filterable)
- `GET /api/v1/scripts/[id]/versions`
- `GET /api/v1/verify/[hash]`
- `GET /api/v1/protect`

---

## Project Structure

```
app/
  page.tsx                          # Landing page
  app/                              # Dashboard (auth-gated)
    page.tsx                        # Script list
    scripts/[id]/page.tsx           # Script detail with chain proof
  api/
    scripts/upload/route.ts         # File upload handler
    scripts/[scriptId]/commit/      # Hash + chain registration
    scripts/[scriptId]/packet/      # Evidence packet generation
    scripts/[scriptId]/certificate/ # PDF certificate generation
    verify/[hash]/route.ts          # Public hash verification
    v1/                             # Public REST API
  auth/                             # Login, signup, reset flows
  verify/page.tsx                   # Public verification page
  protect/page.tsx                  # Upload wizard

components/
  ChainStatusBadge.tsx              # "Verified on Avalanche" badge
  EvidencePacketPreview.tsx         # Visual preview of proof package
  BreathStrip.tsx                   # Landing page feature strip
  ErrorNotice.tsx                   # Consistent error display

lib/
  blockchain/
    client.ts                       # viem client (Fuji/mainnet)
    register.ts                     # Registration with retry logic
    constants.ts                    # Contract ABI + work type map
  certificate-pdf.ts                # PDF generation with pdf-lib
  crypto.ts                         # SHA-256 hashing
  supabase/                         # Supabase client factories

contracts/
  contracts/ProofMarkRegistry.sol   # Smart contract
  test/ProofMarkRegistry.test.ts    # Contract test suite
  scripts/deploy.ts                 # Deployment script
  hardhat.config.ts                 # Fuji + mainnet config
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- Supabase project (with auth, database, storage configured)
- Avalanche Fuji testnet AVAX (for relayer wallet)

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#          SUPABASE_SERVICE_ROLE_KEY, RELAYER_PRIVATE_KEY,
#          PROOFMARK_REGISTRY_ADDRESS, AVALANCHE_RPC_URL

# Deploy smart contract (if needed)
cd contracts && npm install
npx hardhat run scripts/deploy.ts --network fuji

# Check relayer balance
npx hardhat run scripts/check-balance.ts --network fuji

# Start dev server
cd .. && npm run dev
```

### Smart Contract Tests

```bash
cd contracts
npx hardhat test
```

---

## Security Considerations

- **No wallet required:** Users never handle private keys or sign transactions. The relayer pattern abstracts all blockchain complexity.
- **Privacy-preserving:** Only the SHA-256 fingerprint goes on-chain. File content is never exposed publicly.
- **Input validation:** File size limits (100MB), MIME type whitelisting, filename sanitization.
- **Auth guards:** Every protected route validates `supabase.auth.getUser()` server-side.
- **Service role isolation:** All database writes use the Supabase service role client, never the anon key.
- **Audit trail:** Every significant action is logged with timestamps, user IDs, and IP addresses.

---

## Built for Avalanche Build Games 2026

ProofMark was built for the [Avalanche Build Games 2026](https://www.avax.network/buildergames) competition. The Avalanche C-Chain provides the ideal foundation for proof-of-origin: sub-second finality means registrations are instant, low gas costs make it accessible to individual creators, and public verifiability on Snowtrace means proofs are trustworthy without trusting ProofMark.
