/**
 * PDF snapshot storage utility
 * Generates a static snapshot of PDF uploads by loading and re-saving
 */

import { PDFDocument } from "pdf-lib";
import { supabaseServerService } from "@/lib/supabase/server";
import { config } from "@/lib/config";

/**
 * Generate and store a PDF snapshot
 * - Loads the original PDF
 * - Re-saves it without modifications
 * - Stores in Supabase Storage
 * - Returns the storage path
 * 
 * Returns null if:
 * - File is not a PDF
 * - Snapshot generation fails (non-blocking)
 */
export async function generateAndStoreSnapshot(
  fileBuffer: Buffer,
  mimeType: string,
  scriptId: string,
  versionId: string,
  userId: string
): Promise<string | null> {
  // Only process PDFs
  if (!mimeType.includes("pdf") && !mimeType.includes("application/pdf")) {
    return null;
  }

  try {
    // Load and re-save PDF (no content changes)
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const snapshotBytes = await pdfDoc.save();

    // Generate storage path
    const snapshotPath = `scripts/${scriptId}/versions/${versionId}/snapshot.pdf`;

    // Upload to Supabase Storage
    const bucket = config.storage.bucket;
    const supabase = supabaseServerService();
    const { error: uploadErr } = await supabase
      .storage.from(bucket)
      .upload(snapshotPath, snapshotBytes, {
        contentType: "application/pdf",
        upsert: true, // Overwrite if exists
      });

    if (uploadErr) {
      console.warn("Failed to upload snapshot to storage:", uploadErr);
      return null;
    }

    return snapshotPath;
  } catch (error) {
    // Non-blocking: log error but don't fail the flow
    console.warn("Failed to generate PDF snapshot:", error);
    return null;
  }
}
