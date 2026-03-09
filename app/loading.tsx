export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center gap-6">
      {/* Spinner */}
      <div
        className="w-8 h-8 rounded-full border-2 border-[var(--structure)]/20 border-t-[var(--structure)]"
        style={{
          animation: 'spin 0.8s linear infinite',
        }}
      />

      {/* Brand text */}
      <p
        className="text-sm font-medium tracking-widest uppercase text-[var(--structure)]"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        ProofMark
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
