import { getTokenInCookies } from '@utils';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const hasToken = await getTokenInCookies();

  if (hasToken && (pathname === '/signin' || pathname === '/')) {
    return NextResponse.redirect(new URL('/schedule', req.url));
  }
  if (!hasToken) {
    const pathname = req.nextUrl.pathname;
    if (pathname === '/schedule') {
      const token = req.nextUrl.searchParams.get('token');
      if (token) {
        const res = NextResponse.next();
        res.cookies.set('token', token);
        return res;
      }
      return NextResponse.next();
    } else if (pathname !== '/signin') {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|signup).*)'],
};
