-- Migration: Ensure storage_path column exists in script_versions table
-- This fixes the "Could not find the 'storage_path' column" error
-- Run this in Supabase SQL Editor to refresh the schema cache

-- Add storage_path column if it doesn't exist (required, NOT NULL)
ALTER TABLE script_versions 
  ADD COLUMN IF NOT EXISTS storage_path TEXT NOT NULL DEFAULT '';

-- Update any existing NULL values (shouldn't happen, but safety check)
UPDATE script_versions 
SET storage_path = 'migrated-' || id::text
WHERE storage_path IS NULL OR storage_path = '';

-- Remove the default constraint (storage_path should always be provided on insert)
ALTER TABLE script_versions 
  ALTER COLUMN storage_path DROP DEFAULT;

-- Verify column exists and show its properties
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'script_versions' 
  AND column_name = 'storage_path';

-- Note: After running this migration, Supabase's schema cache should refresh automatically.
-- If the error persists, try:
-- 1. Restarting your Supabase project
-- 2. Running: NOTIFY pgrst, 'reload schema';
