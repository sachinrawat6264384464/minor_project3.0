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
  hubX: number;
  hubY: number;
  inclineAngle: number;
  zAmplitude: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface StaticStar {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
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

      // High-Density Sampling (Step = 3 for 3x richer stardust density)
      const step = 3;

      for (let y = step; y < h - step; y += step) {
        for (let x = step; x < w - step; x += step) {
          if (isOpaque(x, y)) {
            // Check boundary perimeter using 8-connectivity for complete crisp border detection
            const isBorder = 
              !isOpaque(x - step, y) || 
              !isOpaque(x + step, y) || 
              !isOpaque(x, y - step) || 
              !isOpaque(x, y + step) ||
              !isOpaque(x - step, y - step) ||
              !isOpaque(x + step, y + step) ||
              !isOpaque(x - step, y + step) ||
              !isOpaque(x + step, y - step);

            if (isBorder) {
              // Border points lock onto exact glyph boundary without jitter
              borderPoints.push({
                x: x - w / 2,
                y: y - h / 2,
              });
            } else {
              // Anti-scanline micro-jitter for organic cosmic stardust texture
              const jx = (Math.random() - 0.5) * 1.4;
              const jy = (Math.random() - 0.5) * 1.4;
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
    const staticStars: StaticStar[] = [];

    const initSystem = () => {
      particles.length = 0;
      orbitingHaloParticles.length = 0;
      staticStars.length = 0;

      // 0. Cosmic Static Background Stars ("background me bhi to static rakh")
      const STATIC_STAR_COUNT = 90;
      for (let i = 0; i < STATIC_STAR_COUNT; i++) {
        staticStars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 0.7 + 0.6,
          baseAlpha: Math.random() * 0.4 + 0.25,
          twinkleSpeed: Math.random() * 1.5 + 0.8,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }

      const fontSize = Math.min(width * 0.30, Math.min(height * 0.70, 330));
      const { borderPoints, interiorPoints } = generateGrandRAGPoints(width, height);
      const allTextPoints = [...borderPoints, ...interiorPoints];
      const targetCount = allTextPoints.length;
      const borderCount = borderPoints.length;
      
      const TOTAL_POINTS = targetCount;

      // 1. Text Particles that form R A G (100% converge to letters, zero leftover static points)
      for (let i = 0; i < TOTAL_POINTS; i++) {
        const initialAngle = Math.random() * Math.PI * 2;
        const initialRadius = Math.random() * (width * 0.65) + 80;
        const initialZ = (Math.random() - 0.5) * 400;

        const isBorder = i < borderCount;
        const targetP = allTextPoints[i];

        // Progressive spawn: starts with initial seed points, streams in remaining points smoothly
        const spawnThreshold = i < 40 
          ? 0 
          : Math.pow((i - 40) / Math.max(1, TOTAL_POINTS - 40), 1.15) * 0.82;

        particles.push({
          x: Math.cos(initialAngle) * initialRadius,
          y: Math.sin(initialAngle) * (initialRadius * 0.5),
          z: initialZ,
          targetX: targetP.x,
          targetY: targetP.y,
          targetZ: 0, // Zero Z-offset ensures 100% pixel-perfect alignment with metallic stroke
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          vz: (Math.random() - 0.5) * 0.1,
          size: isBorder ? (Math.random() * 0.4 + 1.3) : (Math.random() * 0.4 + 0.95),
          alpha: isBorder ? 1.0 : (Math.random() * 0.25 + 0.75),
          angle: initialAngle,
          orbitRadius: initialRadius,
          orbitSpeed: (Math.random() * 0.016 + 0.006) * (Math.random() > 0.5 ? 1 : -1),
          isTextPoint: true,
          isBorderPoint: isBorder,
          spawnThreshold,
        });
      }

      // 2. Extra Orbiting Halo Particles ("group me thode kam kar, space ko badha, close hai bahut RAG ke")
      const HALO_COUNT = 140;
      const letterSpacing = fontSize * 0.84;
      const xR = -letterSpacing;
      const xA = 0;
      const xG = letterSpacing;

      for (let i = 0; i < HALO_COUNT; i++) {
        const hubSelector = i % 4;
        let hubX = 0;
        let radiusX = 0;
        let radiusY = 0;
        let zAmplitude = 110;

        if (hubSelector === 0) {
          // Group 1: Wide orbit around letter 'R'
          hubX = xR;
          radiusX = fontSize * (0.45 + Math.random() * 0.35);
          radiusY = fontSize * (0.48 + Math.random() * 0.35);
          zAmplitude = 120;
        } else if (hubSelector === 1) {
          // Group 2: Wide orbit around letter 'A'
          hubX = xA;
          radiusX = fontSize * (0.40 + Math.random() * 0.30);
          radiusY = fontSize * (0.44 + Math.random() * 0.32);
          zAmplitude = 100;
        } else if (hubSelector === 2) {
          // Group 3: Wide orbit around letter 'G'
          hubX = xG;
          radiusX = fontSize * (0.45 + Math.random() * 0.35);
          radiusY = fontSize * (0.48 + Math.random() * 0.35);
          zAmplitude = 120;
        } else {
          // Group 4: Majestic outer envelope hugging R-A-G with broad spacing
          hubX = 0;
          radiusX = letterSpacing * 1.80 + (Math.random() - 0.5) * 60;
          radiusY = fontSize * 0.82 + (Math.random() - 0.5) * 40;
          zAmplitude = 150;
        }

        orbitingHaloParticles.push({
          angle: Math.random() * Math.PI * 2,
          speed: (Math.random() * 0.012 + 0.005) * (Math.random() > 0.4 ? 1 : -1),
          radiusX,
          radiusY,
          hubX,
          hubY: 0,
          inclineAngle: (Math.random() - 0.5) * 0.7, // 3D orbital tilt
          zAmplitude,
          size: Math.random() * 0.8 + 1.4, // Solid, clean stardust dots
          alpha: 1.0, // Solid type opacity
          twinkleSpeed: Math.random() * 2 + 1,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    initSystem();

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

      // 0. RENDER BACKGROUND COSMIC STATIC STARS ("background me bhi to static rakh")
      for (let i = 0; i < staticStars.length; i++) {
        const star = staticStars[i];
        const twinkle = Math.sin(globalTimer * star.twinkleSpeed + star.twinkleOffset) * 0.25 + 0.75;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.baseAlpha * twinkle})`;
        ctx.fill();
      }

      const projScale = fov / 420;
      const fontSize = Math.min(width * 0.30, Math.min(height * 0.70, 330));
      const letterSpacing = fontSize * 0.84;
      const tiltOffsetX = 0;
      const tiltOffsetY = 0;

      const localTextY = height * 0.49 - height / 2;
      const curTextY = height / 2 + localTextY * projScale + tiltOffsetY;
      const currentFontSize = fontSize * projScale;
      const currentSpacing = letterSpacing * projScale;
      const xR = width / 2 - currentSpacing + tiltOffsetX;
      const xA = width / 2 + tiltOffsetX;
      const xG = width / 2 + currentSpacing + tiltOffsetX;
      const baseline = curTextY + currentFontSize * 0.34; // exact bottom of letters

      // 0.4. GLASS CONTACT SHADOW & COMPACT VERTICAL REFLECTION DIRECTLY UNDERNEATH EACH LETTER
      if (assemblyGlow > 0.05) {
        ctx.save();

        // a) Ambient contact shadow directly under the feet of R, A, G
        const drawLetterFootShadow = (lx: number, sw: number) => {
          const shadowGrad = ctx.createRadialGradient(lx, baseline + 1, 2, lx, baseline + 1, sw);
          shadowGrad.addColorStop(0, `rgba(0, 0, 0, ${0.92 * assemblyGlow})`);
          shadowGrad.addColorStop(0.45, `rgba(0, 0, 0, ${0.55 * assemblyGlow})`);
          shadowGrad.addColorStop(0.8, `rgba(15, 23, 42, ${0.18 * assemblyGlow})`);
          shadowGrad.addColorStop(1, "transparent");

          ctx.fillStyle = shadowGrad;
          ctx.beginPath();
          ctx.ellipse(lx, baseline + 1, sw, currentFontSize * 0.045, 0, 0, Math.PI * 2);
          ctx.fill();
        };

        drawLetterFootShadow(xR, currentFontSize * 0.34);
        drawLetterFootShadow(xA, currentFontSize * 0.38);
        drawLetterFootShadow(xG, currentFontSize * 0.34);

        // b) Compact vertical mirror reflection directly touching the feet of R, A, G
        const reflHeight = currentFontSize * 0.28;
        ctx.beginPath();
        ctx.rect(0, baseline - 1, width, reflHeight);
        ctx.clip();

        // Mirror vertically anchored AT baseline
        ctx.translate(0, baseline);
        ctx.scale(1, -0.42);
        ctx.translate(0, -baseline);

        const reflGrad = ctx.createLinearGradient(0, baseline, 0, curTextY - currentFontSize * 0.3);
        reflGrad.addColorStop(0, `rgba(255, 255, 255, ${0.32 * assemblyGlow})`);
        reflGrad.addColorStop(0.35, `rgba(203, 213, 225, ${0.12 * assemblyGlow})`);
        reflGrad.addColorStop(0.7, `rgba(148, 163, 184, ${0.03 * assemblyGlow})`);
        reflGrad.addColorStop(1, "transparent");

        ctx.font = `900 ${currentFontSize}px "Space Grotesk", "Arial Black", "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = reflGrad;
        ctx.fillText("R", xR, curTextY);
        ctx.fillText("A", xA, curTextY);
        ctx.fillText("G", xG, curTextY);

        ctx.strokeStyle = `rgba(226, 232, 240, ${0.14 * assemblyGlow})`;
        ctx.lineWidth = 1.2;
        ctx.strokeText("R", xR, curTextY);
        ctx.strokeText("A", xA, curTextY);
        ctx.strokeText("G", xG, curTextY);

        ctx.restore();
      }

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

          if (particleProgress > 0.85 && !p.isBorderPoint) {
            p.x += Math.sin(globalTimer + i * 0.3) * 0.08;
            p.y += Math.cos(globalTimer + i * 0.3) * 0.08;
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
        const screenX = width / 2 + p.x * scale;
        const screenY = height / 2 + p.y * scale;

        if (!Number.isFinite(screenX) || !Number.isFinite(screenY)) continue;

        const currentSize = p.size * scale;
        const currentAlpha = Math.min(1, Math.max(0.2, p.alpha * scale));

        ctx.beginPath();
        ctx.arc(screenX, screenY, Math.max(0.7, currentSize), 0, Math.PI * 2);

        // Radiant bloom: crisp illumination on border points
        if (p.isBorderPoint && assemblyGlow > 0.1) {
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 4;
          ctx.fillStyle = "#ffffff";
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        }

        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // 1.5. SCULPTED METALLIC SILVER FRAME & SPECULAR SHINING SWEEP ("silbver frm me diye or sining kare, reflection ho")
      if (assemblyGlow > 0.05) {
        ctx.save();
        // Transform into exact frame of reference where text particles reside
        ctx.translate(width / 2 + tiltOffsetX, height / 2 + tiltOffsetY);
        ctx.scale(projScale, projScale);

        const localXR = -letterSpacing;
        const localXA = 0;
        const localXG = letterSpacing;

        ctx.font = `900 ${fontSize}px "Space Grotesk", "Arial Black", "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // a) Multi-faceted metallic silver gradient frame (100% border aligned)
        const silverFrameGrad = ctx.createLinearGradient(
          localXR - fontSize * 0.45, localTextY - fontSize * 0.45,
          localXG + fontSize * 0.45, localTextY + fontSize * 0.45
        );
        silverFrameGrad.addColorStop(0.0, `rgba(203, 213, 225, ${0.85 * assemblyGlow})`);
        silverFrameGrad.addColorStop(0.18, `rgba(255, 255, 255, ${0.98 * assemblyGlow})`);
        silverFrameGrad.addColorStop(0.35, `rgba(148, 163, 184, ${0.70 * assemblyGlow})`);
        silverFrameGrad.addColorStop(0.5, `rgba(248, 250, 252, ${0.98 * assemblyGlow})`);
        silverFrameGrad.addColorStop(0.68, `rgba(100, 116, 139, ${0.68 * assemblyGlow})`);
        silverFrameGrad.addColorStop(0.84, `rgba(255, 255, 255, ${0.95 * assemblyGlow})`);
        silverFrameGrad.addColorStop(1.0, `rgba(203, 213, 225, ${0.85 * assemblyGlow})`);

        ctx.strokeStyle = silverFrameGrad;
        ctx.lineWidth = 2.2 / projScale;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 4 * assemblyGlow;
        ctx.strokeText("R", localXR, localTextY);
        ctx.strokeText("A", localXA, localTextY);
        ctx.strokeText("G", localXG, localTextY);
        ctx.shadowBlur = 0;

        // b) Inner crisp chrome bevel highlight line
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.55 * assemblyGlow})`;
        ctx.lineWidth = 1.0 / projScale;
        ctx.strokeText("R", localXR, localTextY);
        ctx.strokeText("A", localXA, localTextY);
        ctx.strokeText("G", localXG, localTextY);

        // c) Dynamic Specular Light Shine Beam ("sining kare smaj reflection ho")
        const shineInterval = 4.2; // sweeps periodically across letters
        const shineTime = (globalTimer * 0.65) % shineInterval;
        if (shineTime < 1.6 && assemblyGlow > 0.2) {
          const progress = shineTime / 1.6;
          const leftX = localXR - fontSize * 0.55;
          const rightX = localXG + fontSize * 0.55;
          const currentShineX = leftX + progress * (rightX - leftX);
          const bandWidth = fontSize * 0.40;

          const sweepGrad = ctx.createLinearGradient(
            currentShineX - bandWidth, localTextY - fontSize * 0.4,
            currentShineX + bandWidth, localTextY + fontSize * 0.4
          );
          sweepGrad.addColorStop(0, "transparent");
          sweepGrad.addColorStop(0.35, "rgba(255, 255, 255, 0.1)");
          sweepGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.95 * assemblyGlow})`);
          sweepGrad.addColorStop(0.65, "rgba(255, 255, 255, 0.1)");
          sweepGrad.addColorStop(1, "transparent");

          ctx.strokeStyle = sweepGrad;
          ctx.lineWidth = 3.6 / projScale;
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 10;
          ctx.strokeText("R", localXR, localTextY);
          ctx.strokeText("A", localXA, localTextY);
          ctx.strokeText("G", localXG, localTextY);
          ctx.shadowBlur = 0;
        }

        // d) Sparkling Diamond Star Glints (✦) at polished letter apexes
        if (assemblyGlow > 0.25) {
          const drawStarGlint = (gx: number, gy: number, glintPhase: number) => {
            const glintAlpha = Math.max(0, Math.sin(glintPhase) * assemblyGlow);
            if (glintAlpha <= 0.08) return;

            const armLength = fontSize * 0.075 * (0.8 + Math.sin(glintPhase) * 0.35);
            ctx.save();
            ctx.strokeStyle = `rgba(255, 255, 255, ${glintAlpha * 0.95})`;
            ctx.lineWidth = 1.2 / projScale;
            ctx.beginPath();
            ctx.moveTo(gx - armLength, gy);
            ctx.lineTo(gx + armLength, gy);
            ctx.moveTo(gx, gy - armLength);
            ctx.lineTo(gx, gy + armLength);
            ctx.stroke();

            ctx.lineWidth = 0.7 / projScale;
            const diag = armLength * 0.45;
            ctx.beginPath();
            ctx.moveTo(gx - diag, gy - diag);
            ctx.lineTo(gx + diag, gy + diag);
            ctx.moveTo(gx - diag, gy + diag);
            ctx.lineTo(gx + diag, gy - diag);
            ctx.stroke();

            ctx.fillStyle = `rgba(255, 255, 255, ${glintAlpha})`;
            ctx.beginPath();
            ctx.arc(gx, gy, 1.8 / projScale, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          };

          // Glint 1: Top-left apex of 'R'
          drawStarGlint(localXR - fontSize * 0.22, localTextY - fontSize * 0.34, globalTimer * 2.4);
          // Glint 2: Apex of 'A'
          drawStarGlint(localXA, localTextY - fontSize * 0.37, globalTimer * 2.4 + 2.09);
          // Glint 3: Top curve of 'G'
          drawStarGlint(localXG + fontSize * 0.18, localTextY - fontSize * 0.33, globalTimer * 2.4 + 4.18);
        }

        ctx.restore();
      }

      // 2. RENDER CONTINUOUSLY ORBITING HALO PARTICLES AROUND RAG ("eske banne ke baad points jo around ghoomte rahe")
      if (convergenceProgress > 0.6) {
        const haloFade = Math.min(1, (convergenceProgress - 0.6) / 0.3);

        for (let i = 0; i < orbitingHaloParticles.length; i++) {
          const hp = orbitingHaloParticles[i];

          // Continuous orbital revolution
          hp.angle += hp.speed;

          // 3D Elliptical position anchored to letter hub
          const ox = Math.cos(hp.angle) * hp.radiusX + hp.hubX;
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
          const screenX = width / 2 + rotX * scale;
          const screenY = height / 2 + rotY * scale;

          if (!Number.isFinite(screenX) || !Number.isFinite(screenY)) continue;

          // Solid, crisp, and bright stardust rendering ("solid type me samajh")
          const isFront = rotZ > 0;
          const currentSize = hp.size * scale * (isFront ? 1.25 : 0.95);

          ctx.beginPath();
          ctx.arc(screenX, screenY, Math.max(1.1, currentSize), 0, Math.PI * 2);

          // Solid bright white with radiant bloom
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = isFront ? Math.max(5, 8 * assemblyGlow) : 2;
          ctx.fillStyle = isFront ? "#ffffff" : "rgba(255, 255, 255, 0.85)";

          ctx.fill();
        }

        ctx.shadowBlur = 0;
      }

      if (isVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (!wasVisible && isVisible) {
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );

    if (canvas) observer.observe(canvas);
    render();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />
    </div>
  );
}
