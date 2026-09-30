import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/author/:path*', '/profile/:path*', '/lists/:path*'],
}

export default withAuth(function middleware(req) {
  return NextResponse.next()
})
