import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function createServerClient() {
  const cookieStore = await cookies()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required. Check your .env.local file.");
  }

  if (!anon) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required. Check your .env.local file.");
  }

  return createSupabaseServerClient(
    url,
    anon,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Alias for backward compatibility
export async function createClient() {
  return createServerClient();
}

// Alias as requested
export async function supabaseServer() {
  return createServerClient();
}

export function supabaseServerService() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required. Check your .env.local file.");
  }

  if (!service) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required. Check your .env.local file.");
  }

  return createSupabaseClient(url, service, { auth: { persistSession: false } });
}

// Alias for backward compatibility
export async function createServiceClient() {
  return supabaseServerService();
}
