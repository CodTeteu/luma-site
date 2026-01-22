# LUMA - Review Bundle para Auditoria Externa

**Data:** 2026-01-22  
**Versão:** 1.0  

---

## PASSO 0 — INVENTÁRIO (ÁRVORE DE PASTAS)

```
src/
├── app/
│   ├── api/
│   │   ├── gifts/checkout/route.ts
│   │   ├── maintenance/cleanup-rate-limits/route.ts
│   │   └── rsvp/route.ts
│   ├── dashboard/
│   │   ├── editor/page.tsx
│   │   ├── events/page.tsx
│   │   ├── financial/page.tsx
│   │   ├── guests/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── login/
│   ├── [slug]/page.tsx
│   └── ...
├── components/
│   ├── gifts/
│   │   ├── CartDrawer.tsx
│   │   ├── GiftCard.tsx
│   │   ├── GiftCartContext.tsx
│   │   ├── GiftCheckoutModal.tsx
│   │   ├── GiftList.tsx
│   │   ├── GiftSection.tsx
│   │   └── PixPaymentBox.tsx
│   └── ...
├── contexts/
│   ├── BriefingContext.tsx
│   └── CartContext.tsx
├── lib/
│   ├── supabase/
│   │   ├── admin.ts
│   │   ├── client.ts
│   │   └── server.ts
│   └── slug.ts
├── services/
│   ├── giftOrdersService.ts
│   ├── rsvpService.ts
│   └── transactionService.ts
└── templates/
    ├── TemplateDefault.tsx
    └── registry.ts

supabase/
├── schema.sql
├── rsvp_security_patch.sql
├── profiles_patch.sql
├── content_cleanup_patch.sql
├── rsvp_unique_email_patch.sql
└── gift_orders_patch.sql

middleware.ts
vercel.json
```

---

## PASSO 1 — AUDITORIA FINAL

### ✅ Implementado

| Funcionalidade | Status | Detalhes |
|----------------|--------|----------|
| **Auth real + proteção /dashboard** | ✅ OK | `middleware.ts` verifica `auth.getUser()` e redireciona para `/login` |
| **Multi-evento com active_event_id** | ✅ OK | `profiles` table com `active_event_id`, `BriefingContext` gerencia troca |
| **Slug reservado + colisão + edição** | ✅ OK | `src/lib/slug.ts` com `RESERVED_SLUGS[]`, `generateUniqueSlug()`, `validateSlug()` |
| **/[slug] público + /preview/[slug]** | ✅ OK | `src/app/[slug]/page.tsx` - verifica `status === 'published'` |
| **RSVP via endpoint + honeypot + rate limit** | ✅ OK | `/api/rsvp/route.ts` usa `createAdminClient()` (service role), honeypot, rate limit 5/10min |
| **Lista de presentes + carrinho** | ✅ OK | 8 componentes em `src/components/gifts/`, localStorage por slug |
| **Checkout cria pedido pendente** | ✅ OK | `/api/gifts/checkout/route.ts` → `gift_orders` com `status='pending'` |
| **Pix configurável no dashboard** | ✅ OK | Editor page seção "Presentes e PIX", salva em `events.content.payment` |
| **Dashboard financeiro com gift_orders** | ✅ OK | `/dashboard/financial` lista pedidos, filtro por status, confirm/cancel |
| **Limpeza rate-limit (cron)** | ✅ OK | `vercel.json` cron diário → `/api/maintenance/cleanup-rate-limits` |

---

## PASSO 2 — CHECKLIST OK / FALTANDO / RISCOS

| Item | Status | Observação |
|------|--------|------------|
| Policy pública de INSERT em rsvps | ✅ OK | `DROP POLICY` em `rsvp_security_patch.sql` - removida |
| Policy pública de INSERT em gift_orders | ✅ OK | Nunca existiu - API usa service role |
| Preço vindo do client | ✅ OK | `/api/gifts/checkout` recalcula total do server via `events.content.gifts` |
| Endpoint sem service role | ✅ OK | Ambos `/api/rsvp` e `/api/gifts/checkout` usam `createAdminClient()` |
| Slug colidindo com rotas | ✅ OK | `RESERVED_SLUGS` inclui: dashboard, login, api, preview, etc |
| Exposição de dados privados em content | ✅ OK | `toEventContent()` remove email/phone; `content_cleanup_patch.sql` limpa legado |
| Rate limit em RSVP | ✅ OK | 5 requests/10min por IP/evento via `rsvp_rate_limits` |
| Rate limit em Checkout | ✅ OK | 5 requests/10min por IP/evento via `gift_checkout_rate_limits` |
| RLS em gift_orders | ✅ OK | Event owner: SELECT/UPDATE/INSERT; público: nenhum |
| RLS em gift_checkout_rate_limits | ✅ OK | Nenhuma policy - só service role |
| Validação de honeypot | ✅ OK | Ambos endpoints verificam campo honeypot |
| MAINTENANCE_TOKEN protegido | ✅ OK | Endpoint verifica token via header ou query param |

### Riscos Residuais

1. **metadataBase warning** - Não crítico, apenas afeta OG images
2. **Sem email de confirmação** - Checkout PIX é manual, não há webhook

---

## PASSO 3 — SQL (SCHEMAS E PATCHES)

### 3.1 schema.sql
-- ============================================
-- LUMA - Database Schema for Supabase
-- ============================================
-- Execute this SQL in your Supabase project's SQL Editor
-- Dashboard > SQL Editor > New Query > Paste and Run

-- Events table (each couple = 1 event)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    template_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    content JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
-- Enable RLS on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own events
CREATE POLICY "Users can view own events" ON events
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert only their own events
CREATE POLICY "Users can insert own events" ON events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own events
CREATE POLICY "Users can update own events" ON events
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete only their own events
CREATE POLICY "Users can delete own events" ON events
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Content JSONB Structure (reference)
-- ============================================
-- The 'content' column stores all event details as JSON:
-- {
--     "templateId": "classic-elegance",
--     "templateName": "Classic Elegance",
--     "templateStyle": "Elegante e atemporal",
--     "brideName": "Maria",
--     "groomName": "João",
--     "email": "casal@email.com",
--     "phone": "(11) 99999-9999",
--     "weddingDate": "2026-06-15",
--     "ceremonyTime": "16:00",
--     "partyTime": "19:00",
--     "ceremonyLocation": "Igreja São José",
--     "partyLocation": "Espaço Jardim",
--     "guestCount": "150",
--     "style": "Clássico",
--     "colors": "Branco e dourado",
--     "message": "Observações do casal",
--     "submittedAt": "2026-01-21T12:00:00Z",
--     "status": "pending"
-- }

-- ============================================
-- RSVPs Table (guest confirmations)
-- ============================================
CREATE TABLE IF NOT EXISTS rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    is_attending BOOLEAN DEFAULT true,
    guests INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    dietary_restrictions TEXT,
    message TEXT,
    group_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster event queries
CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON rsvps(event_id);

-- Enable RLS
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Event owner can view all RSVPs for their events
CREATE POLICY "Event owner can view RSVPs" ON rsvps
    FOR SELECT USING (
        event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
    );

-- Event owner can update RSVPs
CREATE POLICY "Event owner can update RSVPs" ON rsvps
    FOR UPDATE USING (
        event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
    );

-- Event owner can delete RSVPs
CREATE POLICY "Event owner can delete RSVPs" ON rsvps
    FOR DELETE USING (
        event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
    );

-- Public can insert RSVP for published events
-- TODO: Add rate limiting or captcha in application layer for spam prevention
CREATE POLICY "Public can RSVP to published events" ON rsvps
    FOR INSERT WITH CHECK (
        event_id IN (SELECT id FROM events WHERE status = 'published')
    );

-- ============================================
-- Gift Transactions Table
-- ============================================
CREATE TABLE IF NOT EXISTS gift_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    gift_name VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    guest_name VARCHAR(255),
    guest_email VARCHAR(255),
    message TEXT,
    payment_method VARCHAR(50) DEFAULT 'pix',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster event queries
CREATE INDEX IF NOT EXISTS idx_gift_transactions_event_id ON gift_transactions(event_id);

-- Enable RLS
ALTER TABLE gift_transactions ENABLE ROW LEVEL SECURITY;

-- Event owner can view all transactions for their events
CREATE POLICY "Event owner can view transactions" ON gift_transactions
    FOR SELECT USING (
        event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
    );

-- Event owner can update transactions (change status)
CREATE POLICY "Event owner can update transactions" ON gift_transactions
    FOR UPDATE USING (
        event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
    );

-- Event owner can delete transactions
CREATE POLICY "Event owner can delete transactions" ON gift_transactions
    FOR DELETE USING (
        event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
    );

-- Public can insert transactions for published events
CREATE POLICY "Public can add transactions to published events" ON gift_transactions
    FOR INSERT WITH CHECK (
        event_id IN (SELECT id FROM events WHERE status = 'published')
    );

-- ============================================
-- Public read access to events for slug lookup
-- ============================================
-- Allow anyone to read published events by slug (for public invitation page)
CREATE POLICY "Anyone can view published events" ON events
    FOR SELECT USING (status = 'published');

 
### 3.2 rsvp_security_patch.sql 
 
`sql 
-- ============================================
-- LUMA - RSVP Security Patch
-- ============================================
-- Execute this SQL in your Supabase SQL Editor AFTER the main schema.sql
-- This removes public INSERT access and adds rate limiting

-- ============================================
-- 1) DROP PUBLIC INSERT POLICY ON RSVPS
-- ============================================
-- Remove the policy that allows anyone to insert RSVPs
DROP POLICY IF EXISTS "Public can RSVP to published events" ON rsvps;

-- ============================================
-- 2) CREATE RATE LIMITING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rsvp_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    ip_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_rsvp_rate_limits_lookup 
    ON rsvp_rate_limits(event_id, ip_hash, created_at DESC);

-- Enable RLS (but we'll use service role to bypass it)
ALTER TABLE rsvp_rate_limits ENABLE ROW LEVEL SECURITY;

-- No public policies - only service role can access
-- Event owner can view their rate limit logs (optional, for debugging)
CREATE POLICY "Event owner can view rate limits" ON rsvp_rate_limits
    FOR SELECT USING (
        event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
    );

-- ============================================
-- 3) UNIQUE CONSTRAINT ON EMAIL PER EVENT
-- ============================================
-- Prevent duplicate RSVPs from same email
-- Only applies when email is not null and not empty
CREATE UNIQUE INDEX IF NOT EXISTS idx_rsvps_unique_email_per_event
    ON rsvps(event_id, email)
    WHERE email IS NOT NULL AND email <> '';

-- ============================================
-- 4) AUTO-CLEANUP OLD RATE LIMIT RECORDS (OPTIONAL)
-- ============================================
-- Function to clean up rate limit records older than 1 hour
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM rsvp_rate_limits WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- You can set up a cron job in Supabase to run this periodically:
-- SELECT cron.schedule('cleanup-rate-limits', '*/30 * * * *', 'SELECT cleanup_old_rate_limits()');

-- ============================================
-- SUMMARY
-- ============================================
-- After running this patch:
-- 1. Public INSERT on rsvps is disabled
-- 2. RSVPs can only be inserted via service role (API endpoint)
-- 3. Rate limiting table tracks submissions per IP per event
-- 4. Duplicate emails per event are prevented
` 
 
### 3.3 profiles_patch.sql 
 
`sql 
-- ============================================
-- LUMA - Multi-Event Support: Profiles Table
-- ============================================
-- Execute this SQL in your Supabase SQL Editor

-- ============================================
-- 1) CREATE PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    active_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_active_event ON profiles(active_event_id);

-- ============================================
-- 2) ENABLE RLS
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- User can view only their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- User can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- 3) AUTO-UPDATE updated_at
-- ============================================
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4) AUTO-CREATE PROFILE ON USER SIGNUP (OPTIONAL)
-- ============================================
-- This function creates a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SUMMARY
-- ============================================
-- After running this patch:
-- 1. profiles table exists with active_event_id
-- 2. RLS ensures users only see their own profile
-- 3. New users automatically get a profile created
-- 4. active_event_id tracks which event is currently selected
` 
 
### 3.4 gift_orders_patch.sql 
 
`sql 
-- ============================================
-- LUMA - Gift Orders System Patch
-- ============================================
-- Execute this SQL in Supabase SQL Editor to create
-- the gift orders tables for checkout/payment tracking.

-- ============================================
-- 1) CREATE update_updated_at FUNCTION (if not exists)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 2) CREATE gift_orders TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gift_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    reference_code TEXT NOT NULL UNIQUE, -- e.g., 'A8K3D2Q1'
    guest_name TEXT,
    guest_email TEXT,
    message TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- items format: [{ "giftId": "uuid", "name": "...", "unitAmount": 100, "qty": 2, "lineTotal": 200 }]
    total_amount NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'pix',
    status TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3) INDEXES for gift_orders
-- ============================================
CREATE INDEX IF NOT EXISTS idx_gift_orders_event_created 
ON gift_orders(event_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gift_orders_event_status 
ON gift_orders(event_id, status);

-- ============================================
-- 4) TRIGGER for updated_at
-- ============================================
DROP TRIGGER IF EXISTS update_gift_orders_updated_at ON gift_orders;
CREATE TRIGGER update_gift_orders_updated_at
    BEFORE UPDATE ON gift_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5) CREATE gift_checkout_rate_limits TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gift_checkout_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    ip_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEX for rate limit lookup
CREATE INDEX IF NOT EXISTS idx_gift_checkout_rate_event_ip_time 
ON gift_checkout_rate_limits(event_id, ip_hash, created_at DESC);

-- ============================================
-- 6) ENABLE RLS
-- ============================================
ALTER TABLE gift_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_checkout_rate_limits ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7) RLS POLICIES for gift_orders
-- ============================================
-- Drop existing policies if any
DROP POLICY IF EXISTS "Event owner can view orders" ON gift_orders;
DROP POLICY IF EXISTS "Event owner can update orders" ON gift_orders;
DROP POLICY IF EXISTS "Event owner can insert orders" ON gift_orders;

-- Event owner can SELECT their orders
CREATE POLICY "Event owner can view orders"
ON gift_orders FOR SELECT
USING (
    event_id IN (
        SELECT id FROM events WHERE user_id = auth.uid()
    )
);

-- Event owner can UPDATE their orders (e.g., mark as confirmed/cancelled)
CREATE POLICY "Event owner can update orders"
ON gift_orders FOR UPDATE
USING (
    event_id IN (
        SELECT id FROM events WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    event_id IN (
        SELECT id FROM events WHERE user_id = auth.uid()
    )
);

-- Event owner can INSERT orders manually (via dashboard)
CREATE POLICY "Event owner can insert orders"
ON gift_orders FOR INSERT
WITH CHECK (
    event_id IN (
        SELECT id FROM events WHERE user_id = auth.uid()
    )
);

-- NOTE: NO PUBLIC POLICY for INSERT
-- Public/guest checkout goes through /api/gift-checkout using service role

-- ============================================
-- 8) RLS POLICIES for gift_checkout_rate_limits
-- ============================================
-- NO POLICIES - only service role can access this table
-- Drop any if they exist
DROP POLICY IF EXISTS "Rate limits are service role only" ON gift_checkout_rate_limits;

-- ============================================
-- SUMMARY
-- ============================================
-- Tables created:
--   - gift_orders: stores pending/confirmed gift checkout orders
--   - gift_checkout_rate_limits: for rate limiting public checkouts
--
-- Security:
--   - RLS enabled on both tables
--   - gift_orders: event owner can SELECT/UPDATE/INSERT
--   - gift_orders: NO public INSERT policy (use API with service role)
--   - gift_checkout_rate_limits: NO policies (service role only)
--
-- Next steps:
--   - Create /api/gift-checkout endpoint using service role
--   - Add gift orders management to dashboard
`
 
--- 
 
## PASSO 4  ARQUIVOS DE CODIGO 
 
### A) middleware.ts 
 
`	ypescript 
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If Supabase is not configured, skip middleware (dev mode with localStorage)
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
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
    const isLoginPage = request.nextUrl.pathname === '/login';

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
         * - public folder
         * - api routes
         */
        '/((?!_next/static|_next/image|favicon.ico|images|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
` 
 
### B) src/lib/supabase/admin.ts 
 
`	ypescript 
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase Admin client with SERVICE ROLE key.
 * This client bypasses RLS and should ONLY be used in server-side code.
 * NEVER import this in client components!
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.error("Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL");
        return null;
    }

    return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
`
 
### C) src/lib/slug.ts 
 
