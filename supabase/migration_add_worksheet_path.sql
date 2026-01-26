-- Add worksheet_path column to script_versions table
-- This column stores the storage path to the registration worksheet PDF

ALTER TABLE script_versions 
ADD COLUMN IF NOT EXISTS worksheet_path TEXT;

-- Add comment for clarity
COMMENT ON COLUMN script_versions.worksheet_path IS 'Storage path to registration worksheet PDF. Null if worksheet generation failed.';
