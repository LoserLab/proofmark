"use client";

import { useState } from "react";

interface RevisionReminderProps {
  versionId: string;
  scriptId: string;
  onDismiss: () => void;
  onTimestamp: () => void;
}

/**
 * Revision Reminder Component
 * Shows a prompt when a new revision is detected
 */
export default function RevisionReminder({
  versionId,
  scriptId,
  onDismiss,
  onTimestamp,
}: RevisionReminderProps) {
  const [isDismissing, setIsDismissing] = useState(false);

  async function handleDismiss() {
    setIsDismissing(true);
    try {
      const res = await fetch(`/api/scripts/${scriptId}/versions/${versionId}/dismiss-reminder`, {
        method: "POST",
      });

      if (res.ok) {
        onDismiss();
      } else {
        // If dismiss fails, still hide the prompt (non-blocking)
        onDismiss();
      }
    } catch (error) {
      // Non-blocking: hide prompt even if API call fails
      onDismiss();
    } finally {
      setIsDismissing(false);
    }
  }

  return (
    <div className="rounded-lg border border-[var(--stroke)] bg-white p-6 shadow-sm">
      <div className="text-sm font-medium text-[var(--text)] mb-2">
        New revision detected
      </div>
      <div className="text-sm text-[var(--muted)] leading-relaxed mb-5">
        This looks like a new draft of an existing script. Each version can be timestamped and archived separately.
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onTimestamp}
          disabled={isDismissing}
          className="px-5 py-2 rounded-md bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Timestamp this version
        </button>
        <button
          onClick={handleDismiss}
          disabled={isDismissing}
          className="px-5 py-2 rounded-md border border-[var(--stroke)] text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