`	ypescript 
/**
 * Slug Utilities
 * Functions for validating, normalizing, and generating unique slugs
 */

import type { SupabaseClient } from "@supabase/supabase-js";

// ============================================
// Reserved Slugs
// ============================================

/**
 * List of reserved slugs that cannot be used for events.
 * These are routes, static files, or system paths.
 */
export const RESERVED_SLUGS = [
    // App routes
    "login",
    "dashboard",
    "templates",
    "preview",
    "api",
    "admin",
    "settings",
    "editor",
    "guests",
    "financial",

    // Static files and Next.js internals
    "images",
    "_next",
    "favicon",
    "favicon.ico",
    "robots",
    "robots.txt",
    "sitemap",
    "sitemap.xml",

    // Legal pages
    "terms",
    "termos",
    "termos-de-uso",
    "privacy",
    "privacidade",
    "politica-de-privacidade",
    "cookies",
    "politica-de-cookies",

    // Common reserved words
    "www",
    "app",
    "help",
    "support",
    "about",
    "contact",
    "blog",
    "news",
    "home",
    "index",
    "null",
    "undefined",
    "test",
    "demo",
] as const;

// ============================================
// Validation Functions
// ============================================

/**
 * Check if a slug is reserved
 */
export function isReservedSlug(slug: string): boolean {
    const normalized = slug.toLowerCase().trim();
    return RESERVED_SLUGS.includes(normalized as typeof RESERVED_SLUGS[number]);
}

/**
 * Validate slug format
 * Returns error message if invalid, null if valid
 */
export function validateSlug(slug: string): string | null {
    if (!slug || slug.trim().length === 0) {
        return "Slug não pode estar vazio";
    }

    if (slug.length < 3) {
        return "Slug deve ter pelo menos 3 caracteres";
    }

    if (slug.length > 100) {
        return "Slug deve ter no máximo 100 caracteres";
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
        return "Slug deve conter apenas letras minúsculas, números e hífens";
    }

    if (slug.startsWith("-") || slug.endsWith("-")) {
        return "Slug não pode começar ou terminar com hífen";
    }

    if (slug.includes("--")) {
        return "Slug não pode conter hífens consecutivos";
    }

    if (isReservedSlug(slug)) {
        return "Este slug é reservado. Escolha outro nome.";
    }

    return null;
}

// ============================================
// Normalization Functions
// ============================================

/**
 * Normalize a string to a valid slug format
 * - Lowercase
 * - Remove accents/diacritics
 * - Replace spaces with hyphens
 * - Remove invalid characters
 * - Remove leading/trailing hyphens
 * - Collapse multiple hyphens
 */
export function normalizeSlug(input: string): string {
    if (!input) return "";

    return input
        .toLowerCase()
        .trim()
        // Remove accents/diacritics
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        // Replace spaces and underscores with hyphens
        .replace(/[\s_]+/g, "-")
        // Remove invalid characters (keep only a-z, 0-9, -)
        .replace(/[^a-z0-9-]/g, "")
        // Collapse multiple hyphens
        .replace(/-+/g, "-")
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, "");
}

// ============================================
// Unique Slug Generation
// ============================================

/**
 * Generate a random suffix for slug collision handling
 */
function generateSuffix(): string {
    return Math.random().toString(36).substring(2, 6);
}

/**
 * Generate a unique slug that doesn't exist in the database
 * 
 * @param baseSlug - The base slug to start with (will be normalized)
 * @param supabase - Supabase client instance
 * @param maxAttempts - Maximum number of attempts to find unique slug
 * @returns Unique slug or null if couldn't generate
 */
export async function generateUniqueSlug(
    baseSlug: string,
    supabase: SupabaseClient,
    maxAttempts = 10
): Promise<string | null> {
    let slug = normalizeSlug(baseSlug);

    // If normalized slug is too short, use a default
    if (slug.length < 3) {
        slug = "evento";
    }

    // If slug is reserved, add suffix immediately
    if (isReservedSlug(slug)) {
        slug = `${slug}-${generateSuffix()}`;
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Check if slug exists
        const { data, error } = await supabase
            .from("events")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();

        if (error) {
            console.error("Error checking slug:", error);
            return null;
        }

        // Slug is available!
        if (!data) {
            return slug;
        }

        // Slug exists, add suffix and try again
        const basePart = normalizeSlug(baseSlug).length >= 3
            ? normalizeSlug(baseSlug)
            : "evento";
        slug = `${basePart}-${generateSuffix()}`;
    }

    // Couldn't find unique slug after max attempts
    console.error(`Could not generate unique slug after ${maxAttempts} attempts`);
    return null;
}

/**
 * Generate slug from couple names
 */
export function generateSlugFromNames(brideName: string, groomName: string): string {
    const bride = normalizeSlug(brideName || "");
    const groom = normalizeSlug(groomName || "");

    // If both names are empty, return empty (will use temporary slug)
    if (!bride && !groom) {
        return "";
    }

    // Combine names
    let base = [bride, groom].filter(Boolean).join("-");

    // If too short, return empty
    if (base.length < 3) {
        return "";
    }

    return base;
}

/**
 * Generate a temporary slug for events without names yet
 */
export function generateTemporarySlug(): string {
    const suffix = Math.random().toString(36).substring(2, 8);
    return `evento-${suffix}`;
}

/**
 * Check if a slug is temporary/legacy and should be updated
 * Returns true if the slug can be improved with real names
 */
export function isTemporarySlug(slug: string): boolean {
    if (!slug) return true;

    // Temporary patterns
    const temporaryPatterns = [
        /^evento-[a-z0-9]+$/,         // evento-xxxx
        /^noiva-noivo(-[a-z0-9]+)?$/, // noiva-noivo or noiva-noivo-xxxx
        /^casamento(-[a-z0-9]+)?$/,   // casamento or casamento-xxxx
    ];

    return temporaryPatterns.some(pattern => pattern.test(slug));
}

` 
 
### D) src/app/api/rsvp/route.ts 
 
`	ypescript 
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createHash } from "crypto";

// ============================================
// Configuration
// ============================================

const RATE_LIMIT_MAX_REQUESTS = 5;      // Max requests per window
const RATE_LIMIT_WINDOW_MINUTES = 10;   // Window in minutes
const MAX_GUESTS = 20;                   // Max guests per RSVP
const MAX_CHILDREN = 10;                 // Max children per RSVP

// ============================================
// Types
// ============================================

interface RSVPPayload {
    slug: string;
    name: string;
    email?: string;
    phone?: string;
    is_attending: boolean;
    guests?: number;
    children?: number;
    dietary_restrictions?: string;
    message?: string;
    // Honeypot field
    website?: string;
}

// ============================================
// Helpers
// ============================================

function hashIP(ip: string): string {
    const salt = process.env.RSVP_RATE_LIMIT_SALT || "default-salt-change-me";
    return createHash("sha256").update(`${ip}:${salt}`).digest("hex").substring(0, 64);
}

function getClientIP(request: NextRequest): string {
    // Try various headers in order of preference
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwardedFor.split(",")[0].trim();
    }

    const realIP = request.headers.get("x-real-ip");
    if (realIP) {
        return realIP;
    }

    // Fallback
    return "unknown";
}

function validatePayload(payload: RSVPPayload): string | null {
    if (!payload.slug || typeof payload.slug !== "string") {
        return "Slug do evento é obrigatório";
    }

    if (!payload.name || typeof payload.name !== "string" || payload.name.trim().length < 2) {
        return "Nome é obrigatório (mínimo 2 caracteres)";
    }

    if (payload.name.length > 200) {
        return "Nome muito longo (máximo 200 caracteres)";
    }

    if (typeof payload.is_attending !== "boolean") {
        return "Confirmação de presença é obrigatória";
    }

    if (payload.email && typeof payload.email === "string") {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.email)) {
            return "Email inválido";
        }
    }

    if (payload.guests !== undefined) {
        const guests = Number(payload.guests);
        if (isNaN(guests) || guests < 1 || guests > MAX_GUESTS) {
            return `Número de convidados deve ser entre 1 e ${MAX_GUESTS}`;
        }
    }

    if (payload.children !== undefined) {
        const children = Number(payload.children);
        if (isNaN(children) || children < 0 || children > MAX_CHILDREN) {
            return `Número de crianças deve ser entre 0 e ${MAX_CHILDREN}`;
        }
    }

    if (payload.message && payload.message.length > 1000) {
        return "Mensagem muito longa (máximo 1000 caracteres)";
    }

    return null;
}

// ============================================
// POST /api/rsvp
// ============================================

export async function POST(request: NextRequest) {
    try {
        // Parse body
        const body = await request.json() as RSVPPayload;

        // ================================
        // 1) HONEYPOT CHECK
        // ================================
        if (body.website && body.website.trim() !== "") {
            // Bot detected - return fake success to not reveal detection
            console.log("[RSVP] Honeypot triggered");
            return NextResponse.json(
                { success: false, error: "Erro ao processar RSVP" },
                { status: 400 }
            );
        }

        // ================================
        // 2) VALIDATE PAYLOAD
        // ================================
        const validationError = validatePayload(body);
        if (validationError) {
            return NextResponse.json(
                { success: false, error: validationError },
                { status: 400 }
            );
        }

        // ================================
        // 3) GET ADMIN CLIENT
        // ================================
        const supabase = createAdminClient();
        if (!supabase) {
            console.error("[RSVP] Admin client not configured");
            return NextResponse.json(
                { success: false, error: "Serviço temporariamente indisponível" },
                { status: 503 }
            );
        }

        // ================================
        // 4) FETCH EVENT BY SLUG
        // ================================
        const { data: event, error: eventError } = await supabase
            .from("events")
            .select("id, status")
            .eq("slug", body.slug)
            .single();

        if (eventError || !event) {
            return NextResponse.json(
                { success: false, error: "Evento não encontrado" },
                { status: 404 }
            );
        }

        // ================================
        // 5) CHECK EVENT IS PUBLISHED
        // ================================
        if (event.status !== "published") {
            return NextResponse.json(
                { success: false, error: "Este evento ainda não está aberto para confirmações" },
                { status: 403 }
            );
        }

        // ================================
        // 6) RATE LIMITING
        // ================================
        const clientIP = getClientIP(request);
        const ipHash = hashIP(clientIP);
        const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();

        // Count recent requests from this IP for this event
        const { count, error: countError } = await supabase
            .from("rsvp_rate_limits")
            .select("*", { count: "exact", head: true })
            .eq("event_id", event.id)
            .eq("ip_hash", ipHash)
            .gte("created_at", windowStart);

        if (countError) {
            console.error("[RSVP] Rate limit check error:", countError);
            // Continue anyway, don't block legitimate users
        } else if (count && count >= RATE_LIMIT_MAX_REQUESTS) {
            return NextResponse.json(
                { success: false, error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
                { status: 429 }
            );
        }

        // Record this attempt
        await supabase
            .from("rsvp_rate_limits")
            .insert({
                event_id: event.id,
                ip_hash: ipHash,
            });

        // ================================
        // 7) CHECK FOR EXISTING RSVP (UPSERT LOGIC)
        // ================================
        const emailNormalized = body.email?.trim().toLowerCase() || null;
        let existingRSVPId: string | null = null;

        if (emailNormalized) {
            const { data: existingRSVP } = await supabase
                .from("rsvps")
                .select("id")
                .eq("event_id", event.id)
                .ilike("email", emailNormalized)
                .single();

            if (existingRSVP) {
                existingRSVPId = existingRSVP.id;
            }
        }

        // ================================
        // 8) INSERT OR UPDATE RSVP
        // ================================
        const rsvpData = {
            event_id: event.id,
            name: body.name.trim(),
            email: emailNormalized,
            phone: body.phone?.trim() || null,
            is_attending: body.is_attending,
            guests: body.guests || 1,
            children: body.children || 0,
            dietary_restrictions: body.dietary_restrictions?.trim() || null,
            message: body.message?.trim() || null,
        };

        let rsvp;
        let isUpdate = false;

        if (existingRSVPId) {
            // UPDATE existing RSVP
            const { data, error: updateError } = await supabase
                .from("rsvps")
                .update(rsvpData)
                .eq("id", existingRSVPId)
                .select()
                .single();

            if (updateError) {
                console.error("[RSVP] Update error:", updateError);
                return NextResponse.json(
                    { success: false, error: "Erro ao atualizar confirmação" },
                    { status: 500 }
                );
            }

            rsvp = data;
            isUpdate = true;
        } else {
            // INSERT new RSVP
            const { data, error: insertError } = await supabase
                .from("rsvps")
                .insert(rsvpData)
                .select()
                .single();

            if (insertError) {
                console.error("[RSVP] Insert error:", insertError);

                // Handle unique constraint violation (race condition)
                if (insertError.code === "23505") {
                    return NextResponse.json(
                        {
                            success: false,
                            error: "Já existe uma confirmação para este email. Tente novamente para atualizar sua resposta."
                        },
                        { status: 409 }
                    );
                }

                return NextResponse.json(
                    { success: false, error: "Erro ao salvar confirmação" },
                    { status: 500 }
                );
            }

            rsvp = data;
        }

        // ================================
        // SUCCESS
        // ================================
        let message: string;
        if (isUpdate) {
            message = body.is_attending
                ? "Confirmação atualizada com sucesso!"
                : "Sua resposta foi atualizada.";
        } else {
            message = body.is_attending
                ? "Presença confirmada! Obrigado."
                : "Resposta registrada. Sentiremos sua falta!";
        }

        return NextResponse.json({
            success: true,
            message,
            rsvp_id: rsvp.id,
            updated: isUpdate,
        });

    } catch (error) {
        console.error("[RSVP] Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
`
 
### E) src/app/api/gifts/checkout/route.ts 
 
