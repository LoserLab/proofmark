"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Stepper } from "@/components/Stepper";
import EvidencePackPreview from "@/components/EvidencePackPreview";
import SuccessPanel from "@/components/SuccessPanel";
import ChainProofBanner from "@/components/ChainProofBanner";
import ErrorNotice from "@/components/ErrorNotice";
import RevisionReminder from "@/components/RevisionReminder";
import PreparedForFilingBadge from "@/components/PreparedForFilingBadge";
import { Errors } from "@/lib/copy/errors";
import { formatVersionLabel } from "@/src/lib/format/versionLabel";

type WorkType = "Screenplay" | "Manuscript" | "Treatment" | "Pitch Deck" | "Research" | "Other";

function bytesToSize(bytes: number) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`;
}

function Card({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[var(--stroke)] bg-white p-6 shadow-sm">
      <div className="text-sm font-medium text-[var(--text)]">{title}</div>
      {desc ? <div className="mt-2 text-sm text-[var(--muted)]">{desc}</div> : null}
      <div className="mt-5">{children}</div>
    </div>
  );
}

export default function ProtectPage() {
  const steps = useMemo(
    () => [
      { id: 1, label: "Upload" },
      { id: 2, label: "Details" },
      { id: 3, label: "Review" },
      { id: 4, label: "Generate" },
    ],
    []
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [showDebug, setShowDebug] = useState(false);
  
  // Debug mode: only in non-production, optionally gated by ?debug=1
  const debug = typeof window !== "undefined" && process.env.NODE_ENV !== "production" && new URLSearchParams(window.location.search).get("debug") === "1";

  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const successRef = useRef<boolean>(false);
  const [uploadState, setUploadState] = useState<"idle" | "ready" | "uploading" | "success" | "error">("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uiError, setUiError] = useState<string | null>(null);

  // These IDs are returned by your backend after upload + commit
  const [scriptId, setScriptId] = useState<string | null>(null);
  const [versionId, setVersionId] = useState<string | null>(null);
  const [versionMetadata, setVersionMetadata] = useState<{
    versionNumber: number | null;
    committedAt: string | null;
    createdAt: string | null;
    sha256: string | null;
    snapshot_path: string | null;
    worksheet_path: string | null;
  } | null>(null);

  // Revision detection state
  const [isPotentialRevision, setIsPotentialRevision] = useState(false);
  const [showRevisionReminder, setShowRevisionReminder] = useState(false);

  const [title, setTitle] = useState("");
  const [workType, setWorkType] = useState<WorkType>("Screenplay");
  const [notes, setNotes] = useState("");

  // Metadata from upload response
  const [fileMetadata, setFileMetadata] = useState<{
    suggestedTitle: string | null;
    fileType: string | null;
    pageCount: number | null;
    fileSizeBytes: number | null;
  } | null>(null);

  const [packetStatus, setPacketStatus] = useState<"idle" | "generating" | "done" | "error">(
    "idle"
  );
  const [packetError, setPacketError] = useState<string | null>(null);
  const [packetDownloadUrl, setPacketDownloadUrl] = useState<string | null>(null);

  // Single source of truth for Continue button state
  const canContinue = useMemo(() => {
    if (currentStep === 1) {
      // Step 1 (Upload): enabled only when upload completes successfully
      return uploadState === "success";
    }
    if (currentStep === 2) {
      // Step 2 (Details): enabled when title is valid
      return title.trim().length >= 2;
    }
    if (currentStep === 3) {
      // Step 3 (Review): always enabled
      return true;
    }
    // Step 4 (Generate): disabled (no next step)
    return false;
  }, [currentStep, uploadState, title]);

  function next() {
    if (!canContinue) return;
    setCurrentStep((s) => Math.min(s + 1, steps.length));
  }

  function back() {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }

  // Mount/unmount detector
  useEffect(() => {
    console.log("[protect] mounted");
    return () => console.log("[protect] unmounted");
  }, []);

  // State watcher
  useEffect(() => {
    console.log("[protect] state", { currentStep, uploadState, scriptId, versionId, canContinue });
  }, [currentStep, uploadState, scriptId, versionId, canContinue]);

  // Auto-upload when file is selected
  useEffect(() => {
    if (file && uploadState === "ready") {
      uploadAndCommit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, uploadState]);

  async function handleFileSelected(f: File | null) {
    setFile(f);
    fileRef.current = f;
    successRef.current = false; // Reset success on new file selection
    setUploadState(f ? "ready" : "idle");
    setUploadError(null);
    setUiError(null);
    setScriptId(null);
    setVersionId(null);
    setPacketStatus("idle");
    setPacketError(null);
    setPacketDownloadUrl(null);
  }

  function removeSelectedFile() {
    if (uploadState === "uploading") return;
    setFile(null);
    fileRef.current = null;
    successRef.current = false; // Reset success when removing file
    setScriptId(null);
    setVersionId(null);
    setUploadError(null);
    setUiError(null);
    setUploadState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadAndCommit() {
    const f = fileRef.current ?? fileInputRef.current?.files?.[0] ?? null;
    console.log("[protect] uploadAndCommit start", { uploadState, hasFileRef: !!fileRef.current, hasInputFile: !!fileInputRef.current?.files?.[0], name: f?.name });
    
    setUiError(null);
    
    if (!f) {
      setUploadError("No file selected");
      setUploadState("error");
      return;
    }

    setUploadState("uploading");
    setUploadError(null);

    // Track endpoint sequence (dev only)
    const endpoints: string[] = [];
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
      endpoints.push("1. POST /api/scripts/create");
    }

    try {
      // 1) Create script (server)
      const createEndpoint = "/api/scripts/create";
      const createRes = await fetch(createEndpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title?.trim() || f.name.replace(/\.[^/.]+$/, ""),
          workType,
        }),
      });

      if (!createRes.ok) {
        const bodyText = await createRes.text();
        throw new Error(`${createEndpoint} ${createRes.status}: ${bodyText}`);
      }
      const createRaw = await createRes.json();
      console.log("create response:", JSON.stringify(createRaw, null, 2));
      if (createRaw.ok !== true) {
        throw new Error(`${createEndpoint} ok:false ${JSON.stringify(createRaw)}`);
      }
      const sid = createRaw.scriptId ?? createRaw.script_id ?? createRaw.data?.scriptId ?? createRaw.data?.script_id;
      if (!sid) {
        throw new Error(`Missing scriptId from create response: ${JSON.stringify(createRaw)}`);
      }

      // 2) Request signed upload URL (server) - this returns metadata
      if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
        endpoints.push(`2. POST /api/scripts/${sid}/upload`);
      }
      const uploadEndpoint = `/api/scripts/${sid}/upload`;
      const signRes = await fetch(uploadEndpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          filename: f.name,
          mimeType: f.type || "application/octet-stream",
          size: f.size,
        }),
      });

      if (!signRes.ok) {
        const bodyText = await signRes.text();
        throw new Error(`${uploadEndpoint} ${signRes.status}: ${bodyText}`);
      }
      const signed = await signRes.json();
      if (signed.ok !== true) {
        throw new Error(`${uploadEndpoint} ok:false ${JSON.stringify(signed)}`);
      }
      const uploadUrl = signed.signedUploadUrl || signed.uploadUrl;
      const storagePath = signed.storagePath || signed.filePath || signed.path;
      if (!uploadUrl || !storagePath) throw new Error("Missing uploadUrl or storagePath.");

      // Store metadata for pre-fill
      setFileMetadata({
        suggestedTitle: signed.suggestedTitle || null,
        fileType: signed.fileType || null,
        pageCount: signed.pageCount || null,
        fileSizeBytes: signed.fileSizeBytes || f.size,
      });

      // Store revision detection info
      setIsPotentialRevision(signed.isPotentialRevision || false);

      // 3) Upload file directly to storage
      if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
        try {
          const uploadHost = new URL(uploadUrl).hostname;
          endpoints.push(`3. PUT ${uploadHost} (signed upload URL)`);
        } catch {
          endpoints.push(`3. PUT <signed upload URL>`);
        }
      }
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        body: f,
        headers: {
          "content-type": f.type || "application/octet-stream",
        },
      });

      if (!putRes.ok) {
        const bodyText = await putRes.text();
        throw new Error(`PUT ${uploadUrl} ${putRes.status}: ${bodyText}`);
      }

      // 4) Commit version (server)
      if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
        endpoints.push(`4. POST /api/scripts/${sid}/commit`);
      }
      const commitEndpoint = `/api/scripts/${sid}/commit`;
      const commitRes = await fetch(commitEndpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          filePath: storagePath,
          fileSize: f.size,
          mimeType: f.type || "application/octet-stream",
        }),
      });

      if (!commitRes.ok) {
        const bodyText = await commitRes.text();
        throw new Error(`${commitEndpoint} ${commitRes.status}: ${bodyText}`);
      }
      const commitRaw = await commitRes.json();
      console.log("commit response:", JSON.stringify(commitRaw, null, 2));
      
      // Gate success on ok === true AND having both IDs
      if (commitRaw.ok !== true) {
        throw new Error(`${commitEndpoint} ok:false ${JSON.stringify(commitRaw)}`);
      }
      
      const vid = commitRaw.versionId ?? commitRaw.version_id ?? commitRaw.data?.versionId ?? commitRaw.data?.version_id;
      if (!vid) {
        throw new Error(`Missing versionId from commit response: ${JSON.stringify(commitRaw)}`);
      }
      
      // Only set success if we have both IDs and ok === true
      const newScriptId = sid ? String(sid) : null;
      const newVersionId = vid ? String(vid) : null;
      
      if (!newScriptId || !newVersionId) {
        throw new Error(`Missing required IDs: scriptId=${newScriptId}, versionId=${newVersionId}`);
      }
      
      // Store version metadata for display
      setVersionMetadata({
        versionNumber: commitRaw.versionNumber || commitRaw.version_number || null,
        committedAt: commitRaw.committedAt || commitRaw.committed_at || null,
        createdAt: commitRaw.createdAt || commitRaw.created_at || null,
        sha256: commitRaw.sha256 || commitRaw.hash_sha256 || null,
        snapshot_path: commitRaw.snapshot_path || null,
        worksheet_path: commitRaw.worksheet_path || null,
      });

      console.log("[protect] uploadAndCommit success about to set state", { newScriptId, newVersionId, ok: commitRaw.ok });
      
      // Log endpoint sequence (dev only)
      if (typeof window !== "undefined" && process.env.NODE_ENV !== "production" && endpoints.length > 0) {
        console.log("[protect] Upload flow endpoints:", endpoints);
      }
      
      // Set state in safe order to ensure re-render - only if ok === true and IDs exist
      setScriptId(newScriptId);
      setVersionId(newVersionId);
      setUploadState("success");
      successRef.current = true; // Persist success state
      
      queueMicrotask(() => console.log("[protect] after success microtask", { uploadState: "success (queued)" }));

      // Update metadata with page count from commit response
      if (commitRaw.pageCount !== undefined) {
        setFileMetadata((prev) => ({
          ...(prev || { suggestedTitle: null, fileType: null, pageCount: null, fileSizeBytes: null }),
          pageCount: commitRaw.pageCount || null,
        }));
      }
      
      // Pre-fill title with suggested title from metadata (user can edit)
      const currentMetadata = {
        suggestedTitle: signed.suggestedTitle || null,
        fileType: signed.fileType || null,
        pageCount: commitRaw.pageCount || null,
        fileSizeBytes: signed.fileSizeBytes || f.size,
      };
      
      if (!title.trim() && currentMetadata.suggestedTitle) {
        setTitle(currentMetadata.suggestedTitle);
      } else if (!title.trim()) {
        setTitle(f.name.replace(/\.[^/.]+$/, ""));
      }
    } catch (err: any) {
      // In dev mode, log detailed error information
      if (process.env.NODE_ENV !== "production") {
        console.error("[protect] upload error", {
          message: err?.message,
          stack: err?.stack,
          error: err,
        });
      }
      
      // Extract error message
      const rawErrorMessage = err instanceof Error ? err.message : String(err);
      
      // In dev mode, show the real error; in production, show friendly message
      const errorMessage = process.env.NODE_ENV !== "production" 
        ? rawErrorMessage 
        : "Upload failed. Please try again.";
      
      setUploadError(errorMessage);
      setUiError(errorMessage);
      setUploadState("error");
    }
  }

  async function generateEvidencePack() {
    if (!scriptId || !versionId) return;

    setPacketStatus("generating");
    setPacketError(null);

    try {
      const res = await fetch(`/api/scripts/${scriptId}/packet`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          versionId,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || Errors.packet.failed.body);
      }

      // Packet route returns ZIP file directly, create blob URL for download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPacketDownloadUrl(url);
      setPacketStatus("done");
    } catch (e: any) {
      setPacketStatus("error");
      setPacketError(e?.message || Errors.packet.failed.body);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <section className="max-w-7xl mx-auto px-6 pt-28 pb-10">
        <div className="bg-[var(--white)] rounded-lg border p-8 md:p-12 shadow-sm" style={{ borderColor: 'rgba(90, 120, 99, 0.25)' }}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-[var(--headline)]">
                Create a record
              </h1>
              <p className="text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
                Upload a file, confirm details, then generate a neutral evidence pack with
                timestamps, fingerprints, and version lineage.
              </p>
            </div>

            <Stepper steps={steps} currentStep={currentStep} />

            <div className={currentStep === 1 ? "space-y-6" : "grid md:grid-cols-12 gap-8 items-start"}>
              {/* Main */}
              <div className={currentStep === 1 ? "space-y-6" : "md:col-span-8 space-y-6"}>
                {currentStep === 1 && (
                  <>
                    <Card
                      title="Upload your draft"
                      desc="PDF or DOCX recommended. ProofMark stores a fingerprint and records the timestamp."
                    >
                      <div className="flex flex-col gap-3">
                        {/* Drag-and-drop zone */}
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.setAttribute("data-dragover", "true");
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.removeAttribute("data-dragover");
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.currentTarget.removeAttribute("data-dragover");
                            const droppedFile = e.dataTransfer.files?.[0];
                            if (droppedFile) {
                              handleFileSelected(droppedFile);
                            }
                          }}
                          onClick={() => fileInputRef.current?.click()}
                          className="group relative cursor-pointer rounded-xl border-2 border-dashed border-[var(--stroke)] bg-[var(--bg)] p-8 text-center transition-all duration-200 hover:border-[var(--accent)] hover:bg-[rgba(235,244,221,0.3)] data-[dragover=true]:border-[var(--accent)] data-[dragover=true]:bg-[rgba(235,244,221,0.5)] data-[dragover=true]:scale-[1.01]"
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            className="hidden"
                            onChange={(e) => handleFileSelected(e.target.files?.[0] || null)}
                          />

                          {/* Upload icon */}
                          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(90,120,99,0.1)] transition-colors group-hover:bg-[rgba(90,120,99,0.15)]">
                            <svg
                              className="h-7 w-7 text-[var(--accent)] transition-transform group-hover:scale-110"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                              />
                            </svg>
                          </div>

                          <p className="text-sm font-medium text-[var(--text)]">
                            Drop your file here, or <span className="text-[var(--accent)] underline underline-offset-2">browse</span>
                          </p>
                          <p className="mt-1 text-xs text-[var(--muted)]">
                            PDF, DOCX, or TXT up to 50MB
                          </p>
                        </div>

                        {/* Selected file display */}
                        {(file || uploadState !== "idle") && (
                          <div className="rounded-lg border border-[var(--stroke)] bg-white p-4">
                            <div className="flex items-center gap-3">
                              {/* File type icon */}
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(90,120,99,0.1)]">
                                <svg
                                  className="h-5 w-5 text-[var(--accent)]"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={1.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                  />
                                </svg>
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-[var(--text)]">
                                  {file?.name ?? "Selected file"}
                                </p>
                                <p className="text-xs text-[var(--muted)]">
                                  {file ? bytesToSize(file.size) : ""}
                                  {uploadState === "uploading" && (
                                    <span className="ml-2 inline-flex items-center gap-1">
                                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]"></span>
                                      Uploading...
                                    </span>
                                  )}
                                  {uploadState === "success" && (
                                    <span className="ml-2 text-[var(--accent)]">Ready</span>
                                  )}
                                </p>
                              </div>

                              {/* Remove button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSelectedFile();
                                }}
                                disabled={uploadState === "uploading"}
                                aria-label="Remove file"
                                className="shrink-0 rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--text)] disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-1"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>

                            {/* Progress bar for uploading state */}
                            {uploadState === "uploading" && (
                              <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--bg)]">
                                <div className="h-full w-2/3 animate-pulse rounded-full bg-[var(--accent)] transition-all"></div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Status line */}
                        {uploadState === "error" && (
                          <div className="text-xs text-red-600">
                            {process.env.NODE_ENV === "production" ? "Upload failed. Please try again." : (uiError || uploadError || "Upload failed. Please try again.")}
                          </div>
                        )}

                        {/* Dev mode: show raw error message under status line */}
                        {process.env.NODE_ENV !== "production" && uploadState === "error" && (uiError || uploadError) && (
                          <div className="text-xs text-red-600 mt-1 font-mono">
                            {uiError || uploadError}
                          </div>
                        )}

                        {uploadError && (
                          <ErrorNotice
                            title={Errors.upload.failed.title}
                            body={uploadError}
                            recovery={Errors.upload.failed.recovery}
                          />
                        )}
                      </div>
                    </Card>

                    {/* Info cards row - only for step 0 */}
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="rounded-lg border border-[var(--stroke)] bg-white p-6 shadow-sm">
                        <div className="text-sm font-medium text-[var(--text)]">What gets recorded</div>
                        <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                          <li>Timestamp of each protected version</li>
                          <li>Cryptographic fingerprint (SHA-256)</li>
                          <li>Version lineage and file metadata</li>
                          <li>Optional sharing and access log</li>
                        </ul>
                      </div>

                      <div className="rounded-lg border border-[var(--stroke)] bg-white p-6 shadow-sm">
                        <div className="text-sm font-medium text-[var(--text)]">Privacy and control</div>
                        <div className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                          You keep ownership of your work. ProofMark stores records and proof.
                          Sharing links are token-based and can be revoked if your system supports it.
                        </div>
                      </div>

                      <div className="rounded-lg border border-[var(--stroke)] bg-white p-6 shadow-sm">
                        <div className="text-sm font-medium text-[var(--text)]">Tip</div>
                        <div className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                          If you iterate often, protect major milestones. ProofMark will keep the lineage clean.
                        </div>
                      </div>
                    </div>

                  </>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    {/* Revision reminder - shown after metadata preview, before packet generation */}
                    {showRevisionReminder && scriptId && versionId && (
                      <RevisionReminder
                        versionId={versionId}
                        scriptId={scriptId}
                        onDismiss={() => setShowRevisionReminder(false)}
                        onTimestamp={() => {
                          // "Timestamp this version" means continue with the current flow
                          // The version is already timestamped on commit, so just dismiss
                          setShowRevisionReminder(false);
                        }}
                      />
                    )}

                    <Card
                      title="Draft details"
                      desc="These details are used in your evidence pack and internal records."
                    >
                      <div className="space-y-4">
                      {/* Helper copy about pre-filling */}
                      {fileMetadata?.suggestedTitle && (
                        <div className="rounded-lg border border-[var(--stroke)] bg-[var(--bg)] p-3 text-xs text-[var(--muted)] leading-relaxed">
                          We pre-filled this based on your file. Please review and edit anything that&apos;s incorrect.
                        </div>
                      )}

                      {/* File metadata badges */}
                      {(fileMetadata?.fileType || fileMetadata?.pageCount !== null) && (
                        <div className="flex flex-wrap gap-2">
                          {fileMetadata?.fileType && (
                            <span className="inline-flex items-center rounded-full border border-[var(--stroke)] bg-white px-3 py-1 text-xs text-[var(--text)]">
                              {fileMetadata.fileType}
                            </span>
                          )}
                          {fileMetadata?.pageCount !== null && fileMetadata?.pageCount !== undefined && (
                            <span className="inline-flex items-center rounded-full border border-[var(--stroke)] bg-white px-3 py-1 text-xs text-[var(--text)]">
                              {fileMetadata.pageCount} {fileMetadata.pageCount === 1 ? "page" : "pages"}
                            </span>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="text-xs text-[var(--muted)]">Title</label>
                        <input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="mt-2 w-full rounded-md border border-[var(--stroke)] bg-white px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                          placeholder="Untitled draft"
                        />
                        <div className="mt-2 text-xs text-[var(--muted)]">
                          Keep it simple and consistent across versions.
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-[var(--muted)]">Work type</label>
                        <select
                          value={workType}
                          onChange={(e) => setWorkType(e.target.value as WorkType)}
                          className="mt-2 w-full rounded-md border border-[var(--stroke)] bg-white px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                        >
                          <option>Screenplay</option>
                          <option>Manuscript</option>
                          <option>Treatment</option>
                          <option>Pitch Deck</option>
                          <option>Research</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-[var(--muted)]">Notes (optional)</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="mt-2 w-full min-h-[110px] rounded-md border border-[var(--stroke)] bg-white px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                          placeholder="Optional notes for your own reference."
                        />
                      </div>
                    </div>
                  </Card>
                  </div>
                )}

                {currentStep === 3 && (
                  <Card
                    title="Review"
                    desc="Preview what will be recorded in your evidence packet."
                  >
                    <div className="text-xs text-[var(--muted)] leading-relaxed">
                      ProofMark will generate an evidence pack containing timestamps, a file fingerprint,
                      and version lineage. ProofMark is not a law firm and does not provide legal advice.
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        className="px-6 py-3 rounded-md border border-[var(--stroke)] text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                        onClick={() => {
                          const k = crypto.randomUUID();
                          const payload = {
                            title,
                            workType,
                            filename: file?.name ?? null,
                            fileSize: file?.size ?? null,
                            scriptId,
                            versionId,
                            notes,
                          };
                          // Clean up old preview keys
                          for (let i = 0; i < sessionStorage.length; i++) {
                            const k2 = sessionStorage.key(i);
                            if (k2?.startsWith("dl_preview_") && k2 !== `dl_preview_${k}`) {
                              sessionStorage.removeItem(k2);
                            }
                          }
                          sessionStorage.setItem(`dl_preview_${k}`, JSON.stringify(payload));
                          window.open(`/protect/preview?key=${encodeURIComponent(k)}`, "_blank", "noopener,noreferrer");
                        }}
                      >
                        Preview full page
                      </button>
                    </div>
                    <div className="mt-6">
                      <EvidencePackPreview
                        title={title}
                        workType={workType}
                        filename={file?.name ?? null}
                        fileSizeLabel={file ? bytesToSize(file.size) : null}
                        scriptId={scriptId}
                        versionId={versionId}
                        notes={notes}
                      />
                    </div>
                  </Card>
                )}

                {currentStep === 4 && (
                  <Card
                    title="Generate evidence pack"
                    desc="This creates your downloadable proof packet for this version."
                  >
                    <div className="space-y-4">
                      {packetStatus !== "done" ? (
                        <>
                          <button
                            onClick={generateEvidencePack}
                            disabled={packetStatus === "generating"}
                            className={[
                              "px-6 py-3.5 rounded-md text-sm font-medium tracking-wide",
                              packetStatus === "generating"
                                ? "bg-[var(--stroke)] text-[var(--muted)] cursor-not-allowed"
                                : "bg-[var(--accent)] text-white hover:opacity-90 transition-opacity",
                            ].join(" ")}
                          >
                            {packetStatus === "generating" ? "Generating" : "Generate evidence pack"}
                          </button>

                          <div className="text-xs text-[var(--muted)] leading-relaxed max-w-2xl">
                            The evidence pack includes a timestamped record, file fingerprint, version lineage,
                            and neutral metadata. ProofMark is not a law firm and does not provide legal advice.
                          </div>
                        </>
                      ) : (
                        <>
                        {/* Blockchain proof banner */}
                        {scriptId && versionId && (
                          <div className="mb-4">
                            <ChainProofBanner scriptId={scriptId} versionId={versionId} />
                          </div>
                        )}

                        <SuccessPanel
                          title="Evidence pack generated"
                          subtitle={
                            versionMetadata ? (
                              <div className="space-y-2">
                                <div>Your evidence packet is ready. You can download it now and optionally create a share link for controlled access.</div>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <div className="text-xs text-[var(--muted)]">
                                    {formatVersionLabel({
                                      versionNumber: versionMetadata.versionNumber,
                                      createdAt: versionMetadata.committedAt || versionMetadata.createdAt,
                                      includeTime: true, // Detailed view
                                    })}
                                  </div>
                                  <PreparedForFilingBadge
                                    version={{
                                      sha256: versionMetadata.sha256,
                                      snapshot_path: versionMetadata.snapshot_path,
                                      worksheet_path: versionMetadata.worksheet_path,
                                    }}
                                    size="sm"
                                  />
                                </div>
                              </div>
                            ) : (
                              "Your evidence packet is ready. You can download it now and optionally create a share link for controlled access."
                            )
                          }
                          primary={
                            <>
                              {packetDownloadUrl ? (
                                <a
                                  className="inline-block px-6 py-3.5 rounded-md bg-[var(--accent)] text-white text-sm font-medium tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                                  href={packetDownloadUrl}
                                  download={`ProofMark_Evidence_Pack_${scriptId}.zip`}
                                >
                                  Download evidence pack
                                </a>
                              ) : (
                                <div className="px-6 py-3 rounded-md border border-[var(--stroke)] text-sm text-[var(--muted)]">
                                  Download link not available
                                </div>
                              )}
                              
                              {/* Re-download button - uses direct API call */}
                              {scriptId && versionId && (
                                <a
                                  href={`/api/scripts/${scriptId}/packet?versionId=${versionId}`}
                                  className="inline-block px-6 py-3 rounded-md border border-[var(--stroke)] text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                                  download={`ProofMark_Evidence_Pack_${scriptId}.zip`}
                                >
                                  Download again
                                </a>
                              )}

                              <a
                                href="/protect"
                                className="inline-block px-6 py-3 rounded-md border border-[var(--stroke)] text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                              >
                                Create another record
                              </a>
                            </>
                          }
                          secondary={
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!scriptId || !versionId) return;
                                  const payload = {
                                    scriptId,
                                    versionId,
                                    title,
                                    workType,
                                  };
                                  sessionStorage.setItem("dl_share_ctx", JSON.stringify(payload));
                                  window.location.href = "/share/create";
                                }}
                                className="inline-block px-6 py-3 rounded-md border border-[var(--stroke)] text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                              >
                                Create share link
                              </button>

                              <a
                                href={`/app/scripts/${scriptId}`}
                                className="inline-block px-6 py-3 rounded-md border border-[var(--stroke)] text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                              >
                                View draft record
                              </a>
                            </>
                          }
                          checklistTitle="Next steps (optional)"
                          checklist={[
                            "Save the evidence pack somewhere you control (local + cloud).",
                            "If you plan to register, keep the title consistent across filings and versions.",
                            "If sharing with collaborators, use a ProofMark link instead of sending raw files.",
                            "For U.S. copyright registration, ProofMark can support organization and evidence, but it is not legal advice.",
                          ]}
                          footnote={
                            <div className="space-y-6">
                              <p className="text-xs text-[var(--muted)] leading-relaxed">
                                If you revise the work, protect major milestones. ProofMark keeps the lineage clean and the record easy to follow.
                              </p>
                              <div className="pt-6 border-t border-[var(--stroke)]">
                                <div className="text-sm font-medium text-[var(--text)] mb-2">
                                  Need proof you sent or submitted this version?
                                </div>
                                <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">
                                  SendProof (Preview) will create a timestamped record when you email, submit, or deliver this draft.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  <a
                                    href="/sendproof"
                                    className="inline-block px-4 py-2 rounded-md bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                                  >
                                    Preview SendProof
                                  </a>
                                  <a
                                    href="/how#sendproof"
                                    className="inline-block px-4 py-2 rounded-md border border-[var(--stroke)] text-xs text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                                  >
                                    Learn more
                                  </a>
                                </div>
                              </div>
                            </div>
                          }
                        />
                        </>
                      )}

                      {packetError && (
                        <ErrorNotice
                          title={Errors.packet.failed.title}
                          body={packetError}
                          recovery={Errors.packet.failed.recovery}
                        />
                      )}
                    </div>
                  </Card>
                )}

                {/* Debug panel - non-production only, optionally gated by ?debug=1 */}
                {process.env.NODE_ENV !== "production" && (debug || showDebug) && (
                  <div className="mt-4 p-3 rounded border border-[var(--stroke)] bg-[var(--bg)]">
                    <div className="text-xs font-mono text-[var(--muted)] space-y-0.5">
                      <div>currentStep: {currentStep}</div>
                      <div>uploadState: {uploadState}</div>
                      <div>file?.name: {file?.name || "null"}</div>
                      <div>scriptId: {scriptId || "null"}</div>
                      <div>versionId: {versionId || "null"}</div>
                      <div>canContinue: {canContinue ? "true" : "false"}</div>
                      <div className="mt-1 pt-1 border-t border-[var(--stroke)]">
                        <div>okUploadStatus: {uploadState === "success" ? "true" : "false"}</div>
                        <div>okScriptId: {!!scriptId ? "true" : "false"}</div>
                        <div>okVersionId: {!!versionId ? "true" : "false"}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Debug toggle button - non-production only */}
                {process.env.NODE_ENV !== "production" && (
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowDebug(!showDebug)}
                      className="text-xs underline opacity-60 hover:opacity-100 text-[var(--muted)] transition-opacity"
                    >
                      Debug
                    </button>
                  </div>
                )}

                {/* Nav buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={back}
                    className="px-4 py-2 rounded-md text-sm border border-[var(--stroke)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                  >
                    Back
                  </button>

                  {(() => {
                    console.log("[protect] render Continue", { disabled: !canContinue, currentStep, uploadState });
                    return (
                      <button
                        type="button"
                        onClick={next}
                        disabled={!canContinue}
                        className={[
                          "px-5 py-2 rounded-md text-sm font-medium text-white transition-colors",
                          canContinue
                            ? "bg-[var(--accent)] hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 cursor-pointer"
                            : "bg-[var(--stroke)] cursor-not-allowed opacity-50",
                        ].join(" ")}
                      >
                        Continue
                      </button>
                    );
                  })()}
                </div>
              </div>

              {/* Side rail - hidden for step 0, shown for other steps */}
              {currentStep !== 1 && (
                <div className="md:col-span-4 space-y-6">
                  <div className="rounded-lg border border-[var(--stroke)] bg-white p-6 shadow-sm">
                    <div className="text-sm font-medium text-[var(--text)]">What gets recorded</div>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                      <li>Timestamp of each protected version</li>
                      <li>Cryptographic fingerprint (SHA-256)</li>
                      <li>Version lineage and file metadata</li>
                      <li>Optional sharing and access log</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-[var(--stroke)] bg-white p-6 shadow-sm">
                    <div className="text-sm font-medium text-[var(--text)]">Privacy and control</div>
                    <div className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                      You keep ownership of your work. ProofMark stores records and proof.
                      Sharing links are token-based and can be revoked if your system supports it.
                    </div>
                  </div>

                  <div className="rounded-lg border border-[var(--stroke)] bg-white p-6 shadow-sm">
                    <div className="text-sm font-medium text-[var(--text)]">Tip</div>
                    <div className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                      If you iterate often, protect major milestones. ProofMark will keep the lineage clean.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom legal note */}
            <div className="text-xs text-[var(--muted)] leading-relaxed max-w-3xl">
              ProofMark supports many kinds of drafts. ProofMark is not a law firm and does not provide legal advice.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
