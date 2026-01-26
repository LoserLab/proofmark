-- Add page_count column to script_versions table
-- This column stores the number of pages for PDF files (nullable)

ALTER TABLE script_versions 
ADD COLUMN IF NOT EXISTS page_count INTEGER;

-- Add comment for clarity
COMMENT ON COLUMN script_versions.page_count IS 'Number of pages (for PDF files). Null for non-PDF files or if extraction failed.';
