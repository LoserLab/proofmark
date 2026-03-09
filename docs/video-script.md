# ProofMark Walkthrough Video Script

**Target length:** 3:00 to 4:00
**Tone:** Confident, concise, founder-presenting-to-judges. Not salesy. Show, don't tell.

---

## INTRO (0:00 - 0:30)

**On screen:** Landing page hero ("Prove you made it first.")

**Script:**
"ProofMark is proof-of-origin for creative work. Screenwriters, songwriters, founders: anyone who creates something and shares it with people they have to trust.

The problem is simple. You write a screenplay, send it to a producer, and six months later a suspiciously similar movie gets greenlit. You had no proof you wrote it first.

ProofMark fixes that. You upload your file, we generate a SHA-256 fingerprint, register it on the Avalanche C-Chain, and hand you a timestamped evidence packet. 60 seconds. Permanent. Publicly verifiable."

**Action:** Scroll through landing page briefly (hero, villain section, how it works).

---

## LIVE DEMO: PROTECT FLOW (0:30 - 2:00)

**On screen:** Click "Lock Your First Draft" from landing page.

**Script:**
"Let me show you the full flow."

### Step 1: Upload (0:30 - 0:50)
**Action:** Drag and drop a PDF into the upload zone.

"I'm dropping a screenplay PDF. ProofMark uploads the file and immediately commits it. The SHA-256 fingerprint is computed server-side and the blockchain registration fires asynchronously."

### Step 2: Details (0:50 - 1:05)
**Action:** Show pre-filled title, select work type, continue.

"Title is auto-detected from the file. I confirm the work type and move on."

### Step 3: Review (1:05 - 1:15)
**Action:** Show the evidence pack preview, continue.

"Here's a preview of exactly what gets recorded: timestamp, fingerprint, version lineage."

### Step 4: Generate + Chain Confirmation (1:15 - 2:00)
**Action:** Generate evidence pack. Point to the ChainProofBanner showing "Verified on Avalanche" with tx hash.

"The evidence pack is generated and, right here, you can see the blockchain confirmation. This fingerprint is now permanently registered on the Avalanche C-Chain. Transaction hash, block number, and a direct link to Snowtrace."

**Action:** Click "View on Snowtrace" to open the transaction in a new tab.

"Anyone can verify this independently on Snowtrace. No ProofMark account needed. The proof exists on Avalanche forever."

**Action:** Download the evidence pack ZIP briefly, show the PDF certificate.

---

## LIVE DEMO: VERIFY FLOW (2:00 - 2:30)

**On screen:** Navigate to /verify

**Script:**
"Now let's verify from the other side. This is the public verification page. No login required."

**Action:** Drop the same file into the verify drop zone.

"I drop the same file. ProofMark hashes it entirely in the browser, so the file never leaves your device for verification, then checks it against our records and the chain."

**Action:** Show the verification result: title, timestamp, chain proof card with Snowtrace link.

"Found. Registered on Avalanche. Transaction confirmed. Independently verifiable."

---

## DASHBOARD + ARCHITECTURE (2:30 - 3:15)

**On screen:** Dashboard showing the script record.

**Script:**
"The dashboard shows all your records with chain status. Each record links to a detail view."

**Action:** Click into the script detail page. Point to the blockchain proof card.

"Full chain proof: transaction hash, block number, chain timestamp. Direct Snowtrace link. You can download the evidence packet or certificate at any time."

**On screen:** Brief cut to the smart contract code or README architecture diagram.

"Under the hood: Next.js 14 with Supabase for auth and storage. The ProofMarkRegistry smart contract is deployed on Avalanche Fuji. It stores a struct-packed record per registration: content hash, timestamp, work type. We use viem for all chain interactions, and a server-side relayer so users never need a wallet or AVAX tokens.

Gas cost per registration is under 7 cents. Sub-second finality. The contract is publicly verifiable on Snowtrace."

---

## CLOSE (3:15 - 3:30)

**On screen:** Landing page or verify page.

**Script:**
"ProofMark turns the Avalanche C-Chain into a public notary for creative work. Permanent proof, 60 seconds, no crypto knowledge required. Thanks for watching."

---

## Tips for Recording

- **Use a real file.** Have a screenplay PDF ready. Don't use "test.pdf".
- **Pre-fund the demo.** Do a test registration before recording to make sure chain registration confirms live.
- **Show Snowtrace.** The moment you click "View on Snowtrace" and judges see the real transaction on the block explorer is the money shot.
- **Keep it moving.** Don't linger on form fields. The pacing should feel fast and confident.
- **Screen resolution:** 1920x1080, browser at ~90% zoom for readability.
- **No filler:** Cut "um", "so", "basically". Every sentence should earn its place.
- **Record in one take if possible.** Judges respect founders who know their product cold.
