"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type VerifyResult = {
  found: boolean;
  sha256: string;
  committedAt?: string;
  title?: string | null;
  workType?: string | null;
  filename?: string | null;
  byteSize?: number | null;
  pageCount?: number | null;
  txHash?: string | null;
  blockNumber?: number | null;
  chainStatus?: string | null;
  chainRegisteredAt?: string | null;
  explorerUrl?: string | null;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function bytesToSize(bytes: number) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`;
}

function fmtDate(s?: string | null) {
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="relative h-10 w-10">
        <div
          className="absolute inset-0 rounded-full border-2 border-[var(--highlight)]"
        />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--structure)] animate-spin"
        />
      </div>
      <p className="text-sm text-[var(--ink)]/60">
        Checking ProofMark records...
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="py-3 border-b border-[var(--structure)]/10 last:border-b-0">
      <div className="text-xs uppercase tracking-wider text-[var(--surface)] font-medium mb-1">
        {label}
      </div>
      <div
        className={`text-sm text-[var(--ink)] ${
          mono ? "font-mono text-xs break-all leading-relaxed" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Found / Not Found result views
// ---------------------------------------------------------------------------

function FoundResult({ result }: { result: VerifyResult }) {
  const chainLabel =
    result.chainStatus === "confirmed"
      ? "Confirmed on-chain"
      : result.chainStatus === "pending"
      ? "Pending"
      : null;

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      {/* Status banner */}
      <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-5">
        <div className="flex items-start gap-3">
          <CheckCircleIcon className="w-6 h-6 text-[var(--success)] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-semibold text-[var(--headline)]">
              Registered with ProofMark
            </h3>
            <p className="mt-1 text-sm text-[var(--ink)]/70 leading-relaxed">
              This fingerprint matches a work recorded in the ProofMark registry.
              The cryptographic hash was committed at the time shown below.
            </p>
          </div>
        </div>
      </div>

      {/* Details card */}
      <div className="rounded-xl border border-[var(--structure)]/20 bg-white p-6">
        {result.title && (
          <DetailRow label="Title" value={result.title} />
        )}
        {result.workType && (
          <DetailRow label="Work Type" value={result.workType} />
        )}
        {result.filename && (
          <DetailRow label="Original File" value={result.filename} />
        )}
        {result.committedAt && (
          <DetailRow
            label="Registered"
            value={fmtDate(result.committedAt) || result.committedAt}
          />
        )}
        <DetailRow label="SHA-256 Fingerprint" value={result.sha256} mono />
        {result.byteSize != null && (
          <DetailRow label="File Size" value={bytesToSize(result.byteSize)} />
        )}
        {result.pageCount != null && (
          <DetailRow
            label="Page Count"
            value={`${result.pageCount} ${
              result.pageCount === 1 ? "page" : "pages"
            }`}
          />
        )}
      </div>

      {/* Blockchain proof card */}
      {(result.txHash || result.chainStatus) && (
        <div className="rounded-xl border border-[var(--structure)]/20 bg-white p-6">
          <h4 className="text-xs uppercase tracking-wider text-[var(--structure)] font-semibold mb-4">
            Blockchain Proof
          </h4>
          {chainLabel && (
            <div className="mb-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  result.chainStatus === "confirmed"
                    ? "bg-[var(--success)]/10 text-[var(--success)]"
                    : "bg-[var(--warning)]/10 text-[var(--warning)]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    result.chainStatus === "confirmed"
                      ? "bg-[var(--success)]"
                      : "bg-[var(--warning)]"
                  }`}
                />
                {chainLabel}
              </span>
            </div>
          )}
          {result.txHash && (
            <DetailRow
              label="Transaction Hash"
              value={result.txHash}
              mono
            />
          )}
          {result.blockNumber != null && (
            <DetailRow
              label="Block Number"
              value={String(result.blockNumber)}
            />
          )}
          {result.chainRegisteredAt && (
            <DetailRow
              label="Chain Timestamp"
              value={
                fmtDate(result.chainRegisteredAt) || result.chainRegisteredAt
              }
            />
          )}
          {result.explorerUrl && (
            <div className="pt-3">
              <a
                href={result.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--structure)] hover:text-[var(--headline)] transition-colors"
              >
                View on Snowtrace
                <ExternalLinkIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotFoundResult({ sha256 }: { sha256: string }) {
  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      <div className="rounded-xl border border-[var(--structure)]/15 bg-white p-6">
        <div className="flex items-start gap-3">
          <SearchIcon className="w-5 h-5 text-[var(--surface)] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-semibold text-[var(--headline)]">
              Not found in ProofMark
            </h3>
            <p className="mt-1 text-sm text-[var(--ink)]/60 leading-relaxed">
              No committed record matches this fingerprint. This does not mean the
              work is unprotected, only that it has not been registered through
              ProofMark.
            </p>
            <div className="mt-4 rounded-lg bg-[var(--paper)] p-3">
              <div className="text-xs uppercase tracking-wider text-[var(--surface)] font-medium mb-1">
                Searched hash
              </div>
              <div className="text-xs font-mono text-[var(--ink)]/70 break-all leading-relaxed">
                {sha256}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[var(--paper)] flex items-center justify-center">
          <LoadingSpinner />
        </main>
      }
    >
      <VerifyPageContent />
    </Suspense>
  );
}

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const initialHash = searchParams.get("hash") || "";

  const [hashInput, setHashInput] = useState(initialHash);
  const [state, setState] = useState<
    "idle" | "loading" | "found" | "not_found" | "error"
  >("idle");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [hashingFile, setHashingFile] = useState(false);
  const [hashedFilename, setHashedFilename] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-verify if hash param is present
  useEffect(() => {
    if (initialHash && /^[a-f0-9]{64}$/i.test(initialHash)) {
      verifyHash(initialHash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyHash = useCallback(async (sha256: string) => {
    const cleaned = sha256.trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(cleaned)) {
      setErrorMsg("Please enter a valid 64-character SHA-256 hash.");
      setState("error");
      return;
    }

    setState("loading");
    setResult(null);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(cleaned)}`);
      const json = await res.json();

      if (json.found) {
        setResult(json);
        setState("found");
      } else {
        setResult({ found: false, sha256: cleaned });
        setState("not_found");
      }
    } catch {
      setErrorMsg("Could not reach the verification service. Please try again.");
      setState("error");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHashedFilename(null);
    verifyHash(hashInput);
  };

  const handleFileDrop = useCallback(
    async (files: FileList | null) => {
      setDragActive(false);
      if (!files || files.length === 0) return;
      const file = files[0];
      setHashingFile(true);
      setHashedFilename(file.name);
      try {
        const hash = await hashFile(file);
        setHashInput(hash);
        setHashingFile(false);
        verifyHash(hash);
      } catch {
        setHashingFile(false);
        setErrorMsg("Failed to hash the file. Please try again.");
        setState("error");
      }
    },
    [verifyHash]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileDrop(e.dataTransfer.files);
  };

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      {/* Hero section */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <ShieldIcon className="w-7 h-7 text-[var(--structure)]" />
          <span className="text-xs uppercase tracking-widest text-[var(--surface)] font-medium">
            ProofMark Verification
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-[var(--headline)]">
          Verify a record
        </h1>
        <p className="mt-3 text-base text-[var(--ink)]/70 leading-relaxed max-w-xl">
          Paste a SHA-256 hash or drop a file to check whether it has been
          registered with ProofMark.
        </p>
      </section>

      {/* Input section */}
      <section className="max-w-3xl mx-auto px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hash input */}
          <div className="relative">
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Enter SHA-256 hash (64 hex characters)"
              className="w-full rounded-xl border border-[var(--structure)]/20 bg-white px-5 py-4 pr-28 text-sm font-mono text-[var(--ink)] placeholder:text-[var(--ink)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--structure)]/40 focus:border-[var(--structure)]/40 transition-shadow"
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={state === "loading" || hashingFile}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Verify
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-[var(--structure)]/10" />
            <span className="text-xs text-[var(--ink)]/30 uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 border-t border-[var(--structure)]/10" />
          </div>

          {/* File drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-colors p-8 text-center ${
              dragActive
                ? "border-[var(--structure)] bg-[var(--highlight)]"
                : "border-[var(--structure)]/15 bg-white hover:border-[var(--structure)]/30 hover:bg-[var(--highlight)]/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => handleFileDrop(e.target.files)}
            />
            <FileIcon className="w-8 h-8 text-[var(--surface)] mx-auto mb-3" />
            {hashingFile ? (
              <p className="text-sm text-[var(--ink)]/60">
                Computing fingerprint...
              </p>
            ) : (
              <>
                <p className="text-sm font-medium text-[var(--ink)]/80">
                  Drop a file here to verify it
                </p>
                <p className="mt-1 text-xs text-[var(--ink)]/40">
                  The file is hashed in your browser. Nothing is uploaded.
                </p>
              </>
            )}
          </div>
        </form>

        {hashedFilename && !hashingFile && (
          <div className="mt-3 text-xs text-[var(--ink)]/50">
            Computed fingerprint for: {hashedFilename}
          </div>
        )}
      </section>

      {/* Results section */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        {state === "loading" && <LoadingSpinner />}
        {state === "found" && result && <FoundResult result={result} />}
        {state === "not_found" && result && (
          <NotFoundResult sha256={result.sha256} />
        )}
        {state === "error" && errorMsg && (
          <div className="animate-[fadeIn_0.4s_ease-out] rounded-xl border border-[var(--error)]/20 bg-[var(--error)]/5 p-5">
            <p className="text-sm text-[var(--error)]">{errorMsg}</p>
          </div>
        )}
      </section>

      {/* How it works section */}
      <section className="border-t border-[var(--structure)]/10 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-xl font-semibold text-[var(--headline)] mb-8">
            How verification works
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[var(--highlight)] flex items-center justify-center mb-3">
                <span className="text-sm font-semibold text-[var(--structure)]">
                  1
                </span>
              </div>
              <h3 className="text-sm font-medium text-[var(--ink)] mb-2">
                Fingerprint
              </h3>
              <p className="text-sm text-[var(--ink)]/60 leading-relaxed">
                Every file has a unique SHA-256 hash, a cryptographic
                fingerprint. Even a single changed character produces a
                completely different hash.
              </p>
            </div>

            <div>
              <div className="w-8 h-8 rounded-lg bg-[var(--highlight)] flex items-center justify-center mb-3">
                <span className="text-sm font-semibold text-[var(--structure)]">
                  2
                </span>
              </div>
              <h3 className="text-sm font-medium text-[var(--ink)] mb-2">
                Timestamp
              </h3>
              <p className="text-sm text-[var(--ink)]/60 leading-relaxed">
                When a work is committed to ProofMark, its fingerprint is
                recorded with a precise timestamp. Optionally, the hash is also
                written to a blockchain.
              </p>
            </div>

            <div>
              <div className="w-8 h-8 rounded-lg bg-[var(--highlight)] flex items-center justify-center mb-3">
                <span className="text-sm font-semibold text-[var(--structure)]">
                  3
                </span>
              </div>
              <h3 className="text-sm font-medium text-[var(--ink)] mb-2">
                Verify
              </h3>
              <p className="text-sm text-[var(--ink)]/60 leading-relaxed">
                Anyone with the original file (or its hash) can verify the
                registration date and chain proof independently, without
                revealing the file contents.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-xl bg-[var(--paper)] p-5">
            <p className="text-xs text-[var(--ink)]/50 leading-relaxed">
              ProofMark provides proof of existence. It records that a
              specific file fingerprint existed at a specific time. This is not
              a substitute for legal copyright registration. ProofMark is not a
              law firm and does not provide legal advice.
            </p>
          </div>
        </div>
      </section>

      {/* Inline keyframes for fadeIn */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
