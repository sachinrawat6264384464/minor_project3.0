"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  alpha: number;
  angle: number;
  orbitRadius: number;
  orbitSpeed: number;
  isTextPoint: boolean;
  isBorderPoint: boolean;
  spawnThreshold: number;
}

interface OrbitingHaloParticle {
  angle: number;
  speed: number;
  radiusX: number;
  radiusY: number;
  inclineAngle: number;
  zAmplitude: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export default function VectorPointGalaxyCanvas({
  interactive = true,
  className = "",
}: {
  interactive?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    isHovered: false,
    radius: 140,
    tiltX: 0,
    tiltY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 750);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initSystem();
    };

    window.addEventListener("resize", handleResize);

    // High-Precision Structural Border & Stardust Sampling (No Scanlines, Crisp Edges)
    const generateGrandRAGPoints = (w: number, h: number) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = w;
      offscreen.height = h;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return { borderPoints: [], interiorPoints: [] };

      offCtx.fillStyle = "#000000";
      offCtx.fillRect(0, 0, w, h);

      // Grand Scale Size: Spans ~75-80% of screen width, commanding presence
      const fontSize = Math.min(w * 0.30, Math.min(h * 0.70, 330));
      offCtx.font = `900 ${fontSize}px "Space Grotesk", "Arial Black", "Inter", sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#ffffff";

      // Symmetrical, balanced letter spacing
      const letterSpacing = fontSize * 0.84;
      const textY = h * 0.49;

      const xR = w / 2 - letterSpacing;
      const xA = w / 2;
      const xG = w / 2 + letterSpacing;

      offCtx.fillText("R", xR, textY);
      offCtx.fillText("A", xA, textY);
      offCtx.fillText("G", xG, textY);

      const imgData = offCtx.getImageData(0, 0, w, h);
      const data = imgData.data;

      const borderPoints: { x: number; y: number }[] = [];
      const interiorPoints: { x: number; y: number }[] = [];

      const isOpaque = (px: number, py: number) => {
        if (px < 0 || px >= w || py < 0 || py >= h) return false;
        return data[(py * w + px) * 4] > 100;
      };

      const step = 3;

      for (let y = step; y < h - step; y += step) {
        for (let x = step; x < w - step; x += step) {
          if (isOpaque(x, y)) {
            // Check boundary perimeter (has a transparent neighbor)
            const isBorder = 
              !isOpaque(x - step, y) || 
              !isOpaque(x + step, y) || 
              !isOpaque(x, y - step) || 
              !isOpaque(x, y + step) ||
              !isOpaque(x - step, y - step) ||
              !isOpaque(x + step, y + step);

            if (isBorder) {
              borderPoints.push({
                x: x - w / 2,
                y: y - h / 2,
              });
            } else {
              // Anti-scanline jitter for organic cosmic texture
              const jx = (Math.random() - 0.5) * 2.2;
              const jy = (Math.random() - 0.5) * 2.2;
              interiorPoints.push({
                x: x + jx - w / 2,
                y: y + jy - h / 2,
              });
            }
          }
        }
      }

      return { borderPoints, interiorPoints };
    };

    const particles: Particle[] = [];
    const orbitingHaloParticles: OrbitingHaloParticle[] = [];

    const initSystem = () => {
      particles.length = 0;
      orbitingHaloParticles.length = 0;

      const { borderPoints, interiorPoints } = generateGrandRAGPoints(width, height);
      const allTextPoints = [...borderPoints, ...interiorPoints];
      const targetCount = allTextPoints.length;
      const borderCount = borderPoints.length;
      
      const TOTAL_POINTS = Math.max(2200, targetCount + 250);

      // 1. Text Particles that form R A G
      for (let i = 0; i < TOTAL_POINTS; i++) {
        const initialAngle = Math.random() * Math.PI * 2;
        const initialRadius = Math.random() * (width * 0.65) + 80;
        const initialZ = (Math.random() - 0.5) * 400;

        const isAssigned = i < targetCount;
        const isBorder = i < borderCount;

        const targetP = isAssigned 
          ? allTextPoints[i] 
          : {
              x: (Math.random() - 0.5) * width * 0.8,
              y: (Math.random() - 0.5) * height * 0.7,
            };

        // Progressive spawn: starts with ~35 points, streams in remaining points smoothly
        const spawnThreshold = i < 35 
          ? 0 
          : Math.pow((i - 35) / (TOTAL_POINTS - 35), 1.15) * 0.82;

        particles.push({
          x: Math.cos(initialAngle) * initialRadius,
          y: Math.sin(initialAngle) * (initialRadius * 0.5),
          z: initialZ,
          targetX: targetP.x,
          targetY: targetP.y,
          targetZ: isAssigned ? (Math.random() - 0.5) * 15 : (Math.random() - 0.5) * 140,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          vz: (Math.random() - 0.5) * 0.15,
          size: isBorder ? (Math.random() * 0.6 + 1.4) : isAssigned ? (Math.random() * 0.6 + 1.0) : (Math.random() * 0.5 + 0.6),
          alpha: isBorder ? 0.95 : isAssigned ? (Math.random() * 0.25 + 0.7) : 0.3,
          angle: initialAngle,
          orbitRadius: initialRadius,
          orbitSpeed: (Math.random() * 0.016 + 0.006) * (Math.random() > 0.5 ? 1 : -1),
          isTextPoint: isAssigned,
          isBorderPoint: isBorder,
          spawnThreshold,
        });
      }

      // 2. Extra Orbiting Halo Particles ("eske banne ke baad kuch points or jo ki around ghoomte rahe")
      const HALO_COUNT = 190;
      for (let i = 0; i < HALO_COUNT; i++) {
        // Diverse orbital bands (some wide, some closer)
        const bandRatio = (i % 3 === 0) ? 0.44 : (i % 3 === 1) ? 0.52 : 0.62;
        const radiusX = width * (bandRatio + (Math.random() - 0.5) * 0.12);
        const radiusY = height * (bandRatio * 0.65 + (Math.random() - 0.5) * 0.10);

        orbitingHaloParticles.push({
          angle: Math.random() * Math.PI * 2,
          speed: (Math.random() * 0.010 + 0.004) * (Math.random() > 0.4 ? 1 : -1),
          radiusX,
          radiusY,
          inclineAngle: (Math.random() - 0.5) * 0.65, // Varied 3D orbital tilts
          zAmplitude: Math.random() * 180 + 80,
          size: Math.random() * 1.3 + 0.9,
          alpha: Math.random() * 0.4 + 0.55,
          twinkleSpeed: Math.random() * 2 + 1,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    initSystem();

    // Mouse / Touch Event Listeners for Torch Effect
    const updateTorchCoords = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) return;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (Number.isFinite(x) && Number.isFinite(y)) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
        mouseRef.current.isHovered = true;
        mouseRef.current.tiltX = ((x - width / 2) / width) * 20;
        mouseRef.current.tiltY = ((y - height / 2) / height) * 20;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      updateTorchCoords(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!interactive || !e.touches[0]) return;
      updateTorchCoords(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      mouseRef.current.tiltX = 0;
      mouseRef.current.tiltY = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchend", handleMouseLeave);

    let convergenceProgress = 0;
    let assemblyGlow = 0; // Activates smoothly once RAG is formed
    let globalTimer = 0;
    const fov = 460;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Progressive point inflow
      if (convergenceProgress < 1) {
        convergenceProgress += 0.009;
      }
      
      // Post-assembly radiant glow ramps up
      if (convergenceProgress >= 0.85 && assemblyGlow < 1) {
        assemblyGlow = Math.min(1, assemblyGlow + 0.025);
      }

      globalTimer += 0.02;

      const torchX = Number.isFinite(mouseRef.current.x) ? mouseRef.current.x : -1000;
      const torchY = Number.isFinite(mouseRef.current.y) ? mouseRef.current.y : -1000;
      const torchRadius = mouseRef.current.radius;
      
      const isTorchActive = 
        mouseRef.current.isHovered && 
        torchX >= 0 && 
        torchX <= width && 
        torchY >= 0 && 
        torchY <= height;

      // Draw subtle torch spotlight beam
      if (isTorchActive) {
        try {
          const outerR = Math.max(10, torchRadius * 1.4);
          const torchGrad = ctx.createRadialGradient(torchX, torchY, 0, torchX, torchY, outerR);
          torchGrad.addColorStop(0, "rgba(255, 255, 255, 0.15)");
          torchGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.05)");
          torchGrad.addColorStop(0.8, "rgba(255, 255, 255, 0.01)");
          torchGrad.addColorStop(1, "transparent");

          ctx.fillStyle = torchGrad;
          ctx.beginPath();
          ctx.arc(torchX, torchY, outerR, 0, Math.PI * 2);
          ctx.fill();
        } catch {
          // Guard canvas coordinates
        }
      }

      const torchLitParticles: { x: number; y: number }[] = [];

      // 1. RENDER MAIN R A G TEXT PARTICLES
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (convergenceProgress < p.spawnThreshold) {
          continue;
        }

        const particleSpawnRange = 1 - p.spawnThreshold;
        const particleProgress = particleSpawnRange > 0 
          ? Math.min(1, (convergenceProgress - p.spawnThreshold) / particleSpawnRange)
          : 1;

        p.angle += p.orbitSpeed;
        const orbitX = Math.cos(p.angle) * p.orbitRadius;
        const orbitY = Math.sin(p.angle) * (p.orbitRadius * 0.5);

        if (p.isTextPoint) {
          const targetCurrentX = orbitX * (1 - particleProgress) + p.targetX * particleProgress;
          const targetCurrentY = orbitY * (1 - particleProgress) + p.targetY * particleProgress;
          const targetCurrentZ = p.targetZ * particleProgress;

          p.x += (targetCurrentX - p.x) * 0.13;
          p.y += (targetCurrentY - p.y) * 0.13;
          p.z += (targetCurrentZ - p.z) * 0.13;

          if (particleProgress > 0.85) {
            p.x += Math.sin(globalTimer + i * 0.3) * 0.12;
            p.y += Math.cos(globalTimer + i * 0.3) * 0.12;
          }
        } else {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          if (Math.abs(p.x) > width * 0.48) p.vx *= -1;
          if (Math.abs(p.y) > height * 0.48) p.vy *= -1;
        }

        const screenZ = p.z + 420;
        if (screenZ <= 10) continue;

        const scale = fov / screenZ;
        let screenX = width / 2 + p.x * scale + mouseRef.current.tiltX * 0.15;
        let screenY = height / 2 + p.y * scale + mouseRef.current.tiltY * 0.15;

        if (!Number.isFinite(screenX) || !Number.isFinite(screenY)) continue;

        // Torch Effect: Repulsion & Highlighting
        let torchBoost = 0;
        if (isTorchActive) {
          const dx = screenX - torchX;
          const dy = screenY - torchY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < torchRadius) {
            torchBoost = (1 - dist / torchRadius);

            const pushAngle = Math.atan2(dy, dx);
            const pushForce = torchBoost * 25;
            screenX += Math.cos(pushAngle) * pushForce;
            screenY += Math.sin(pushAngle) * pushForce;

            torchLitParticles.push({ x: screenX, y: screenY });
          }
        }

        const currentSize = p.size * scale * (1 + torchBoost * 0.8);
        const currentAlpha = Math.min(1, Math.max(0.2, (p.alpha * scale) + torchBoost * 0.3));

        ctx.beginPath();
        ctx.arc(screenX, screenY, Math.max(0.7, currentSize), 0, Math.PI * 2);

        // Radiant bloom once formed with breathing pulse
        if (p.isTextPoint && assemblyGlow > 0.1) {
          const pulse = 1 + Math.sin(globalTimer * 2.2 + (p.x * 0.01)) * 0.16;
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = Math.max(3, (p.isBorderPoint ? 10 : 6) * assemblyGlow * pulse + 12 * torchBoost);
          ctx.fillStyle = "#ffffff";
        } else if (torchBoost > 0.05) {
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 10 * torchBoost;
          ctx.fillStyle = "#ffffff";
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        }

        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // 2. RENDER CONTINUOUSLY ORBITING HALO PARTICLES AROUND RAG ("eske banne ke baad points jo around ghoomte rahe")
      if (convergenceProgress > 0.6) {
        const haloFade = Math.min(1, (convergenceProgress - 0.6) / 0.3);

        for (let i = 0; i < orbitingHaloParticles.length; i++) {
          const hp = orbitingHaloParticles[i];

          // Continuous orbital revolution
          hp.angle += hp.speed;

          // 3D Elliptical position
          const ox = Math.cos(hp.angle) * hp.radiusX;
          const oy = Math.sin(hp.angle) * hp.radiusY;

          // 3D Inclined rotation
          const cosInc = Math.cos(hp.inclineAngle);
          const sinInc = Math.sin(hp.inclineAngle);

          const rotX = ox * cosInc - oy * sinInc;
          const rotY = ox * sinInc + oy * cosInc;
          const rotZ = Math.sin(hp.angle) * hp.zAmplitude;

          // Project to 2D
          const screenZ = rotZ + 420;
          if (screenZ <= 15) continue;

          const scale = fov / screenZ;
          let screenX = width / 2 + rotX * scale + mouseRef.current.tiltX * 0.25;
          let screenY = height / 2 + rotY * scale + mouseRef.current.tiltY * 0.25;

          if (!Number.isFinite(screenX) || !Number.isFinite(screenY)) continue;

          // Torch effect interaction with orbiting particles
          let torchBoost = 0;
          if (isTorchActive) {
            const dx = screenX - torchX;
            const dy = screenY - torchY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < torchRadius) {
              torchBoost = (1 - dist / torchRadius);
              const pushAngle = Math.atan2(dy, dx);
              screenX += Math.cos(pushAngle) * (torchBoost * 22);
              screenY += Math.sin(pushAngle) * (torchBoost * 22);
              torchLitParticles.push({ x: screenX, y: screenY });
            }
          }

          // Depth-based brightness: particles in front of RAG (rotZ > 0) are brighter!
          const isFront = rotZ > 0;
          const twinkle = Math.sin(globalTimer * hp.twinkleSpeed + hp.twinkleOffset) * 0.2 + 0.8;
          const baseAlpha = (isFront ? hp.alpha : hp.alpha * 0.45) * haloFade * twinkle;
          const currentSize = hp.size * scale * (isFront ? 1.2 : 0.85) * (1 + torchBoost * 0.6);

          ctx.beginPath();
          ctx.arc(screenX, screenY, Math.max(0.6, currentSize), 0, Math.PI * 2);

          if (isFront && assemblyGlow > 0.2) {
            ctx.shadowColor = "#ffffff";
            ctx.shadowBlur = 6 * assemblyGlow + 8 * torchBoost;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, baseAlpha + 0.3)})`;
          } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(255, 255, 255, ${baseAlpha})`;
          }

          ctx.fill();
        }

        ctx.shadowBlur = 0;
      }

      // Laser lines between nearby torchlit particles
      if (torchLitParticles.length > 1) {
        ctx.lineWidth = 0.8;
        const maxLines = Math.min(torchLitParticles.length, 25);

        for (let i = 0; i < maxLines; i++) {
          for (let j = i + 1; j < maxLines; j++) {
            const p1 = torchLitParticles[i];
            const p2 = torchLitParticles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

            if (dist < 40) {
              const lineAlpha = (1 - dist / 40) * 0.45;
              ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchend", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [interactive]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-auto cursor-crosshair" />
    </div>
  );
}
