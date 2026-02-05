-- ============================================
-- LUMA - ULTIMATE DATABASE SETUP (Restoration Script)
-- ============================================
-- This script contains the logic from schema.sql, v2_migration.sql, and all patches.
-- It sets up Tables, RLS, Indexes, Triggers, and Storage Policies.
-- Safe to run in a fresh Supabase project or existing one.

-- ============================================
-- 1. UTILITY FUNCTIONS
-- ============================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- 2. CORE TABLES
-- ============================================

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    template_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    event_type VARCHAR(20) DEFAULT 'wedding' CHECK (event_type IN ('wedding', 'graduation')),
    plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'plus', 'concierge')),
    event_date DATE,
    expires_at TIMESTAMPTZ,
    password_hash VARCHAR(255),
    content JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_plan ON events(plan);
CREATE INDEX IF NOT EXISTS idx_events_expires_at ON events(expires_at);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Profiles Table (Multi-Event Support)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    active_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_active_event ON profiles(active_event_id);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RSVPs Table
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
    ip_hash VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON rsvps(event_id);
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Gifts Table (Catalog)
CREATE TABLE IF NOT EXISTS gifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    suggested_value NUMERIC(10, 2),
    pix_key VARCHAR(255),
    pix_key_type VARCHAR(20) CHECK (pix_key_type IN ('cpf', 'cnpj', 'email', 'phone', 'random')),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gifts_event_id ON gifts(event_id);
CREATE INDEX IF NOT EXISTS idx_gifts_display_order ON gifts(event_id, display_order);
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

-- Gift Orders Table (Checkout System)
CREATE TABLE IF NOT EXISTS gift_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    reference_code TEXT NOT NULL UNIQUE,
    guest_name TEXT,
    guest_email TEXT,
    message TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'pix',
    status TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gift_orders_event_created ON gift_orders(event_id, created_at DESC);
ALTER TABLE gift_orders ENABLE ROW LEVEL SECURITY;

-- Gift Transactions (Legacy/Manual Tracking)
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

CREATE INDEX IF NOT EXISTS idx_gift_transactions_event_id ON gift_transactions(event_id);
ALTER TABLE gift_transactions ENABLE ROW LEVEL SECURITY;

-- Assets Table (Gallery Photos Metadata)
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    asset_type VARCHAR(20) DEFAULT 'photo' CHECK (asset_type IN ('photo', 'video', 'document')),
    original_filename VARCHAR(255),
    storage_path VARCHAR(500) NOT NULL,
    thumbnail_path VARCHAR(500),
    mime_type VARCHAR(100),
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_event_id ON assets(event_id);
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Reports Table (Moderation)
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    reason VARCHAR(100) NOT NULL CHECK (reason IN (
        'inappropriate_content', 'spam', 'fake_event', 'harassment', 'copyright', 'other'
    )),
    message TEXT,
    reporter_ip_hash VARCHAR(64),
    reporter_email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'actioned')),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Rate Limits Tables
CREATE TABLE IF NOT EXISTS rsvp_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    ip_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gift_checkout_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    ip_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rsvp_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_checkout_rate_limits ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. RLS POLICIES
-- ============================================

-- 3.1 EVENTS
CREATE POLICY "Owner can manage own events" ON events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view valid published events" ON events FOR SELECT 
    USING (status = 'published' AND (expires_at IS NULL OR expires_at > NOW()));

-- 3.2 PROFILES
CREATE POLICY "User can manage own profile" ON profiles FOR ALL USING (auth.uid() = id);

-- 3.3 RSVPS
CREATE POLICY "Owner can manage rsvps" ON rsvps FOR ALL 
    USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));
CREATE POLICY "Public can insert RSVPs to published events" ON rsvps FOR INSERT 
    WITH CHECK (event_id IN (SELECT id FROM events WHERE status = 'published'));

