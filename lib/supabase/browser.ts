import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";

export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required. Check your .env.local file.");
  }

  if (!anon) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required. Check your .env.local file.");
  }

  return createSupabaseBrowserClient(url, anon);
}
