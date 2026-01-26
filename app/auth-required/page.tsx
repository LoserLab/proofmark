"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthRequired from "@/components/AuthRequired";

function AuthRequiredContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const message = from
    ? `The page you tried to access (${from}) requires you to be signed in.`
    : "This page requires you to be signed in.";

  return <AuthRequired message={message} />;
}

export default function AuthRequiredPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-sm text-[var(--muted)]">Loading...</div>
      </main>
    }>
      <AuthRequiredContent />
    </Suspense>
  );
}
