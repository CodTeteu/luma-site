import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for handling dynamic slug-based routing
 * Rewrites /[slug] to /preview/template1?slug=[slug]
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Paths that should NOT be rewritten (system routes)
    const protectedPaths = [
        '/dashboard',
        '/editor',
        '/login',
        '/preview',
        '/api',
        '/_next',
        '/favicon.ico',
        '/images',
        '/fonts',
    ];

    // Check if path starts with any protected path
    const isProtectedPath = protectedPaths.some(path =>
        pathname === path || pathname.startsWith(`${path}/`)
    );

    // Skip static files and protected paths
    if (isProtectedPath || pathname.includes('.')) {
        return NextResponse.next();
    }

    // Skip root path
    if (pathname === '/') {
        return NextResponse.next();
    }

    // Extract slug from pathname (remove leading slash)
    const slug = pathname.slice(1);

    // Rewrite to preview page with slug parameter
    const url = request.nextUrl.clone();
    url.pathname = '/preview/template1';
    url.searchParams.set('slug', slug);

    return NextResponse.rewrite(url);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
