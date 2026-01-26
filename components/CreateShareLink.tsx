"use client";

import { useMemo, useState } from "react";
import { messages } from "@/lib/messages";

type Props = {
  userId: string;
  scriptId: string;   // draft id
  versionId: string;  // specific version to share
  origin?: string;    // optional override, defaults to window.location.origin
};

export default function CreateShareLink({ userId, scriptId, versionId, origin }: Props) {
  const [viewerLabel, setViewerLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const base = useMemo(() => {
    if (origin) return origin;
    if (typeof window !== "undefined") return window.location.origin;
    return "";
  }, [origin]);

  async function onCreate() {
    setError(null);
    setCopied(false);
    setLoading(true);

    try {
      const res = await fetch("/api/share/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          scriptId,
          versionId,
          viewerLabel: viewerLabel.trim() || null
        })
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || messages.share.failed);
        setLoading(false);
        return;
      }

      const url = `${base}${json.shareUrl}`;
      setShareUrl(url);
      setLoading(false);
    } catch {
      setError(messages.general.network);
      setLoading(false);
    }
  }

  async function onCopy() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError(messages.general.unexpected);
    }
  }

  return (
    <div className="border rounded p-4 space-y-3">
      <div>
        <div className="text-sm font-medium">Create share link</div>
        <div className="text-xs opacity-70">
          Generates a private link that serves a watermarked view copy.
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs opacity-70">Viewer label (optional)</label>
        <input
          value={viewerLabel}
          onChange={(e) => setViewerLabel(e.target.value)}
          placeholder="Agent, Producer, Contest, Name"
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onCreate}
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white text-sm disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create link"}
        </button>

        {shareUrl && (
          <button
            onClick={onCopy}
            className="px-4 py-2 rounded border text-sm"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {shareUrl && (
        <div className="space-y-1">
          <div className="text-xs opacity-70">Share URL</div>
          <div className="text-sm break-all border rounded px-3 py-2 bg-white">
            {shareUrl}
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
    </div>
  );
}
