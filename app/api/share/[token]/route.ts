import { NextResponse } from "next/server";
import { supabaseServerService } from "@/lib/supabase/server";
import { config } from "@/lib/config";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  const supabase = supabaseServerService();
  const token = params.token;

  const { data: link, error: linkErr } = await supabase
    .from("share_links")
    .select(
      "id, token, viewer_label, viewer_id, revoked_at, script_id, version_id, created_at, expires_at, view_count, created_by, first_viewed_at, allow_download"
    )
    .eq("token", token)
    .single();

  if (linkErr || !link) {
    return NextResponse.json(
      {
        ok: false,
        status: "not_found",
        token,
      },
      { status: 404 }
    );
  }

  // Check if revoked
  if (link.revoked_at) {
    return NextResponse.json({
      ok: true,
      token,
      status: "revoked",
      allowDownload: false,
      title: null,
      workType: null,
      createdAt: link.created_at,
      expiresAt: link.expires_at,
      views: link.view_count || 0,
      firstViewedAt: link.first_viewed_at || null,
      viewerId: link.viewer_id || null,
      evidence: null,
    });
  }

  // Check if expired
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return NextResponse.json({
      ok: true,
      token,
      status: "expired",
      allowDownload: false,
      title: null,
      workType: null,
      createdAt: link.created_at,
      expiresAt: link.expires_at,
      views: link.view_count || 0,
      firstViewedAt: link.first_viewed_at || null,
      viewerId: link.viewer_id || null,
      evidence: null,
    });
  }

  // Get script and version data
  const { data: script, error: sErr } = await supabase
    .from("scripts")
    .select("id, title")
    .eq("id", link.script_id)
    .single();

  const { data: version, error: vErr } = await supabase
    .from("script_versions")
    .select(
      "id, original_filename, byte_size, mime_type, file_path, committed_at"
    )
    .eq("id", link.version_id)
    .single();

  if (sErr || !script || vErr || !version) {
    return NextResponse.json(
      {
        ok: false,
        status: "not_found",
        token,
      },
      { status: 404 }
    );
  }

  // Check if this is the first view
  const isFirstView = !link.first_viewed_at;
  const now = new Date().toISOString();

  // Update first_viewed_at if this is the first view, and increment view_count
  const updateData: { view_count: number; first_viewed_at?: string } = {
    view_count: (link.view_count || 0) + 1,
  };

  if (isFirstView) {
    updateData.first_viewed_at = now;
  }

  await supabase
    .from("share_links")
    .update(updateData)
    .eq("id", link.id);

  // Log view (this will be the first entry if isFirstView is true)
  await supabase.from("audit_log").insert({
    user_id: link.created_by,
    script_id: link.script_id,
    script_version_id: link.version_id,
    action: "share_viewed",
    metadata: { token },
  });

  // Use first_viewed_at from the updated link (or existing if not first view)
  const firstViewedAt = isFirstView ? now : (link.first_viewed_at || null);

  // Construct evidence URL if file exists
  let evidenceUrl: string | null = null;
  if (version.file_path) {
    const bucket = config.storage.bucket;
    const { data: signedUrl } = await supabase.storage
      .from(bucket)
      .createSignedUrl(version.file_path, 3600); // 1 hour expiry
    evidenceUrl = signedUrl?.signedUrl || null;
  }

  // Read allowDownload from share_links table, default to true if not set
  const allowDownload = link.allow_download ?? true;

  return NextResponse.json({
    ok: true,
    token,
    status: "active",
    allowDownload,
    title: script.title || null,
    workType: "Work", // You may want to add this to scripts table
    createdAt: link.created_at,
    expiresAt: link.expires_at,
    views: (link.view_count || 0) + 1, // Include the current view
    firstViewedAt: firstViewedAt,
    viewerId: link.viewer_id || null, // Return viewer ID
    evidence: {
      url: evidenceUrl,
      filename: version.original_filename,
      sizeBytes: version.byte_size ? Number(version.byte_size) : null,
    },
  });
}
