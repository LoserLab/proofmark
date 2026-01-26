-- Add viewer identification columns to share_links table

ALTER TABLE share_links 
ADD COLUMN IF NOT EXISTS viewer_id TEXT,
ADD COLUMN IF NOT EXISTS first_viewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;

-- Add comments for clarity
COMMENT ON COLUMN share_links.viewer_id IS 'Short, random identifier for this specific viewer instance. Generated at link creation.';
COMMENT ON COLUMN share_links.first_viewed_at IS 'Timestamp of the first view. Set on first load if null.';
COMMENT ON COLUMN share_links.view_count IS 'Total number of views. Incremented on each view.';
