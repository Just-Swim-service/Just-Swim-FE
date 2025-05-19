import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get('authorization')?.value;

  // ✅ signin에서는 절대 redirect 안되도록 예외 처리
  if (pathname === '/signin' || pathname === '/qr-entry') {
    return NextResponse.next();
  }

  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/schedule', req.url));
  }

  if (!token && pathname.startsWith('/schedule')) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|privacy).*)'],
};
