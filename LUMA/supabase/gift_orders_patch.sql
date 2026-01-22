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