`	ypescript 
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createHash } from "crypto";

// ============================================
// Configuration
// ============================================

const RATE_LIMIT_MAX_REQUESTS = 5;      // Max checkouts per window
const RATE_LIMIT_WINDOW_MINUTES = 10;   // Window in minutes
const MAX_ITEM_QTY = 10;                // Max quantity per item
const REFERENCE_CODE_LENGTH = 8;        // Length of reference code
const REFERENCE_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I, O, 0, 1

// ============================================
// Types
// ============================================

interface CartItem {
    giftId: string;
    qty: number;
}

interface CheckoutPayload {
    slug: string;
    cart: CartItem[];
    guestName?: string;
    guestEmail?: string;
    message?: string;
    honeypot?: string;
}

interface Gift {
    id: string;
    name: string;
    amount: number;
}

interface OrderItem {
    giftId: string;
    name: string;
    unitAmount: number;
    qty: number;
    lineTotal: number;
}

// ============================================
// Helpers
// ============================================

function hashIP(ip: string): string {
    const salt = process.env.GIFTS_RATE_LIMIT_SALT || "default-gifts-salt-change-me";
    return createHash("sha256").update(`${ip}:${salt}`).digest("hex").substring(0, 64);
}

function getClientIP(request: NextRequest): string {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }
    const realIP = request.headers.get("x-real-ip");
    if (realIP) {
        return realIP;
    }
    return "unknown";
}

function generateReferenceCode(): string {
    let code = "";
    for (let i = 0; i < REFERENCE_CODE_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * REFERENCE_CODE_CHARS.length);
        code += REFERENCE_CODE_CHARS[randomIndex];
    }
    return code;
}

function validatePayload(payload: CheckoutPayload): string | null {
    if (!payload.slug || typeof payload.slug !== "string") {
        return "Slug do evento é obrigatório";
    }

    if (!Array.isArray(payload.cart) || payload.cart.length === 0) {
        return "Carrinho não pode estar vazio";
    }

    if (payload.cart.length > 50) {
        return "Carrinho com muitos itens";
    }

    for (const item of payload.cart) {
        if (!item.giftId || typeof item.giftId !== "string") {
            return "ID do presente inválido";
        }
        if (typeof item.qty !== "number" || item.qty < 1 || item.qty > MAX_ITEM_QTY) {
            return `Quantidade deve ser entre 1 e ${MAX_ITEM_QTY}`;
        }
    }

    if (payload.guestEmail && typeof payload.guestEmail === "string") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.guestEmail)) {
            return "Email inválido";
        }
    }

    if (payload.message && payload.message.length > 1000) {
        return "Mensagem muito longa (máximo 1000 caracteres)";
    }

    return null;
}

// ============================================
// POST /api/gifts/checkout
// ============================================

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as CheckoutPayload;

        // ================================
        // 1) HONEYPOT CHECK
        // ================================
        if (body.honeypot && body.honeypot.trim() !== "") {
            console.log("[GiftCheckout] Honeypot triggered");
            return NextResponse.json(
                { ok: false, error: "Erro ao processar pedido" },
                { status: 400 }
            );
        }

        // ================================
        // 2) VALIDATE PAYLOAD
        // ================================
        const validationError = validatePayload(body);
        if (validationError) {
            return NextResponse.json(
                { ok: false, error: validationError },
                { status: 400 }
            );
        }

        // ================================
        // 3) GET ADMIN CLIENT
        // ================================
        const supabase = createAdminClient();
        if (!supabase) {
            console.error("[GiftCheckout] Admin client not configured");
            return NextResponse.json(
                { ok: false, error: "Serviço temporariamente indisponível" },
                { status: 503 }
            );
        }

        // ================================
        // 4) FETCH EVENT BY SLUG
        // ================================
        const { data: event, error: eventError } = await supabase
            .from("events")
            .select("id, status, content")
            .eq("slug", body.slug)
            .single();

        if (eventError || !event) {
            return NextResponse.json(
                { ok: false, error: "Evento não encontrado" },
                { status: 404 }
            );
        }

        // ================================
        // 5) CHECK EVENT IS PUBLISHED
        // ================================
        if (event.status !== "published") {
            return NextResponse.json(
                { ok: false, error: "Este evento ainda não está aberto" },
                { status: 403 }
            );
        }

        // ================================
        // 6) GET PIX CONFIG
        // ================================
        const content = event.content as {
            payment?: { pixKey?: string; pixName?: string; enabled?: boolean };
            gifts?: Gift[];
        } | null;

        const pixKey = content?.payment?.pixKey;
        const pixName = content?.payment?.pixName;

        if (!pixKey || pixKey.trim() === "") {
            return NextResponse.json(
                { ok: false, error: "Pix não configurado para este evento" },
                { status: 400 }
            );
        }

        // ================================
        // 7) GET GIFTS CATALOG
        // ================================
        const gifts: Gift[] = content?.gifts || [];
        if (gifts.length === 0) {
            return NextResponse.json(
                { ok: false, error: "Nenhum presente cadastrado neste evento" },
                { status: 400 }
            );
        }

        // ================================
        // 8) RATE LIMITING
        // ================================
        const clientIP = getClientIP(request);
        const ipHash = hashIP(clientIP);
        const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();

        const { count, error: countError } = await supabase
            .from("gift_checkout_rate_limits")
            .select("*", { count: "exact", head: true })
            .eq("event_id", event.id)
            .eq("ip_hash", ipHash)
            .gte("created_at", windowStart);

        if (countError) {
            console.error("[GiftCheckout] Rate limit check error:", countError);
            // Continue anyway
        } else if (count && count >= RATE_LIMIT_MAX_REQUESTS) {
            return NextResponse.json(
                { ok: false, error: "Muitas tentativas. Aguarde alguns minutos." },
                { status: 429 }
            );
        }

        // Record this attempt
        await supabase
            .from("gift_checkout_rate_limits")
            .insert({
                event_id: event.id,
                ip_hash: ipHash,
            });

        // ================================
        // 9) CALCULATE ORDER ITEMS & TOTAL (SERVER-SIDE)
        // ================================
        const orderItems: OrderItem[] = [];
        let totalAmount = 0;

        for (const cartItem of body.cart) {
            const gift = gifts.find(g => g.id === cartItem.giftId);

            if (!gift) {
                return NextResponse.json(
                    { ok: false, error: `Presente não encontrado: ${cartItem.giftId}` },
                    { status: 400 }
                );
            }

            const lineTotal = gift.amount * cartItem.qty;

            orderItems.push({
                giftId: gift.id,
                name: gift.name,
                unitAmount: gift.amount,
                qty: cartItem.qty,
                lineTotal,
            });

            totalAmount += lineTotal;
        }

        if (totalAmount <= 0) {
            return NextResponse.json(
                { ok: false, error: "Valor total inválido" },
                { status: 400 }
            );
        }

        // ================================
        // 10) GENERATE UNIQUE REFERENCE CODE
        // ================================
        let referenceCode: string | null = null;
        const maxAttempts = 10;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const candidate = generateReferenceCode();

            const { data: existing } = await supabase
                .from("gift_orders")
                .select("id")
                .eq("reference_code", candidate)
                .maybeSingle();

            if (!existing) {
                referenceCode = candidate;
                break;
            }
        }

        if (!referenceCode) {
            console.error("[GiftCheckout] Could not generate unique reference code");
            return NextResponse.json(
                { ok: false, error: "Erro ao gerar código do pedido" },
                { status: 500 }
            );
        }

        // ================================
        // 11) INSERT ORDER
        // ================================
        const { data: order, error: insertError } = await supabase
            .from("gift_orders")
            .insert({
                event_id: event.id,
                reference_code: referenceCode,
                guest_name: body.guestName?.trim() || null,
                guest_email: body.guestEmail?.trim().toLowerCase() || null,
                message: body.message?.trim() || null,
                items: orderItems,
                total_amount: totalAmount,
                payment_method: "pix",
                status: "pending",
            })
            .select()
            .single();

        if (insertError) {
            console.error("[GiftCheckout] Insert error:", insertError);

            // Handle unique constraint violation (race condition on reference_code)
            if (insertError.code === "23505") {
                return NextResponse.json(
                    { ok: false, error: "Erro ao criar pedido. Tente novamente." },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { ok: false, error: "Erro ao criar pedido" },
                { status: 500 }
            );
        }

        // ================================
        // SUCCESS
        // ================================
        return NextResponse.json({
            ok: true,
            orderId: order.id,
            referenceCode: order.reference_code,
            totalAmount,
            pixKey,
            pixName: pixName || null,
        });

    } catch (error) {
        console.error("[GiftCheckout] Unexpected error:", error);
        return NextResponse.json(
            { ok: false, error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
` 
 
### F) src/services/giftOrdersService.ts 
 
`	ypescript 
import { createClient } from "@/lib/supabase/client";

// ============================================
// Types
// ============================================

export interface GiftOrderItem {
    giftId: string;
    name: string;
    unitAmount: number;
    qty: number;
    lineTotal: number;
}

export interface GiftOrder {
    id: string;
    event_id: string;
    reference_code: string;
    guest_name: string | null;
    guest_email: string | null;
    message: string | null;
    items: GiftOrderItem[];
    total_amount: number;
    payment_method: string;
    status: "pending" | "confirmed" | "cancelled";
    created_at: string;
    updated_at: string;
}

export interface GiftOrderStats {
    pending: { count: number; total: number };
    confirmed: { count: number; total: number };
    cancelled: { count: number; total: number };
}

// ============================================
// Service Functions
// ============================================

/**
 * Get orders for an event, optionally filtered by status
 */
export async function getOrders(
    eventId: string,
    status?: "pending" | "confirmed" | "cancelled"
): Promise<GiftOrder[]> {
    const supabase = createClient();
    if (!supabase) return [];

    let query = supabase
        .from("gift_orders")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

    if (status) {
        query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
        console.error("[GiftOrdersService] Error fetching orders:", error);
        return [];
    }

    return (data as GiftOrder[]) || [];
}

/**
 * Update order status
 */
export async function updateOrderStatus(
    orderId: string,
    status: "pending" | "confirmed" | "cancelled"
): Promise<boolean> {
    const supabase = createClient();
    if (!supabase) return false;

    const { error } = await supabase
        .from("gift_orders")
        .update({ status })
        .eq("id", orderId);

    if (error) {
        console.error("[GiftOrdersService] Error updating status:", error);
        return false;
    }

    return true;
}

/**
 * Get order statistics for an event
 */
export async function getOrderStats(eventId: string): Promise<GiftOrderStats> {
    const supabase = createClient();

    const defaultStats: GiftOrderStats = {
        pending: { count: 0, total: 0 },
        confirmed: { count: 0, total: 0 },
        cancelled: { count: 0, total: 0 },
    };

    if (!supabase) return defaultStats;

    const { data, error } = await supabase
        .from("gift_orders")
        .select("status, total_amount")
        .eq("event_id", eventId);

    if (error || !data) {
        console.error("[GiftOrdersService] Error fetching stats:", error);
        return defaultStats;
    }

    const stats = { ...defaultStats };

    for (const order of data) {
        const status = order.status as keyof GiftOrderStats;
        if (stats[status]) {
            stats[status].count += 1;
            stats[status].total += Number(order.total_amount) || 0;
        }
    }

    return stats;
}

/**
 * Get a single order by ID
 */
export async function getOrder(orderId: string): Promise<GiftOrder | null> {
    const supabase = createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from("gift_orders")
        .select("*")
        .eq("id", orderId)
        .single();

    if (error) {
        console.error("[GiftOrdersService] Error fetching order:", error);
        return null;
    }

    return data as GiftOrder;
}
`
 
--- 
 
## PASSO 5  COMO TESTAR (PASSO A PASSO) 
 
### Testes Manuais 
 
1. **Login/Logout**: Acesse /login, entre com email/senha, verifique redirecionamento para /dashboard. Clique logout. 
2. **Criar Evento**: No dashboard, clique 'Criar Evento'. Evento deve aparecer na lista. 
3. **Configurar Pix + Presentes**: Abra /dashboard/editor, va em 'Presentes e PIX', ative, configure Pix key, adicione 2-3 presentes, salve. 
4. **Preview**: Abra /preview/[slug] - deve mostrar convite com presentes. 
5. **Publicar**: No editor, clique 'Publicar'. Status muda para 'published'. 
6. **Slug Publico**: Abra /[slug] - convite aparece para visitante. 
7. **Checkout Presentes**: Adicione presentes ao carrinho, clique 'Continuar para pagamento', preencha nome/email, confirme. Modal PIX aparece. 
8. **Verificar Pedido**: Va em /dashboard/financial, pedido deve aparecer como 'Pendente'. 
9. **Confirmar/Cancelar**: Expanda pedido, clique 'Confirmar Recebimento'. Status muda. Totais atualizam. 
10. **Rate Limit Checkout**: Tente 6 checkouts em 10min. Sexto deve retornar erro 429. 
11. **RSVP**: No convite publico, preencha RSVP. Verificar em /dashboard/guests.
 
--- 
 
## ARQUIVOS FALTANTES - COMPLEMENTO 
 
### 3.5 content_cleanup_patch.sql 
 
`sql 
-- ============================================
-- LUMA - Content Data Cleanup Patch
-- ============================================
-- Execute this SQL to remove private data from events.content
-- This removes email and other internal fields that should not be public

-- ============================================
-- 1) REMOVE EMAIL FROM CONTENT
-- ============================================
UPDATE events 
SET content = content - 'email' 
WHERE content ? 'email';

-- ============================================
-- 2) REMOVE OTHER INTERNAL FIELDS (IF ANY)
-- ============================================
-- Remove phone if accidentally stored
UPDATE events 
SET content = content - 'phone' 
WHERE content ? 'phone';

-- Remove status field from content (it's a column, not content)
UPDATE events 
SET content = content - 'status' 
WHERE content ? 'status';

-- ============================================
-- 3) VERIFY CLEANUP
-- ============================================
-- Run this to check what fields are in content across all events
-- SELECT DISTINCT jsonb_object_keys(content) as field FROM events ORDER BY field;

-- ============================================
-- SUMMARY
-- ============================================
-- After running this patch:
-- - email field removed from all events.content
-- - phone field removed from all events.content
-- - Private user data is no longer in public content
--
-- Going forward, createEvent() no longer stores email in content
` 
 
### 3.6 rsvp_unique_email_patch.sql 
 
`sql 
-- ============================================
-- LUMA - RSVP Unique Email Index
-- ============================================
-- Execute this SQL to prevent duplicate RSVPs per email/event

-- ============================================
-- 1) CREATE UNIQUE PARTIAL INDEX
-- ============================================
-- This ensures only one RSVP per email per event
-- Partial: only applies when email is not null/empty

-- Drop existing index if it exists (might have been created differently)
DROP INDEX IF EXISTS idx_rsvps_unique_email_per_event;

-- Create the unique index with lower() for case-insensitive matching
CREATE UNIQUE INDEX idx_rsvps_unique_email_per_event 
ON rsvps (event_id, lower(email)) 
WHERE email IS NOT NULL AND email <> '';

-- ============================================
-- 2) OPTIONAL: UNIQUE INDEX FOR PHONE
-- ============================================
-- Uncomment if you want to also prevent duplicates by phone
-- DROP INDEX IF EXISTS idx_rsvps_unique_phone_per_event;
-- CREATE UNIQUE INDEX idx_rsvps_unique_phone_per_event 
-- ON rsvps (event_id, phone) 
-- WHERE phone IS NOT NULL AND phone <> '';

-- ============================================
-- SUMMARY
-- ============================================
-- After running this patch:
-- - Each email can only have ONE RSVP per event
-- - Case-insensitive matching (test@email.com == TEST@EMAIL.com)
-- - Empty/null emails are allowed (users can submit without email)
-- - Attempting duplicate insert will return unique constraint error
`
 
### vercel.json 
 
`json 
{
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "framework": "nextjs",
    "buildCommand": "npm run build",
    "outputDirectory": ".next",
    "crons": [
        {
            "path": "/api/maintenance/cleanup-rate-limits?token=${MAINTENANCE_TOKEN}",
            "schedule": "0 3 * * *"
        }
    ]
}` 
 
### src/lib/supabase/client.ts 
 
`	ypescript 
import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for use in the browser.
 * This client is used in Client Components.
 */
export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        // Return null to signal that Supabase is not configured
        // Caller should handle fallback to localStorage
        return null;
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
    return !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
}
` 
 
### src/lib/supabase/server.ts 
 
`	ypescript 
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for use in Server Components, Route Handlers, and Server Actions.
 * This client has access to cookies for session management.
 */
export async function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return null;
    }

    const cookieStore = await cookies();

    return createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // The `setAll` method was called from a Server Component.
                    // This can be ignored if you have middleware refreshing user sessions.
                }
            },
        },
    });
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
    return !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
}
`
 
### src/app/api/maintenance/cleanup-rate-limits/route.ts 
 
`	ypescript 
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// ============================================
// Configuration
// ============================================

const CLEANUP_DAYS = 7; // Delete records older than this

// ============================================
// GET /api/maintenance/cleanup-rate-limits
// ============================================
// This endpoint is protected by MAINTENANCE_TOKEN
// Can be called via Vercel Cron or manually

export async function GET(request: NextRequest) {
    try {
        // ================================
        // 1) VERIFY MAINTENANCE TOKEN
        // ================================
        const token = request.headers.get("x-maintenance-token")
            || request.nextUrl.searchParams.get("token");

        const expectedToken = process.env.MAINTENANCE_TOKEN;

        if (!expectedToken) {
            console.error("[Maintenance] MAINTENANCE_TOKEN not configured");
            return NextResponse.json(
                { success: false, error: "Maintenance not configured" },
                { status: 500 }
            );
        }

        if (!token || token !== expectedToken) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // ================================
        // 2) GET ADMIN CLIENT
        // ================================
        const supabase = createAdminClient();
        if (!supabase) {
            console.error("[Maintenance] Admin client not configured");
            return NextResponse.json(
                { success: false, error: "Service unavailable" },
                { status: 503 }
            );
        }

        // ================================
        // 3) DELETE OLD RATE LIMIT RECORDS
        // ================================
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_DAYS);

        // First count how many will be deleted
        const { count: beforeCount } = await supabase
            .from("rsvp_rate_limits")
            .select("*", { count: "exact", head: true })
            .lt("created_at", cutoffDate.toISOString());

        // Delete old records
        const { error } = await supabase
            .from("rsvp_rate_limits")
            .delete()
            .lt("created_at", cutoffDate.toISOString());

        if (error) {
            console.error("[Maintenance] Delete error:", error);
            return NextResponse.json(
                { success: false, error: "Failed to delete records" },
                { status: 500 }
            );
        }

        // ================================
        // SUCCESS
        // ================================
        console.log(`[Maintenance] Cleaned up ${beforeCount || 0} old rate limit records`);

        return NextResponse.json({
            success: true,
            deletedCount: beforeCount || 0,
            cutoffDate: cutoffDate.toISOString(),
            message: `Deleted ${beforeCount || 0} records older than ${CLEANUP_DAYS} days`,
        });

    } catch (error) {
        console.error("[Maintenance] Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
` 
 
### src/app/[slug]/page.tsx 
 
`	ypescript 
`
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTemplate } from "@/templates/registry";
import { InvitationContent, DEFAULT_INVITATION_CONTENT } from "@/types/invitation";
import { Metadata } from "next";

// ============================================
// Types
// ============================================

interface PageProps {
    params: Promise<{ slug: string }>;
}

// ============================================
// Generate Metadata
// ============================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();

    if (!supabase) {
        return { title: "Convite" };
    }

    const { data: event } = await supabase
        .from("events")
        .select("content")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (!event) {
        return { title: "Convite não encontrado" };
    }

    const content = event.content as InvitationContent;
    const coupleNames = [content.couple?.brideName, content.couple?.groomName]
        .filter(Boolean)
        .join(" & ") || "Casamento";

    return {
        title: `${coupleNames} | Convite de Casamento`,
        description: content.messages?.welcomeText || "Você está convidado para o nosso casamento!",
        openGraph: {
            title: `${coupleNames} - Convite de Casamento`,
            description: content.messages?.welcomeText || "Você está convidado para o nosso casamento!",
        },
    };
}

// ============================================
// Page Component
// ============================================

