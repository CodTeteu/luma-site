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
