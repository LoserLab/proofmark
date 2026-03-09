'use client'

import { useState } from 'react'
import ErrorNotice from '@/components/ErrorNotice'
import { Errors } from '@/lib/copy/errors'

export default function ScriptDetailClient({
  scriptId,
  versionId,
}: {
  scriptId: string
  versionId?: string
}) {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownloadPacket = async () => {
    setDownloading(true)
    setError(null)

    try {
      const apiUrl = versionId 
        ? `/api/scripts/${scriptId}/packet?versionId=${versionId}`
        : `/api/scripts/${scriptId}/packet`
      const response = await fetch(apiUrl)
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Download failed')
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `proofmark-protection-packet-${scriptId}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(blobUrl)
      document.body.removeChild(a)
    } catch (err) {
      setError(Errors.packet.failed.body)
    } finally {
      setDownloading(false)
    }
  }


  return (
    <div>
      <button
        onClick={handleDownloadPacket}
        disabled={downloading}
        className="bg-[var(--accent)] text-white px-6 py-3.5 rounded-md text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloading ? 'Downloading...' : 'Download evidence packet'}
      </button>

      {error && (
        <div className="mt-4">
          <ErrorNotice
            title={Errors.packet.failed.title}
            body={error}
            recovery={Errors.packet.failed.recovery}
          />
        </div>
      )}
    </div>
  )
}