export default async function InvitationPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    // If Supabase not configured, show not found
    if (!supabase) {
        notFound();
    }

    // Fetch event by slug
    const { data: event, error } = await supabase
        .from("events")
        .select("id, slug, status, template_id, content")
        .eq("slug", slug)
        .single();

    // Event not found
    if (error || !event) {
        notFound();
    }

    // Event not published
    if (event.status !== "published") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0] p-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-[#C19B58]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-10 h-10 text-[#C19B58]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-medium text-[#2A3B2E] mb-4 font-[family-name:var(--font-heading)]">
                        Convite em Preparação
                    </h1>
                    <p className="text-[#6B7A6C]">
                        Este convite ainda está sendo preparado pelos noivos.
                        Volte em breve para conferir os detalhes!
                    </p>
                </div>
            </div>
        );
    }

    // Merge content with defaults
    const rawContent = event.content as Partial<InvitationContent>;
    const content: InvitationContent = {
        couple: { ...DEFAULT_INVITATION_CONTENT.couple, ...rawContent?.couple },
        event: { ...DEFAULT_INVITATION_CONTENT.event, ...rawContent?.event },
        locations: { ...DEFAULT_INVITATION_CONTENT.locations, ...rawContent?.locations },
        messages: { ...DEFAULT_INVITATION_CONTENT.messages, ...rawContent?.messages },
        theme: { ...DEFAULT_INVITATION_CONTENT.theme, ...rawContent?.theme },
        rsvp: { ...DEFAULT_INVITATION_CONTENT.rsvp, ...rawContent?.rsvp },
    };

    // Get template component
    const TemplateComponent = getTemplate(event.template_id || "default");

    return <TemplateComponent content={content} isPreview={false} slug={slug} />;
}
 
### src/templates/registry.ts 
 
`	ypescript 
/**
 * Template Registry
 * Maps template_id to template components
 */

import { ComponentType } from "react";
import { TemplateProps, TemplateInfo } from "./types";
import TemplateDefault from "./TemplateDefault";

// ============================================
// Template Components Map
// ============================================

const templates: Record<string, ComponentType<TemplateProps>> = {
    "default": TemplateDefault,
    "classic-elegance": TemplateDefault,  // For now, all use default
    // Add more templates here as they are created:
    // "modern-minimal": TemplateModern,
    // "romantic-garden": TemplateGarden,
};

// ============================================
// Template Info Registry
// ============================================

export const templateInfos: TemplateInfo[] = [
    {
        id: "default",
        name: "Clássico",
        description: "Design elegante e atemporal",
    },
    {
        id: "classic-elegance",
        name: "Classic Elegance",
        description: "Elegante e sofisticado",
    },
];

// ============================================
// Get Template Component
// ============================================

export function getTemplate(templateId: string): ComponentType<TemplateProps> {
    return templates[templateId] || TemplateDefault;
}

// ============================================
// Get Template Info
// ============================================

export function getTemplateInfo(templateId: string): TemplateInfo | undefined {
    return templateInfos.find(t => t.id === templateId);
}

// ============================================
// Export all
// ============================================

export { TemplateDefault };
export type { TemplateProps, TemplateInfo };
` 
 
### src/services/rsvpService.ts 
 
`	ypescript 
/**
 * RSVP Service
 * Supabase-backed service for managing wedding RSVPs
 */

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

// ============================================
// Types
// ============================================

export interface RSVPGuest {
    id: string;
    event_id: string;
    name: string;
    email?: string;
    phone?: string;
    is_attending: boolean;
    guests: number;
    children: number;
    dietary_restrictions?: string;
    message?: string;
    group_name?: string;
    created_at: string;
}

export interface RSVPStats {
    total: number;
    confirmed: number;
    declined: number;
    totalGuests: number;
    totalChildren: number;
}

export type NewRSVP = Omit<RSVPGuest, "id" | "created_at">;
export type RSVPUpdate = Partial<Omit<RSVPGuest, "id" | "event_id" | "created_at">>;

// ============================================
// Service Functions
// ============================================

/**
 * Get all RSVPs for an event
 */
export async function getGuestList(eventId: string): Promise<RSVPGuest[]> {
    if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured");
        return [];
    }

    const supabase = createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching RSVPs:", error);
        return [];
    }

    return data || [];
}

/**
 * Add a new RSVP
 */
export async function addRSVP(
    eventId: string,
    payload: Omit<NewRSVP, "event_id">
): Promise<RSVPGuest | null> {
    if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured");
        return null;
    }

    const supabase = createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from("rsvps")
        .insert({
            event_id: eventId,
            ...payload,
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding RSVP:", error);
        return null;
    }

    return data;
}

/**
 * Update an RSVP
 */
export async function updateGuest(
    eventId: string,
    id: string,
    updates: RSVPUpdate
): Promise<RSVPGuest | null> {
    if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured");
        return null;
    }

    const supabase = createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from("rsvps")
        .update(updates)
        .eq("id", id)
        .eq("event_id", eventId)
        .select()
        .single();

    if (error) {
        console.error("Error updating RSVP:", error);
        return null;
    }

    return data;
}

/**
 * Remove an RSVP
 */
export async function removeRSVP(eventId: string, id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured");
        return false;
    }

    const supabase = createClient();
    if (!supabase) return false;

    const { error } = await supabase
        .from("rsvps")
        .delete()
        .eq("id", id)
        .eq("event_id", eventId);

    if (error) {
        console.error("Error removing RSVP:", error);
        return false;
    }

    return true;
}

/**
 * Get RSVP statistics for an event
 */
export async function getGuestStats(eventId: string): Promise<RSVPStats> {
    const guests = await getGuestList(eventId);

    const confirmed = guests.filter(g => g.is_attending);
    const declined = guests.filter(g => !g.is_attending);

    return {
        total: guests.length,
        confirmed: confirmed.length,
        declined: declined.length,
        totalGuests: confirmed.reduce((sum, g) => sum + (g.guests || 1), 0),
        totalChildren: confirmed.reduce((sum, g) => sum + (g.children || 0), 0),
    };
}
`
 
### src/components/gifts/GiftSection.tsx 
 
`	ypescript 
"use client";

import { useState } from "react";
import { GiftCartProvider, useGiftCart, Gift } from "./GiftCartContext";
import GiftList from "./GiftList";
import CartDrawer, { CartButton } from "./CartDrawer";
import GiftCheckoutModal from "./GiftCheckoutModal";
import PixPaymentBox from "./PixPaymentBox";

interface GiftSectionProps {
    slug: string;
    gifts: Gift[];
    pixKey?: string;
    pixName?: string;
}

function GiftSectionInner({ slug, gifts, pixKey, pixName }: GiftSectionProps) {
    const { items, totalAmount, clearCart } = useGiftCart();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Payment result state
    const [paymentInfo, setPaymentInfo] = useState<{
        referenceCode: string;
        totalAmount: number;
        pixKey: string;
        pixName?: string | null;
    } | null>(null);

    const handleOpenCheckout = () => {
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };

    const handleCheckout = async (data: {
        guestName?: string;
        guestEmail?: string;
        message?: string;
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/gifts/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    slug,
                    cart: items.map(item => ({
                        giftId: item.gift.id,
                        qty: item.qty,
                    })),
                    guestName: data.guestName,
                    guestEmail: data.guestEmail,
                    message: data.message,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.ok) {
                throw new Error(result.error || "Erro ao processar pedido");
            }

            // Success - show payment box
            setPaymentInfo({
                referenceCode: result.referenceCode,
                totalAmount: result.totalAmount,
                pixKey: result.pixKey,
                pixName: result.pixName,
            });

            // Clear cart and close checkout modal
            clearCart();
            setIsCheckoutOpen(false);
            setIsPaymentOpen(true);

        } catch (e) {
            const message = e instanceof Error ? e.message : "Erro ao processar pedido";
            setError(message);
            console.error("[GiftSection] Checkout error:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClosePayment = () => {
        setIsPaymentOpen(false);
        setPaymentInfo(null);
    };

    return (
        <>
            {/* Gift list section */}
            <GiftList gifts={gifts} />

            {/* Floating cart button */}
            <CartButton onClick={() => setIsCartOpen(true)} />

            {/* Cart drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={handleOpenCheckout}
            />

            {/* Checkout modal */}
            <GiftCheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onConfirm={handleCheckout}
                isLoading={isLoading}
                totalAmount={totalAmount}
            />

            {/* Error toast */}
            {error && (
                <div className="fixed bottom-6 left-6 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-3 font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Payment box */}
            {paymentInfo && (
                <PixPaymentBox
                    isOpen={isPaymentOpen}
                    onClose={handleClosePayment}
                    totalAmount={paymentInfo.totalAmount}
                    pixKey={paymentInfo.pixKey}
                    pixName={paymentInfo.pixName}
                    referenceCode={paymentInfo.referenceCode}
                />
            )}
        </>
    );
}

// Wrapper with provider
export default function GiftSection({ slug, gifts, pixKey, pixName }: GiftSectionProps) {
    // Don't render if no gifts
    if (!gifts || gifts.length === 0) {
        return null;
    }

    return (
        <GiftCartProvider slug={slug}>
            <GiftSectionInner
                slug={slug}
                gifts={gifts}
                pixKey={pixKey}
                pixName={pixName}
            />
        </GiftCartProvider>
    );
}
` 
 
### src/components/gifts/GiftCartContext.tsx 
 
`	ypescript 
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

// ============================================
// Types
// ============================================

export interface Gift {
    id: string;
    name: string;
    amount: number;
    description?: string;
    imageUrl?: string;
}

export interface CartItem {
    gift: Gift;
    qty: number;
}

interface GiftCartContextType {
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
    addToCart: (gift: Gift, qty?: number) => void;
    removeFromCart: (giftId: string) => void;
    updateQty: (giftId: string, qty: number) => void;
    clearCart: () => void;
    isInCart: (giftId: string) => boolean;
    getQty: (giftId: string) => number;
}

// ============================================
// Context
// ============================================

const GiftCartContext = createContext<GiftCartContextType | undefined>(undefined);

// ============================================
// Provider
// ============================================

interface GiftCartProviderProps {
    children: ReactNode;
    slug: string;
}

export function GiftCartProvider({ children, slug }: GiftCartProviderProps) {
    const [items, setItems] = useState<CartItem[]>([]);
    const storageKey = `luma_cart:${slug}`;

    // Load from localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setItems(parsed);
                }
            }
        } catch {
            // Ignore parse errors
        }
    }, [storageKey]);

    // Save to localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            localStorage.setItem(storageKey, JSON.stringify(items));
        } catch {
            // Ignore storage errors
        }
    }, [items, storageKey]);

    // Computed values
    const totalAmount = items.reduce((sum, item) => sum + item.gift.amount * item.qty, 0);
    const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

    // Actions
    const addToCart = useCallback((gift: Gift, qty = 1) => {
        setItems(prev => {
            const existing = prev.find(item => item.gift.id === gift.id);
            if (existing) {
                return prev.map(item =>
                    item.gift.id === gift.id
                        ? { ...item, qty: Math.min(item.qty + qty, 10) }
                        : item
                );
            }
            return [...prev, { gift, qty: Math.min(qty, 10) }];
        });
    }, []);

    const removeFromCart = useCallback((giftId: string) => {
        setItems(prev => prev.filter(item => item.gift.id !== giftId));
    }, []);

    const updateQty = useCallback((giftId: string, qty: number) => {
        if (qty <= 0) {
            removeFromCart(giftId);
            return;
        }
        setItems(prev =>
            prev.map(item =>
                item.gift.id === giftId
                    ? { ...item, qty: Math.min(qty, 10) }
                    : item
            )
        );
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setItems([]);
        if (typeof window !== "undefined") {
            localStorage.removeItem(storageKey);
        }
    }, [storageKey]);

    const isInCart = useCallback((giftId: string) => {
        return items.some(item => item.gift.id === giftId);
    }, [items]);

    const getQty = useCallback((giftId: string) => {
        const item = items.find(i => i.gift.id === giftId);
        return item?.qty || 0;
    }, [items]);

    return (
        <GiftCartContext.Provider
            value={{
                items,
                totalAmount,
                totalItems,
                addToCart,
                removeFromCart,
                updateQty,
                clearCart,
                isInCart,
                getQty,
            }}
        >
            {children}
        </GiftCartContext.Provider>
    );
}

export function useGiftCart() {
    const context = useContext(GiftCartContext);
    if (context === undefined) {
        throw new Error("useGiftCart must be used within a GiftCartProvider");
    }
    return context;
}
`
 
### src/components/gifts/CartDrawer.tsx 
 
`	ypescript 
"use client";

import { useState } from "react";
import { useGiftCart } from "./GiftCartContext";
import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
    const { items, totalAmount, totalItems, updateQty, removeFromCart } = useGiftCart();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <ShoppingCart size={20} />
                        <h2 className="text-lg font-semibold">Carrinho</h2>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-sm rounded-full">
                            {totalItems}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <ShoppingCart size={48} className="mb-4 opacity-30" />
                            <p>Seu carrinho está vazio</p>
                            <button
                                onClick={onClose}
                                className="mt-4 text-amber-600 hover:underline"
                            >
                                Ver presentes
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.gift.id}
                                    className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                                >
                                    {/* Gift icon */}
                                    <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">🎁</span>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">
                                            {item.gift.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {formatCurrency(item.gift.amount)} cada
                                        </p>

                                        {/* Qty controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQty(item.gift.id, item.qty - 1)}
                                                className="p-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-6 text-center text-sm">{item.qty}</span>
                                            <button
                                                onClick={() => updateQty(item.gift.id, item.qty + 1)}
                                                disabled={item.qty >= 10}
                                                className="p-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
                                            >
                                                <Plus size={14} />
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.gift.id)}
                                                className="p-1 ml-auto text-red-500 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Line total */}
                                    <div className="text-right">
                                        <span className="font-semibold text-amber-600">
                                            {formatCurrency(item.gift.amount * item.qty)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t p-4 space-y-4 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total</span>
                            <span className="text-2xl font-bold text-gray-900">
                                {formatCurrency(totalAmount)}
                            </span>
                        </div>
                        <button
                            onClick={onCheckout}
                            className="w-full py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                        >
                            Continuar para pagamento
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

// Floating cart button
interface CartButtonProps {
    onClick: () => void;
}

export function CartButton({ onClick }: CartButtonProps) {
    const { totalItems, totalAmount } = useGiftCart();

    if (totalItems === 0) return null;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 bg-amber-500 text-white rounded-full shadow-xl hover:bg-amber-600 transition-all hover:scale-105 z-30"
        >
            <div className="relative">
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-amber-600 text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                </span>
            </div>
            <span className="font-semibold">{formatCurrency(totalAmount)}</span>
        </button>
    );
}
` 
 
### src/components/gifts/PixPaymentBox.tsx 
 
`	ypescript 
"use client";

import { useState } from "react";
import { Copy, Check, QrCode, X } from "lucide-react";

interface PixPaymentBoxProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    pixKey: string;
    pixName?: string | null;
    referenceCode: string;
}

export default function PixPaymentBox({
    isOpen,
    onClose,
    totalAmount,
    pixKey,
    pixName,
    referenceCode,
}: PixPaymentBoxProps) {
    const [copiedKey, setCopiedKey] = useState(false);
    const [copiedMessage, setCopiedMessage] = useState(false);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    const pixMessage = `Presente de casamento - REF: ${referenceCode}`;

    const copyToClipboard = async (text: string, type: "key" | "message") => {
        try {
            await navigator.clipboard.writeText(text);
            if (type === "key") {
                setCopiedKey(true);
                setTimeout(() => setCopiedKey(false), 2000);
            } else {
                setCopiedMessage(true);
                setTimeout(() => setCopiedMessage(false), 2000);
            }
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);

            if (type === "key") {
                setCopiedKey(true);
                setTimeout(() => setCopiedKey(false), 2000);
            } else {
                setCopiedMessage(true);
                setTimeout(() => setCopiedMessage(false), 2000);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Modal */}
                <div
                    className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <QrCode size={32} />
                        </div>
                        <h2 className="text-xl font-bold mb-1">Pagamento via Pix</h2>
                        <p className="text-green-100">Pedido #{referenceCode}</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-5">
                        {/* Total */}
                        <div className="text-center py-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500 mb-1">Valor a transferir</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {formatCurrency(totalAmount)}
                            </p>
                        </div>

                        {/* Pix Key */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Chave Pix
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1 px-4 py-3 bg-gray-100 rounded-lg font-mono text-sm text-gray-800 truncate">
                                    {pixKey}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(pixKey, "key")}
                                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-1"
                                >
                                    {copiedKey ? <Check size={16} /> : <Copy size={16} />}
                                    {copiedKey ? "Copiado!" : "Copiar"}
                                </button>
                            </div>
                            {pixName && (
                                <p className="text-sm text-gray-500">
                                    Titular: {pixName}
                                </p>
                            )}
                        </div>

                        {/* Message/Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Mensagem para descrição do Pix
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1 px-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-800">
                                    {pixMessage}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(pixMessage, "message")}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1"
                                >
                                    {copiedMessage ? <Check size={16} /> : <Copy size={16} />}
                                    {copiedMessage ? "Copiado!" : "Copiar"}
                                </button>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                            <h4 className="font-medium text-amber-800 mb-2">
                                Como pagar:
                            </h4>
                            <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                                <li>Abra o app do seu banco</li>
                                <li>Escolha pagar via Pix</li>
                                <li>Cole a chave Pix acima</li>
                                <li>Informe o valor: {formatCurrency(totalAmount)}</li>
                                <li>Cole a mensagem na descrição</li>
                                <li>Confirme o pagamento</li>
                            </ol>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
`
 
### src/components/gifts/GiftCheckoutModal.tsx 
 
