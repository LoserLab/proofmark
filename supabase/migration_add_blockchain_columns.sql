-- Migration: Add blockchain registration columns to script_versions
-- These columns track on-chain proof of hash registration on Avalanche C-Chain

ALTER TABLE script_versions
  ADD COLUMN IF NOT EXISTS tx_hash TEXT,
  ADD COLUMN IF NOT EXISTS block_number BIGINT,
  ADD COLUMN IF NOT EXISTS chain_status TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS chain_registered_at TIMESTAMPTZ;

-- Index for looking up versions by tx_hash (for verification page)
CREATE INDEX IF NOT EXISTS idx_script_versions_tx_hash
  ON script_versions(tx_hash)
  WHERE tx_hash IS NOT NULL;

-- Index for looking up by chain_status (for retry/monitoring)
CREATE INDEX IF NOT EXISTS idx_script_versions_chain_status
  ON script_versions(chain_status)
  WHERE chain_status IS NOT NULL;

COMMENT ON COLUMN script_versions.tx_hash IS 'Avalanche C-Chain transaction hash';
COMMENT ON COLUMN script_versions.block_number IS 'Block number where the hash was registered on-chain';
COMMENT ON COLUMN script_versions.chain_status IS 'pending | confirmed | failed | NULL (not attempted)';
COMMENT ON COLUMN script_versions.chain_registered_at IS 'When the on-chain registration was confirmed';
