/**
 * Application configuration from environment variables
 */

export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
  storage: {
    bucket: process.env.STORAGE_BUCKET || 'draftlock',
    publicBaseUrl: process.env.STORAGE_PUBLIC_BASE_URL,
  },
} as const

// Validate required environment variables
if (typeof window === 'undefined') {
  // Server-side validation
  if (!config.supabase.url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
  }
  if (!config.supabase.anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
  }
  if (!config.supabase.serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required')
  }
}
