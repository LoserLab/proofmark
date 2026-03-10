import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";
import { config } from "@/lib/config";

// Maximum file size: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const toByteSize = (...candidates: Array<unknown>) => {
  for (const c of candidates) {
    const v = typeof c === "string" ? Number(c) : Number(c as any);
    if (Number.isFinite(v) && v >= 0) return v;
  }
  return 0;
};

// Sanitize filename to prevent path traversal and invalid characters
const sanitizeFilename = (filename: string): string => {
  // Remove path separators and null bytes
  let sanitized = filename.replace(/[/\\:\x00]/g, "_");
  // Remove leading dots to prevent hidden files
  sanitized = sanitized.replace(/^\.+/, "");
  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.split(".").pop() || "";
    const base = sanitized.slice(0, 250 - ext.length);
    sanitized = ext ? `${base}.${ext}` : base;
  }
  // Fallback if empty
  return sanitized || "file";
};

export async function POST(req: Request) {
  // Authenticate user from session
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const supabase = supabaseServerService();
  const body = await req.json();

  const {
    title,
    workType,
    notes,
    authorsCount,
    workMadeForHire,
    publicationStatus,
    preexistingMaterial,
    mimeType,
  } = body;

  const originalFilename = body.originalFilename || body.filename;
  const byteSize = body.byteSize || body.size;

  if (!originalFilename || !mimeType || !byteSize) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Validate file size
  const size = toByteSize(byteSize);
  if (size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
      { status: 413 }
    );
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed types: PDF, DOC, DOCX, TXT" },
      { status: 400 }
    );
  }

  // Sanitize filename
  const safeFilename = sanitizeFilename(originalFilename);

  const { data: script, error: scriptErr } = await supabase
    .from("scripts")
    .insert({
      user_id: userId,
      title: title ?? "Untitled screenplay",
      work_type: workType ?? null,
      notes: notes ?? null,
      authors_count: authorsCount ?? 1,
      work_made_for_hire: workMadeForHire ?? "no",
      publication_status: publicationStatus ?? "unpublished",
      preexisting_material: preexistingMaterial ?? "no",
    })
    .select("*")
    .single();

  if (scriptErr) {
    console.error("[api/scripts/upload] Script insert error:", scriptErr.message);
    return NextResponse.json({ error: "Failed to create script" }, { status: 500 });
  }

  const storagePath = `${userId}/${script.id}/${crypto.randomUUID()}-${safeFilename}`;

  const byte_size = size;
  const insertPayload = {
    script_id: script.id,
    user_id: userId,
    file_path: storagePath,
    original_filename: originalFilename,
    mime_type: mimeType,
    byte_size,
  };

  // Server-side logging (dev only)
  if (process.env.NODE_ENV !== "production") {
    console.log("[api] byte_size computed", { byte_size });
  }

  const { data: version, error: verErr } = await supabase
    .from("script_versions")
    .insert(insertPayload)
    .select("*")
    .single();

  if (verErr) {
    console.error("[api/scripts/upload] Version insert error:", {
      message: verErr.message,
      details: verErr.details,
      hint: verErr.hint,
      code: verErr.code,
    });
    return NextResponse.json({ error: "Failed to create version" }, { status: 500 });
  }

  await supabase.from("audit_log").insert({
    user_id: userId,
    script_id: script.id,
    script_version_id: version.id,
    action: "upload_started",
    metadata: { originalFilename, mimeType, byteSize },
  });

  const bucket = config.storage.bucket;
  const { data: signed, error: signErr } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(storagePath);

  if (signErr) {
    console.error("[api/scripts/upload] Signed URL error:", signErr.message);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }

  return NextResponse.json({
    scriptId: script.id,
    versionId: version.id,
    storagePath,
    signedUploadUrl: signed.signedUrl,
    token: signed.token,
  });
}
