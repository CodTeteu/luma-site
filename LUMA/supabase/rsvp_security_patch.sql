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
