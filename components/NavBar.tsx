// ============================================================================
// HEADER LOCKED - DO NOT MODIFY
// ============================================================================
// This header (logo + navigation) is final and locked.
// 
// DO NOT change:
// - Alignment, spacing, padding, margins, width, position, or container structure
// - Typography, colors, hover states, border radius, blur, or background
// - Labels, CTAs, or links
// - Component structure, layout, or responsiveness
//
// This component may only be referenced as a fixed dependency by other sections.
// To modify, explicitly request "unlock header" in your prompt.
// ============================================================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NavBar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const accountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        // If Supabase isn't configured or there's an error, default to logged out
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();

    // Listen for auth changes
    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const supabase = createClient();
      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange(() => {
        checkAuth();
      });
      subscription = sub;
    } catch (error) {
      // If Supabase isn't configured, skip subscription
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileRef.current && !mobileRef.current.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (accountTimeoutRef.current) {
        clearTimeout(accountTimeoutRef.current);
      }
    };
  }, []);

  // Handle keyboard events for account dropdown
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isAccountOpen) {
        setIsAccountOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAccountOpen]);

  return (
    <header className="fixed left-0 right-0 z-50 top-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Left - Logo (standalone, no background container) */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-sm font-medium tracking-wide text-[var(--text)] hover:text-[var(--headline)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 rounded"
            >
              ProofMark
            </Link>
          </div>

          {/* Right - Rounded Navigation Container (Desktop) */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-3 backdrop-blur-[14px] rounded-xl bg-white/70 border shadow-sm py-2.5 pr-2.5 pl-3" style={{ borderColor: 'rgba(90, 120, 99, 0.2)' }}>
              {/* The Process */}
              <Link
                href="/how"
                className="px-3 py-2 text-sm font-medium tracking-tight text-[var(--text)] rounded-lg transition-all duration-150 ease-out hover:bg-[rgba(235,244,221,0.5)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
              >
                The Process
              </Link>

              {/* Pricing */}
              <Link
                href="/pricing"
                className="px-3 py-2 text-sm font-medium tracking-tight text-[var(--text)] rounded-lg transition-all duration-150 ease-out hover:bg-[rgba(235,244,221,0.5)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
              >
                Pricing
              </Link>

              {/* Auth action */}
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <div 
                      className="relative" 
                      ref={accountRef}
                      onMouseEnter={() => {
                        if (accountTimeoutRef.current) {
                          clearTimeout(accountTimeoutRef.current);
                        }
                        setIsAccountOpen(true);
                      }}
                      onMouseLeave={() => {
                        accountTimeoutRef.current = setTimeout(() => {
                          setIsAccountOpen(false);
                        }, 150);
                      }}
                      onFocus={() => {
                        if (accountTimeoutRef.current) {
                          clearTimeout(accountTimeoutRef.current);
                        }
                        setIsAccountOpen(true);
                      }}
                      onBlur={(e) => {
                        // Only close if focus is leaving the entire container
                        if (!accountRef.current?.contains(e.relatedTarget as Node)) {
                          accountTimeoutRef.current = setTimeout(() => {
                            setIsAccountOpen(false);
                          }, 150);
                        }
                      }}
                    >
                      <button
                        onClick={() => setIsAccountOpen(!isAccountOpen)}
                        aria-haspopup="menu"
                        aria-expanded={isAccountOpen}
                        aria-controls="account-menu"
                        className="px-3 py-2 text-sm font-medium tracking-tight text-[var(--text)] rounded-lg transition-all duration-150 ease-out hover:bg-[rgba(235,244,221,0.5)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
                      >
                        Account
                      </button>
                      {isAccountOpen && (
                        <div 
                          id="account-menu"
                          className="absolute top-full right-0 mt-2 w-48 bg-white/70 backdrop-blur-[14px] rounded-lg border shadow-sm py-2 z-[60]"
                          style={{ borderColor: 'rgba(90, 120, 99, 0.2)' }}
                        >
                          <Link
                            href="/app"
                            onClick={() => setIsAccountOpen(false)}
                            className="block px-4 py-2 text-sm font-medium tracking-tight text-[var(--text)] rounded-lg transition-all duration-150 ease-out hover:bg-[rgba(235,244,221,0.5)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
                          >
                            Dashboard
                          </Link>
                          <Link
                            href="/app/settings"
                            onClick={() => setIsAccountOpen(false)}
                            className="block px-4 py-2 text-sm font-medium tracking-tight text-[var(--text)] rounded-lg transition-all duration-150 ease-out hover:bg-[rgba(235,244,221,0.5)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
                          >
                            Settings
                          </Link>
                          <div className="border-t border-[var(--stroke)] my-2" style={{ borderColor: 'rgba(90, 120, 99, 0.2)' }}></div>
                          <Link
                            href="/auth/logout"
                            onClick={() => setIsAccountOpen(false)}
                            className="block px-4 py-2 text-sm font-medium tracking-tight text-[var(--text)] rounded-lg transition-all duration-150 ease-out hover:bg-[rgba(235,244,221,0.5)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
                          >
                            Sign out
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="px-3 py-2 text-sm font-medium tracking-tight text-[var(--text)] rounded-lg transition-all duration-150 ease-out hover:bg-[rgba(235,244,221,0.5)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
                    >
                      Sign in
                    </Link>
                  )}
                </>
              )}

              {/* Create record - CTA Button */}
              <Link
                href="/protect"
                className="px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-medium tracking-tight hover:opacity-90 transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
              >
                Create record
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden relative" ref={mobileRef}>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 rounded"
              aria-label="Menu"
            >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
            </button>

            {/* Mobile Menu Panel */}
            {isMobileOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-[var(--white)] rounded-lg border border-[var(--stroke)] shadow-lg py-2 z-50">
              <Link
                href="/how"
                onClick={() => setIsMobileOpen(false)}
                className="block px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--highlight)] transition-colors"
              >
                The Process
              </Link>
              <Link
                href="/pricing"
                onClick={() => setIsMobileOpen(false)}
                className="block px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--highlight)] transition-colors"
              >
                Pricing
              </Link>
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/app"
                        onClick={() => setIsMobileOpen(false)}
                        className="block px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--highlight)] transition-colors"
                      >
                        My records
                      </Link>
                      <Link
                        href="/app/settings"
                        onClick={() => setIsMobileOpen(false)}
                        className="block px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--highlight)] transition-colors"
                      >
                        Settings
                      </Link>
                      <div className="border-t border-[var(--stroke)] my-2"></div>
                      <Link
                        href="/auth/logout"
                        onClick={() => setIsMobileOpen(false)}
                        className="block px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--highlight)] transition-colors"
                      >
                        Sign out
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMobileOpen(false)}
                      className="block px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--highlight)] transition-colors"
                    >
                      Sign in
                    </Link>
                  )}
                </>
              )}
              <div className="border-t border-[var(--stroke)] my-2"></div>
              <Link
                href="/protect"
                onClick={() => setIsMobileOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
              >
                Create record
              </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
