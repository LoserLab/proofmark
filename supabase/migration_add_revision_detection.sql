-- Add revision detection and reminder columns to script_versions table

ALTER TABLE script_versions 
ADD COLUMN IF NOT EXISTS reminder_dismissed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS detected_as_revision_of UUID REFERENCES script_versions(id) ON DELETE SET NULL;

-- Add comments for clarity
COMMENT ON COLUMN script_versions.reminder_dismissed_at IS 'Timestamp when the revision reminder was dismissed by the user. Null if not dismissed.';
COMMENT ON COLUMN script_versions.detected_as_revision_of IS 'Reference to the version this was detected as a revision of. Null if not detected as a revision.';
