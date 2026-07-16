-- Allow Dead End status and archive closed applications
-- Run in the Supabase SQL editor if your status column uses a CHECK constraint.

-- If you have a status check constraint, drop and recreate it to include Dead End:
-- ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;
-- ALTER TABLE applications ADD CONSTRAINT applications_status_check
--   CHECK (status IN ('Applied', 'Followed-Up', 'Interviewing', 'Offer', 'Accepted', 'Rejected', 'Dead End'));

UPDATE applications
SET is_archived = true
WHERE status IN ('Rejected', 'Dead End') AND is_archived = false;
