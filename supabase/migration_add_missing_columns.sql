-- Migration: Add missing columns for DraftLock API routes
-- Run this in Supabase SQL Editor after verifying current schema

-- Add missing columns to scripts table
ALTER TABLE scripts 
  ADD COLUMN IF NOT EXISTS work_type TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS authors_count INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS publication_status TEXT DEFAULT 'unpublished',
  ADD COLUMN IF NOT EXISTS work_made_for_hire TEXT DEFAULT 'no',
  ADD COLUMN IF NOT EXISTS preexisting_material TEXT DEFAULT 'no';

-- Add missing columns to share_links table
ALTER TABLE share_links
  ADD COLUMN IF NOT EXISTS allow_download BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS first_viewed_at TIMESTAMPTZ;

-- Verify columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'scripts' 
  AND column_name IN ('work_type', 'notes', 'authors_count', 'publication_status', 'work_made_for_hire', 'preexisting_material')
ORDER BY column_name;

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'share_links'
  AND column_name IN ('allow_download', 'first_viewed_at')
ORDER BY column_name;
