"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EvidencePackPreview from "@/components/EvidencePackPreview";

function bytesToSize(bytes: number) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`;
}

type PreviewPayload = {
  title: string;
  workType: string;
  filename?: string | null;
  fileSize?: number | null;
  scriptId?: string | null;
  versionId?: string | null;
  notes?: string | null;
};

function ProtectPreviewContent() {
  const sp = useSearchParams();
  const key = sp.get("key");

  const [payload, setPayload] = useState<PreviewPayload | null>(null);

  useEffect(() => {
    if (!key) return;

    try {
      const raw = sessionStorage.getItem(`dl_preview_${key}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PreviewPayload;
      setPayload(parsed);
    } catch {
      // ignore
    }
  }, [key]);

  const fileSizeLabel = useMemo(() => {
    if (!payload?.fileSize) return null;
    return bytesToSize(payload.fileSize);
  }, [payload?.fileSize]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/5 to-transparent" />

      <section className="relative max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-neutral-400">
              ProofMark
            </div>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold">
              Evidence Pack Preview
            </h1>
            <p className="mt-2 text-sm text-neutral-400 max-w-2xl">
              This preview shows the structure and tone of the evidence pack before generation.
              The final file will reflect stored metadata and the computed checksum.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/protect"
              className="px-5 py-2 rounded-md border border-neutral-700 text-sm"
            >
              Back to Protect
            </a>
            <button
              onClick={() => window.print()}
              className="px-5 py-2 rounded-md bg-white text-black text-sm font-medium"
            >
              Print preview
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        {payload ? (
          <EvidencePackPreview
            title={payload.title}
            workType={payload.workType}
            filename={payload.filename ?? null}
            fileSizeLabel={fileSizeLabel}
            scriptId={payload.scriptId ?? null}
            versionId={payload.versionId ?? null}
            notes={payload.notes ?? null}
          />
        ) : (
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/30 p-10 text-sm text-neutral-400">
            Preview data not found in this session.
            <div className="mt-3 text-xs text-neutral-500">
              Open this preview from the Protect flow so ProofMark can load the preview payload.
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function ProtectPreviewPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-24">
          <div className="text-sm text-neutral-400">Loading preview...</div>
        </div>
      </main>
    }>
      <ProtectPreviewContent />
    </Suspense>
  );
}
