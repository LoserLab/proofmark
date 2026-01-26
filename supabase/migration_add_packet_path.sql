-- Add packet_path column to script_versions table
-- This column stores the storage path to the generated protection packet ZIP

ALTER TABLE script_versions 
ADD COLUMN IF NOT EXISTS packet_path TEXT;

-- Add comment for clarity
COMMENT ON COLUMN script_versions.packet_path IS 'Storage path to the generated protection packet ZIP. Null if packet has not been generated yet.';
