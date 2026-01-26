'use client'

import { useState } from 'react'

type AuditLogEntry = {
  id: string
  action: string
  created_at: string
  metadata?: any
}

export default function RecordHistorySection({ auditLog }: { auditLog: AuditLogEntry[] }) {
  const [isOpen, setIsOpen] = useState(false)

  const formatAction = (action: string) => {
    const actionMap: Record<string, string> = {
      'upload_started': 'Upload started',
      'upload_completed': 'Upload completed',
      'committed': 'Version committed',
      'packet_downloaded': 'Evidence packet downloaded',
      'share_created': 'Share link created',
      'share_viewed': 'Share link viewed',
    }
    return actionMap[action] || action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <h2 className="text-xl font-semibold text-[var(--headline)]">
          Record history
        </h2>
        <svg
          className={`w-5 h-5 text-[var(--muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-2">
          {auditLog && auditLog.length > 0 ? (
            auditLog.map((entry) => (
              <div
                key={entry.id}
                className="text-sm text-[var(--muted)] border-l-2 pl-3 py-1"
                style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}
              >
                <span className="text-[var(--text)]">{formatAction(entry.action)}</span>
                {' · '}
                <span>{new Date(entry.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              History will appear here as you create records, versions, and share links.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
