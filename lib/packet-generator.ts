import { buildPacketZip } from './utils'

export interface PacketData {
  receiptText: string
  hash: string
  metadata: {
    scriptId: string
    versionId: string
    title: string
    createdAt: string
    fileSize: number
    mimeType: string | null
  }
  filingWorksheet: string
  watermarkPdf?: Buffer
}

export async function generateProtectionPacket(data: PacketData): Promise<Buffer> {
  const files: Array<{ name: string; content: string | Buffer }> = [
    { name: 'receipt.txt', content: data.receiptText },
    {
      name: 'hash.json',
      content: JSON.stringify(
        {
          algorithm: 'SHA-256',
          hash: data.hash,
          computedAt: new Date().toISOString(),
        },
        null,
        2
      ),
    },
    { name: 'metadata.json', content: JSON.stringify(data.metadata, null, 2) },
    { name: 'filing-worksheet.txt', content: data.filingWorksheet },
  ]

  if (data.watermarkPdf) {
    files.push({ name: 'watermark.pdf', content: data.watermarkPdf })
  }

  return await buildPacketZip(files)
}
