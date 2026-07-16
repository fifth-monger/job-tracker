-- Add archiving support to applications
-- Run this in the Supabase SQL editor (or via the CLI) before deploying the UI changes.

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false;

-- Optional: archive any existing Rejected applications so they match the new auto-archive behavior
UPDATE applications
SET is_archived = true
WHERE status = 'Rejected' AND is_archived = false;

CREATE INDEX IF NOT EXISTS applications_is_archived_idx
  ON applications (is_archived);
