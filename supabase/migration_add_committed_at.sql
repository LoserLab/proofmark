-- Migration: Add committed_at column to script_versions
-- This column tracks when a version was committed (hashed and registered)

ALTER TABLE script_versions
  ADD COLUMN IF NOT EXISTS committed_at TIMESTAMPTZ;
