"use client";

export default function SuccessPanel(props: {
  title: string;
  subtitle?: string | React.ReactNode;
  primary?: React.ReactNode;
  secondary?: React.ReactNode;
  checklistTitle?: string;
  checklist?: string[];
  footnote?: string | React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[var(--stroke)] bg-[var(--surface)] p-8 md:p-10 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--warm)]">
            Success
          </div>
          <div className="mt-2 text-2xl font-semibold text-[var(--text)]">
            {props.title}
          </div>
          {props.subtitle ? (
            <div className="mt-2 text-sm text-[var(--muted)] leading-relaxed max-w-2xl">
              {props.subtitle}
            </div>
          ) : null}
        </div>

        <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-[var(--stroke)] bg-[var(--bg)] text-[var(--accent)]">
          ✓
        </div>
      </div>

      {(props.primary || props.secondary) ? (
        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-3">{props.primary}</div>
          <div className="flex flex-wrap gap-3">{props.secondary}</div>
        </div>
      ) : null}

      {props.checklist?.length ? (
        <div className="mt-10 rounded-lg border border-[var(--stroke)] bg-[var(--bg)] p-6">
          <div className="text-sm font-medium text-[var(--text)]">
            {props.checklistTitle || "What to do next"}
          </div>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {props.checklist.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[var(--muted)]">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {props.footnote ? (
        <div className="mt-8 text-xs text-[var(--muted)] leading-relaxed max-w-3xl">
          {props.footnote}
        </div>
      ) : null}
    </div>
  );
}
