/**
 * Registration Worksheet storage utility
 * Generates and stores the registration worksheet PDF
 */

import { supabaseServerService } from "@/lib/supabase/server";
import { config } from "@/lib/config";
import { generateRegistrationWorksheetPDF } from "@/lib/registration-worksheet-pdf";

/**
 * Generate and store registration worksheet PDF
 * - Generates PDF from script and version data
 * - Stores in Supabase Storage at scripts/{scriptId}/versions/{versionId}/registration_worksheet.pdf
 * - Returns the storage path
 * 
 * Returns null if generation/storage fails (non-blocking)
 */
export async function generateAndStoreRegistrationWorksheet(
  script: any,
  version: any,
  scriptId: string,
  versionId: string
): Promise<string | null> {
  try {
    // Generate PDF
    const pdfBuffer = await generateRegistrationWorksheetPDF({
      script,
      version,
    });

    // Generate storage path
    const worksheetPath = `scripts/${scriptId}/versions/${versionId}/registration_worksheet.pdf`;

    // Upload to Supabase Storage
    const bucket = config.storage.bucket;
    const supabase = supabaseServerService();
    const { error: uploadErr } = await supabase
      .storage.from(bucket)
      .upload(worksheetPath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true, // Overwrite if exists
      });

    if (uploadErr) {
      console.warn("Failed to upload registration worksheet to storage:", uploadErr);
      return null;
    }

    return worksheetPath;
  } catch (error) {
    // Non-blocking: log error but don't fail the flow
    console.warn("Failed to generate registration worksheet PDF:", error);
    return null;
  }
}
