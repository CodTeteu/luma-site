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
