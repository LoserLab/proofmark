# ProofMark: Public Messaging Strategy

> This is the public-facing version of the GTM revamp. Blockchain is treated as infrastructure, not identity. For the full technical positioning (including Avalanche/chain specifics), see `gtm-revamp.md`.

---

## The Diagnosis

The product is positioned around its mechanism instead of its meaning.

"Proof of creation, sealed forever" describes what ProofMark does technically. It doesn't describe why anyone should care. The landing page leads with technical jargon when it should lead with the fear every creator feels the moment before they hit send.

---

## 1. REPOSITIONING

### Competitive Alternatives (what people do today)

- Email themselves the file ("poor man's copyright")
- WGA registration ($20, 5-year limit, screenwriters only)
- US Copyright Office ($45-65, takes 3-12 months)
- Various technical timestamping tools (confusing, built for engineers)
- **Most commonly: nothing. They just hope for the best.**

### The Villain

The power imbalance. Every time a creator shares work with someone who has more leverage (a producer, a publisher, an investor, a collaborator), they're trusting that person not to take it. Most creators have zero proof they made it first. The system is designed for people with lawyers, not people with laptops.

### The Category

**Don't call it "proof of origin."** That's a feature. Call it what it is from the creator's perspective.

**ProofMark is a "creation receipt."** You made something. Here's your receipt. Permanent, verifiable, tamper-proof.

### The Onlyness Statement

> ProofMark is the **only creation receipt** that **proves your work existed before you share it** for **independent creators** who **need protection without lawyers, technical knowledge, or months of waiting.**

### The One Word ProofMark Owns

**First.** As in: "I made this first." That's the entire product in one word.

---

## 2. MESSAGING ARCHITECTURE

### Layer 1: Tagline (hero, bios, everywhere)

> **Prove you made it first.**

5 words. Instantly understood. Contains the urgency ("first" implies someone else might claim it). Passes the repeat-from-memory test.

### Layer 2: One-Liner (meta descriptions, email sigs, intros)

> ProofMark creates permanent, verifiable proof that your creative work existed before you share it with anyone.

### Layer 3: Elevator Pitch (30 seconds)

> Every time you send a screenplay, pitch an idea, or share a song, you're trusting the other person not to take it. Most creators have zero proof they made it first. ProofMark creates a tamper-proof timestamp in under 60 seconds. Your file never leaves your device. Anyone can verify your proof independently, forever. It's the receipt your creative work deserves.

### Layer 4: Three Key Messages

| Pillar | Claim | Evidence | Emotion | Objection Killed |
|--------|-------|----------|---------|------------------|
| **"Lock it before you share it."** | Every creative work should be timestamped before it leaves your hands | Permanent record created in <60s | Fear → relief | "Is this really necessary?" |
| **"Your file never leaves your device."** | ProofMark proves your work exists without ever seeing it | Client-side fingerprinting, privacy-first architecture | Trust, security | "What if ProofMark leaks my work?" |
| **"Anyone can verify. No account needed."** | Your proof is independently verifiable, forever | Public verification, shareable links, embeddable badges | Confidence, power | "What if ProofMark shuts down?" |

### Voice

- **Direct.** No corporate hedging. Say what it does.
- **Protective.** Like a friend who's also a lawyer. Warm but serious.
- **Specific.** Numbers over adjectives. "60 seconds" not "fast." "Tamper-proof" not "secure."
- **NOT**: salesy, crypto-bro, legalese, or generic SaaS

---

## 3. LANDING PAGE: COPY DIRECTION

The current page is aesthetically strong but converts weakly. Here's the structural revamp.

### Hero (emotion first, mechanism second)

**Current**: "Proof of creation, sealed forever" + "Upload your screenplay, manuscript, or creative work. ProofMark creates a digital fingerprint..."

**New direction**:

> **Prove you made it first.**
>
> Before you pitch it, send it, or share it. ProofMark creates permanent, verifiable proof of your creative work in under 60 seconds. Your file never leaves your device.
>
> \[Lock Your First Draft\] \[See How It Works\]

The CTA changes from "Protect Your Work" (passive, generic) to "Lock Your First Draft" (active, specific, uses the product language).

### Section 2: The Villain (NEW, replaces generic "How It Works" as section 2)

> **You create. They take. You can't prove a thing.**
>
> A screenwriter shares a script with a producer. Six months later, a suspiciously similar movie gets greenlit. A songwriter demos a hook in a session. It shows up on someone else's album. A founder pitches an idea. The VC funds a clone.
>
> It happens every day. And the creator almost never wins. Not because they weren't first. Because they can't prove they were first.
>
> **ProofMark changes that.**

