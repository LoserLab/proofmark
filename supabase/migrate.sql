-- Safe migration script: drops existing tables and recreates
-- WARNING: This will delete all existing data!

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS share_links CASCADE;
DROP TABLE IF EXISTS receipts CASCADE;
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS script_versions CASCADE;
DROP TABLE IF EXISTS scripts CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Scripts table
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  work_type TEXT,
  notes TEXT,
  authors_count INTEGER DEFAULT 1,
  publication_status TEXT DEFAULT 'unpublished',
  work_made_for_hire TEXT DEFAULT 'no',
  preexisting_material TEXT DEFAULT 'no',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Script versions table
CREATE TABLE script_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  storage_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT,
  byte_size BIGINT NOT NULL,
  sha256 TEXT,
  committed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'uploading',
  snapshot_path TEXT,
  worksheet_path TEXT,
  packet_path TEXT,
  page_count INTEGER,
  reminder_dismissed_at TIMESTAMPTZ,
  detected_as_revision_of UUID REFERENCES script_versions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(script_id, version_number)
);

-- Audit log table (append-only)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  script_id UUID REFERENCES scripts(id) ON DELETE CASCADE,
  script_version_id UUID REFERENCES script_versions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Receipts table
CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  script_version_id UUID NOT NULL REFERENCES script_versions(id) ON DELETE CASCADE,
  receipt_text TEXT NOT NULL,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Share links table
CREATE TABLE share_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  version_id UUID NOT NULL REFERENCES script_versions(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewer_label TEXT,
  viewer_id TEXT,
  allow_download BOOLEAN DEFAULT true,
  revoked_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  first_viewed_at TIMESTAMPTZ,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scripts_updated_at
  BEFORE UPDATE ON scripts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Scripts policies
CREATE POLICY "Users can view their own scripts"
  ON scripts FOR SELECT
  USING (auth.uid() = user_id);

-- Script versions policies
CREATE POLICY "Users can view versions of their scripts"
  ON script_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM scripts
      WHERE scripts.id = script_versions.script_id
      AND scripts.user_id = auth.uid()
    )
  );

-- Audit log policies
CREATE POLICY "Users can view audit logs for their scripts"
  ON audit_log FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM scripts
      WHERE scripts.id = audit_log.script_id
      AND scripts.user_id = auth.uid()
    )
  );

-- Receipts policies
CREATE POLICY "Users can view receipts for their scripts"
  ON receipts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM script_versions sv
      JOIN scripts s ON s.id = sv.script_id
      WHERE sv.id = receipts.script_version_id
      AND s.user_id = auth.uid()
    )
  );

-- Share links policies
CREATE POLICY "Users can view their own share links"
  ON share_links FOR SELECT
  USING (auth.uid() = created_by);

-- Indexes for performance
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_scripts_user_id ON scripts(user_id);
CREATE INDEX idx_script_versions_script_id ON script_versions(script_id);
CREATE INDEX idx_script_versions_sha256 ON script_versions(sha256) WHERE sha256 IS NOT NULL;
CREATE INDEX idx_audit_log_script_id ON audit_log(script_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_receipts_script_version_id ON receipts(script_version_id);
CREATE INDEX idx_share_links_token ON share_links(token);
CREATE INDEX idx_share_links_script_id ON share_links(script_id);
CREATE INDEX idx_share_links_version_id ON share_links(version_id);
