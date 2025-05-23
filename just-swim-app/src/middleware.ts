import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ✅ signin에서는 절대 redirect 안되도록 예외 처리
  if (pathname === '/signin' || pathname === '/qr-entry') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|privacy).*)'],
};
