import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseServerService } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    // Verify user is authenticated
    const authClient = await createClient()
    const {
      data: { user },
    } = await authClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await req.json()
    const { username } = body

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    // Validate format server-side
    const usernameRegex = /^[a-zA-Z0-9_]{3,24}$/
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: 'Username must be 3–24 characters. Letters, numbers, and underscores only.' },
        { status: 400 }
      )
    }

    // Use service client for database operations
    const supabase = supabaseServerService()

    // Check if user_profiles table exists, if not create it
    // First, try to upsert the profile
    const { error: upsertError } = await supabase
      .from('user_profiles')
      .upsert(
        {
          user_id: user.id,
          username,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        }
      )

    if (upsertError) {
      // If table doesn't exist, we'll get an error
      // Check if it's a "relation does not exist" error
      if (upsertError.message.includes('relation') && upsertError.message.includes('does not exist')) {
        // Table doesn't exist - we can't create it from here, but we can return a helpful error
        // In production, you'd want to run a migration first
        return NextResponse.json(
          { error: 'User profiles table not found. Please run database migrations.' },
          { status: 500 }
        )
      }

      // Check for uniqueness constraint violation
      if (upsertError.code === '23505' || upsertError.message.includes('unique')) {
        return NextResponse.json(
          { error: 'That username is not available.' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: upsertError.message || 'Failed to update username' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
