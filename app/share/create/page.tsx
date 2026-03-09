"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ErrorNotice from "@/components/ErrorNotice";
import { Errors } from "@/lib/copy/errors";

type ShareContext = {
  scriptId: string;
  versionId: string;
  title?: string | null;
  workType?: string | null;
};

function ShareCreateContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const [ctx, setCtx] = useState<ShareContext | null>(null);

  const [expiresInDays, setExpiresInDays] = useState<number>(0); // 0 = no expiration
  const [allowDownload, setAllowDownload] = useState<boolean>(true);

  const [status, setStatus] = useState<"idle" | "creating" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    // 1) Prefer sessionStorage (new flow)
    try {
      const raw = sessionStorage.getItem("dl_share_ctx");
      if (raw) {
        const parsed = JSON.parse(raw) as ShareContext;
        if (parsed?.scriptId && parsed?.versionId) {
          setCtx(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }

    // 2) Backwards compatibility: accept query params (old links)
    const scriptId = sp.get("scriptId");
    const versionId = sp.get("versionId");
    const title = sp.get("title");
    const workType = sp.get("workType");

    if (scriptId && versionId) {
      const payload: ShareContext = {
        scriptId,
        versionId,
        title,
        workType,
      };

      try {
        sessionStorage.setItem("dl_share_ctx", JSON.stringify(payload));
      } catch {
        // ignore
      }

      setCtx(payload);

      // Optional: clean the URL (remove query params) so it looks intentional
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", "/share/create");
      }
    }
  }, [sp]);

  async function createLink() {
    if (!ctx) return;
    setStatus("creating");
    setError(null);

    try {
      // Resolved endpoint: /api/scripts/[scriptId]/share (supports expiresInDays and allowDownload)
      const res = await fetch(`/api/scripts/${ctx.scriptId}/share`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          versionId: ctx.versionId,
          expiresInDays: expiresInDays > 0 ? expiresInDays : null,
          allowDownload,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const url =
        data.url ||
        data.shareUrl ||
        data.publicUrl ||
        (data.token ? `${window.location.origin}/s/${data.token}` : null);

      if (!url) throw new Error("Share URL not returned by server.");
      setShareUrl(url);
      setStatus("done");
    } catch (e: any) {
      setStatus("error");
      setError(Errors.share.failed.body);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/5 to-transparent" />

      <section className="relative max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-neutral-400">ProofMark</div>
            <h1 className="mt-2 text-2xl md:text-3xl font-semibold">Create share link</h1>
            <p className="mt-2 text-sm text-neutral-400 max-w-2xl">
              Generate a controlled share link for this version. Links are token-based and can be
              configured with optional limits.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="px-5 py-2 rounded-md border border-neutral-700 text-sm"
            >
              Back
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        {!ctx ? (
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/30 p-10 text-sm text-neutral-400">
            Share context not found in this session.
            <div className="mt-3 text-xs text-neutral-500">
              Open this page from the Protect flow so ProofMark can load the correct draft version.
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/25 p-8 md:p-10">
            <div className="grid md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-7">
                <div className="text-sm font-medium">Share settings</div>

                <div className="mt-5 space-y-5">
                  <div>
                    <label className="text-xs text-neutral-500">Expiration</label>
                    <select
                      value={String(expiresInDays)}
                      onChange={(e) => setExpiresInDays(Number(e.target.value))}
                      className="mt-2 w-full rounded-md border border-neutral-800 bg-neutral-950/40 px-4 py-3 text-sm outline-none focus:border-neutral-600"
                    >
                      <option value="0">No expiration</option>
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-950/30 p-4">
                    <div>
                      <div className="text-sm text-neutral-200 font-medium">Allow download</div>
                      <div className="mt-1 text-xs text-neutral-500">
                        If off, viewers can read the shared view but not download files.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAllowDownload((v) => !v)}
                      className={[
                        "px-4 py-2 rounded-md text-sm border",
                        allowDownload
                          ? "border-neutral-600 text-neutral-200"
                          : "border-neutral-800 text-neutral-500",
                      ].join(" ")}
                    >
                      {allowDownload ? "On" : "Off"}
                    </button>
                  </div>

                  {status !== "done" ? (
                    <button
                      onClick={createLink}
                      disabled={status === "creating"}
                      className={[
                        "px-6 py-3 rounded-md text-sm font-medium",
                        status === "creating"
                          ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                          : "bg-white text-black",
                      ].join(" ")}
                    >
                      {status === "creating" ? "Creating" : "Create share link"}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-neutral-200">Share link created</div>

                      {shareUrl ? (
                        <div className="rounded-xl border border-neutral-800 bg-neutral-950/30 p-4">
                          <div className="text-xs text-neutral-500">Link</div>
                          <div className="mt-2 text-sm text-neutral-200 break-all">{shareUrl}</div>

                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              onClick={async () => {
                                await navigator.clipboard.writeText(shareUrl);
                              }}
                              className="px-5 py-2 rounded-md bg-white text-black text-sm font-medium"
                            >
                              Copy link
                            </button>

                            <a
                              href={shareUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-5 py-2 rounded-md border border-neutral-700 text-sm"
                            >
                              Open share view
                            </a>
                          </div>
                        </div>
                      ) : null}

                      <div className="text-xs text-neutral-500 leading-relaxed">
                        Share links are token-based. Treat them like access keys.
                      </div>

                      {shareUrl && (
                        <div className="mt-6 pt-6 border-t border-neutral-800 bg-neutral-950/20 rounded-lg p-4">
                          <div className="text-sm font-medium text-neutral-200 mb-2">
                            Want proof you shared this version?
                          </div>
                          <p className="text-xs text-neutral-400 leading-relaxed mb-2">
                            SendProof (Preview) will record when and how this link was delivered, creating a durable record for your files.
                          </p>
                          <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                            Records the action of sharing. Does not track viewers or responses.
                          </p>
                          <a
                            href="/how#sendproof"
                            className="text-xs text-neutral-300 hover:text-neutral-100 underline transition-colors"
                          >
                            Learn about SendProof
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {error ? (
                    <ErrorNotice
                      title={Errors.share.failed.title}
                      body={error}
                      recovery={Errors.share.failed.recovery}
                    />
                  ) : null}
                </div>
              </div>

              <div className="md:col-span-5 space-y-6">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950/20 p-6">
                  <div className="text-sm font-medium">Sharing</div>
                  <div className="mt-2 text-sm text-neutral-400 leading-relaxed">
                    Title: <span className="text-neutral-200">{ctx.title || "Untitled"}</span>
                    <br />
                    Type: <span className="text-neutral-200">{ctx.workType || "Work"}</span>
                    <br />
                    Script: <span className="text-neutral-200 break-all">{ctx.scriptId}</span>
                    <br />
                    Version: <span className="text-neutral-200 break-all">{ctx.versionId}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-950/20 p-6">
                  <div className="text-sm font-medium">Watermark</div>
                  <div className="mt-2 text-sm text-neutral-400 leading-relaxed">
                    Shared views should display a subtle watermark and access notice to discourage
                    misuse without sounding accusatory.
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-950/20 p-6">
                  <div className="text-sm font-medium">Note</div>
                  <div className="mt-2 text-sm text-neutral-400 leading-relaxed">
                    ProofMark is not a law firm and does not provide legal advice.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function ShareCreatePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-24">
          <div className="text-sm text-neutral-400">Loading...</div>
        </div>
      </main>
    }>
      <ShareCreateContent />
    </Suspense>
  );
}
