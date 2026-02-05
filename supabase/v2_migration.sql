-- ============================================
-- LUMA v2 Migration - Alinhamento com Documento Mestre
-- ============================================
-- Execute this SQL in your Supabase project's SQL Editor
-- This migration is idempotent - safe to run multiple times

-- ============================================
-- 1. Events Table - New Columns
-- ============================================

-- Event type (wedding/graduation)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'event_type') THEN
        ALTER TABLE events ADD COLUMN event_type VARCHAR(20) DEFAULT 'wedding' 
            CHECK (event_type IN ('wedding', 'graduation'));
    END IF;
END $$;

-- Plan (free/plus/concierge)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'plan') THEN
        ALTER TABLE events ADD COLUMN plan VARCHAR(20) DEFAULT 'free' 
            CHECK (plan IN ('free', 'plus', 'concierge'));
    END IF;
END $$;

-- Event date (the actual wedding/graduation date)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'event_date') THEN
        ALTER TABLE events ADD COLUMN event_date DATE;
    END IF;
END $$;

-- Expiration date (link expiry)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'expires_at') THEN
        ALTER TABLE events ADD COLUMN expires_at TIMESTAMPTZ;
    END IF;
END $$;

-- Password hash for protected invites
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'password_hash') THEN
        ALTER TABLE events ADD COLUMN password_hash VARCHAR(255);
    END IF;
END $$;

-- Index for event_type queries
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_plan ON events(plan);
CREATE INDEX IF NOT EXISTS idx_events_expires_at ON events(expires_at);

-- ============================================
-- 2. Gifts Table (Gift Items with PIX)
-- ============================================
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

-- Enable RLS
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

-- Owner can manage their gifts
CREATE POLICY "Owner can manage gifts" ON gifts
    FOR ALL USING (
        event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
    );

-- Public can view gifts for published events
DROP POLICY IF EXISTS "Public can view gifts for published events" ON gifts;
CREATE POLICY "Public can view gifts for published events" ON gifts
    FOR SELECT USING (
        event_id IN (SELECT id FROM events WHERE status = 'published')
        AND is_active = true
    );

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_gifts_updated_at ON gifts;
CREATE TRIGGER update_gifts_updated_at
    BEFORE UPDATE ON gifts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. Reports Table (Content Moderation)
-- ============================================
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

CREATE INDEX IF NOT EXISTS idx_reports_event_id ON reports(event_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Public can create reports
CREATE POLICY "Anyone can create reports" ON reports
    FOR INSERT WITH CHECK (true);

-- Only admins/event owners can view (simplified: event owners see their event reports)
CREATE POLICY "Event owner can view reports" ON reports
    FOR SELECT USING (
        event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
    );

-- ============================================
-- 4. Audit Logs Table
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(50) NOT NULL CHECK (action IN (
        'event_created', 'event_published', 'event_unpublished', 
        'slug_changed', 'plan_upgraded', 'password_set', 'password_removed',
        'photo_uploaded', 'photo_deleted', 'gift_added', 'gift_removed'
    )),
    meta JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_event_id ON audit_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only event owner can view their logs
CREATE POLICY "Event owner can view audit logs" ON audit_logs
    FOR SELECT USING (
        event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
        OR user_id = auth.uid()
    );

-- System/service role can insert
CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- ============================================
-- 5. Assets Table (Gallery Photos)
-- ============================================
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    asset_type VARCHAR(20) DEFAULT 'photo' CHECK (asset_type IN ('photo', 'video', 'document')),
    original_filename VARCHAR(255),
    storage_path VARCHAR(500) NOT NULL,
    thumbnail_path VARCHAR(500),
    mime_type VARCHAR(100),
    file_size INTEGER, -- bytes
    width INTEGER,
    height INTEGER,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_event_id ON assets(event_id);
CREATE INDEX IF NOT EXISTS idx_assets_display_order ON assets(event_id, display_order);

-- Enable RLS
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Owner can manage their assets
CREATE POLICY "Owner can manage assets" ON assets
    FOR ALL USING (
        event_id IN (SELECT id FROM events WHERE user_id = auth.uid())
    );

-- Public can view assets for published events
DROP POLICY IF EXISTS "Public can view assets for published events" ON assets;
CREATE POLICY "Public can view assets for published events" ON assets
    FOR SELECT USING (
        event_id IN (SELECT id FROM events WHERE status = 'published')
        AND is_active = true
    );

-- ============================================
-- 6. Update rsvps table - add ip_hash column
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'rsvps' AND column_name = 'ip_hash') THEN
        ALTER TABLE rsvps ADD COLUMN ip_hash VARCHAR(64);
    END IF;
END $$;

-- ============================================
-- 7. RLS Policy Updates for events table
-- ============================================

-- Add policy for public access with expiration check
DROP POLICY IF EXISTS "Anyone can view published events" ON events;
CREATE POLICY "Anyone can view valid published events" ON events
    FOR SELECT USING (
        status = 'published' 
        AND (expires_at IS NULL OR expires_at > NOW())
    );

-- Keep owner policies as they are (already exist from original schema)

-- ============================================
-- 8. Helper Functions
-- ============================================

-- Function to calculate expiration date based on plan
CREATE OR REPLACE FUNCTION calculate_expiration(
    p_plan VARCHAR,
    p_event_date DATE
) RETURNS TIMESTAMPTZ AS $$
BEGIN
    IF p_event_date IS NULL THEN
        RETURN NULL;
    END IF;
    
    CASE p_plan
        WHEN 'free' THEN
            -- 30 days after event
            RETURN (p_event_date + INTERVAL '30 days')::TIMESTAMPTZ;
        WHEN 'plus', 'concierge' THEN
            -- 12 months after event
            RETURN (p_event_date + INTERVAL '12 months')::TIMESTAMPTZ;
        ELSE
            RETURN (p_event_date + INTERVAL '30 days')::TIMESTAMPTZ;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-set expiration on event update
CREATE OR REPLACE FUNCTION set_event_expiration()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_event_expiration_trigger ON events;
CREATE TRIGGER set_event_expiration_trigger
    BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION set_event_expiration();

-- ============================================
-- 9. RSVP Rate Limits Table (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS rsvp_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    ip_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvp_rate_limits_lookup 
    ON rsvp_rate_limits(event_id, ip_hash, created_at);

-- Enable RLS (no user access, only backend)
ALTER TABLE rsvp_rate_limits ENABLE ROW LEVEL SECURITY;

-- Cleanup old rate limit entries (run periodically)
-- DELETE FROM rsvp_rate_limits WHERE created_at < NOW() - INTERVAL '1 hour';

-- ============================================
-- Migration Complete
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- After running, verify with: SELECT column_name FROM information_schema.columns WHERE table_name = 'events';
