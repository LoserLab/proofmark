"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8; // Max 4px movement
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
        setMousePosition({ x, y });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md mx-auto lg:max-w-lg h-[400px] lg:h-[500px] flex items-center justify-center"
    >
      {/* Abstract proof artifact composition */}
      <div className="relative w-full h-full">
        {/* Base layer - large rounded rectangle */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "linear-gradient(135deg, rgba(251, 243, 219, 0.15) 0%, rgba(251, 243, 219, 0.08) 50%, transparent 100%)",
            transform: prefersReducedMotion
              ? "none"
              : `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
            transition: prefersReducedMotion ? "none" : "transform 0.1s ease-out",
          }}
        />

        {/* Middle layer - medium rounded rectangle */}
        <div
          className="absolute top-8 left-8 right-8 bottom-8 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(18, 18, 18, 0.12) 0%, rgba(251, 243, 219, 0.06) 100%)",
            transform: prefersReducedMotion
              ? "none"
              : `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            transition: prefersReducedMotion ? "none" : "transform 0.15s ease-out",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
          }}
        />

        {/* Top layer - small rounded rectangle */}
        <div
          className="absolute top-16 left-16 right-16 bottom-16 rounded-xl"
          style={{
            background: "linear-gradient(135deg, rgba(251, 243, 219, 0.2) 0%, rgba(18, 18, 18, 0.15) 100%)",
            transform: prefersReducedMotion
              ? "none"
              : `translate(${mousePosition.x * 0.7}px, ${mousePosition.y * 0.7}px)`,
            transition: prefersReducedMotion ? "none" : "transform 0.2s ease-out",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
          }}
        />

        {/* Hash line motif - subtle fingerprint hint */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: prefersReducedMotion
              ? "none"
              : `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`,
            transition: prefersReducedMotion ? "none" : "transform 0.12s ease-out",
          }}
        >
          <div className="flex flex-col gap-2 opacity-20">
            <div className="w-16 h-px bg-[var(--text)] rounded-full" />
            <div className="w-12 h-px bg-[var(--text)] rounded-full ml-4" />
            <div className="w-14 h-px bg-[var(--text)] rounded-full ml-2" />
          </div>
        </div>

        {/* Subtle shimmer effect (only if motion is allowed) */}
        {!prefersReducedMotion && (
          <div
            className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-10 transition-opacity duration-1000"
            style={{
              background:
                "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
            }}
          />
        )}
      </div>
    </div>
  );
}
