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

