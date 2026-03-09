"use client";

import { useEffect, useMemo, useState } from "react";
import ErrorNotice from "@/components/ErrorNotice";
import { Errors } from "@/lib/copy/errors";

type ShareStatus = "active" | "expired" | "revoked" | "not_found";

type ShareResponse = {
  ok: boolean;
  token?: string;
  status?: ShareStatus;
  allowDownload?: boolean;

  title?: string | null;
  workType?: string | null;

  createdAt?: string | null;
  expiresAt?: string | null;

  views?: number | null;
  firstViewedAt?: string | null;
  viewerId?: string | null; // Viewer ID for watermark

  evidence?: {
    url?: string | null; // signed URL or public URL to PDF
    filename?: string | null;
    sizeBytes?: number | null;
  } | null;

  message?: string | null;
};

function bytesToSize(bytes: number) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`;
}

function fmtDate(s?: string | null) {
  if (!s) return "N/A";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleString();
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-950/30 px-3 py-1 text-xs text-neutral-300">
      {children}
    </span>
  );
}

function Panel({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-900/25 p-6 md:p-8">
      <div className="text-sm font-medium text-neutral-100">{title}</div>
      {desc ? <div className="mt-2 text-sm text-neutral-400">{desc}</div> : null}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function StatusScreen({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/5 to-transparent" />
      <section className="relative max-w-3xl mx-auto px-6 pt-24 pb-24">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/25 p-10">
          <div className="text-xs uppercase tracking-wide text-neutral-500">ProofMark</div>
          <h1 className="mt-3 text-2xl font-semibold">{title}</h1>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">{message}</p>
          <div className="mt-8 flex gap-3">
            <a
              href="/"
              className="px-5 py-2 rounded-md border border-neutral-700 text-sm"
            >
              Back to ProofMark
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ShareViewPage({ params }: { params: { token: string } }) {
  const token = params.token;

  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [data, setData] = useState<ShareResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState("loading");
      try {
        // TODO: If your route differs, change only this URL:
        const res = await fetch(`/api/share/${encodeURIComponent(token)}`, {
          method: "GET",
          cache: "no-store",
        });

        let json: ShareResponse | null = null;
        try {
          json = await res.json();
        } catch {
          json = { ok: false, message: Errors.general.loadFailed.body };
        }

        if (cancelled) return;

        if (!res.ok) {
          setData(json ?? { ok: false, message: Errors.general.loadFailed.body });
          setState("error");
          return;
        }

        setData(json);
        setState("ready");
      } catch (e: any) {
        if (cancelled) return;
        setData({ ok: false, message: Errors.general.network.body });
        setState("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const status = data?.status;

  const allowDownload = !!data?.allowDownload;
  const title = data?.title || "Untitled draft";
  const workType = data?.workType || "Work";
  const evidenceUrl = data?.evidence?.url || null;
  const filename = data?.evidence?.filename || "Evidence Pack";
  const sizeBytes = data?.evidence?.sizeBytes || 0;
  const viewerId = data?.viewerId || null;

  const viewModeLabel = useMemo(() => {
    if (!data?.ok) return "N/A";
    if (allowDownload) return "View + download";
    return "View only";
  }, [data?.ok, allowDownload]);

  if (state === "loading") {
    return (
      <StatusScreen
        title="Loading shared view"
        message="Preparing the shared evidence view."
      />
    );
  }

  if (state === "error") {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/5 to-transparent" />
        <section className="relative max-w-3xl mx-auto px-6 pt-24 pb-24">
          <ErrorNotice
            title={Errors.share.loadFailed.title}
            body={data?.message || Errors.share.loadFailed.body}
            recovery={Errors.share.loadFailed.recovery}
          />
          <div className="mt-8 flex gap-3">
            <a
              href="/"
              className="px-5 py-2 rounded-md border border-neutral-700 text-sm"
            >
              Back to ProofMark
            </a>
          </div>
        </section>
      </main>
    );
  }

  // If API says not ok, treat as not found
  if (!data?.ok || status === "not_found") {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/5 to-transparent" />
        <section className="relative max-w-3xl mx-auto px-6 pt-24 pb-24">
          <ErrorNotice
            title={Errors.share.unavailable.title}
            body={Errors.share.unavailable.body}
            recovery={Errors.share.unavailable.recovery}
          />
          <div className="mt-8 flex gap-3">
            <a
              href="/"
              className="px-5 py-2 rounded-md border border-neutral-700 text-sm"
            >
              Back to ProofMark
            </a>
          </div>
        </section>
      </main>
    );
  }

  if (status === "expired") {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/5 to-transparent" />
        <section className="relative max-w-3xl mx-auto px-6 pt-24 pb-24">
          <ErrorNotice
            title={Errors.share.expired.title}
            body={Errors.share.expired.body}
            recovery={Errors.share.expired.recovery}
          />
          <div className="mt-8 flex gap-3">
            <a
              href="/"
              className="px-5 py-2 rounded-md border border-neutral-700 text-sm"
            >
              Back to ProofMark
            </a>
          </div>
        </section>
      </main>
    );
  }

  if (status === "revoked") {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/5 to-transparent" />
        <section className="relative max-w-3xl mx-auto px-6 pt-24 pb-24">
          <ErrorNotice
            title={Errors.share.revoked.title}
            body={Errors.share.revoked.body}
            recovery={Errors.share.revoked.recovery}
          />
          <div className="mt-8 flex gap-3">
            <a
              href="/"
              className="px-5 py-2 rounded-md border border-neutral-700 text-sm"
            >
              Back to ProofMark
            </a>
          </div>
        </section>
      </main>
    );
  }

  // ACTIVE
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/5 to-transparent" />

      {/* Watermark overlay - subtle opacity (0.04-0.08) */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.06]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[10px] md:text-xs font-medium tracking-[0.35em] uppercase text-white select-none rotate-[-24deg]">
            {viewerId
              ? `ProofMark • Shared View • Viewer ID: ${viewerId} • ProofMark • Shared View • Viewer ID: ${viewerId}`
              : "ProofMark • Shared View • ProofMark • Shared View • ProofMark • Shared View"}
          </div>
        </div>
      </div>

      <section className="relative max-w-6xl mx-auto px-6 pt-14 pb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-neutral-400">ProofMark</div>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold leading-tight">
              {title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill>{workType}</Pill>
              <Pill>{viewModeLabel}</Pill>
              <Pill>Token-based access</Pill>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {allowDownload ? (
              <a
                href={evidenceUrl || "#"}
                className={[
                  "px-5 py-2 rounded-md text-sm font-medium",
                  evidenceUrl ? "bg-white text-black" : "bg-neutral-800 text-neutral-500 cursor-not-allowed",
                ].join(" ")}
                aria-disabled={!evidenceUrl}
              >
                Download
              </a>
            ) : (
              <div className="px-5 py-2 rounded-md border border-neutral-700 text-sm text-neutral-300">
                View only
              </div>
            )}
            <a
              href="/"
              className="px-5 py-2 rounded-md border border-neutral-700 text-sm"
            >
              ProofMark
            </a>
          </div>
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main doc surface */}
          <div className="lg:col-span-8 space-y-6">
            <Panel
              title="Access notice"
            >
              <div className="text-sm text-neutral-300 leading-relaxed space-y-3">
                <div>
                  This page is a shared view provided by the owner of the record.
                </div>
                <div>
                  Access is controlled by a token-based link. Treat it like an access key.
                </div>
                <div>
                  {allowDownload
                    ? "Download is enabled for this link."
                    : "Download is disabled for this link."}
                </div>
                {viewerId && (
                  <div className="mt-4 pt-4 border-t border-neutral-800">
                    <div className="text-sm font-medium text-neutral-200">
                      Viewer ID: {viewerId}
                    </div>
                    <div className="text-xs text-neutral-500 leading-relaxed mt-1">
                      Included to help identify the source of this shared copy.
                    </div>
                  </div>
                )}
                <div className="text-xs text-neutral-500 leading-relaxed mt-4">
                  ProofMark is not a law firm and does not provide legal advice.
                </div>
              </div>
            </Panel>

            <Panel
              title="Evidence pack"
              desc="Neutral metadata and proof artifacts associated with this version."
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-neutral-800 bg-neutral-950/30 p-4">
                  <div className="text-xs text-neutral-500">Filename</div>
                  <div className="mt-1 text-sm text-neutral-200 font-medium break-words">
                    {filename}
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950/30 p-4">
                  <div className="text-xs text-neutral-500">Size</div>
                  <div className="mt-1 text-sm text-neutral-200 font-medium">
                    {sizeBytes ? bytesToSize(sizeBytes) : "N/A"}
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950/30 p-4">
                  <div className="text-xs text-neutral-500">Created</div>
                  <div className="mt-1 text-sm text-neutral-200 font-medium">
                    {fmtDate(data.createdAt)}
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950/30 p-4">
                  <div className="text-xs text-neutral-500">Expires</div>
                  <div className="mt-1 text-sm text-neutral-200 font-medium">
                    {data.expiresAt ? fmtDate(data.expiresAt) : "No expiration"}
                  </div>
                </div>
              </div>

              {allowDownload ? (
                <div className="mt-6">
                  <a
                    href={evidenceUrl || "#"}
                    className={[
                      "inline-block px-6 py-3 rounded-md text-sm font-medium",
                      evidenceUrl ? "bg-white text-black" : "bg-neutral-800 text-neutral-500 cursor-not-allowed",
                    ].join(" ")}
                    aria-disabled={!evidenceUrl}
                  >
                    Download evidence pack
                  </a>
                  <div className="mt-3 text-xs text-neutral-500">
                    If you were sent this link, keep the evidence pack with your project records.
                  </div>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  <div className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-950/30 px-4 py-2 text-sm text-neutral-300">
                    View only
                  </div>
                  <div className="text-sm text-neutral-400">
                    The owner disabled downloads for this link.
                  </div>
                </div>
              )}
            </Panel>
          </div>

          {/* Side rail */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6">
              <div className="text-sm font-medium">Activity</div>
              <div className="mt-3 space-y-3 text-sm text-neutral-400">
                <div className="flex items-center justify-between gap-4">
                  <span>Views</span>
                  <span className="text-neutral-200">{data.views ?? 0}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>First viewed</span>
                  <span className="text-neutral-200">{fmtDate(data.firstViewedAt)}</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-neutral-500 leading-relaxed">
                View counts are recorded as simple access signals. Personal identity is not required.
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6">
              <div className="text-sm font-medium">Watermark</div>
              <div className="mt-2 text-sm text-neutral-400 leading-relaxed">
                This view includes a subtle watermark and access notice to discourage misuse without
                implying wrongdoing.
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6">
              <div className="text-sm font-medium">Need a new link?</div>
              <div className="mt-2 text-sm text-neutral-400 leading-relaxed">
                If this link expires or loses access, request a fresh share link from the sender.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
