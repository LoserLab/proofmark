-- Add snapshot_path column to script_versions table
-- This column stores the storage path to the PDF snapshot (for PDF uploads only)

ALTER TABLE script_versions 
ADD COLUMN IF NOT EXISTS snapshot_path TEXT;

-- Add comment for clarity
COMMENT ON COLUMN script_versions.snapshot_path IS 'Storage path to PDF snapshot (for PDF uploads only). Null for non-PDF files or if snapshot generation failed.';
