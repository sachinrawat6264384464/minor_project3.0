"use client";

import React, { useEffect, useRef, useState } from "react";

export function ResearchTorchDarkBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [torchPos, setTorchPos] = useState<{ x: number; y: number } | null>(null);
  const [isInside, setIsInside] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate cursor position relative to this container
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check what DOM element is directly under the cursor
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;

      // Detect if cursor is hovering over any card, button, link, canvas, or UI container
      const isOverCardOrUI = target ? !!target.closest(
        'button, a, input, canvas, header, nav, footer, [role="button"], [class*="rounded-2xl"], [class*="rounded-xl"], [class*="border-rose"], [class*="border-emerald"], [class*="border-cyan"], [class*="border-purple"], [class*="border-white/"], [class*="bg-black/"], [class*="bg-white/"], [class*="bg-[#"], [class*="backdrop-blur"], .hud-corner-bracket, [id^="stack-stage-"]'
      ) : false;

      // Check if mouse is within container bounds
      const isInsideContainer = (
        e.clientY >= rect.top - 50 &&
        e.clientY <= rect.bottom + 50 &&
        e.clientX >= rect.left - 50 &&
        e.clientX <= rect.right + 50
      );

      // Torch activates ONLY on the open background grid, smoothly fading out on cards
      if (isInsideContainer && !isOverCardOrUI) {
        setTorchPos({ x, y });
        setIsInside(true);
      } else {
        setIsInside(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const torchX = torchPos?.x ?? -1500;
  const torchY = torchPos?.y ?? -1500;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* =========================================================================
       * SUBTLE, ELEGANT & SOFT TORCH AMBIENT GLOW
       * (Light significantly turned down to a refined, non-distracting atmospheric glow)
       * ========================================================================= */}
      <div 
        className={`transition-opacity duration-300 pointer-events-none ${isInside ? "opacity-100" : "opacity-0"}`}
      >
        {/* Soft Outer Atmospheric Glow */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: torchX,
            top: torchY,
            width: "440px",
            height: "440px",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, rgba(56, 189, 248, 0.03) 40%, transparent 75%)",
            filter: "blur(30px)",
          }}
        />

        {/* Gentle Core Light Center */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: torchX,
            top: torchY,
            width: "160px",
            height: "160px",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.09) 0%, rgba(186, 230, 253, 0.03) 55%, transparent 80%)",
            filter: "blur(14px)",
          }}
        />
      </div>
    </div>
  );
}
