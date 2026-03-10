import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { rateLimit } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
  // Rate limit API routes (30 requests per minute per IP)
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { limited } = rateLimit(`api:${ip}`, { maxRequests: 30, windowMs: 60_000 });

    if (limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Skip Supabase session refresh for v1 API routes (they use API key auth)
  if (request.nextUrl.pathname.startsWith("/api/v1/")) {
    return response;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return response;
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh session if expired - this will update cookies
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

// ============================================================================
// AUTH VERIFICATION CHECKLIST
// ============================================================================
// After signing in, verify:
// 1. Visiting /app should stay on /app (no redirect loop)
// 2. Application > Cookies should show Supabase auth cookies for localhost
//    (Look for cookies like: sb-<project>-auth-token, etc.)
// 3. Hard refresh (Cmd+Shift+R) on /app should remain authenticated
// 4. /auth/login and /auth/signup should NOT be blocked by auth guard
// ============================================================================
