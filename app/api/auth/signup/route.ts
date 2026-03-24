import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firmName } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    // Sign up via Supabase Auth
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Signup succeeded but no user returned. Check your email to confirm.' },
        { status: 200 }
      )
    }

    // Insert tenant row into cpa_users using the service role
    // (bypasses RLS so we can write before the session is fully established)
    const serviceClient = await createServiceClient()
    const { error: profileError } = await serviceClient.from('cpa_users').insert({
      id: authData.user.id,   // tenant ID = Supabase auth UID
      email,
      firm_name: firmName || null,
      tier: 'starter',
    })

    if (profileError) {
      // Auth user was created but profile insert failed — clean up
      await serviceClient.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        {
          error: 'Failed to create firm profile. Please try again.',
          detail: profileError.message,
          code: profileError.code,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      tenantId: authData.user.id,
      emailConfirmationRequired: !authData.session,
    })
  } catch (err) {
    console.error('[signup]', err)
    return NextResponse.json({ error: 'Unexpected error during signup.' }, { status: 500 })
  }
}
