-- RLS Security Policies for DraftLock
-- This script enforces: users can only SELECT their own rows, all writes via API routes (service role)
--
-- SECURITY MODEL:
-- - All SELECT policies are scoped to the authenticated user's own data
-- - All INSERT/UPDATE/DELETE operations go through API routes using service role
-- - Share link lookups by token are handled via service role in API (not exposed via RLS)
-- - Audit log and receipts are append-only via service role

-- Enable RLS on all tables
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view their own scripts" ON scripts;
DROP POLICY IF EXISTS "Users can create their own scripts" ON scripts;
DROP POLICY IF EXISTS "Users can update their own scripts" ON scripts;
DROP POLICY IF EXISTS "Users can delete their own scripts" ON scripts;

DROP POLICY IF EXISTS "Users can view versions of their scripts" ON script_versions;
DROP POLICY IF EXISTS "Users can create versions for their scripts" ON script_versions;
DROP POLICY IF EXISTS "Users can update versions of their scripts" ON script_versions;
DROP POLICY IF EXISTS "Users can delete versions of their scripts" ON script_versions;

DROP POLICY IF EXISTS "Users can view their own share links" ON share_links;
DROP POLICY IF EXISTS "Users can create share links for their scripts" ON share_links;
DROP POLICY IF EXISTS "Users can update share links" ON share_links;
DROP POLICY IF EXISTS "Users can delete share links" ON share_links;
DROP POLICY IF EXISTS "Anyone can view share links by token" ON share_links;
DROP POLICY IF EXISTS "Anyone can view share links by token (for public access)" ON share_links;
DROP POLICY IF EXISTS "System can update share link view count" ON share_links;

DROP POLICY IF EXISTS "Users can view audit logs for their scripts" ON audit_log;
DROP POLICY IF EXISTS "System can create audit logs" ON audit_log;
DROP POLICY IF EXISTS "Users can update audit logs" ON audit_log;
DROP POLICY IF EXISTS "Users can delete audit logs" ON audit_log;

DROP POLICY IF EXISTS "Users can view receipts for their scripts" ON receipts;
DROP POLICY IF EXISTS "System can create receipts" ON receipts;

-- ============================================================================
-- SCRIPTS TABLE
-- ============================================================================

-- SELECT: Users can only view their own scripts
CREATE POLICY "Users can view their own scripts"
  ON scripts FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies - only service role can write via API routes

-- ============================================================================
-- SCRIPT_VERSIONS TABLE
-- ============================================================================

-- SELECT: Users can view versions of their own scripts
CREATE POLICY "Users can view versions of their scripts"
  ON script_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM scripts
      WHERE scripts.id = script_versions.script_id
      AND scripts.user_id = auth.uid()
    )
  );

-- No INSERT/UPDATE/DELETE policies - only service role can write via API routes

-- ============================================================================
-- SHARE_LINKS TABLE
-- ============================================================================

-- SELECT: Users can ONLY view share links they created
-- NOTE: Public share link lookups by token must go through API route using service role
-- This prevents enumeration attacks where anyone could list all share links
CREATE POLICY "Users can view their own share links"
  ON share_links FOR SELECT
  USING (auth.uid() = created_by);

-- No INSERT/UPDATE/DELETE policies - only service role can write via API routes
-- No public SELECT policy - token lookups handled by service role in /api/share/[token]

-- ============================================================================
-- AUDIT_LOG TABLE
-- ============================================================================

-- SELECT: Users can view audit logs for their own scripts
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

-- No INSERT/UPDATE/DELETE policies - only service role can write via API routes
-- This ensures audit log integrity (append-only, tamper-proof)

-- ============================================================================
-- RECEIPTS TABLE
-- ============================================================================

-- SELECT: Users can view receipts for their own script versions
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

-- No INSERT/UPDATE/DELETE policies - only service role can write via API routes

-- ============================================================================
-- VERIFICATION QUERIES (run these to verify policies)
-- ============================================================================

-- Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('scripts', 'script_versions', 'share_links', 'audit_log', 'receipts');

-- Check policies exist (should see only SELECT policies, no INSERT/UPDATE/DELETE):
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('scripts', 'script_versions', 'share_links', 'audit_log', 'receipts')
-- ORDER BY tablename, policyname;

-- Test that service role bypasses RLS (run from API):
-- Service role key automatically bypasses RLS, so API routes can INSERT/UPDATE/DELETE
