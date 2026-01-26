import JSZip from "jszip";

export async function buildEvidencePack(files: {
  receipt: string;
  worksheet: string;
  metadata: object;
  hash: object;
  readme: string;
}) {
  const zip = new JSZip();

  zip.file("receipt.txt", files.receipt);
  zip.file("filing-worksheet.txt", files.worksheet);
  zip.file("metadata.json", JSON.stringify(files.metadata, null, 2));
  zip.file("hash.json", JSON.stringify(files.hash, null, 2));
  zip.file("README.txt", files.readme);

  return await zip.generateAsync({ type: "nodebuffer" });
}
