-- Migration: Ensure byte_size column exists in script_versions table
-- This fixes the "Could not find the 'byte_size' column" error

-- Add byte_size column if it doesn't exist
ALTER TABLE script_versions 
  ADD COLUMN IF NOT EXISTS byte_size BIGINT NOT NULL DEFAULT 0;

-- Add mime_type if it doesn't exist (optional but commonly used)
ALTER TABLE script_versions 
  ADD COLUMN IF NOT EXISTS mime_type TEXT;

-- Add original_filename if it doesn't exist (required by schema)
ALTER TABLE script_versions 
  ADD COLUMN IF NOT EXISTS original_filename TEXT;

-- Update any existing rows with NULL byte_size to 0 (shouldn't happen, but safety check)
UPDATE script_versions 
SET byte_size = 0 
WHERE byte_size IS NULL;

-- Verify columns were added
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'script_versions' 
  AND column_name IN ('byte_size', 'mime_type', 'original_filename')
ORDER BY column_name;
