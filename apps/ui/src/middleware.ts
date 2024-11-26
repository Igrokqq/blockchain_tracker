import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const isAuthenticated = (req: NextRequest) => {
  const token = req.cookies.get('access_token');
  return token ? true : false;
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!isAuthenticated(req) && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuthenticated(req) && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
