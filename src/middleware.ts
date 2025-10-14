import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('student_records_session');
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  const isApi = request.nextUrl.pathname.startsWith('/api');

  // Redirect to dashboard if logged in and trying to access login page
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to login if not logged in and trying to access protected routes
  if (isDashboard && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // For API routes, let the route handlers deal with authentication
  if (isApi) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

