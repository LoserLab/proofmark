export default function ErrorNotice(props: {
  title: string;
  body: string;
  recovery?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--stroke)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="text-sm font-medium text-[var(--text)]">{props.title}</div>
      <div className="mt-1 text-sm text-[var(--muted)]">{props.body}</div>
      {props.recovery ? (
        <div className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
          {props.recovery}
        </div>
      ) : null}
    </div>
  );
}
