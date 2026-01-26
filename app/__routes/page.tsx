import Link from "next/link";

// Dev-only route listing all pages
// Only accessible when NODE_ENV !== "production"

const publicPages = [
  { path: "/", name: "Homepage", description: "Landing page" },
  { path: "/how", name: "How It Works", description: "Product explanation" },
  { path: "/pricing", name: "Pricing", description: "Pricing information" },
  { path: "/terms", name: "Terms of Service", description: "Legal terms" },
  { path: "/privacy", name: "Privacy Policy", description: "Privacy policy" },
  { path: "/disclaimer", name: "Disclaimer", description: "Legal disclaimer" },
  { path: "/support", name: "Support", description: "Support and FAQ" },
  { path: "/sendproof", name: "SendProof", description: "SendProof information page" },
  { path: "/protect", name: "Protect a Draft", description: "Upload and protect workflow" },
  { path: "/protect/preview", name: "Protect Preview", description: "Preview protection details" },
  { path: "/share/create", name: "Create Share Link", description: "Create a share link" },
  { path: "/s/[token]", name: "Share View", description: "View shared draft (token-based)" },
];

const authPages = [
  { path: "/auth/login", name: "Login", description: "User login", access: "Public (redirects to /app when authenticated)" },
  { path: "/auth/signup", name: "Sign Up", description: "User registration", access: "Public (redirects to /app when authenticated)" },
  { path: "/auth/logout", name: "Logout", description: "User logout", access: "POST route (redirects to /)" },
];

const appPages = [
  { path: "/app", name: "Dashboard", description: "User dashboard with scripts list", access: "Requires authentication" },
  { path: "/app/settings", name: "Settings", description: "User settings and proof tools", access: "Requires authentication" },
  { path: "/app/scripts/[id]", name: "Script Detail", description: "View script details and versions", access: "Requires authentication + ownership" },
];

export default function RoutesPage() {
  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return (
      <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[var(--text)] mb-2">Not found</h1>
          <p className="text-sm text-[var(--muted)]">This page is not available in production.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">DraftLock Routes</h1>
          <p className="text-sm text-[var(--muted)]">
            Development-only route listing. This page is not accessible in production.
          </p>
        </div>

        <div className="space-y-8">
          {/* Public Pages */}
          <section>
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4">Public Pages</h2>
            <div className="bg-[var(--surface)] rounded-lg border border-[var(--stroke)] p-6">
              <ul className="space-y-3">
                {publicPages.map((page) => (
                  <li key={page.path} className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={page.path}
                          className="text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] underline"
                        >
                          {page.path}
                        </Link>
                      </div>
                      <div className="text-xs text-[var(--muted)] mt-1">{page.name}</div>
                      <div className="text-xs text-[var(--muted)] mt-0.5">{page.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Auth Pages */}
          <section>
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4">Auth Pages</h2>
            <div className="bg-[var(--surface)] rounded-lg border border-[var(--stroke)] p-6">
              <ul className="space-y-3">
                {authPages.map((page) => (
                  <li key={page.path} className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={page.path}
                          className="text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] underline"
                        >
                          {page.path}
                        </Link>
                      </div>
                      <div className="text-xs text-[var(--muted)] mt-1">{page.name}</div>
                      <div className="text-xs text-[var(--muted)] mt-0.5">{page.description}</div>
                      {page.access && (
                        <div className="text-xs text-[var(--warm)] mt-1">Access: {page.access}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* App Pages (Auth Required) */}
          <section>
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4">App Pages (Auth Required)</h2>
            <div className="bg-[var(--surface)] rounded-lg border border-[var(--stroke)] p-6">
              <ul className="space-y-3">
                {appPages.map((page) => (
                  <li key={page.path} className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={page.path}
                          className="text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] underline"
                        >
                          {page.path}
                        </Link>
                      </div>
                      <div className="text-xs text-[var(--muted)] mt-1">{page.name}</div>
                      <div className="text-xs text-[var(--muted)] mt-0.5">{page.description}</div>
                      {page.access && (
                        <div className="text-xs text-[var(--warm)] mt-1">Access: {page.access}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--stroke)]">
          <p className="text-xs text-[var(--muted)]">
            Note: Some pages may require authentication or have additional access requirements.
            Visiting protected pages without authentication will redirect to the homepage.
          </p>
        </div>
      </div>
    </main>
  );
}
