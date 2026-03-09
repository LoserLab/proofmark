import { NextResponse } from "next/server";
import type { ApiError, ErrorCode } from "./types";

export function apiError(
  message: string,
  code: ErrorCode,
  status: number
): NextResponse<ApiError> {
  return NextResponse.json({ error: message, code }, { status });
}

export function unauthorized(message = "Unauthorized") {
  return apiError(message, "unauthorized", 401);
}

export function notFound(message = "Not found") {
  return apiError(message, "not_found", 404);
}

export function invalidRequest(message: string) {
  return apiError(message, "invalid_request", 400);
}

export function fileTooLarge(message = "File too large. Maximum size is 100MB") {
  return apiError(message, "file_too_large", 413);
}

export function unsupportedFileType(
  message = "Unsupported file type. Allowed: PDF, DOC, DOCX, TXT"
) {
  return apiError(message, "unsupported_file_type", 400);
}

export function versionNotCommitted(message = "Version not committed yet") {
  return apiError(message, "version_not_committed", 400);
}

export function internalError(message = "Internal server error") {
  return apiError(message, "internal_error", 500);
}
