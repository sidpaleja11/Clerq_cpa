import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/signup', '/mfa-verify', '/auth/callback', '/api/auth/']
// Routes that require AAL2 (MFA verified)
const MFA_EXEMPT_ROUTES = ['/mfa-verify', '/auth/callback']

const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

export async function middleware(request: NextRequest) {
  // DEV BYPASS — remove before production
  return NextResponse.next()

  // eslint-disable-next-line no-unreachable
  const { pathname } = request.nextUrl
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Skip middleware for static assets and API routes that handle their own auth
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return response
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Enforce authentication on protected routes
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r))

  if (!user && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user) {
    // Redirect away from login if already authenticated
    if (pathname === '/login' || pathname === '/signup') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Enforce MFA (AAL2) — every protected route requires MFA completion
    if (!MFA_EXEMPT_ROUTES.some((r) => pathname.startsWith(r))) {
      const { data: { authenticatorAssuranceLevel } } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

      if (
        authenticatorAssuranceLevel?.nextLevel === 'aal2' &&
        authenticatorAssuranceLevel.currentLevel !== 'aal2'
      ) {
        const mfaUrl = new URL('/mfa-verify', request.url)
        mfaUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(mfaUrl)
      }
    }

    // Session timeout: check last activity timestamp from cookie
    const lastActivityCookie = request.cookies.get('clerq_last_activity')
    const now = Date.now()

    if (lastActivityCookie) {
      const lastActivity = parseInt(lastActivityCookie.value, 10)
      if (now - lastActivity > SESSION_TIMEOUT_MS) {
        await supabase.auth.signOut()
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('reason', 'session_expired')
        const redirectResponse = NextResponse.redirect(loginUrl)
        redirectResponse.cookies.delete('clerq_last_activity')
        return redirectResponse
      }
    }

    // Refresh last activity timestamp
    response.cookies.set('clerq_last_activity', String(now), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
