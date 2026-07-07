// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = [
  '/dashboard',
  '/Dashboard',
  '/settings',
  "/accountDeatils",
  "/market",
]

const authPaths = [
  '/signIn',
  '/signUp',
  '/about',
  '/demos',
  "/membership",
]

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const path = request.nextUrl.pathname

  const isProtectedPath = protectedPaths.some(pp => path.startsWith(pp))
  const isAuthPath = authPaths.some(ap => path.startsWith(ap))

  // If trying to access protected route without token
  if (isProtectedPath && !token) {
    const response = NextResponse.redirect(new URL('/signIn', request.url))
    // Don't delete token here as it might be valid in other tabs
    return response
  }

  // If trying to access auth routes with token
  if (isAuthPath && token) {
    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    // Add token to response to ensure it persists
    response.cookies.set('token', token.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
    return response
  }

  return NextResponse.next()
}