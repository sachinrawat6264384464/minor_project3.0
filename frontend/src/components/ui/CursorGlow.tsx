"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    const updateMouse = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(${e.clientX - 300}px, ${e.clientY - 300}px, 0)`;
        }
      });
    };
    window.addEventListener("mousemove", updateMouse, { passive: true });
    return () => {
      window.removeEventListener("mousemove", updateMouse);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden hidden md:block">
      <div
        ref={glowRef}
        className="w-[600px] h-[600px] rounded-full will-change-transform opacity-60 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)",
          transform: "translate3d(-1000px, -1000px, 0)",
        }}
      />
    </div>
  );
}
