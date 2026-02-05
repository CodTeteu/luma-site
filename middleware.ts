import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// ============================================
// Hostname Configuration
// ============================================

const PRODUCTION_DOMAIN = 'lumaconvites.com.br';
const APP_SUBDOMAIN = 'app';

/**
 * Check if request is for the app subdomain
 */
function isAppSubdomain(hostname: string): boolean {
    // Production: app.lumaconvites.com.br
    if (hostname === `${APP_SUBDOMAIN}.${PRODUCTION_DOMAIN}`) {
        return true;
    }
    // Development: localhost with port or app.localhost
    if (hostname.startsWith('app.localhost') || hostname.startsWith('app.127.0.0.1')) {
        return true;
    }
    // Query param override for local testing: ?app=1
    return false;
}

/**
 * Check if path is an app route (dashboard, login for app context)
 */
function isAppRoute(pathname: string): boolean {
    return pathname.startsWith('/dashboard') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/auth');
}

/**
 * Check if path is a marketing route
 */
function isMarketingRoute(pathname: string): boolean {
    const marketingPaths = [
        '/',
        '/casamento',
        '/formatura',
        '/templates',
        '/precos',
        '/concierge',
        '/termos-de-uso',
        '/termos',
        '/privacidade',
        '/politica-de-privacidade',
        '/politica-de-cookies',
    ];
    return marketingPaths.includes(pathname);
}

/**
 * Check if path is a static/public resource
 */
function isStaticResource(pathname: string): boolean {
    return pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/images') ||
        pathname.includes('.') // Has file extension
}

// ============================================
// Main Middleware
// ============================================

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const pathname = request.nextUrl.pathname;

    // Skip static resources
    if (isStaticResource(pathname)) {
        return NextResponse.next();
    }

    // ====================================
    // Hostname-based Routing
    // ====================================

    const isApp = isAppSubdomain(hostname) || request.nextUrl.searchParams.get('app') === '1';

    // If on app subdomain but trying to access marketing route, redirect to main domain
    if (isApp && isMarketingRoute(pathname) && pathname !== '/login') {
        const url = request.nextUrl.clone();
        url.hostname = PRODUCTION_DOMAIN;
        url.port = '';
        return NextResponse.redirect(url);
    }

    // If on main domain but trying to access dashboard, redirect to app subdomain
    // (Only in production - in dev, we allow both)
    if (!isApp && isAppRoute(pathname) && hostname.includes(PRODUCTION_DOMAIN)) {
        const url = request.nextUrl.clone();
        url.hostname = `${APP_SUBDOMAIN}.${PRODUCTION_DOMAIN}`;
        url.port = '';
        return NextResponse.redirect(url);
    }

    // ====================================
    // Supabase Auth
    // ====================================

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If Supabase is not configured, skip auth middleware (dev mode)
    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value)
                );
                supabaseResponse = NextResponse.next({
                    request,
                });
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                );
            },
        },
    });

    // Refresh session if expired
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes that require authentication
    const isProtectedRoute = pathname.startsWith('/dashboard');
    const isLoginPage = pathname === '/login';

    // If trying to access protected route without auth, redirect to login
    if (isProtectedRoute && !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // If logged in and trying to access login page, redirect to dashboard
    if (isLoginPage && user) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
};
