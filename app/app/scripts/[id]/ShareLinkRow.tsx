'use client'

type ShareLink = {
  id: string
  token: string
  created_at: string
  expires_at: string | null
  revoked_at: string | null
}

export default function ShareLinkRow({ link }: { link: ShareLink }) {
  const isExpired = link.expires_at && new Date(link.expires_at) < new Date()
  const isRevoked = !!link.revoked_at
  const status = isRevoked ? 'Revoked' : isExpired ? 'Expired' : 'Active'
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/s/${link.token}`
    : `/s/${link.token}`

  const handleCopy = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
    }
  }

  return (
    <div
      className="border rounded-lg p-4" 
      style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--text)] mb-1">
            {status}
          </p>
          <p className="text-xs text-[var(--muted)]">
            Created {new Date(link.created_at).toLocaleDateString()}
          </p>
        </div>
        {status === 'Active' && (
          <button
            onClick={handleCopy}
            className="text-xs text-[var(--muted)] hover:text-[var(--text)] underline transition-colors"
          >
            Copy link
          </button>
        )}
        {isRevoked && link.revoked_at && (
          <span className="text-xs text-[var(--muted)]">
            Revoked {new Date(link.revoked_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
}
