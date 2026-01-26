/**
 * Metadata extraction utilities
 */

/**
 * Extract suggested title from filename
 * - Strips extension
 * - Normalizes spacing (replaces underscores, hyphens with spaces)
 * - Trims whitespace
 */
export function extractSuggestedTitle(filename: string): string {
  // Remove extension
  const withoutExt = filename.replace(/\.[^/.]+$/, "");
  
  // Normalize spacing: replace underscores and hyphens with spaces
  const normalized = withoutExt.replace(/[_-]/g, " ");
  
  // Trim and collapse multiple spaces
  return normalized.trim().replace(/\s+/g, " ");
}

/**
 * Safely extract page count from PDF buffer
 * Returns null if parsing fails or file is not a PDF
 */
export async function extractPageCount(
  buffer: Buffer,
  mimeType: string
): Promise<number | null> {
  // Only process PDFs
  if (mimeType !== "application/pdf" && !mimeType.includes("pdf")) {
    return null;
  }

  try {
    // Use pdf-lib to safely get page count
    // This does not parse content, just reads the document structure
    const { PDFDocument } = await import("pdf-lib");
    const pdfDoc = await PDFDocument.load(buffer);
    return pdfDoc.getPageCount();
  } catch (error) {
    // If parsing fails for any reason, return null
    // This is safe - we don't want to block uploads if page count extraction fails
    console.warn("Failed to extract page count from PDF:", error);
    return null;
  }
}

/**
 * Determine file type from mime type
 */
export function getFileType(mimeType: string): string {
  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.includes("wordprocessingml") || mimeType.includes("msword")) return "DOCX";
  if (mimeType.includes("text/plain")) return "TXT";
  if (mimeType.includes("text")) return "Text";
  return "Document";
}
