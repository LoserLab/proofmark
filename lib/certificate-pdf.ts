/**
 * Certificate PDF generation
 * Generates a formal certificate of registration PDF for proof of existence
 */

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export interface CertificateData {
  title: string;
  workType: string;
  sha256: string;
  committedAt: string;
  versionId: string;
  filename: string;
  txHash?: string | null;
  blockNumber?: number | null;
  verificationUrl: string;
}

export async function generateCertificatePdf(
  data: CertificateData
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // US Letter
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const courier = await pdfDoc.embedFont(StandardFonts.Courier);

  const { width, height } = page.getSize();
  const margin = 50;

  // Colors matching ProofMark brand
  const inkColor = rgb(0.231, 0.286, 0.325); // #3B4953
  const greenColor = rgb(0.353, 0.471, 0.388); // #5A7863
  const lightGreen = rgb(0.565, 0.671, 0.545); // #90AB8B
  const paperBg = rgb(0.965, 0.965, 0.953); // #F6F6F3

  // Background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: paperBg,
  });

  // Outer border
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: greenColor,
    borderWidth: 2,
    color: undefined,
  });

  // Inner border
  page.drawRectangle({
    x: 38,
    y: 38,
    width: width - 76,
    height: height - 76,
    borderColor: lightGreen,
    borderWidth: 0.5,
    color: undefined,
  });

  let y = height - 90;

  // Header
  const headerText = "CERTIFICATE OF REGISTRATION";
  const headerWidth = helveticaBold.widthOfTextAtSize(headerText, 22);
  page.drawText(headerText, {
    x: (width - headerWidth) / 2,
    y,
    size: 22,
    font: helveticaBold,
    color: inkColor,
  });

  y -= 20;
  // Decorative line under header
  page.drawLine({
    start: { x: margin + 60, y },
    end: { x: width - margin - 60, y },
    thickness: 1.5,
    color: greenColor,
  });

  y -= 15;
  const subText = "Proof of Existence";
  const subWidth = helvetica.widthOfTextAtSize(subText, 12);
  page.drawText(subText, {
    x: (width - subWidth) / 2,
    y,
    size: 12,
    font: helvetica,
    color: lightGreen,
  });

  y -= 50;
  // "This certifies that" text
  const certifiesText =
    "This certifies that the following work was registered with ProofMark";
  const certifiesWidth = helvetica.widthOfTextAtSize(certifiesText, 11);
  page.drawText(certifiesText, {
    x: (width - certifiesWidth) / 2,
    y,
    size: 11,
    font: helvetica,
    color: inkColor,
  });

  y -= 45;
  // Title
  const displayTitle = data.title || "Untitled Work";
  const titleSize = displayTitle.length > 40 ? 18 : 24;
  const titleWidth = helveticaBold.widthOfTextAtSize(displayTitle, titleSize);
  page.drawText(displayTitle, {
    x: Math.max(margin, (width - titleWidth) / 2),
    y,
    size: titleSize,
    font: helveticaBold,
    color: greenColor,
  });

  y -= 35;
  // Separator
  page.drawLine({
    start: { x: margin + 100, y },
    end: { x: width - margin - 100, y },
    thickness: 0.5,
    color: lightGreen,
  });

  y -= 35;
  // Details section
  const labelSize = 9;
  const valueSize = 11;
  const lineSpacing = 28;

  function drawField(label: string, value: string, useMonospace = false) {
    page.drawText(label.toUpperCase(), {
      x: margin + 20,
      y,
      size: labelSize,
      font: helvetica,
      color: lightGreen,
    });
    y -= 14;
    const valueFont = useMonospace ? courier : helvetica;
    const effectiveSize = useMonospace ? 9 : valueSize;
    page.drawText(value, {
      x: margin + 20,
      y,
      size: effectiveSize,
      font: valueFont,
      color: inkColor,
    });
    y -= lineSpacing;
  }

  drawField("Work Type", data.workType || "Document");
  drawField("Original File", data.filename || "Unknown");
  drawField("Registered", new Date(data.committedAt).toUTCString());
  drawField("SHA-256 Fingerprint", data.sha256, true);
  drawField("Version ID", data.versionId, true);

  if (data.txHash) {
    drawField("Blockchain Transaction", data.txHash, true);
    if (data.blockNumber) {
      drawField("Block Number", String(data.blockNumber));
    }
  }

  // Verification section
  y -= 10;
  page.drawLine({
    start: { x: margin + 20, y },
    end: { x: width - margin - 20, y },
    thickness: 0.5,
    color: lightGreen,
  });

  y -= 25;
  page.drawText("VERIFICATION", {
    x: margin + 20,
    y,
    size: labelSize,
    font: helveticaBold,
    color: greenColor,
  });
  y -= 16;
  page.drawText("Verify this certificate at:", {
    x: margin + 20,
    y,
    size: 10,
    font: helvetica,
    color: inkColor,
  });
  y -= 14;
  page.drawText(data.verificationUrl, {
    x: margin + 20,
    y,
    size: 9,
    font: courier,
    color: greenColor,
  });

  // Footer
  const footerY = 55;
  page.drawLine({
    start: { x: margin + 20, y: footerY + 15 },
    end: { x: width - margin - 20, y: footerY + 15 },
    thickness: 0.5,
    color: lightGreen,
  });

  const disclaimer =
    "This certificate verifies the cryptographic fingerprint was recorded at the stated time.";
  const disclaimerWidth = helvetica.widthOfTextAtSize(disclaimer, 8);
  page.drawText(disclaimer, {
    x: (width - disclaimerWidth) / 2,
    y: footerY,
    size: 8,
    font: helvetica,
    color: lightGreen,
  });

  const disclaimer2 =
    "ProofMark provides proof of existence, not legal copyright registration.";
  const disclaimer2Width = helvetica.widthOfTextAtSize(disclaimer2, 8);
  page.drawText(disclaimer2, {
    x: (width - disclaimer2Width) / 2,
    y: footerY - 12,
    size: 8,
    font: helvetica,
    color: lightGreen,
  });

  return pdfDoc.save();
}