`	ypescript 
"use client";

import { useState } from "react";
import { X, Loader2, User, Mail, MessageSquare } from "lucide-react";

interface GiftCheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { guestName?: string; guestEmail?: string; message?: string }) => void;
    isLoading: boolean;
    totalAmount: number;
}

export default function GiftCheckoutModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    totalAmount,
}: GiftCheckoutModalProps) {
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [message, setMessage] = useState("");

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({
            guestName: guestName.trim() || undefined,
            guestEmail: guestEmail.trim() || undefined,
            message: message.trim() || undefined,
        });
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Modal */}
                <div
                    className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-amber-50">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Finalizar Presente
                            </h2>
                            <p className="text-sm text-gray-600">
                                Total: <span className="font-semibold text-amber-600">{formatCurrency(totalAmount)}</span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="p-2 hover:bg-amber-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        <p className="text-sm text-gray-500">
                            Deixe uma mensagem para os noivos (opcional)
                        </p>

                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                <User size={14} />
                                Seu nome
                            </label>
                            <input
                                type="text"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="Maria Silva"
                                disabled={isLoading}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                <Mail size={14} />
                                Seu email
                            </label>
                            <input
                                type="email"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                placeholder="maria@email.com"
                                disabled={isLoading}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                            />
                        </div>

                        {/* Message */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                <MessageSquare size={14} />
                                Mensagem para os noivos
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Desejo muitas felicidades..."
                                disabled={isLoading}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Honeypot - hidden from users */}
                        <input
                            type="text"
                            name="website"
                            style={{ display: "none" }}
                            tabIndex={-1}
                            autoComplete="off"
                        />

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Processando...
                                </>
                            ) : (
                                "Continuar para Pix"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
` 
 
### src/components/gifts/GiftCard.tsx 
 
`	ypescript 
"use client";

import { Gift, useGiftCart } from "./GiftCartContext";
import { Plus, Check, Minus } from "lucide-react";

interface GiftCardProps {
    gift: Gift;
}

export default function GiftCard({ gift }: GiftCardProps) {
    const { addToCart, isInCart, getQty, updateQty, removeFromCart } = useGiftCart();
    const inCart = isInCart(gift.id);
    const qty = getQty(gift.id);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image placeholder */}
            {gift.imageUrl ? (
                <div
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${gift.imageUrl})` }}
                />
            ) : (
                <div className="h-40 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                    <span className="text-4xl">🎁</span>
                </div>
            )}

            {/* Content */}
            <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                    {gift.name}
                </h3>

                {gift.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {gift.description}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-amber-600">
                        {formatCurrency(gift.amount)}
                    </span>

                    {inCart ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateQty(gift.id, qty - 1)}
                                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-medium">{qty}</span>
                            <button
                                onClick={() => updateQty(gift.id, qty + 1)}
                                disabled={qty >= 10}
                                className="p-1.5 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors disabled:opacity-50"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => addToCart(gift)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
                        >
                            <Plus size={16} />
                            Adicionar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
`
 
### src/contexts/BriefingContext.tsx 
 
`	ypescript 
"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
    generateUniqueSlug,
    generateSlugFromNames,
    generateTemporarySlug,
} from "@/lib/slug";

// ============================================
// Types
// ============================================

export interface BriefingData {
    // Template Info
    templateId: string;
    templateName: string;
    templateStyle: string;
    // Couple Info (PRIVATE - do NOT persist inside events.content)
    email: string;
    phone: string;
    brideName: string;
    groomName: string;
    // Event Details
    weddingDate: string;
    ceremonyTime: string;
    partyTime: string;
    ceremonyLocation: string;
    partyLocation: string;
    guestCount: string;
    // Style Preferences
    style: string;
    colors: string;
    message: string;
    // Metadata
    submittedAt: string;
    status: "pending" | "in_progress" | "completed";
}

/**
 * Only PUBLIC data should be stored in events.content.
 * Anything private (email/phone) must NOT go here.
 */
type EventContent = Omit<BriefingData, "email" | "phone">;

export interface EventSummary {
    id: string;
    slug: string;
    status: "draft" | "published";
    created_at: string;
    content: Partial<EventContent>;
}

interface BriefingContextType {
    briefingData: BriefingData | null;
    eventId: string | null;
    eventSlug: string | null;
    eventStatus: "draft" | "published" | null;
    allEvents: EventSummary[];
    hasBriefing: boolean;
    isLoading: boolean;
    setBriefingData: (data: BriefingData) => void;
    updateBriefingData: (updates: Partial<BriefingData>) => Promise<void>;
    createEvent: (
        templateId: string,
        templateName: string,
        templateStyle: string
    ) => Promise<boolean>;
    setActiveEvent: (eventId: string) => Promise<boolean>;
    updateSlug: (brideName: string, groomName: string) => Promise<string | null>;
    clearBriefingData: () => void;
    refreshEvents: () => Promise<void>;
}

// ============================================
// Constants
// ============================================

const STORAGE_KEY = "luma_briefing_data";

const DEFAULT_BRIEFING_DATA: BriefingData = {
    templateId: "",
    templateName: "",
    templateStyle: "",
    brideName: "",
    groomName: "",
    email: "",
    phone: "",
    weddingDate: "",
    ceremonyTime: "",
    partyTime: "",
    ceremonyLocation: "",
    partyLocation: "",
    guestCount: "",
    style: "",
    colors: "",
    message: "",
    submittedAt: "",
    status: "pending",
};

// ============================================
// Helpers: sanitize/merge for DB vs State
// ============================================

function toEventContent(data: BriefingData): EventContent {
    // Strip private fields (email/phone) before persisting
    const { email: _email, phone: _phone, ...publicPart } = data;
    return publicPart;
}

function fromEventContent(
    content: Partial<EventContent> | null | undefined,
    privateOverrides?: Partial<Pick<BriefingData, "email" | "phone">>
): BriefingData {
    return {
        ...DEFAULT_BRIEFING_DATA,
        ...(content ?? {}),
        email: privateOverrides?.email ?? DEFAULT_BRIEFING_DATA.email,
        phone: privateOverrides?.phone ?? DEFAULT_BRIEFING_DATA.phone,
    };
}

// ============================================
// Context
// ============================================

const BriefingContext = createContext<BriefingContextType | undefined>(
    undefined
);

export function BriefingProvider({ children }: { children: ReactNode }) {
    const [briefingData, setBriefingDataState] = useState<BriefingData | null>(
        null
    );
    const [eventId, setEventId] = useState<string | null>(null);
    const [eventSlug, setEventSlug] = useState<string | null>(null);
    const [eventStatus, setEventStatus] = useState<"draft" | "published" | null>(
        null
    );
    const [allEvents, setAllEvents] = useState<EventSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // ============================================
    // Helper: Load event by ID (PUBLIC content only)
    // ============================================
    const loadEventById = useCallback(
        async (
            supabase: ReturnType<typeof createClient>,
            eventIdToLoad: string,
            privateOverrides?: Partial<Pick<BriefingData, "email" | "phone">>
        ) => {
            if (!supabase) return false;

            const { data: event, error } = await supabase
                .from("events")
                // Avoid select("*") to reduce risk of leaking unexpected fields
                .select("id, slug, status, content")
                .eq("id", eventIdToLoad)
                .single();

            if (error || !event) {
                console.error("Error loading event:", error);
                return false;
            }

            setEventId(event.id);
            setEventSlug(event.slug);
            setEventStatus(event.status);

            const merged = fromEventContent(event.content as Partial<EventContent>, {
                email: privateOverrides?.email ?? "",
                phone: privateOverrides?.phone ?? "",
            });

            setBriefingDataState(merged);
            return true;
        },
        []
    );

    // ============================================
    // Load data on mount
    // ============================================
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            if (!isSupabaseConfigured()) {
                // Fallback to localStorage for development
                console.warn("SUPABASE NOT CONFIGURED: Using localStorage fallback");
                try {
                    const stored = localStorage.getItem(STORAGE_KEY);
                    if (stored) {
                        setBriefingDataState(JSON.parse(stored));
                    }
                } catch (e) {
                    console.error("Failed to parse localStorage briefing data:", e);
                }
                setIsLoading(false);
                return;
            }

            const supabase = createClient();
            if (!supabase) {
                setIsLoading(false);
                return;
            }

            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (!user) {
                    setIsLoading(false);
                    return;
                }

                // 1) Fetch all user's events
                const { data: events, error: eventsError } = await supabase
                    .from("events")
                    .select("id, slug, status, created_at, content")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (eventsError) {
                    console.error("Error fetching events:", eventsError);
                    setIsLoading(false);
                    return;
                }

                setAllEvents((events as EventSummary[]) || []);

                // 2) Fetch user's profile to get active_event_id
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("active_event_id")
                    .eq("id", user.id)
                    .single();

                if (profileError) {
                    // Not fatal; continue with fallback
                    console.warn("Could not load profile.active_event_id:", profileError);
                }

                let eventToLoad: string | null = null;

                if (profile?.active_event_id) {
                    eventToLoad = profile.active_event_id;
                } else if (events && events.length > 0) {
                    eventToLoad = events[0].id;

                    // Upsert profile with active event
                    await supabase.from("profiles").upsert(
                        {
                            id: user.id,
                            active_event_id: eventToLoad,
                        },
                        { onConflict: "id" }
                    );
                }

                // 3) Load the active event
                if (eventToLoad) {
                    // Keep private fields only in state (not in DB content)
                    await loadEventById(supabase, eventToLoad, {
                        email: user.email || "",
                        phone: "",
                    });
                } else {
                    // No event yet: keep state null
                    setBriefingDataState(null);
                    setEventId(null);
                    setEventSlug(null);
                    setEventStatus(null);
                }
            } catch (e) {
                console.error("Error loading briefing data:", e);
            }

            setIsLoading(false);
        };

        loadData();
    }, [loadEventById]);

    // ============================================
    // refreshEvents - reload all events list
    // ============================================
    const refreshEvents = useCallback(async () => {
        if (!isSupabaseConfigured()) return;

        const supabase = createClient();
        if (!supabase) return;

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: events } = await supabase
            .from("events")
            .select("id, slug, status, created_at, content")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        setAllEvents((events as EventSummary[]) || []);
    }, []);

    // ============================================
    // setActiveEvent - switch to a different event
    // ============================================
    const setActiveEvent = useCallback(
        async (newEventId: string): Promise<boolean> => {
            if (!isSupabaseConfigured()) return false;

            const supabase = createClient();
            if (!supabase) return false;

            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                if (!user) return false;

                const { error: profileError } = await supabase.from("profiles").upsert(
                    {
                        id: user.id,
                        active_event_id: newEventId,
                    },
                    { onConflict: "id" }
                );

                if (profileError) {
                    console.error("Error updating active event:", profileError);
                    return false;
                }

                const success = await loadEventById(supabase, newEventId, {
                    email: user.email || "",
                    phone: "",
                });

                return success;
            } catch (e) {
                console.error("Error setting active event:", e);
                return false;
            }
        },
        [loadEventById]
    );

    // ============================================
    // setBriefingData - set entire briefing data
    // ============================================
    const setBriefingData = useCallback((data: BriefingData) => {
        setBriefingDataState(data);

        if (!isSupabaseConfigured()) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }, []);

    // ============================================
    // updateBriefingData - update partial data
    // ============================================
    const updateBriefingData = useCallback(
        async (updates: Partial<BriefingData>) => {
            const newData = {
                ...(briefingData || DEFAULT_BRIEFING_DATA),
                ...updates,
            };
            setBriefingDataState(newData);

            if (!isSupabaseConfigured()) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
                return;
            }

            if (!eventId) return;

            const supabase = createClient();
            if (!supabase) return;

            try {
                // Persist ONLY public data
                const contentToSave = toEventContent(newData);

                const { error } = await supabase
                    .from("events")
                    .update({ content: contentToSave })
                    .eq("id", eventId);

                if (error) {
                    console.error("Error updating event:", error);
                }
            } catch (e) {
                console.error("Error updating briefing data:", e);
            }
        },
        [briefingData, eventId]
    );

    // ============================================
    // createEvent - create new event in Supabase
    // ============================================
    const createEvent = useCallback(
        async (
            templateId: string,
            templateName: string,
            templateStyle: string
        ): Promise<boolean> => {
            if (!isSupabaseConfigured()) {
                const data: BriefingData = {
                    ...DEFAULT_BRIEFING_DATA,
                    templateId,
                    templateName,
                    templateStyle,
                    submittedAt: new Date().toISOString(),
                };
                setBriefingDataState(data);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                return true;
            }

            const supabase = createClient();
            if (!supabase) return false;

            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                if (!user) {
                    console.error("No user logged in");
                    return false;
                }

                // PUBLIC content only
                const contentPublic: EventContent = {
                    ...toEventContent(DEFAULT_BRIEFING_DATA),
                    templateId,
                    templateName,
                    templateStyle,
                    submittedAt: new Date().toISOString(),
                };

                // Use temporary slug until names are set
                const baseSlug = generateTemporarySlug();
                const slug = await generateUniqueSlug(baseSlug, supabase);

                if (!slug) {
                    console.error("Could not generate unique slug");
                    return false;
                }

                const { data: newEvent, error } = await supabase
                    .from("events")
                    .insert({
                        user_id: user.id,
                        slug,
                        template_id: templateId,
                        status: "draft",
                        content: contentPublic,
                    })
                    .select("id, slug, status, content")
                    .single();

                if (error || !newEvent) {
                    console.error("Error creating event:", error);
                    return false;
                }

                await supabase.from("profiles").upsert(
                    {
                        id: user.id,
                        active_event_id: newEvent.id,
                    },
                    { onConflict: "id" }
                );

                setEventId(newEvent.id);
                setEventSlug(newEvent.slug);
                setEventStatus(newEvent.status);

                // Keep private fields only in state
                setBriefingDataState(
                    fromEventContent(newEvent.content as Partial<EventContent>, {
                        email: user.email || "",
                        phone: "",
                    })
                );

                await refreshEvents();
                return true;
            } catch (e) {
                console.error("Error creating event:", e);
                return false;
            }
        },
        [refreshEvents]
    );

    // ============================================
    // updateSlug - generate new slug from names
    // ============================================
    const updateSlug = useCallback(
        async (brideName: string, groomName: string): Promise<string | null> => {
            if (!isSupabaseConfigured() || !eventId) return null;

            const supabase = createClient();
            if (!supabase) return null;

            try {
                const baseSlug = generateSlugFromNames(brideName, groomName);
                if (!baseSlug) {
                    console.error("Cannot generate slug from empty names");
                    return null;
                }

                const newSlug = await generateUniqueSlug(baseSlug, supabase);
                if (!newSlug) {
                    console.error("Could not generate unique slug");
                    return null;
                }

                const { error } = await supabase
                    .from("events")
                    .update({ slug: newSlug })
                    .eq("id", eventId);

                if (error) {
                    console.error("Error updating slug:", error);
                    return null;
                }

                setEventSlug(newSlug);
                await refreshEvents();
                return newSlug;
            } catch (e) {
                console.error("Error updating slug:", e);
                return null;
            }
        },
        [eventId, refreshEvents]
    );

    // ============================================
    // clearBriefingData - clear all data
    // ============================================
    const clearBriefingData = useCallback(() => {
        setBriefingDataState(null);
        setEventId(null);
        setEventSlug(null);
        setEventStatus(null);

        // Only relevant for dev fallback
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // ============================================
    // Provider
    // ============================================
    return (
        <BriefingContext.Provider
            value={{
                briefingData,
                eventId,
                eventSlug,
                eventStatus,
                allEvents,
                hasBriefing: !!eventId, // more robust than !!briefingData
                isLoading,
                setBriefingData,
                updateBriefingData,
                createEvent,
                setActiveEvent,
                updateSlug,
                clearBriefingData,
                refreshEvents,
            }}
        >
            {children}
        </BriefingContext.Provider>
    );
}

export function useBriefing() {
    const context = useContext(BriefingContext);
    if (context === undefined) {
        throw new Error("useBriefing must be used within a BriefingProvider");
    }
    return context;
}
`
 
### src/app/dashboard/page.tsx 
 
`	ypescript 
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Heart,
    Calendar,
    MapPin,
    Users,
    Palette,
    Clock,
    Mail,
    Phone,
    MessageCircle,
    Edit2,
    Check,
    X,
    Sparkles,
    Tag,
} from "lucide-react";
import { useBriefing, BriefingData } from "@/contexts/BriefingContext";
import Link from "next/link";

interface EditableFieldProps {
    label: string;
    value: string;
    field: keyof BriefingData;
    icon: React.ReactNode;
    type?: "text" | "date" | "time" | "email" | "tel";
}

