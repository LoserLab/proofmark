"use client";

import { useMemo } from "react";

function Block({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[var(--stroke)] bg-[var(--bg)] p-4">
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className="mt-1 text-sm text-[var(--text)] font-medium break-words">
        {value}
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[var(--stroke)] bg-white p-6 shadow-sm">
      <div className="flex items-baseline justify-between gap-4">
        <div className="text-sm font-medium text-[var(--text)]">{title}</div>
        {subtitle ? (
          <div className="text-xs text-[var(--muted)]">{subtitle}</div>
        ) : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function fakeHash(seed: string) {
  // Deterministic-looking placeholder hash for preview only.
  // Do NOT use for security. Real hash should come from server output.
  const base = (seed || "draftlock").replace(/\s+/g, "").toLowerCase();
  const pad = (base + "evidencepack").repeat(8).slice(0, 64);
  return pad.replace(/[^a-f0-9]/g, "a").padEnd(64, "a");
}

export default function EvidencePackPreview(props: {
  title: string;
  workType: string;
  filename?: string | null;
  fileSizeLabel?: string | null;
  scriptId?: string | null;
  versionId?: string | null;
  notes?: string | null;
}) {
  const generatedOn = useMemo(() => new Date(), []);
  const previewHash = useMemo(
    () => fakeHash(`${props.title}-${props.filename}-${props.versionId}`),
    [props.title, props.filename, props.versionId]
  );

  const evidenceId = useMemo(() => {
    const sid = props.scriptId ? props.scriptId.slice(0, 8) : "pending";
    const vid = props.versionId ? props.versionId.slice(0, 8) : "pending";
    return `DL-${sid}-${vid}`.toUpperCase();
  }, [props.scriptId, props.versionId]);

  return (
    <div className="rounded-lg border border-[var(--stroke)] bg-white p-6 md:p-8 shadow-sm">
      {/* "Print-like" header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--muted)]">
            Evidence Pack Preview
          </div>
          <div className="mt-2 text-2xl font-semibold leading-tight text-[var(--text)]">
            {props.title || "Untitled draft"}
          </div>
          <div className="mt-2 text-sm text-[var(--muted)]">
            {props.workType || "Work"} • DraftLock Evidence Record
          </div>
        </div>

        <div className="text-xs text-[var(--muted)]">
          Generated on{" "}
          <span className="text-[var(--text)]">
            {generatedOn.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <Section title="Record summary" subtitle="Neutral metadata">
            <div className="grid sm:grid-cols-2 gap-3">
              <Block label="Evidence ID" value={evidenceId} />
              <Block label="Work type" value={props.workType || "—"} />
              <Block label="Filename" value={props.filename || "—"} />
              <Block label="File size" value={props.fileSizeLabel || "—"} />
              <Block
                label="Script record"
                value={props.scriptId ? props.scriptId : "Assigned at upload"}
              />
              <Block
                label="Version record"
                value={props.versionId ? props.versionId : "Assigned at commit"}
              />
            </div>
          </Section>

          <Section title="File fingerprint" subtitle="Cryptographic checksum">
            <div className="rounded-lg border border-[var(--stroke)] bg-[var(--bg)] p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs text-[var(--muted)]">Algorithm</div>
                <div className="text-xs text-[var(--text)]">SHA-256</div>
              </div>
              <div className="mt-3 font-mono text-xs text-[var(--text)] break-all leading-relaxed">
                {previewHash}
              </div>
              <div className="mt-3 text-xs text-[var(--muted)] leading-relaxed">
                This preview shows a placeholder checksum. The final evidence pack
                will contain the checksum computed for the uploaded file.
              </div>
            </div>
          </Section>

          <Section title="Author notes" subtitle="Optional">
            <div className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-wrap">
              {props.notes?.trim()
                ? props.notes.trim()
                : "No notes provided for this record."}
            </div>
          </Section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Section title="Version lineage" subtitle="Traceable history">
            <div className="rounded-lg border border-[var(--stroke)] bg-[var(--bg)] p-4">
              <div className="text-xs text-[var(--muted)]">
                This record captures the state of the work at the time of upload and commit.
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-[var(--stroke)] bg-white p-3">
                  <div className="text-xs text-[var(--muted)]">Milestone</div>
                  <div className="mt-1 text-sm text-[var(--text)] font-medium">
                    Protected version
                  </div>
                  <div className="mt-1 text-xs text-[var(--muted)]">
                    Timestamp recorded • Version linked to script record
                  </div>
                </div>

                <div className="rounded-lg border border-[var(--stroke)] bg-white p-3">
                  <div className="text-xs text-[var(--muted)]">Lineage</div>
                  <div className="mt-1 text-sm text-[var(--text)] font-medium">
                    Previous versions
                  </div>
                  <div className="mt-1 text-xs text-[var(--muted)]">
                    Shown in the final pack if earlier versions exist
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Sharing and access log" subtitle="If links are created">
            <div className="rounded-lg border border-[var(--stroke)] bg-[var(--bg)] p-4">
              <div className="text-xs text-[var(--muted)] leading-relaxed">
                If you generate share links, the final evidence pack can include a simple
                access summary (token created, first view time, view count). No personal data
                is required for viewing unless you enable it.
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <Block label="Share token" value="Not created" />
                <Block label="Views" value="—" />
                <Block label="First viewed" value="—" />
                <Block label="Expires" value="—" />
              </div>
            </div>
          </Section>

          <Section title="Registration support notes" subtitle="Guidance, not advice">
            <div className="text-xs text-[var(--muted)] leading-relaxed space-y-2">
              <div>
                DraftLock can organize information that may help with U.S. copyright registration,
                such as title, dates, and deposit copy references.
              </div>
              <div>
                DraftLock is not a law firm and does not provide legal advice.
              </div>
            </div>
          </Section>
        </div>
      </div>

      <div className="mt-8 text-xs text-[var(--muted)] leading-relaxed">
        Preview only. The final evidence pack will reflect the stored metadata and computed file checksum.
      </div>
    </div>
  );
}
