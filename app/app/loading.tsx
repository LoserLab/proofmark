export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Title skeleton */}
        <div className="h-9 w-44 bg-[var(--structure)]/10 rounded animate-pulse mb-8" />

        {/* Action button skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-12 w-40 bg-[var(--structure)]/10 rounded-md animate-pulse" />
        </div>

        {/* Subtitle skeleton */}
        <div className="h-3 w-72 bg-[var(--structure)]/5 rounded animate-pulse mb-6" />

        {/* Script card skeletons */}
        <div className="grid grid-cols-1 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-[var(--white)] rounded-lg border p-6 shadow-sm"
              style={{
                borderColor: 'rgba(90, 120, 99, 0.25)',
                animation: `fadeIn 0.4s ease-out ${i * 120}ms both`,
              }}
            >
              <div
                className="h-6 w-64 bg-[var(--structure)]/10 rounded animate-pulse mb-3"
                style={{ animationDelay: `${i * 100}ms` }}
              />
              <div
                className="h-4 w-36 bg-[var(--structure)]/5 rounded animate-pulse"
                style={{ animationDelay: `${i * 100 + 50}ms` }}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