This section does the StoryBrand villain work: names the external problem (theft), the internal problem (helplessness), and the philosophical problem (it's wrong that creators bear this risk).

### Section 3: How It Works (tightened)

Keep the three-step editorial layout. Tighten the copy:

| Step | Title | New Copy |
|------|-------|----------|
| 01 | **Drop** | Drop your file. ProofMark computes a unique digital fingerprint entirely in your browser. Your content never touches our servers. |
| 02 | **Lock** | Your fingerprint is sealed with a permanent, tamper-proof timestamp. Immutable. Verifiable. Yours. |
| 03 | **Prove** | Download your certificate, share a verification link, or embed a badge. Anyone can confirm your proof independently. |

### Section 4: Use Cases (reframed around moments, not file types)

**Current**: Generic categories (Screenplays, Manuscripts, Song Lyrics...)

**New**: Trigger moments. Frame around WHEN you need it, not WHAT it protects:

> **Lock it before...**
>
> - **The pitch meeting.** Your deck, your concept, your strategy. Timestamped before you walk in the room.
> - **The collaboration.** You brought the hook. Prove it was yours before the session started.
> - **The query letter.** Your manuscript, your synopsis. Proof that predates every submission.
> - **Hitting "send."** Any file, any format, any creative work. 60 seconds to permanent proof.

This reframe creates urgency by naming the trigger event and broadens the ICP beyond "screenwriters" without losing specificity.

### Section 5: Evidence Packet (keep, it's strong)

This section already works. The visual of the actual proof document is compelling. Minor copy tightening.

### Section 6: Trust Section (NEW, before final CTA)

> **Built on math, not trust.**
>
> - **Digital fingerprinting.** SHA-256, the same security standard used by banks, governments, and the infrastructure that secures online banking worldwide.
> - **Permanent public record.** Your proof is written to a tamper-proof record. It can't be altered, deleted, or disputed.
> - **Independent verification.** Anyone can verify your proof, anytime, without an account or our involvement.
> - **Privacy-first.** Your file never leaves your browser. We never see, store, or access your content.

Note: no chain names, no validator counts, no crypto/cryptographic terminology. Curious technical users can find the architecture details on a dedicated "How It Works" deep-dive page.

### Section 7: Final CTA (urgency)

> **Your next draft deserves a receipt.**
>
> Create your first permanent proof in under 60 seconds. Free. No credit card.
>
> \[Lock Your First Draft\]

---

## 4. GO-TO-MARKET STRATEGY

### Beachhead: Screenwriters

**Why screenwriters first:**

- Highest pain intensity (scripts get stolen constantly, it's an industry cliche)
- Clear trigger event (sharing with producers, managers, agents)
- Dense, reachable community (screenwriting Twitter, r/Screenwriting, Black List, Coverfly)
- High-value work (a screenplay can be worth $100K-$5M+)
- Built-in word-of-mouth culture (writers talk to writers)

**Win screenwriters first. Expand to all creators from there.**

### Primary Channel: X/Twitter (Founder-Led)

Founder personal account, not brand account. 5-10x organic reach.

**The 70/20/10 split:**

- **70% domain expertise**: IP theft stories, copyright education, creator rights, industry analysis
- **20% build journey**: Why you're building ProofMark, design decisions, milestones
- **10% product**: Demo clips, feature drops, user stories

**Cadence**: 1 post/day + 10-20 replies to screenwriters, creators, IP lawyers

### Secondary Channel: TikTok/Reels (ScreenwritingTok)

ScreenwritingTok is massive. Creators sharing their journey, complaining about the industry, showing their process.

**Format**: 30-60 second screen recordings. "I just locked my screenplay in 42 seconds. Here's how." Silent-test optimized (captions, visual process).

**Hook architecture**:

- 0-3s: "A producer stole my friend's screenplay. She had no proof she wrote it first."
- 3-8s: "I'm never letting that happen to me. Here's what I do before I send ANYTHING."
- 8-15s: Show the ProofMark flow (upload → lock → certificate)
- 15-20s: Show the proof / verification
- End: "Lock it before you share it. Link in bio."

### Community Infiltration

Before any promotion:

- Be genuinely helpful in r/Screenwriting, r/selfpublish, screenwriting Discord servers
- Answer questions about copyright, IP protection, WGA registration
- Build trust by giving, not selling
- When someone asks "how do I protect my script before sending it out?" — that's the moment

---

## 5. MONETIZATION FRAMEWORK

### Three Tiers

| | **Free** | **Pro** ($9/mo or $79/yr) | **Team** ($29/mo) |
|---|---|---|---|
| Records | 3/month | Unlimited | Unlimited |
| Certificate PDF | Basic | Full evidence packet | Full evidence packet |
| Permanent ledger proof | No | Yes | Yes |
| Share links | No | Watermarked, tracked | Watermarked, tracked |
| Version tracking | No | Yes | Yes |
| API access | No | No | Yes |
| Embeddable badges | No | No | Yes |
| Audit trail | No | Basic | Full |

**Why this works:**

- **Free tier is the acquisition loop.** 3 records/month is enough to try it, not enough to rely on it.
- **Permanent proof is the upgrade trigger.** Free = ProofMark's record. Pro = permanent, independent, tamper-proof record. The value delta is clear.
- **Annual pricing**: "2 months free" framing ($79/yr vs $108/yr)
- **Team tier** targets studios, agencies, publishers who need it for workflows

### Pricing Psychology

- Lead with value: "Permanent proof for less than a coffee"
- Anchor against alternatives: "$9/month vs. $65 + 6 months waiting for USCO"
- "Most popular" badge on Pro
- CTA: "Lock your work" not "Subscribe" or "Buy now"

---

## 6. CONTENT & DISTRIBUTION PLAN

### Content Pillars

**Pillar 1: "The Receipts"** (70%, domain expertise)

- Core thesis: Creators are unprotected and don't know it
- Target emotion: Anger at the system, urgency to act
- Content: IP theft case studies, copyright myths, "did you know" facts about creator rights

**Pillar 2: "Building ProofMark"** (20%, build journey)

- Core thesis: We're building the protection layer creators deserve
- Target emotion: Trust, investment in the journey
- Content: Design decisions, milestones, behind-the-scenes

**Pillar 3: "Locked"** (10%, product)

- Core thesis: This is the simplest way to prove you made something first
- Target emotion: Relief, empowerment
- Content: Demo clips, user stories, feature drops

### 5-Beat Campaign Arc (First Campaign)

| Beat | Day | Content | Channel |
|------|-----|---------|---------|
| **Provocation** | 1 | "Your screenplay has no proof of origin. Neither does your manuscript, your song, or your pitch deck. And you're about to share it with a stranger." | X thread |
| **Evidence** | 3 | IP theft case study. Real story, anonymized if needed. "Here's what happens when you can't prove you were first." | X thread + TikTok |
| **Framework** | 5 | "The 60-Second Rule: Before you share ANY creative work, do this one thing." Educational content about timestamping. | X post + blog |
| **Demonstration** | 7 | Screen recording: "Watch me lock a screenplay in 42 seconds." Full ProofMark flow. | TikTok/Reels + X clip |
| **CTA** | 9 | "ProofMark is live. Free to start. Lock your first draft now." Direct product push. | X post + email |

### Weekly Rhythm

- **Monday**: Provocative take on creator protection (engagement driver)
- **Tuesday**: Educational content about copyright / IP (authority builder)
- **Wednesday**: Build-in-public update (trust builder)
- **Thursday**: Industry commentary / news analysis (shows awareness)
- **Friday**: Lighter content, personal story, or community highlight
- **Weekend**: Reply strategy, community engagement, relationship building

---

## 7. COMPETITIVE MOAT

### Short-term (now)

- **Speed + simplicity**: 60 seconds vs. months (USCO) or confusing technical tools
- **Privacy-first**: File never leaves the browser (unique in the space)
- **Free tier**: Lower barrier than any alternative

### Medium-term (6-12 months)

- **Network effects**: "Verified on ProofMark" becomes a recognized trust signal
- **Integration partnerships**: Final Draft, The Black List, Coverfly, WriterSolo
- **Verification badges**: Publishers, agents, producers checking ProofMark proofs becomes standard

### Long-term (12-24 months)

- **API ecosystem**: Platforms integrating ProofMark verification into their workflows
- **Data moat**: Aggregated (anonymous) data about creation patterns, industry trends
- **Category ownership**: "ProofMark it" becomes a verb, like "Google it"

---

## 8. BLOCKCHAIN MESSAGING GUIDELINES

### The Rule

Blockchain is infrastructure, not identity. ProofMark uses it so creators never have to think about it.

### Language Substitutions

| Don't say | Say instead |
|-----------|------------|
| Blockchain | Permanent public record / tamper-proof record |
| On-chain | Permanently recorded |
| Avalanche C-Chain | (omit entirely in public copy) |
| Smart contract | (omit entirely in public copy) |
| Crypto / Web3 | (never use) |
| Cryptographic | Digital (e.g. "digital fingerprint") |
| Decentralized | Independent, tamper-proof |
| Block explorer | Verification page / public record |
| Transaction hash | Record ID / proof reference |
| Gas fees | (never surface to users) |

### Where blockchain CAN appear

- **Technical deep-dive page** (opt-in, for curious users): "Under the hood, ProofMark writes your proof to the Avalanche blockchain..."
- **Developer/API documentation**: Full technical details including chain ID, contract address, Snowtrace links
- **Competition submissions**: Avalanche Build Games materials, technical judges
- **Investor materials**: Architecture diagrams, cost structure, chain selection rationale
- **Press/media** (when asked): "Yes, we use blockchain infrastructure for permanent proof, but the product is designed so creators never need to know that."

### Where blockchain should NEVER appear

- Landing page hero or tagline
- Primary CTAs
- Social media hooks
- Onboarding flow
- Pricing page
- Email sequences (unless specifically about the tech)

---

## Summary: The Three Biggest Changes

1. **Lead with the fear, not the feature.** "Prove you made it first" beats "Proof of creation, sealed forever" because it speaks to the REASON someone would use this, not the mechanism.

2. **Win screenwriters, then expand.** Stop trying to be for everyone. Win one tribe. Let them evangelize to adjacent tribes.

3. **Founder-led distribution, not brand-led.** Your personal account on X + TikTok, telling the story of WHY creator protection matters, will outperform any brand account 10x. 70% domain expertise, 20% build journey, 10% product.

The product is ready. The positioning is what needs to catch up.
