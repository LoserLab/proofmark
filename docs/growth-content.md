# ProofMark Growth Content Package

## X/Twitter Launch Thread

**Tweet 1 (Hook):**
A screenwriter sends a script to a producer. Six months later, a suspiciously similar movie gets greenlit. The screenwriter has no proof they wrote it first. This happens every single day.

**Tweet 2 (Problem):**
Your options right now: Poor Man's Copyright (courts don't recognize it). WGA registration ($250, takes days, screenplays only). USCO copyright ($65, takes 3-8 months). Or the most common choice: nothing.

**Tweet 3 (Agitation):**
The problem isn't that creators get stolen from. It's that they have zero evidence when it happens. No timestamp. No proof. Just "I swear I wrote this first."

**Tweet 4 (Solution):**
We built ProofMark. Upload any creative file. In under 60 seconds, your work is fingerprinted and registered on the Avalanche blockchain. Permanent. Tamper-proof. Publicly verifiable.

**Tweet 5 (How):**
How it works: Drop your file. ProofMark generates a SHA-256 fingerprint (same cryptography banks use). That fingerprint is sealed on the Avalanche C-Chain with an immutable timestamp. You get a downloadable evidence packet: PDF certificate + blockchain receipt + your original file.

**Tweet 6 (Differentiator):**
No wallet. No crypto. No waiting. ProofMark handles the blockchain behind the scenes. You just upload and lock.

**Tweet 7 (Proof point):**
Anyone can verify your proof at proofmark.xyz/verify. Drop the file or paste the hash. The blockchain confirms it. No account needed. No trusting us. Just math.

**Tweet 8 (CTA):**
Lock your first draft free at proofmark.xyz. 60 seconds between vulnerability and proof.

---

## TikTok/Reels Script (60s)

```
[0-3s]  TEXT ON SCREEN: "A producer stole my script."
        HOOK (spoken): "This screenwriter sent their script
        to a producer. Six months later..."

[3-8s]  STAKES: "...a suspiciously similar movie got
        greenlit. And they had zero proof they wrote it
        first."

[8-15s] PROBLEM: "Your options? Mail yourself a copy.
        Courts don't care. WGA registration. $250, takes
        days. Copyright office. $65, takes MONTHS."

[15-20s] RE-HOOK: "Or... 60 seconds."
         TEXT ON SCREEN: "60 seconds to permanent proof."

[20-45s] DEMO: Screen recording of ProofMark flow.
         Upload file > fingerprint generates >
         "Registered on Avalanche" confirmation >
         download evidence packet.
         TEXT OVERLAY on each step.

[45-55s] PAYOFF: "Blockchain-verified. Tamper-proof.
         Anyone can verify it. No crypto needed."

[55-60s] CTA: "Lock your work before you share it.
         Link in bio."
         TEXT ON SCREEN: proofmark.xyz
```

---

## Reddit Post (r/Screenwriting)

**Title:** I got tired of having no proof I wrote something first, so I built a free tool for it

**Body:**

Every screenwriter I know has the same story. You share a script, a treatment, a pitch. Months later, something suspiciously similar shows up. And you have nothing.

Poor Man's Copyright doesn't hold up in court. WGA registration only covers screenplays and costs $250 for non-members. The Copyright Office takes months. Most of us just... hope for the best.

I wanted something that takes less than a minute. So I built ProofMark.

You upload your file (any format: PDF, FDX, DOCX, whatever). It computes a cryptographic fingerprint of your work and registers it on a public blockchain with a permanent timestamp. You get a downloadable evidence packet with a PDF certificate, a machine-readable receipt, and your original file.

Anyone can verify it independently at the verification page. No account needed. No trusting me or my service. The blockchain confirms it.

It's free to use. No wallet or crypto knowledge needed.

Would love feedback from other writers. Curious if this is something you'd actually use before sending out a script.

---

## Hacker News (Show HN)

**Title:** Show HN: ProofMark, blockchain proof-of-origin for creative work (Avalanche)

**Body:**

ProofMark registers SHA-256 fingerprints of creative files on the Avalanche C-Chain via a custom Solidity contract with a server-side relayer. Users never touch a wallet.

The flow: upload file > server computes SHA-256 > relayer signs registerHash() tx on Avalanche > sub-second finality > tx hash + block number stored > evidence packet generated (PDF certificate + receipt.json + original file snapshot).

Architecture decisions:
- Avalanche C-Chain over Ethereum/Polygon: sub-second finality, ~$0.05/tx
- Server-side relayer (EOA wallet) so users never need MetaMask or AVAX
- Async fire-and-forget registration (don't block the user on chain confirmation)
- Dual-index contract: lookup by versionId OR contentHash
- Struct packing: uint64 + uint8 + address in one storage slot

Stack: Next.js 14, Supabase (auth + db + storage), viem, Hardhat, pdf-lib.

Public verification at /verify checks both Supabase DB and on-chain state via Snowtrace.

Site: https://proofmark.xyz

Happy to go deep on any architectural decisions.

---

## Content Calendar (First 2 Weeks)

### Week 1: Launch

| Day | Platform | Content | Pillar |
|-----|----------|---------|--------|
| Mon | X/Twitter | Launch thread (8 tweets above) | Product |
| Mon | Reddit | r/Screenwriting post (above) | Community |
| Mon | HN | Show HN post (above) | Dev |
| Tue | X/Twitter | "Poor Man's Copyright doesn't work" myth-busting thread | The Proof Gap |
| Wed | X/Twitter | 60-second demo screen recording | 60-Second Security |
| Thu | TikTok/Reels | "A producer stole my script" video (script above) | They Took It |
| Fri | X/Twitter | "Why we chose Avalanche" decision log | Build Journal |

### Week 2: Sustain

| Day | Platform | Content | Pillar |
|-----|----------|---------|--------|
| Mon | X/Twitter | Thread: "5 real cases of creative theft in Hollywood" | They Took It |
| Tue | Reddit | r/Filmmakers post: "How cryptographic fingerprinting works (explained for non-devs)" | The Proof Gap |
| Wed | X/Twitter | Before/after: "47 seconds from upload to blockchain proof" (screen recording) | 60-Second Security |
| Thu | TikTok/Reels | "The $250 lie: why WGA registration isn't enough" | The Proof Gap |
| Fri | X/Twitter | "Week 1 numbers: X signups, Y files protected, Z verifications" | Build Journal |

---

## Quick-Deploy Hooks (Copy-Paste Ready)

### For X/Twitter Bio
"Prove you made it first. Blockchain proof-of-origin for creative work. Free."

### For Instagram/TikTok Bio
"Lock your creative work in 60 seconds. Free blockchain proof of creation."

### For Reddit Flair/Bio
"Built ProofMark: free proof-of-creation tool for writers"

### For Email Signature
"P.S. Before you share that draft, lock it: proofmark.xyz (60 seconds, free)"

### For Discord Server Introduction
"Hey, I built ProofMark: a free tool that gives your creative work a blockchain-verified timestamp before you share it. Takes about a minute. No crypto needed. Happy to answer any questions about it."

---

## Landing Page Improvements

### Current CTA (Final Section)
> "Create your first permanent proof in under 60 seconds. Free. No credit card."

### Recommended CTA
> "Your next pitch meeting is coming. Lock your work before you walk in the room. Free during beta."

### Missing Elements
1. **Social proof**: Add a counter ("X files protected") or "Built on Avalanche" badge
2. **Urgency**: "Free during beta" creates scarcity without being dishonest
3. **Specificity**: The hero subhead could name the file types: "screenplays, manuscripts, songs, pitch decks"
