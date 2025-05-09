import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get('authorization')?.value;

  if (token && (pathname === '/signin' || pathname === '/')) {
    return NextResponse.redirect(new URL('/schedule', req.url));
  }

  if (!token && pathname.startsWith('/schedule')) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|signup).*)'],
};
