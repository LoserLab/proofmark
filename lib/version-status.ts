/**
 * Version status utilities
 * Checks if a version has all artifacts needed for filing preparation
 */

export type VersionArtifacts = {
  sha256?: string | null;
  snapshot_path?: string | null;
  worksheet_path?: string | null;
};

/**
 * Checks if a version is "prepared for filing" by verifying all required artifacts are present.
 * Required artifacts:
 * - sha256 (string, non-empty)
 * - snapshot_path (string, non-empty)
 * - worksheet_path (string, non-empty)
 */
export function isPreparedForFiling(version: VersionArtifacts): boolean {
  return !!(
    version.sha256 &&
    typeof version.sha256 === "string" &&
    version.sha256.trim().length > 0 &&
    version.snapshot_path &&
    typeof version.snapshot_path === "string" &&
    version.snapshot_path.trim().length > 0 &&
    version.worksheet_path &&
    typeof version.worksheet_path === "string" &&
    version.worksheet_path.trim().length > 0
  );
}
