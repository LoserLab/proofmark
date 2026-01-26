import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { WATERMARK_PLACEMENT } from "@/lib/watermark";

export async function watermarkPdfBuffer(input: {
  pdfBytes: Buffer;
  watermarkText: string;
}) {
  const pdfDoc = await PDFDocument.load(input.pdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();

    // Footer watermark
    page.drawText(input.watermarkText, {
      x: WATERMARK_PLACEMENT.footer.xMargin,
      y: WATERMARK_PLACEMENT.footer.yFromBottom,
      size: WATERMARK_PLACEMENT.footer.fontSize,
      font,
      color: rgb(0, 0, 0),
      opacity: WATERMARK_PLACEMENT.footer.opacity
    });

    // Optional diagonal watermark (keep disabled by default)
    if (WATERMARK_PLACEMENT.diagonal.enabled) {
      const textWidth = font.widthOfTextAtSize(
        input.watermarkText,
        WATERMARK_PLACEMENT.diagonal.fontSize
      );

      page.drawText(input.watermarkText, {
        x: (width - textWidth) / 2,
        y: height / 2,
        size: WATERMARK_PLACEMENT.diagonal.fontSize,
        font,
        color: rgb(0, 0, 0),
        opacity: WATERMARK_PLACEMENT.diagonal.opacity,
        rotate: degrees(WATERMARK_PLACEMENT.diagonal.rotationDegrees)
      });
    }
  }

  const out = await pdfDoc.save();
  return Buffer.from(out);
}
