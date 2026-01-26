"use client";

import { isPreparedForFiling, type VersionArtifacts } from "@/lib/version-status";

type PreparedForFilingBadgeProps = {
  version: VersionArtifacts;
  size?: "sm" | "md";
  showTooltip?: boolean;
};

export default function PreparedForFilingBadge({
  version,
  size = "md",
  showTooltip = true,
}: PreparedForFilingBadgeProps) {
  if (!isPreparedForFiling(version)) {
    return null;
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <div className="inline-flex items-center gap-1.5 group relative">
      <span
        className={`inline-flex items-center rounded-md border border-[var(--stroke)] bg-[var(--bg)] ${sizeClasses[size]} text-[var(--text)] font-medium`}
      >
        Prepared for filing
      </span>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
          <div className="bg-[var(--text)] text-white text-xs rounded px-2 py-1.5 whitespace-nowrap shadow-lg">
            Includes a snapshot, worksheet, and timestamped receipt for this version.
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="border-4 border-transparent border-t-[var(--text)]"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