-- 3.4 GIFTS
CREATE POLICY "Owner can manage catalog gifts" ON gifts FOR ALL 
    USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));
CREATE POLICY "Public can view active gifts" ON gifts FOR SELECT 
    USING (event_id IN (SELECT id FROM events WHERE status = 'published') AND is_active = true);

-- 3.5 GIFT ORDERS & TRANSACTIONS
CREATE POLICY "Owner can view/update gift orders" ON gift_orders FOR ALL 
    USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));
CREATE POLICY "Owner can view/update transactions" ON gift_transactions FOR ALL 
    USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));
-- Note: Insert for orders/transactions is restricted to owners OR service-role API.

-- 3.6 ASSETS
CREATE POLICY "Owner can manage assets" ON assets FOR ALL 
    USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));
CREATE POLICY "Public can view active assets" ON assets FOR SELECT 
    USING (event_id IN (SELECT id FROM events WHERE status = 'published') AND is_active = true);

-- 3.7 REPORTS
CREATE POLICY "Anyone can create reports" ON reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Owner can see reports for their event" ON reports FOR SELECT 
    USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

-- ============================================
-- 4. STORAGE POLICIES
-- ============================================
-- Requires buckets: 'gallery' and 'assets' to exist.
-- Run these as Superuser or if you have access to storage schema.

/*
-- Policy for 'gallery' bucket
CREATE POLICY "Public can view gallery photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Owners can upload gallery photos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'gallery' AND
        (storage.foldername(name))[1] IN (
            SELECT id::text FROM events WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can delete gallery photos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'gallery' AND
        (storage.foldername(name))[1] IN (
            SELECT id::text FROM events WHERE user_id = auth.uid()
        )
    );
*/

-- ============================================
-- 5. HELPERS & TRIGGERS
-- ============================================

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Expiration Logic
CREATE OR REPLACE FUNCTION calculate_expiration(p_plan VARCHAR, p_event_date DATE) 
RETURNS TIMESTAMPTZ AS $$
BEGIN
    IF p_event_date IS NULL THEN RETURN NULL; END IF;
    CASE p_plan
        WHEN 'free' THEN RETURN (p_event_date + INTERVAL '30 days')::TIMESTAMPTZ;
        WHEN 'plus', 'concierge' THEN RETURN (p_event_date + INTERVAL '12 months')::TIMESTAMPTZ;
        ELSE RETURN (p_event_date + INTERVAL '30 days')::TIMESTAMPTZ;
    END CASE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_event_expiration() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.event_date IS NOT NULL AND (
        OLD.event_date IS DISTINCT FROM NEW.event_date 
        OR OLD.plan IS DISTINCT FROM NEW.plan
        OR NEW.expires_at IS NULL
    ) THEN
        NEW.expires_at := calculate_expiration(NEW.plan, NEW.event_date);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGERS
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gifts_updated_at BEFORE UPDATE ON gifts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gift_orders_updated_at BEFORE UPDATE ON gift_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_event_expiration_trigger BEFORE INSERT OR UPDATE ON events FOR EACH ROW EXECUTE FUNCTION set_event_expiration();

-- CASE-INSENSITIVE UNIQUE EMAIL INDEX
DROP INDEX IF EXISTS idx_rsvps_unique_email_per_event;
CREATE UNIQUE INDEX idx_rsvps_unique_email_per_event 
ON rsvps (event_id, lower(email)) 
WHERE email IS NOT NULL AND email <> '';

-- ============================================
-- 6. FINAL NOTES
-- ============================================
-- 1. Create the buckets 'gallery' and 'assets' in the Supabase Dashboard Storage section.
-- 2. Make 'gallery' bucket PUBLIC.
-- 3. In Auth Settings, ensure 'Email Confirmation' is disabled for local testing or enabled for prod.
-- 4. SITE_URL should be configured in Supabase to 'https://app.luma.com.br' or your local dev URL.

-- MIGRATION COMPLETE.