function EditableField({ label, value, field, icon, type = "text" }: EditableFieldProps) {
    const { updateBriefingData } = useBriefing();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);

    const handleSave = () => {
        updateBriefingData({ [field]: editValue });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
    };

    const formatDisplayValue = () => {
        if (!value) return <span className="text-[#6B7A6C]/50 italic">Não informado</span>;
        if (type === "date") {
            return new Date(value).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });
        }
        return value;
    };

    return (
        <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#DCD3C5] hover:border-[#C19B58]/30 transition-colors group">
            <div className="p-2 bg-[#C19B58]/10 rounded-lg text-[#C19B58]">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#6B7A6C] uppercase tracking-wider mb-1">{label}</p>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <input
                            type={type}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-2 text-sm bg-[#F7F5F0] border border-[#C19B58] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C19B58]/20"
                            autoFocus
                        />
                        <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Check size={16} />
                        </button>
                        <button onClick={handleCancel} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-[#2A3B2E] font-medium">{formatDisplayValue()}</p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-1.5 text-[#6B7A6C] hover:text-[#C19B58] hover:bg-[#C19B58]/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Edit2 size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { briefingData, hasBriefing, isLoading, createEvent } = useBriefing();
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateEvent = async () => {
        setIsCreating(true);
        // Create with default template - user can change later
        const success = await createEvent(
            "classic-elegance",
            "Classic Elegance",
            "Elegante e atemporal"
        );
        if (!success) {
            console.error("Failed to create event");
        }
        setIsCreating(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-[#C19B58]/30 border-t-[#C19B58] rounded-full animate-spin" />
            </div>
        );
    }

    if (!hasBriefing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md"
                >
                    <div className="w-20 h-20 bg-[#C19B58]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <Tag size={40} className="text-[#C19B58]" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-medium text-[#2A3B2E] mb-4 font-[family-name:var(--font-heading)]">
                        Crie Seu Evento
                    </h1>
                    <p className="text-[#6B7A6C] mb-6">
                        Você ainda não criou um evento. Clique abaixo para começar a personalizar seu convite de casamento.
                    </p>

                    {/* Price Card */}
                    <div className="bg-gradient-to-r from-[#2A3B2E] to-[#3E4A3F] rounded-2xl p-6 mb-6 text-white">
                        <p className="text-sm text-white/60 uppercase tracking-wider mb-2">Projeto Completo</p>
                        <p className="text-4xl font-bold font-[family-name:var(--font-heading)] mb-2">
                            R$ 197
                        </p>
                        <p className="text-sm text-white/70">Pagamento único • Tudo incluso</p>
                    </div>

                    <motion.button
                        onClick={handleCreateEvent}
                        disabled={isCreating}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#C19B58] text-white rounded-lg font-medium hover:bg-[#b08d4b] transition-colors shadow-lg shadow-[#C19B58]/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isCreating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Criando...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Criar Meu Evento
                            </>
                        )}
                    </motion.button>

                    <p className="text-xs text-[#6B7A6C] mt-4">
                        Ou <Link href="/templates" className="text-[#C19B58] hover:underline">escolha um template específico</Link>
                    </p>
                </motion.div>
            </div>
        );
    }

    const statusColors = {
        pending: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Aguardando" },
        in_progress: { bg: "bg-blue-50", text: "text-blue-700", label: "Em Produção" },
        completed: { bg: "bg-green-50", text: "text-green-700", label: "Concluído" },
    };

    const status = statusColors[briefingData?.status || "pending"];

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl md:text-3xl font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        Bem-vindos, {briefingData?.brideName} & {briefingData?.groomName}! 💍
                    </h1>
                    <p className="text-[#6B7A6C] mt-1">
                        Gerencie as informações do seu convite de casamento
                    </p>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.bg} ${status.text} text-sm font-medium`}>
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    {status.label}
                </div>
            </motion.div>

            {/* Template Card */}
            {briefingData?.templateName && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-[#2A3B2E] to-[#3E4A3F] rounded-2xl p-6 text-white"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#C19B58]/20 rounded-lg">
                            <Palette size={20} className="text-[#C19B58]" />
                        </div>
                        <div>
                            <p className="text-xs text-white/60 uppercase tracking-wider">Template Selecionado</p>
                            <h2 className="text-xl font-medium font-[family-name:var(--font-heading)]">
                                {briefingData.templateName}
                            </h2>
                        </div>
                    </div>
                    <p className="text-sm text-white/70 ml-12">{briefingData.templateStyle}</p>
                </motion.div>
            )}

            {/* Info Sections */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Couple Info */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#F7F5F0] rounded-2xl p-6 border border-[#DCD3C5]"
                >
                    <h3 className="text-lg font-medium text-[#2A3B2E] mb-4 flex items-center gap-2 font-[family-name:var(--font-heading)]">
                        <Heart size={18} className="text-[#C19B58]" />
                        Dados do Casal
                    </h3>
                    <div className="space-y-3">
                        <EditableField label="Noiva" value={briefingData?.brideName || ""} field="brideName" icon={<Heart size={16} />} />
                        <EditableField label="Noivo" value={briefingData?.groomName || ""} field="groomName" icon={<Heart size={16} />} />
                        <EditableField label="Email" value={briefingData?.email || ""} field="email" icon={<Mail size={16} />} type="email" />
                        <EditableField label="WhatsApp" value={briefingData?.phone || ""} field="phone" icon={<Phone size={16} />} type="tel" />
                    </div>
                </motion.section>

                {/* Event Details */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#F7F5F0] rounded-2xl p-6 border border-[#DCD3C5]"
                >
                    <h3 className="text-lg font-medium text-[#2A3B2E] mb-4 flex items-center gap-2 font-[family-name:var(--font-heading)]">
                        <Calendar size={18} className="text-[#C19B58]" />
                        Detalhes do Evento
                    </h3>
                    <div className="space-y-3">
                        <EditableField label="Data do Casamento" value={briefingData?.weddingDate || ""} field="weddingDate" icon={<Calendar size={16} />} type="date" />
                        <EditableField label="Horário Cerimônia" value={briefingData?.ceremonyTime || ""} field="ceremonyTime" icon={<Clock size={16} />} type="time" />
                        <EditableField label="Horário Festa" value={briefingData?.partyTime || ""} field="partyTime" icon={<Clock size={16} />} type="time" />
                        <EditableField label="Convidados" value={briefingData?.guestCount || ""} field="guestCount" icon={<Users size={16} />} />
                    </div>
                </motion.section>

                {/* Locations */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#F7F5F0] rounded-2xl p-6 border border-[#DCD3C5]"
                >
                    <h3 className="text-lg font-medium text-[#2A3B2E] mb-4 flex items-center gap-2 font-[family-name:var(--font-heading)]">
                        <MapPin size={18} className="text-[#C19B58]" />
                        Locais
                    </h3>
                    <div className="space-y-3">
                        <EditableField label="Local da Cerimônia" value={briefingData?.ceremonyLocation || ""} field="ceremonyLocation" icon={<MapPin size={16} />} />
                        <EditableField label="Local da Festa" value={briefingData?.partyLocation || ""} field="partyLocation" icon={<MapPin size={16} />} />
                    </div>
                </motion.section>

                {/* Style Preferences */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-[#F7F5F0] rounded-2xl p-6 border border-[#DCD3C5]"
                >
                    <h3 className="text-lg font-medium text-[#2A3B2E] mb-4 flex items-center gap-2 font-[family-name:var(--font-heading)]">
                        <Palette size={18} className="text-[#C19B58]" />
                        Preferências de Estilo
                    </h3>
                    <div className="space-y-3">
                        <EditableField label="Estilo do Casamento" value={briefingData?.style || ""} field="style" icon={<Sparkles size={16} />} />
                        <EditableField label="Cores Preferidas" value={briefingData?.colors || ""} field="colors" icon={<Palette size={16} />} />
                        <EditableField label="Observações" value={briefingData?.message || ""} field="message" icon={<MessageCircle size={16} />} />
                    </div>
                </motion.section>
            </div>

            {/* Submitted Info */}
            {briefingData?.submittedAt && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-sm text-[#6B7A6C]"
                >
                    Briefing enviado em{" "}
                    {new Date(briefingData.submittedAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </motion.div>
            )}
        </div>
    );
}
`
 
### src/app/dashboard/editor/page.tsx 
 
`	ypescript 
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Save,
    Eye,
    Globe,
    Loader2,
    Check,
    ExternalLink,
    Users,
    Calendar,
    MapPin,
    MessageSquare,
    Palette,
    Send,
    ChevronDown,
    ChevronUp,
    Link2,
    AlertTriangle,
    EyeOff,
    Gift,
    DollarSign,
    Plus,
    Trash2,
    Edit2
} from "lucide-react";
import { useBriefing } from "@/contexts/BriefingContext";
import { createClient } from "@/lib/supabase/client";
import { isTemporarySlug, normalizeSlug, isReservedSlug, generateUniqueSlug } from "@/lib/slug";
import { InvitationContent, DEFAULT_INVITATION_CONTENT } from "@/types/invitation";
import { getTemplate } from "@/templates/registry";
import { showToast } from "@/components/ui/Toast";
import Link from "next/link";

// ============================================
// Section Component
// ============================================

interface SectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function Section({ title, icon, children, defaultOpen = true }: SectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-[#DCD3C5] rounded-xl overflow-hidden bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#F7F5F0]/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#C19B58]/10 rounded-lg text-[#C19B58]">
                        {icon}
                    </div>
                    <span className="font-medium text-[#2A3B2E]">{title}</span>
                </div>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {isOpen && (
                <div className="p-4 pt-0 space-y-4">
                    {children}
                </div>
            )}
        </div>
    );
}

// ============================================
// Input Field Component
// ============================================

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: "text" | "date" | "time" | "textarea" | "color";
    placeholder?: string;
}

function InputField({ label, value, onChange, type = "text", placeholder }: InputFieldProps) {
    const baseClass = "w-full px-4 py-2.5 rounded-lg border border-[#DCD3C5] bg-[#F7F5F0]/50 focus:border-[#C19B58] focus:ring-1 focus:ring-[#C19B58] outline-none transition-all text-[#2A3B2E] text-sm";

    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#6B7A6C] uppercase tracking-wider">
                {label}
            </label>
            {type === "textarea" ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className={baseClass + " resize-none"}
                />
            ) : type === "color" ? (
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={value || "#000000"}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-[#DCD3C5] cursor-pointer"
                    />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="#C19B58"
                        className={baseClass + " flex-1"}
                    />
                </div>
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={baseClass}
                />
            )}
        </div>
    );
}

// ============================================
// Main Editor Page
// ============================================

export default function EditorPage() {
    const { eventId, eventSlug, hasBriefing, isLoading: contextLoading, updateSlug } = useBriefing();
    const [content, setContent] = useState<InvitationContent>(DEFAULT_INVITATION_CONTENT);
    const [templateId, setTemplateId] = useState("default");
    const [status, setStatus] = useState<"draft" | "published">("draft");
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);
    const [isUpdatingSlug, setIsUpdatingSlug] = useState(false);
    const [isUnpublishing, setIsUnpublishing] = useState(false);
    const [customSlug, setCustomSlug] = useState("");
    const [slugError, setSlugError] = useState<string | null>(null);
    const [isSavingSlug, setIsSavingSlug] = useState(false);

    // Gift/PIX state
    interface GiftItem {
        id: string;
        name: string;
        amount: number;
        description?: string;
    }
    const [gifts, setGifts] = useState<GiftItem[]>([]);
    const [pixKey, setPixKey] = useState("");
    const [pixName, setPixName] = useState("");
    const [giftsEnabled, setGiftsEnabled] = useState(false);
    const [editingGift, setEditingGift] = useState<GiftItem | null>(null);
    const [newGift, setNewGift] = useState({ name: "", amount: "", description: "" });
    const MAX_GIFTS = 20;

    // Load event data
    useEffect(() => {
        const loadEvent = async () => {
            if (!eventId) {
                setIsLoading(false);
                return;
            }

            const supabase = createClient();
            if (!supabase) {
                setIsLoading(false);
                return;
            }

            try {
                const { data: event, error } = await supabase
                    .from("events")
                    .select("*")
                    .eq("id", eventId)
                    .single();

                if (error) throw error;

                if (event) {
                    // Merge with defaults to ensure all fields exist
                    const eventContent = event.content as Partial<InvitationContent> & {
                        gifts?: GiftItem[];
                        payment?: { pixKey?: string; pixName?: string };
                        sections?: { giftsEnabled?: boolean };
                    };
                    setContent({
                        couple: { ...DEFAULT_INVITATION_CONTENT.couple, ...eventContent?.couple },
                        event: { ...DEFAULT_INVITATION_CONTENT.event, ...eventContent?.event },
                        locations: { ...DEFAULT_INVITATION_CONTENT.locations, ...eventContent?.locations },
                        messages: { ...DEFAULT_INVITATION_CONTENT.messages, ...eventContent?.messages },
                        theme: { ...DEFAULT_INVITATION_CONTENT.theme, ...eventContent?.theme },
                        rsvp: { ...DEFAULT_INVITATION_CONTENT.rsvp, ...eventContent?.rsvp },
                    });
                    setTemplateId(event.template_id || "default");
                    setStatus(event.status);

                    // Load gifts and PIX
                    setGifts(eventContent?.gifts || []);
                    setPixKey(eventContent?.payment?.pixKey || "");
                    setPixName(eventContent?.payment?.pixName || "");
                    setGiftsEnabled(eventContent?.sections?.giftsEnabled ?? false);
                }
            } catch (e) {
                console.error("Error loading event:", e);
                showToast("Erro ao carregar evento", "error");
            }

            setIsLoading(false);
        };

        if (!contextLoading) {
            loadEvent();
        }
    }, [eventId, contextLoading]);

    // Update content helper
    const updateContent = useCallback(<K extends keyof InvitationContent>(
        section: K,
        field: keyof InvitationContent[K],
        value: string | boolean
    ) => {
        setContent(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
        setHasChanges(true);
    }, []);

    // Save to Supabase
    const handleSave = async () => {
        if (!eventId) return;

        setIsSaving(true);
        const supabase = createClient();

        if (!supabase) {
            showToast("Supabase não configurado", "error");
            setIsSaving(false);
            return;
        }

        try {
            // Combine content with gifts and payment
            const fullContent = {
                ...content,
                gifts,
                payment: {
                    enabled: true,
                    pixKey,
                    pixName,
                },
                sections: {
                    giftsEnabled,
                },
            };

            const { error } = await supabase
                .from("events")
                .update({ content: fullContent, template_id: templateId })
                .eq("id", eventId);

            if (error) throw error;

            showToast("Salvo com sucesso!", "success");
            setHasChanges(false);
        } catch (e) {
            console.error("Error saving:", e);
            showToast("Erro ao salvar", "error");
        }

        setIsSaving(false);
    };

    // Publish event
    const handlePublish = async () => {
        if (!eventId) return;

        setIsPublishing(true);
        const supabase = createClient();

        if (!supabase) {
            showToast("Supabase não configurado", "error");
            setIsPublishing(false);
            return;
        }

        try {
            // Save content and update status
            const { error } = await supabase
                .from("events")
                .update({
                    content,
                    template_id: templateId,
                    status: "published"
                })
                .eq("id", eventId);

            if (error) throw error;

            setStatus("published");
            setHasChanges(false);
            showToast("Convite publicado! 🎉", "success");
        } catch (e) {
            console.error("Error publishing:", e);
            showToast("Erro ao publicar", "error");
        }

        setIsPublishing(false);
    };

    // Unpublish event (back to draft)
    const handleUnpublish = async () => {
        if (!eventId) return;
        if (!confirm("Tem certeza? O link público ficará indisponível.")) return;

        setIsUnpublishing(true);
        const supabase = createClient();

        if (!supabase) {
            showToast("Supabase não configurado", "error");
            setIsUnpublishing(false);
            return;
        }

        try {
            const { error } = await supabase
                .from("events")
                .update({ status: "draft" })
                .eq("id", eventId);

            if (error) throw error;

            setStatus("draft");
            showToast("Convite despublicado. Link público desativado.", "success");
        } catch (e) {
            console.error("Error unpublishing:", e);
            showToast("Erro ao despublicar", "error");
        }

        setIsUnpublishing(false);
    };

    // Validate and save custom slug
    const handleSaveSlug = async () => {
        if (!eventId || !customSlug.trim()) return;

        const supabase = createClient();
        if (!supabase) {
            showToast("Supabase não configurado", "error");
            return;
        }

        setIsSavingSlug(true);
        setSlugError(null);

        try {
            const normalized = normalizeSlug(customSlug);

            if (!normalized || normalized.length < 3) {
                setSlugError("Slug deve ter pelo menos 3 caracteres");
                setIsSavingSlug(false);
                return;
            }

            if (isReservedSlug(normalized)) {
                setSlugError(`"${normalized}" é um nome reservado. Escolha outro.`);
                setIsSavingSlug(false);
                return;
            }

            // Check if slug exists (excluding current event)
            const { data: existing } = await supabase
                .from("events")
                .select("id")
                .eq("slug", normalized)
                .neq("id", eventId)
                .maybeSingle();

            if (existing) {
                // Suggest alternative
                const alternative = await generateUniqueSlug(normalized, supabase);
                setSlugError(`"${normalized}" já está em uso. Sugestão: ${alternative}`);
                setCustomSlug(alternative || normalized);
                setIsSavingSlug(false);
                return;
            }

            // Save the new slug
            const { error } = await supabase
                .from("events")
                .update({ slug: normalized })
                .eq("id", eventId);

            if (error) throw error;

            showToast(`Link atualizado para /${normalized}`, "success");
            // Update local state would need context refresh
            window.location.reload();
        } catch (e) {
            console.error("Error saving slug:", e);
            showToast("Erro ao salvar link", "error");
        }

        setIsSavingSlug(false);
    };

    // Get template component for preview
    const TemplateComponent = getTemplate(templateId);

    // Loading state
    if (isLoading || contextLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-[#C19B58]/30 border-t-[#C19B58] rounded-full animate-spin" />
            </div>
        );
    }

    // No event
    if (!hasBriefing || !eventId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <p className="text-[#6B7A6C] mb-4">
                    Você precisa criar um evento primeiro.
                </p>
                <Link
                    href="/dashboard"
                    className="text-[#C19B58] hover:underline"
                >
                    Ir para o Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#DCD3C5] bg-white">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        Editor do Convite
                    </h1>
                    {status === "published" && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Publicado
                        </span>
                    )}
                    {hasChanges && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            Alterações não salvas
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {/* Open Invite Link */}
                    {status === "published" && eventSlug && (
                        <Link
                            href={`/${eventSlug}`}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#6B7A6C] hover:text-[#2A3B2E] hover:bg-[#F7F5F0] rounded-lg transition-colors"
                        >
                            <ExternalLink size={16} />
                            Abrir Convite
                        </Link>
                    )}

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2A3B2E] bg-[#F7F5F0] hover:bg-[#E5E0D6] rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSaving ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        Salvar
                    </button>

                    {/* Publish Button */}
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#C19B58] hover:bg-[#b08d4b] rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-[#C19B58]/20"
                    >
                        {isPublishing ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : status === "published" ? (
                            <Check size={16} />
                        ) : (
                            <Globe size={16} />
                        )}
                        {status === "published" ? "Atualizar" : "Publicar"}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Editor Form */}
                <div className="w-[400px] xl:w-[450px] flex-shrink-0 overflow-y-auto p-4 space-y-4 bg-[#F7F5F0] border-r border-[#DCD3C5]">
                    {/* Couple Section */}
                    <Section title="Casal" icon={<Users size={18} />}>
                        <InputField
                            label="Nome da Noiva"
                            value={content.couple.brideName}
                            onChange={(v) => updateContent("couple", "brideName", v)}
                            placeholder="Maria"
                        />
                        <InputField
                            label="Nome do Noivo"
                            value={content.couple.groomName}
                            onChange={(v) => updateContent("couple", "groomName", v)}
                            placeholder="João"
                        />

                        {/* Update Slug Button */}
                        {eventSlug && isTemporarySlug(eventSlug) && content.couple.brideName && content.couple.groomName && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-xs text-amber-700 mb-2">
                                    Seu link atual é <code className="bg-amber-100 px-1 rounded">/{eventSlug}</code>.
                                    Atualize para um link personalizado!
                                </p>
                                <button
                                    onClick={async () => {
                                        setIsUpdatingSlug(true);
                                        const newSlug = await updateSlug(content.couple.brideName, content.couple.groomName);
                                        if (newSlug) {
                                            showToast(`Link atualizado para /${newSlug}`, "success");
                                        } else {
                                            showToast("Erro ao atualizar link", "error");
                                        }
                                        setIsUpdatingSlug(false);
                                    }}
                                    disabled={isUpdatingSlug}
                                    className="w-full py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isUpdatingSlug ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <ExternalLink size={14} />
                                    )}
                                    Atualizar Link Automaticamente
                                </button>
                            </div>
                        )}
                    </Section>

                    {/* Event Section */}
                    <Section title="Evento" icon={<Calendar size={18} />}>
                        <InputField
                            label="Data do Casamento"
                            value={content.event.weddingDate}
                            onChange={(v) => updateContent("event", "weddingDate", v)}
                            type="date"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Horário Cerimônia"
                                value={content.event.ceremonyTime}
                                onChange={(v) => updateContent("event", "ceremonyTime", v)}
                                type="time"
                            />
                            <InputField
                                label="Horário Festa"
                                value={content.event.partyTime}
                                onChange={(v) => updateContent("event", "partyTime", v)}
                                type="time"
                            />
                        </div>
                    </Section>

                    {/* Locations Section */}
                    <Section title="Locais" icon={<MapPin size={18} />}>
                        <InputField
                            label="Local da Cerimônia"
                            value={content.locations.ceremonyLocation}
                            onChange={(v) => updateContent("locations", "ceremonyLocation", v)}
                            placeholder="Igreja São José"
                        />
                        <InputField
                            label="Endereço da Cerimônia"
                            value={content.locations.ceremonyAddress || ""}
                            onChange={(v) => updateContent("locations", "ceremonyAddress", v)}
                            placeholder="Rua das Flores, 123"
                        />
                        <InputField
                            label="Local da Festa"
                            value={content.locations.partyLocation}
                            onChange={(v) => updateContent("locations", "partyLocation", v)}
                            placeholder="Espaço Jardim"
                        />
                        <InputField
                            label="Endereço da Festa"
                            value={content.locations.partyAddress || ""}
                            onChange={(v) => updateContent("locations", "partyAddress", v)}
                            placeholder="Av. Principal, 456"
                        />
                    </Section>

                    {/* Messages Section */}
                    <Section title="Mensagens" icon={<MessageSquare size={18} />}>
                        <InputField
                            label="Texto de Boas-vindas"
                            value={content.messages.welcomeText}
                            onChange={(v) => updateContent("messages", "welcomeText", v)}
                            type="textarea"
                            placeholder="Com alegria convidamos você..."
                        />
                        <InputField
                            label="Nossa História"
                            value={content.messages.storyText}
                            onChange={(v) => updateContent("messages", "storyText", v)}
                            type="textarea"
                            placeholder="Nossa história de amor começou..."
                        />
                        <InputField
                            label="Mensagem de Encerramento"
                            value={content.messages.closingText || ""}
                            onChange={(v) => updateContent("messages", "closingText", v)}
                            placeholder="Com amor, Noiva & Noivo"
                        />
                    </Section>

                    {/* Theme Section */}
                    <Section title="Cores" icon={<Palette size={18} />} defaultOpen={false}>
                        <InputField
                            label="Cor Primária (destaques)"
                            value={content.theme.primaryColor}
                            onChange={(v) => updateContent("theme", "primaryColor", v)}
                            type="color"
                        />
                        <InputField
                            label="Cor Secundária (fundos)"
                            value={content.theme.secondaryColor}
                            onChange={(v) => updateContent("theme", "secondaryColor", v)}
                            type="color"
                        />
                    </Section>

                    {/* Publication & Link Section */}
                    <Section title="Publicação e Link" icon={<Link2 size={18} />} defaultOpen={false}>
                        {/* Current Link */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#6B7A6C] uppercase tracking-wider">
                                Link Atual
                            </label>
                            {eventSlug && (
                                <div className="flex items-center gap-2 p-3 bg-[#F7F5F0] rounded-lg">
                                    <code className="text-sm text-[#2A3B2E] flex-1 truncate">
                                        {typeof window !== 'undefined' ? window.location.origin : ''}/{eventSlug}
                                    </code>
                                    {status === "published" && (
                                        <Link
                                            href={`/${eventSlug}`}
                                            target="_blank"
                                            className="text-[#C19B58] hover:text-[#A88347]"
                                        >
                                            <ExternalLink size={16} />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Custom Slug Editor */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#6B7A6C] uppercase tracking-wider">
                                Editar Link
                            </label>
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A6C] text-sm">/</span>
                                    <input
                                        type="text"
                                        value={customSlug || eventSlug || ""}
                                        onChange={(e) => {
                                            setCustomSlug(e.target.value);
                                            setSlugError(null);
                                        }}
                                        placeholder="ana-joao"
                                        className="w-full pl-6 pr-3 py-2.5 rounded-lg border border-[#DCD3C5] bg-white focus:border-[#C19B58] focus:ring-1 focus:ring-[#C19B58] outline-none transition-all text-[#2A3B2E] text-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleSaveSlug}
                                    disabled={isSavingSlug || (!customSlug || customSlug === eventSlug)}
                                    className="px-4 py-2 bg-[#2A3B2E] text-white rounded-lg text-sm font-medium hover:bg-[#1a261d] transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSavingSlug ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <Check size={14} />
                                    )}
                                    Salvar
                                </button>
                            </div>
                            {slugError && (
                                <p className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertTriangle size={12} />
                                    {slugError}
                                </p>
                            )}
                        </div>

                        {/* Warning */}
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                            <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700">
                                Alterar o link pode quebrar links já compartilhados. Use com cuidado.
                            </p>
                        </div>

                        {/* Unpublish Button */}
                        {status === "published" && (
                            <button
                                onClick={handleUnpublish}
                                disabled={isUnpublishing}
                                className="w-full py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isUnpublishing ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <EyeOff size={14} />
                                )}
                                Despublicar (voltar para rascunho)
                            </button>
                        )}
                    </Section>

                    {/* RSVP Section */}
                    <Section title="Confirmação de Presença" icon={<Send size={18} />} defaultOpen={false}>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#6B7A6C]">Habilitar RSVP</span>
                            <button
                                onClick={() => updateContent("rsvp", "enabled", !content.rsvp.enabled)}
                                className={`w-12 h-6 rounded-full transition-colors ${content.rsvp.enabled ? "bg-[#C19B58]" : "bg-[#DCD3C5]"
                                    }`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${content.rsvp.enabled ? "translate-x-6" : "translate-x-0.5"
                                    }`} />
                            </button>
                        </div>
                        {content.rsvp.enabled && (
                            <>
                                <InputField
                                    label="Prazo para Confirmação"
                                    value={content.rsvp.deadline || ""}
                                    onChange={(v) => updateContent("rsvp", "deadline", v)}
                                    type="date"
                                />
                                <InputField
                                    label="WhatsApp para RSVP"
                                    value={content.rsvp.whatsappNumber || ""}
                                    onChange={(v) => updateContent("rsvp", "whatsappNumber", v)}
                                    placeholder="5511999999999"
                                />
                            </>
                        )}
                    </Section>

                    {/* Gifts Section */}
                    <Section title="Presentes e PIX" icon={<Gift size={18} />} defaultOpen={false}>
                        {/* Enable Gifts Toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#6B7A6C]">Habilitar Lista de Presentes</span>
                            <button
                                onClick={() => {
                                    setGiftsEnabled(!giftsEnabled);
                                    setHasChanges(true);
                                }}
                                className={`w-12 h-6 rounded-full transition-colors ${giftsEnabled ? "bg-[#C19B58]" : "bg-[#DCD3C5]"}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${giftsEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
                            </button>
                        </div>

                        {giftsEnabled && (
                            <>
                                {/* PIX Configuration */}
                                <div className="p-4 bg-[#F7F5F0] rounded-lg space-y-3">
                                    <p className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">
                                        Configuração PIX
                                    </p>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[#6B7A6C]">Chave PIX *</label>
                                        <input
                                            type="text"
                                            value={pixKey}
                                            onChange={(e) => {
                                                setPixKey(e.target.value);
                                                setHasChanges(true);
                                            }}
                                            className="w-full px-3 py-2 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none"
                                            placeholder="email@exemplo.com ou CPF"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[#6B7A6C]">Nome do Titular</label>
                                        <input
                                            type="text"
                                            value={pixName}
                                            onChange={(e) => {
                                                setPixName(e.target.value);
                                                setHasChanges(true);
                                            }}
                                            className="w-full px-3 py-2 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none"
                                            placeholder="Nome completo"
                                        />
                                    </div>
                                </div>

                                {/* Add Gift Form */}
                                <div className="p-4 bg-white border border-[#DCD3C5] rounded-lg space-y-3">
                                    <p className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">
                                        Adicionar Presente ({gifts.length}/{MAX_GIFTS})
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs text-[#6B7A6C]">Nome *</label>
                                            <input
                                                type="text"
                                                value={newGift.name}
                                                onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none"
                                                placeholder="Jogo de panelas"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-[#6B7A6C]">Valor (R$) *</label>
                                            <input
                                                type="number"
                                                value={newGift.amount}
                                                onChange={(e) => setNewGift({ ...newGift, amount: e.target.value })}
                                                className="w-full px-3 py-2 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none"
                                                placeholder="250"
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[#6B7A6C]">Descrição (opcional)</label>
                                        <input
                                            type="text"
                                            value={newGift.description}
                                            onChange={(e) => setNewGift({ ...newGift, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none"
                                            placeholder="Para nossa cozinha"
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!newGift.name.trim() || !newGift.amount) {
                                                showToast("Nome e valor são obrigatórios", "error");
                                                return;
                                            }
                                            const amount = parseFloat(newGift.amount);
                                            if (isNaN(amount) || amount <= 0) {
                                                showToast("Valor deve ser maior que zero", "error");
                                                return;
                                            }
                                            if (gifts.length >= MAX_GIFTS) {
                                                showToast(`Limite de ${MAX_GIFTS} presentes atingido`, "error");
                                                return;
                                            }
                                            const gift: GiftItem = {
                                                id: crypto.randomUUID(),
                                                name: newGift.name.trim(),
                                                amount,
                                                description: newGift.description.trim() || undefined,
                                            };
                                            setGifts([...gifts, gift]);
                                            setNewGift({ name: "", amount: "", description: "" });
                                            setHasChanges(true);
                                        }}
                                        disabled={gifts.length >= MAX_GIFTS}
                                        className="w-full py-2 bg-[#C19B58] text-white rounded-lg text-sm font-medium hover:bg-[#A88347] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Adicionar Presente
                                    </button>
                                </div>

                                {/* Gifts List */}
                                {gifts.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">
                                            Lista de Presentes
                                        </p>
                                        {gifts.map((gift, index) => (
                                            <div
                                                key={gift.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-[#2A3B2E] truncate">{gift.name}</p>
                                                    <p className="text-sm text-[#6B7A6C]">
                                                        R$ {gift.amount.toFixed(2)}
                                                        {gift.description && ` • ${gift.description}`}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setNewGift({
                                                                name: gift.name,
                                                                amount: gift.amount.toString(),
                                                                description: gift.description || "",
                                                            });
                                                            setGifts(gifts.filter(g => g.id !== gift.id));
                                                            setHasChanges(true);
                                                        }}
                                                        className="p-1.5 text-[#6B7A6C] hover:bg-gray-200 rounded transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setGifts(gifts.filter(g => g.id !== gift.id));
                                                            setHasChanges(true);
                                                        }}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        title="Remover"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {!pixKey && (
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                                        <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-700">
                                            Configure a chave PIX para habilitar o checkout de presentes.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </Section>
                </div>

                {/* Right: Live Preview */}
                <div className="flex-1 overflow-hidden bg-gray-100">
                    <div className="h-full overflow-y-auto">
                        <div className="flex items-center justify-center p-2 bg-gray-200 text-xs text-gray-600 gap-2">
                            <Eye size={14} />
                            <span>Preview ao vivo</span>
                        </div>
                        <div className="transform origin-top scale-[0.85] xl:scale-90">
                            <TemplateComponent content={content} isPreview={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
`
 
### src/app/dashboard/financial/page.tsx 
 
`	ypescript 
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Wallet,
    Gift,
    Copy,
    Check,
    DollarSign,
    TrendingUp,
    RefreshCw,
    Loader2,
    Package,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import { useBriefing } from "@/contexts/BriefingContext";
import {
    getTransactions,
    getTransactionStats,
    GiftTransaction,
    TransactionStats
} from "@/services/transactionService";
import {
    getOrders,
    getOrderStats,
    updateOrderStatus,
    GiftOrder,
    GiftOrderStats
} from "@/services/giftOrdersService";
import Link from "next/link";

export default function FinancialPage() {
    const { eventId, briefingData, hasBriefing, isLoading: contextLoading, updateBriefingData } = useBriefing();
    const [transactions, setTransactions] = useState<GiftTransaction[]>([]);
    const [stats, setStats] = useState<TransactionStats>({
        total: 0,
        confirmed: 0,
        pending: 0,
        totalAmount: 0,
        confirmedAmount: 0
    });
    const [pixKey, setPixKey] = useState("");
    const [pixHolder, setPixHolder] = useState("");
    const [copied, setCopied] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Gift Orders state
    const [orders, setOrders] = useState<GiftOrder[]>([]);
    const [orderStats, setOrderStats] = useState<GiftOrderStats>({
        pending: { count: 0, total: 0 },
        confirmed: { count: 0, total: 0 },
        cancelled: { count: 0, total: 0 },
    });
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        if (!eventId) return;

        setIsRefreshing(true);
        try {
            const [txList, txStats, orderList, oStats] = await Promise.all([
                getTransactions(eventId),
                getTransactionStats(eventId),
                getOrders(eventId),
                getOrderStats(eventId),
            ]);
            setTransactions(txList);
            setStats(txStats);
            setOrders(orderList);
            setOrderStats(oStats);
        } catch (e) {
            console.error("Error loading data:", e);
            showToast("Erro ao carregar dados", "error");
        }

        // Load PIX config from briefingData (Supabase)
        const payment = (briefingData as { payment?: { pixKey?: string; pixName?: string } } | null)?.payment;
        if (payment) {
            setPixKey(payment.pixKey || "");
            setPixHolder(payment.pixName || "");
        }

        setIsRefreshing(false);
        setIsLoading(false);
    }, [eventId, briefingData]);

    useEffect(() => {
        if (!contextLoading && eventId) {
            loadData();
        } else if (!contextLoading && !eventId) {
            setIsLoading(false);
        }
    }, [contextLoading, eventId, loadData]);

    const handleCopyPix = () => {
        navigator.clipboard.writeText(pixKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSavePixConfig = async () => {
        setIsSaving(true);

        try {
            // Save PIX config to Supabase via BriefingContext
            await updateBriefingData({
                payment: {
                    enabled: true,
                    pixKey,
                    pixName: pixHolder,
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
            showToast("Configurações de PIX salvas!", "success");
        } catch (error) {
            console.error("Error saving PIX config:", error);
            showToast("Erro ao salvar configurações de PIX", "error");
        }

        setIsSaving(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return "agora";
        if (diffHours < 24) return `há ${diffHours}h`;
        if (diffHours < 48) return "ontem";
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    const handleUpdateOrderStatus = async (orderId: string, newStatus: "pending" | "confirmed" | "cancelled") => {
        setUpdatingOrderId(orderId);

        const success = await updateOrderStatus(orderId, newStatus);

        if (success) {
            showToast(
                newStatus === "confirmed"
                    ? "Pedido confirmado!"
                    : newStatus === "cancelled"
                        ? "Pedido cancelado"
                        : "Status atualizado",
                "success"
            );
            await loadData();
        } else {
            showToast("Erro ao atualizar status", "error");
        }

        setUpdatingOrderId(null);
    };

    const filteredOrders = statusFilter === "all"
        ? orders
        : orders.filter(o => o.status === statusFilter);

    const averageGift = stats.total > 0 ? Math.round(stats.totalAmount / stats.total) : 0;

    // Loading state
    if (isLoading || contextLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-[#C19B58]/30 border-t-[#C19B58] rounded-full animate-spin" />
            </div>
        );
    }

    // No event
    if (!hasBriefing || !eventId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <Wallet size={48} className="text-[#DCD3C5] mb-4" />
                <p className="text-[#6B7A6C] mb-4">
                    Você precisa criar um evento primeiro para gerenciar finanças.
                </p>
                <Link
                    href="/dashboard"
                    className="text-[#C19B58] hover:underline"
                >
                    Ir para o Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        Financeiro & Presentes
                    </h1>
                    <p className="text-[#6B7A6C] mt-1">
                        Gerencie os presentes recebidos e configure seu PIX.
                    </p>
                </div>
                <button
                    onClick={loadData}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-3 py-2.5 border border-[#DCD3C5] text-[#6B7A6C] text-sm rounded-lg hover:bg-[#E5E0D6] transition-colors disabled:opacity-50"
                    title="Atualizar dados"
                >
                    {isRefreshing ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <RefreshCw size={16} />
                    )}
                    Atualizar
                </button>
            </header>

            {/* Balance Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#2A3B2E] to-[#1a261d] rounded-2xl p-8 text-white relative overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C19B58]/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-white/10">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className="text-white/60 text-sm">Valor Total Recebido</p>
                            {stats.total > 0 && (
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={14} className="text-emerald-400" />
                                    <span className="text-emerald-400 text-xs">
                                        {stats.confirmed} confirmado{stats.confirmed > 1 ? 's' : ''}, {stats.pending} pendente{stats.pending > 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-5xl font-medium font-[family-name:var(--font-heading)] mb-4">
                        R$ {stats.confirmedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>

                    <p className="text-white/60 text-sm">
                        💚 Os valores caem direto na sua conta via PIX
                    </p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/80 p-6 rounded-xl border border-[#DCD3C5]"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-[#C19B58]/10">
                            <Gift size={20} className="text-[#C19B58]" />
                        </div>
                        <div>
                            <p className="text-2xl font-medium text-[#2A3B2E]">{stats.total}</p>
                            <p className="text-xs text-[#6B7A6C]">Presentes recebidos</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 p-6 rounded-xl border border-[#DCD3C5]"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-emerald-50">
                            <DollarSign size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-medium text-[#2A3B2E]">
                                R$ {averageGift}
                            </p>
                            <p className="text-xs text-[#6B7A6C]">Média por presente</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 p-6 rounded-xl border border-[#DCD3C5]"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-emerald-50">
                            <Check size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-medium text-[#2A3B2E]">Instantâneo</p>
                            <p className="text-xs text-[#6B7A6C]">PIX cai direto na conta</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* PIX Configuration & Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PIX Config */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#DCD3C5] p-6"
                >
                    <h2 className="text-lg font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)] mb-6">
                        Configurar Recebimento
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider block mb-2">
                                Chave PIX
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={pixKey}
                                    onChange={(e) => setPixKey(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none bg-white text-[#2A3B2E]"
                                    placeholder="email@exemplo.com ou CPF"
                                />
                                <button
                                    onClick={handleCopyPix}
                                    disabled={!pixKey}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-[#E5E0D6] text-[#6B7A6C] transition-colors disabled:opacity-50"
                                    title="Copiar"
                                >
                                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider block mb-2">
                                Nome do Titular
                            </label>
                            <input
                                type="text"
                                value={pixHolder}
                                onChange={(e) => setPixHolder(e.target.value)}
                                className="w-full px-4 py-3 border border-[#DCD3C5] rounded-lg text-sm focus:border-[#C19B58] focus:outline-none bg-white text-[#2A3B2E]"
                                placeholder="Nome completo"
                            />
                        </div>

                        <button
                            onClick={handleSavePixConfig}
                            disabled={isSaving}
                            className="w-full py-3 bg-[#2A3B2E] text-[#F7F5F0] rounded-lg font-medium text-sm hover:bg-[#1a261d] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                "Salvar Configurações"
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Recent Transactions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#DCD3C5] p-6"
                >
                    <h2 className="text-lg font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)] mb-6">
                        Últimos Presentes
                    </h2>

                    <div className="space-y-4">
                        {transactions.length === 0 && (
                            <p className="text-sm text-[#6B7A6C] text-center py-8">
                                Nenhum presente recebido ainda.
                            </p>
                        )}

                        {transactions.slice(0, 5).map((tx) => (
                            <div
                                key={tx.id}
                                className="flex items-center justify-between pb-4 border-b border-[#DCD3C5]/50 last:border-0 last:pb-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#C19B58]/10 text-[#C19B58] flex items-center justify-center">
                                        <Gift size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#2A3B2E]">{tx.guest_name || "Anônimo"}</p>
                                        <p className="text-xs text-[#6B7A6C]">{tx.gift_name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-medium ${tx.status === 'confirmed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {tx.status === 'confirmed' ? '+' : ''}R$ {Number(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-[10px] text-[#6B7A6C]">
                                        {tx.status === 'pending' ? 'Pendente • ' : ''}{formatDate(tx.created_at)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Gift Orders Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#DCD3C5] p-6"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h2 className="text-lg font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        Pedidos de Presentes
                    </h2>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        {(["all", "pending", "confirmed", "cancelled"] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${statusFilter === status
                                        ? "bg-[#2A3B2E] text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {status === "all" && `Todos (${orders.length})`}
                                {status === "pending" && `Pendentes (${orderStats.pending.count})`}
                                {status === "confirmed" && `Confirmados (${orderStats.confirmed.count})`}
                                {status === "cancelled" && `Cancelados (${orderStats.cancelled.count})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Order Stats Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-amber-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-amber-600">{formatCurrency(orderStats.pending.total)}</p>
                        <p className="text-xs text-amber-700">{orderStats.pending.count} pendente{orderStats.pending.count !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-emerald-600">{formatCurrency(orderStats.confirmed.total)}</p>
                        <p className="text-xs text-emerald-700">{orderStats.confirmed.count} confirmado{orderStats.confirmed.count !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-gray-500">{formatCurrency(orderStats.cancelled.total)}</p>
                        <p className="text-xs text-gray-500">{orderStats.cancelled.count} cancelado{orderStats.cancelled.count !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-3">
                    {filteredOrders.length === 0 && (
                        <p className="text-sm text-[#6B7A6C] text-center py-8">
                            Nenhum pedido {statusFilter !== "all" ? `com status "${statusFilter}"` : "encontrado"}.
                        </p>
                    )}

                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="border border-[#DCD3C5] rounded-lg overflow-hidden"
                        >
                            {/* Order Header */}
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${order.status === "pending" ? "bg-amber-100 text-amber-600" :
                                            order.status === "confirmed" ? "bg-emerald-100 text-emerald-600" :
                                                "bg-gray-100 text-gray-500"
                                        }`}>
                                        {order.status === "pending" && <Clock size={18} />}
                                        {order.status === "confirmed" && <CheckCircle size={18} />}
                                        {order.status === "cancelled" && <XCircle size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#2A3B2E]">
                                            #{order.reference_code}
                                            {order.guest_name && ` - ${order.guest_name}`}
                                        </p>
                                        <p className="text-xs text-[#6B7A6C]">
                                            {formatDate(order.created_at)}
                                            {order.guest_email && ` • ${order.guest_email}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-[#2A3B2E]">
                                        {formatCurrency(order.total_amount)}
                                    </span>
                                    {expandedOrder === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedOrder === order.id && (
                                <div className="border-t border-[#DCD3C5] p-4 bg-gray-50">
                                    {/* Items */}
                                    <div className="mb-4">
                                        <p className="text-xs font-medium text-[#6B7A6C] mb-2">Itens:</p>
                                        <div className="space-y-2">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-[#2A3B2E]">
                                                        {item.qty}x {item.name}
                                                    </span>
                                                    <span className="text-[#6B7A6C]">
                                                        {formatCurrency(item.lineTotal)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    {order.message && (
                                        <div className="mb-4 p-3 bg-white rounded-lg">
                                            <p className="text-xs font-medium text-[#6B7A6C] mb-1">Mensagem:</p>
                                            <p className="text-sm text-[#2A3B2E] italic">"{order.message}"</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {order.status !== "confirmed" && (
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order.id, "confirmed")}
                                                disabled={updatingOrderId === order.id}
                                                className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {updatingOrderId === order.id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <CheckCircle size={14} />
                                                )}
                                                Confirmar Recebimento
                                            </button>
                                        )}
                                        {order.status !== "cancelled" && (
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                                                disabled={updatingOrderId === order.id}
                                                className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {updatingOrderId === order.id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <XCircle size={14} />
                                                )}
                                                Cancelar
                                            </button>
                                        )}
                                        {order.status !== "pending" && (
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order.id, "pending")}
                                                disabled={updatingOrderId === order.id}
                                                className="py-2 px-4 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            >
                                                Voltar para Pendente
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
`
 
### src/app/dashboard/events/page.tsx 
 
`	ypescript 
"use client";

import { useEffect, useState } from "react";
import { useBriefing, EventSummary } from "@/contexts/BriefingContext";
import { Plus, Check, Calendar, Globe, Pencil, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/components/ui/Toast";

export default function EventsPage() {
    const {
        allEvents,
        eventId: activeEventId,
        setActiveEvent,
        createEvent,
        refreshEvents,
        isLoading
    } = useBriefing();

    const [isCreating, setIsCreating] = useState(false);
    const [isSwitching, setIsSwitching] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Format date
    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    // Get event display name from content
    const getEventName = (event: EventSummary) => {
        const content = event.content;
        if (content?.brideName && content?.groomName) {
            return `${content.brideName} & ${content.groomName}`;
        }
        if (content?.brideName || content?.groomName) {
            return content.brideName || content.groomName;
        }
        return "Novo Evento";
    };

    // Handle creating new event
    const handleCreateEvent = async () => {
        setIsCreating(true);
        const success = await createEvent("default", "Template Padrão", "classic");
        if (success) {
            showToast("Novo evento criado!", "success");
        } else {
            showToast("Erro ao criar evento", "error");
        }
        setIsCreating(false);
    };

    // Handle selecting an event
    const handleSelectEvent = async (eventIdToSelect: string) => {
        if (eventIdToSelect === activeEventId) return;

        setIsSwitching(eventIdToSelect);
        const success = await setActiveEvent(eventIdToSelect);
        if (success) {
            showToast("Evento selecionado!", "success");
        } else {
            showToast("Erro ao selecionar evento", "error");
        }
        setIsSwitching(null);
    };

    // Handle deleting an event
    const handleDeleteEvent = async (eventIdToDelete: string) => {
        if (!confirm("Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.")) {
            return;
        }

        setIsDeleting(eventIdToDelete);

        const supabase = createClient();
        if (!supabase) {
            showToast("Erro de conexão", "error");
            setIsDeleting(null);
            return;
        }

        try {
            const { error } = await supabase
                .from("events")
                .delete()
                .eq("id", eventIdToDelete);

            if (error) {
                throw error;
            }

            showToast("Evento excluído", "success");
            await refreshEvents();

            // If deleted the active event, switch to another
            if (eventIdToDelete === activeEventId && allEvents.length > 1) {
                const otherEvent = allEvents.find(e => e.id !== eventIdToDelete);
                if (otherEvent) {
                    await setActiveEvent(otherEvent.id);
                }
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            showToast("Erro ao excluir evento", "error");
        }

        setIsDeleting(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#C19B58]" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-[#2A3B2E]">
                        Meus Eventos
                    </h1>
                    <p className="text-[#6B7A6C] mt-1">
                        Gerencie seus eventos e selecione qual está ativo
                    </p>
                </div>

                <button
                    onClick={handleCreateEvent}
                    disabled={isCreating}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A3B2E] text-white rounded-lg font-medium hover:bg-[#1a261d] transition-colors disabled:opacity-70"
                >
                    {isCreating ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Plus size={18} />
                    )}
                    Novo Evento
                </button>
            </div>

            {/* Events Grid */}
            {allEvents.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#DCD3C5] p-12 text-center">
                    <div className="w-16 h-16 bg-[#C19B58]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={32} className="text-[#C19B58]" />
                    </div>
                    <h3 className="text-lg font-medium text-[#2A3B2E] mb-2">
                        Nenhum evento ainda
                    </h3>
                    <p className="text-[#6B7A6C] mb-6">
                        Crie seu primeiro evento para começar
                    </p>
                    <button
                        onClick={handleCreateEvent}
                        disabled={isCreating}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#C19B58] text-white rounded-lg font-medium hover:bg-[#A88347] transition-colors"
                    >
                        <Plus size={18} />
                        Criar Primeiro Evento
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {allEvents.map((event) => {
                        const isActive = event.id === activeEventId;
                        const isCurrentlySwitching = isSwitching === event.id;
                        const isCurrentlyDeleting = isDeleting === event.id;

                        return (
                            <div
                                key={event.id}
                                className={`bg-white rounded-xl border-2 p-6 transition-all ${isActive
                                        ? "border-[#C19B58] shadow-md"
                                        : "border-[#DCD3C5] hover:border-[#C19B58]/50"
                                    }`}
                            >
                                {/* Active Badge */}
                                {isActive && (
                                    <div className="flex items-center gap-1 text-xs font-medium text-[#C19B58] mb-3">
                                        <Check size={14} />
                                        Evento Ativo
                                    </div>
                                )}

                                {/* Event Name */}
                                <h3 className="text-lg font-semibold text-[#2A3B2E] mb-1">
                                    {getEventName(event)}
                                </h3>

                                {/* Slug */}
                                <p className="text-sm text-[#6B7A6C] mb-3 font-mono">
                                    /{event.slug}
                                </p>

                                {/* Status & Date */}
                                <div className="flex items-center gap-4 text-sm text-[#6B7A6C] mb-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${event.status === "published"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}>
                                        <Globe size={12} />
                                        {event.status === "published" ? "Publicado" : "Rascunho"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {formatDate(event.created_at)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {!isActive && (
                                        <button
                                            onClick={() => handleSelectEvent(event.id)}
                                            disabled={isCurrentlySwitching}
                                            className="flex-1 py-2 bg-[#C19B58] text-white rounded-lg text-sm font-medium hover:bg-[#A88347] transition-colors disabled:opacity-70 flex items-center justify-center gap-1"
                                        >
                                            {isCurrentlySwitching ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                <Check size={14} />
                                            )}
                                            Selecionar
                                        </button>
                                    )}

                                    {isActive && (
                                        <Link
                                            href="/dashboard/editor"
                                            className="flex-1 py-2 bg-[#2A3B2E] text-white rounded-lg text-sm font-medium hover:bg-[#1a261d] transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Pencil size={14} />
                                            Editar
                                        </Link>
                                    )}

                                    <button
                                        onClick={() => handleDeleteEvent(event.id)}
                                        disabled={isCurrentlyDeleting}
                                        className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors disabled:opacity-70"
                                        title="Excluir evento"
                                    >
                                        {isCurrentlyDeleting ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
`
