import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle sitemap.xml specifically
  if (pathname === '/sitemap.xml') {
    const response = await fetch(`${request.nextUrl.origin}/api/sitemap`);
    const xml = await response.text();
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  }

  // Handle root path redirect to /tr
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/tr', request.url));
  }

  // For all other routes, use the intl middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all paths except api, _next, and files with extensions
    '/((?!api|_next|.*\\..*).*))',
    // Also match /sitemap.xml and root path
    '/sitemap.xml',
    '/'
  ]
};
