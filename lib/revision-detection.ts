/**
 * Revision detection utility
 * Detects if an uploaded file might be a revision of an existing script
 */

import { supabaseServerService } from "@/lib/supabase/server";

/**
 * Detect if an uploaded file might be a revision of an existing script
 * 
 * Detection criteria:
 * - User has existing scripts with similar filenames (same base name, different extension or version)
 * - User has existing scripts in general (context-based)
 * 
 * Returns the most likely parent version ID if detected, null otherwise
 */
export async function detectPotentialRevision(
  userId: string,
  filename: string,
  currentScriptId?: string
): Promise<{ isRevision: boolean; parentVersionId: string | null }> {
  try {
    const supabase = supabaseServerService();

    // Get user's existing scripts (excluding current script if provided)
    const { data: existingScripts, error: scriptsErr } = await supabase
      .from("scripts")
      .select("id, title")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (scriptsErr || !existingScripts || existingScripts.length === 0) {
      return { isRevision: false, parentVersionId: null };
    }

    // If current script is provided, check if it has existing versions
    if (currentScriptId) {
      const { data: existingVersions, error: versionsErr } = await supabase
        .from("script_versions")
        .select("id, original_filename")
        .eq("script_id", currentScriptId)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!versionsErr && existingVersions && existingVersions.length > 0) {
        // This is likely a new version of an existing script
        const mostRecentVersion = existingVersions[0];
        return {
          isRevision: true,
          parentVersionId: mostRecentVersion.id,
        };
      }
    }

    // Extract base filename (without extension) for comparison
    const baseFilename = filename
      .replace(/\.[^/.]+$/, "") // Remove extension
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ""); // Normalize

    // Check for similar filenames in existing versions
    const { data: existingVersions, error: versionsErr } = await supabase
      .from("script_versions")
      .select("id, original_filename, script_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!versionsErr && existingVersions) {
      for (const version of existingVersions) {
        const existingBase = version.original_filename
          .replace(/\.[^/.]+$/, "")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

        // If base filenames are similar (exact match or very close)
        if (existingBase === baseFilename || existingBase.includes(baseFilename) || baseFilename.includes(existingBase)) {
          return {
            isRevision: true,
            parentVersionId: version.id,
          };
        }
      }
    }

    // If user has existing scripts but no exact match, still suggest it might be a revision
    // (context-based detection)
    if (existingScripts.length > 0) {
      // Return the most recent version from the most recent script as a suggestion
      const mostRecentScript = existingScripts[0];
      const { data: recentVersions } = await supabase
        .from("script_versions")
        .select("id")
        .eq("script_id", mostRecentScript.id)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (recentVersions) {
        return {
          isRevision: true,
          parentVersionId: recentVersions.id,
        };
      }
    }

    return { isRevision: false, parentVersionId: null };
  } catch (error) {
    // Non-blocking: if detection fails, just return false
    console.warn("Revision detection failed:", error);
    return { isRevision: false, parentVersionId: null };
  }
}
