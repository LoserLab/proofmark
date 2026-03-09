export default function ScriptDetailLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div
          className="bg-[var(--white)] rounded-lg border p-8 shadow-sm"
          style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}
        >
          {/* Header area */}
          <div className="mb-6">
            <div className="h-9 w-72 bg-[var(--structure)]/10 rounded animate-pulse mb-3" />
            <div className="h-4 w-24 bg-[var(--structure)]/5 rounded animate-pulse mb-2" />
            <div className="h-3 w-36 bg-[var(--structure)]/5 rounded animate-pulse" />
          </div>

          {/* Action button skeleton */}
          <div className="mb-12">
            <div className="h-12 w-48 bg-[var(--structure)]/10 rounded-md animate-pulse" />
          </div>

          {/* Versions section */}
          <div className="mb-12">
            <div className="h-6 w-28 bg-[var(--structure)]/10 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4"
                  style={{
                    borderColor: 'rgba(90, 120, 99, 0.25)',
                    animation: `fadeIn 0.4s ease-out ${i * 120}ms both`,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div
                        className="h-5 w-40 bg-[var(--structure)]/10 rounded animate-pulse mb-2"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                      <div
                        className="h-4 w-28 bg-[var(--structure)]/5 rounded animate-pulse"
                        style={{ animationDelay: `${i * 100 + 50}ms` }}
                      />
                    </div>
                    <div
                      className="h-4 w-32 bg-[var(--structure)]/5 rounded animate-pulse"
                      style={{ animationDelay: `${i * 100 + 80}ms` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sharing section */}
          <div className="mb-12">
            <div className="h-6 w-24 bg-[var(--structure)]/10 rounded animate-pulse mb-4" />
            <div className="h-4 w-36 bg-[var(--structure)]/5 rounded animate-pulse" />
          </div>

          {/* Record history section */}
          <div className="mb-8">
            <div className="h-6 w-36 bg-[var(--structure)]/10 rounded animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  );
}
