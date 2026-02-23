import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.has('auth-token')

  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isAuthRoute = pathname === '/'

  if (isDashboardRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
}
