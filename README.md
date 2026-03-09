# ProofMark

**Blockchain proof-of-origin for creative work, powered by Avalanche.**

ProofMark gives creators permanent, tamper-proof evidence that they created something first. Upload your screenplay, manuscript, song, or any creative file. ProofMark generates a cryptographic fingerprint and registers it on the Avalanche C-Chain. Anyone can verify your proof independently, forever.

**Website:** [proofmark.xyz](https://proofmark.xyz)

---

## The Problem

Creators share work constantly: scripts with producers, demos with collaborators, pitches with investors. When someone copies their idea, they almost never win. Not because they weren't first, but because they can't prove they were first.

ProofMark solves this with a 60-second workflow: upload your file, get a permanent blockchain receipt.

---

## How It Works

1. **Upload** your creative file (screenplay, manuscript, song, pitch deck, etc.)
2. **ProofMark registers** a cryptographic fingerprint on the Avalanche C-Chain
3. **Download** your evidence packet: PDF certificate, blockchain receipt, and original file snapshot
4. **Anyone can verify** your proof publicly, without needing a ProofMark account

No wallet needed. No crypto knowledge required. ProofMark handles all blockchain interactions behind the scenes.

---

## Key Features

- **Instant Registration:** Sub-second finality on Avalanche C-Chain
- **Evidence Packets:** Downloadable ZIP with PDF certificate, machine-readable receipt, and file snapshot
- **Public Verification:** Verify any proof by hash or file drop at `/verify`
- **Share Links:** Controlled distribution with access tracking and audit trail
- **REST API:** API key-authenticated endpoints for third-party integrations
- **Privacy-Preserving:** Only the cryptographic fingerprint goes on-chain, never the file itself

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Auth | Supabase Auth (SSR) |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |
| Blockchain | Avalanche C-Chain |
| Smart Contract | Solidity 0.8.20 (Hardhat) |

---

## Avalanche Integration

ProofMark uses a custom smart contract deployed on the Avalanche C-Chain (Fuji testnet) for on-chain hash registration and verification. A server-side relayer pattern abstracts all blockchain complexity so users never need a wallet or AVAX tokens.

**Why Avalanche:**
- Sub-second finality for instant registrations
- Low gas costs accessible to individual creators
- Public verifiability on Snowtrace without trusting ProofMark
- EVM compatibility with standard tooling

---

## Running Locally

```bash
npm install
cp .env.example .env.local
# Fill in your Supabase and Avalanche credentials
npm run dev
```

See `.env.example` for required environment variables.

---

## Built for Avalanche Build Games 2026

ProofMark was built for the [Avalanche Build Games 2026](https://www.avax.network/buildergames) competition.
