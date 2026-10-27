"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Search, 
  Cpu, 
  Database, 
  Zap, 
  Clock, 
  FileText, 
  Target,
  Layers,
  Award,
  Eye,
  SlidersHorizontal,
  Flame
} from "lucide-react";

export default function WhyYouNeedThisPlatform() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  // State to toggle/override the cinematic B&W filter manually if desired
  const [isFilterColor, setIsFilterColor] = useState(false);

  // 3D Canvas Animation in High-Tech Dark / Cosmic Mode
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 360;
    };
    window.addEventListener("resize", handleResize);

    interface NeuralPoint {
      x: number;
      y: number;
      z: number;
      label?: string;
      isAnchor: boolean;
      radius: number;
    }

    interface SynapsePulse {
      fromIdx: number;
      toIdx: number;
      progress: number;
      speed: number;
    }

    const points: NeuralPoint[] = [];
    const sphereRadius = 135;

    // 7 Widely spaced key neural concept anchors (engineered angular offsets to prevent overlapping)
    const keyAnchors = [
      { label: "OpenAlex 250M+", phi: 0.8, theta: 0.4 },
      { label: "PyMuPDF Stream", phi: 1.2, theta: 2.1 },
      { label: "BM25 + Dense RRF", phi: 0.9, theta: 3.9 },
      { label: "BGE 384d Latent", phi: 1.6, theta: 5.3 },
      { label: "Zero-Hallucination", phi: 2.0, theta: 1.2 },
      { label: "Counter-Evidence", phi: 2.3, theta: 3.2 },
      { label: "Novelty Index 95%", phi: 2.1, theta: 4.8 }
    ];

    keyAnchors.forEach((a) => {
      points.push({
        x: sphereRadius * Math.sin(a.phi) * Math.cos(a.theta),
        y: sphereRadius * Math.cos(a.phi),
        z: sphereRadius * Math.sin(a.phi) * Math.sin(a.theta),
        label: a.label,
        isAnchor: true,
        radius: 4.5
      });
    });

    // 55 Interconnected synaptic interneurons forming the dense neural mesh
    const numInterneurons = 55;
    for (let i = 0; i < numInterneurons; i++) {
      const phi = Math.acos(-1 + (2 * i) / numInterneurons);
      const theta = Math.sqrt(numInterneurons * Math.PI) * phi;
      points.push({
        x: sphereRadius * Math.sin(phi) * Math.cos(theta),
        y: sphereRadius * Math.cos(phi),
        z: sphereRadius * Math.sin(phi) * Math.sin(theta),
        isAnchor: false,
        radius: 2
      });
    }

    // Active Action Potential Pulses (Signals firing through synapses)
    const pulses: SynapsePulse[] = [
      { fromIdx: 0, toIdx: 2, progress: 0.1, speed: 0.005 },
      { fromIdx: 1, toIdx: 3, progress: 0.5, speed: 0.006 },
      { fromIdx: 2, toIdx: 4, progress: 0.3, speed: 0.004 },
      { fromIdx: 3, toIdx: 5, progress: 0.7, speed: 0.005 },
      { fromIdx: 4, toIdx: 6, progress: 0.2, speed: 0.006 },
      { fromIdx: 5, toIdx: 1, progress: 0.8, speed: 0.004 },
      { fromIdx: 6, toIdx: 0, progress: 0.4, speed: 0.005 }
    ];

    // Slower, smooth and majestic neural rotation
    let angleX = 0.0006;
    let angleY = 0.0010;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - width / 2) * 0.00003;
      mouseY = (e.clientY - rect.top - height / 2) * 0.00003;
    };
    canvas.addEventListener("mousemove", onMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const rotX = angleX + mouseY;
      const rotY = angleY + mouseX;

      const projected = points.map((p) => {
        let x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
        let z1 = p.z * Math.cos(rotY) + p.x * Math.sin(rotY);

        let y2 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = z1 * Math.cos(rotX) + p.y * Math.sin(rotX);

        p.x = x1;
        p.y = y2;
        p.z = z2;

        const fov = 340;
        const scale = fov / (fov + z2);
        const projX = x1 * scale + width / 2;
        const projY = y2 * scale + height / 2;

        return {
          ...p,
          projX,
          projY,
          scale,
          z2
        };
      });

      projected.sort((a, b) => a.z2 - b.z2);

      // Draw Synaptic Axons (Connections - now clearly visible & interconnected)
      ctx.lineWidth = 1.1;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.projX - p2.projX;
          const dy = p1.projY - p2.projY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Generous distance threshold so connection mesh is clearly visible
          const maxDist = (p1.isAnchor || p2.isAnchor) ? 88 : 78;

          if (dist < maxDist) {
            const depthFactor = (p1.scale + p2.scale) / 2;
            const distRatio = 1 - dist / maxDist;
            
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);

            if (p1.isAnchor || p2.isAnchor) {
              // Bright cyan synaptic axon linking key neural centers
              const alpha = Math.min(0.75, distRatio * 0.65 * depthFactor);
              ctx.strokeStyle = `rgba(125, 211, 252, ${alpha})`;
            } else {
              // Crisp visible silver axon between interneurons
              const alpha = Math.min(0.55, distRatio * 0.45 * depthFactor);
              ctx.strokeStyle = `rgba(203, 213, 225, ${alpha})`;
            }

            ctx.stroke();
          }
        }
      }

      // Draw Firing Neural Action Potential Pulses (Signals traveling along synapses)
      pulses.forEach((pulse) => {
        pulse.progress += pulse.speed;
        if (pulse.progress > 1) {
          pulse.progress = 0;
          pulse.fromIdx = Math.floor(Math.random() * 7);
          pulse.toIdx = Math.floor(Math.random() * projected.length);
          pulse.speed = 0.004 + Math.random() * 0.004;
        }

        const p1 = projected[pulse.fromIdx];
        const p2 = projected[pulse.toIdx];
        if (p1 && p2) {
          const pulseX = p1.projX + (p2.projX - p1.projX) * pulse.progress;
          const pulseY = p1.projY + (p2.projY - p1.projY) * pulse.progress;

          // Glowing synaptic electrical impulse
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowColor = "#38BDF8";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw Neurons & High-Contrast Readable HUD Labels
      projected.forEach((p) => {
        const radius = Math.max(1.5, p.radius * p.scale);
        const depthAlpha = Math.min(1, Math.max(0.25, (p.z2 + sphereRadius) / (2 * sphereRadius)));

        // Outer Synaptic Glow
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, radius + 3, 0, Math.PI * 2);
        ctx.fillStyle = p.isAnchor
          ? `rgba(56, 189, 248, ${depthAlpha * 0.45})`
          : `rgba(255, 255, 255, ${depthAlpha * 0.15})`;
        ctx.fill();

        // Neuron Nucleus
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isAnchor
          ? `rgba(255, 255, 255, ${depthAlpha})`
          : `rgba(148, 163, 184, ${depthAlpha * 0.8})`;
        ctx.fill();

        // 100% Crisp Legible HUD Label with Protective Black Pill
        if (p.label && p.z2 > -35 && p.scale > 0.82) {
          ctx.font = "bold 10px 'Space Grotesk', 'Inter', sans-serif";
          const textWidth = ctx.measureText(p.label).width;
          const pillW = textWidth + 18;
          const pillH = 20;
          const pillX = p.projX + 9;
          const pillY = p.projY - pillH / 2;

          // Solid protective dark pill to eliminate visual overlap
          ctx.fillStyle = "rgba(4, 7, 15, 0.92)";
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pillW, pillH, 5);
          ctx.fill();

          // Subtle hairline border
          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Neural indicator dot
          ctx.beginPath();
          ctx.arc(pillX + 6, p.projY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#38BDF8";
          ctx.fill();

          // High contrast white text
          ctx.fillStyle = "#FFFFFF";
          ctx.textBaseline = "middle";
          ctx.fillText(p.label, pillX + 12, p.projY);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const comparisonData = [
    {
      metric: "Literature Review Duration",
      bad: "3 to 8 Weeks of manual reading across 80+ PDFs",
      good: "Under 60 Seconds with automated 9-stage synthesis",
      icon: Clock
    },
    {
      metric: "Hallucination & Fabrication Risk",
      bad: "High (Generic LLMs invent fake DOIs, authors & years)",
      good: "0% Hallucinations (100% Verifiable Page-Number citations)",
      icon: ShieldCheck
    },
    {
      metric: "Finding Genuine Research Gaps",
      bad: "Subjective guesswork (High risk: already solved in 2024)",
      good: "Automated Counter-Evidence checks ensure 100% novelty",
      icon: Target
    },
    {
      metric: "Side-by-Side Paper Comparison",
      bad: "Messy Excel sheets or fragmented browser tabs",
      good: "Structured Matrix (Datasets, Metrics, Limitations)",
      icon: Layers
    },
    {
      metric: "Exporting to LaTeX & Overleaf",
      bad: "Hours copying citations, bibtex & fixing compile errors",
      good: "1-Click IEEEtran LaTeX push directly into Overleaf",
      icon: FileText
    }
  ];

  return (
    <div 
      ref={sectionRef}
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-transparent text-white font-sans overflow-hidden select-none"
    >
      {/* 3D Perspective Grid Floor on bottom */}
      <div className="absolute inset-x-0 bottom-0 h-[380px] perspective-grid-floor opacity-30 pointer-events-none z-0" />

      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* =========================================================================
         * SECTION HEADER: "AAPKE LIYE ISKA USE KARNA ZAROORI KYU HAI?"
         * ========================================================================= */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-black font-mono font-black text-[11px] uppercase tracking-widest mb-4 shadow-[0_0_25px_rgba(255,255,255,0.7)]">
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            SCHOLAR ESSENTIAL // AAPKE LIYE ISKA USE KARNA KYU ZAROORI HAI?
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white font-sans leading-tight">
            WHY RESEARCHERS <span className="underline decoration-white decoration-4 sm:decoration-6 underline-offset-8">MUST USE</span> THIS PLATFORM
          </h2>

          <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Har saal hazaron research papers sirf isliye reject ho jaate hain kyunki unka literature review purana hota hai ya unhone aisi problem pick kar li hoti hai jo pehle hi solve ho chuki hai. <br className="hidden sm:inline" />
            <strong className="text-white font-bold">ResearchGap.ai</strong> aapke 3 mahine ke hardwork ko 100% verified, peer-review proof aur novel banata hai.
          </p>

          {/* Filter Effect Indicator Pill */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-mono text-slate-400">
            <SlidersHorizontal className="w-3 h-3 text-slate-300" />
            <span>Interactive Visual Filter:</span>
            <button
              onClick={() => setIsFilterColor(!isFilterColor)}
              className={`px-2.5 py-0.5 rounded border transition-all font-bold uppercase ${
                isFilterColor
                  ? "bg-white text-black border-white shadow-[0_0_10px_#fff]"
                  : "bg-white/10 text-slate-300 border-white/20 hover:text-white"
              }`}
            >
              {isFilterColor ? "Vibrant Color Mode" : "Cinematic B&W (Hover for Color)"}
            </button>
          </div>
        </div>

        {/* =========================================================================
         * 3D CANVAS & 4 CORE RESEARCH SUPERPOWERS
         * ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-16">
          
          {/* Left: 3D Interactive Neural Network Canvas (Clean Full-Bleed Focus) */}
          <div className="lg:col-span-6 relative bg-transparent rounded-2xl border border-white/20 p-2 sm:p-3 overflow-hidden">
            {/* Canvas */}
            <div className="relative w-full h-[340px] sm:h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing">
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>
          </div>

          {/* Right: Key Value Pillars (Transparent Minimalist Outlines) */}
          <div className="lg:col-span-6 space-y-3">
            
            {/* Pillar 1 */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-transparent border border-white/15 hover:border-white/40 hover:bg-white/[0.04] transition-all group">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm sm:text-[15px] font-bold text-white">
                      1. 100% Verifiable Page-Number Citations
                    </h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-bold">
                      Zero Fake DOIs
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Generic ChatGPT creates fake citations that ruin academic credibility. Our engine binds every sentence directly to the paper title, DOI, exact page number, and verbatim excerpt.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-transparent border border-white/15 hover:border-white/40 hover:bg-white/[0.04] transition-all group">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm sm:text-[15px] font-bold text-white">
                      2. Automated 9-Stage Research Gap Engine
                    </h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded font-bold">
                      Patent-Grade
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Isolates real scientific blind spots: Underexplored Questions, Limited Dataset Diversity, Generalization Weaknesses, and Baseline Gaps that conference reviewers demand.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-transparent border border-white/15 hover:border-white/40 hover:bg-white/[0.04] transition-all group">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm sm:text-[15px] font-bold text-white">
                      3. Counter-Evidence Verification (0–100% Novelty)
                    </h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-bold">
                      Anti-Rejection
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Prevents you from wasting months on an idea that was already published last month. It automatically checks candidate gaps against global 2025/2026 publications via Google Scholar & OpenAlex.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-transparent border border-white/15 hover:border-white/40 hover:bg-white/[0.04] transition-all group">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm sm:text-[15px] font-bold text-white">
                      4. One-Click IEEEtran LaTeX & Overleaf Push
                    </h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded font-bold">
                      Camera-Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Say goodbye to manual BibTeX formatting. Export complete Literature Synthesis matrices and Gap Analysis directly as IEEE-formatted .tex files or launch straight into Overleaf.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
         * HIGH-VELOCITY IMAGE FLOW SHOWCASE (With Cinematic B&W -> Color Filter)
         * Inspired by galloping speed, high-velocity data flow, and laser scanning
         * ========================================================================= */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300 mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              HIGH-VELOCITY SCANNING & DYNAMIC FLOW ENGINE
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-white uppercase">
              How The Engine Accelerates Your Discovery
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Scroll into view or hover cards to reveal vibrant color and active data scanning streams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Visual Card 1: Ingestion & Discovery Lens */}
            <div className="relative rounded-2xl p-4 bg-transparent border border-white/20 hover:border-white/50 transition-all duration-300 group overflow-hidden">
              
              {/* Image Container with Dynamic Filter (No Extra Neon Light Rays) */}
              <div className="relative w-full h-[200px] sm:h-[240px] rounded-xl overflow-hidden mb-4 border border-white/20 bg-black">
                
                {/* Clean Image with Cinematic Black & White / Color Transition */}
                <div 
                  className={`relative w-full h-full transition-all duration-700 ease-out ${
                    isFilterColor 
                      ? "grayscale-0 contrast-100 brightness-100 scale-105" 
                      : "grayscale contrast-125 brightness-95 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-105"
                  }`}
                >
                  <Image
                    src="/images/researcher_insight_3d.jpg"
                    alt="High-Velocity Academic Research Ingestion"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-black/85 backdrop-blur-md rounded-full text-[10px] font-mono font-bold text-white border border-white/30 flex items-center gap-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  PyMuPDF 500-Word Ingestion Stream
                </div>

                {/* Live Speed Indicator */}
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-black/85 backdrop-blur-md rounded text-[10px] font-mono text-slate-200 border border-white/30 shadow-md">
                  Speed: <span className="text-white font-bold">120 Pages / Sec</span>
                </div>
              </div>

              {/* Text Info (High-Contrast & Highly Legible) */}
              <h4 className="text-base sm:text-lg font-bold text-white mb-1.5 flex items-center justify-between">
                <span>Multi-Strategy Structural Extraction</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h4>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal">
                PyMuPDF structurally indexes Abstract, Methodology, Findings, and Limitations. Preserves paragraph hierarchy and exact bounding boxes for effortless navigation.
              </p>
            </div>

            {/* Visual Card 2: Novelty Shield & Verification Grid */}
            <div className="relative rounded-2xl p-4 bg-transparent border border-white/20 hover:border-white/50 transition-all duration-300 group overflow-hidden">
              
              {/* Image Container with Dynamic Filter (No Extra Neon Light Rays) */}
              <div className="relative w-full h-[200px] sm:h-[240px] rounded-xl overflow-hidden mb-4 border border-white/20 bg-black">
                
                {/* Clean Image with Cinematic Black & White / Color Transition */}
                <div 
                  className={`relative w-full h-full transition-all duration-700 ease-out ${
                    isFilterColor 
                      ? "grayscale-0 contrast-100 brightness-100 scale-105" 
                      : "grayscale contrast-125 brightness-95 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-105"
                  }`}
                >
                  <Image
                    src="/images/novelty_shield_3d.jpg"
                    alt="Thesis Novelty Shield & Verification Grid"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-black/85 backdrop-blur-md rounded-full text-[10px] font-mono font-bold text-white border border-white/30 flex items-center gap-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Anti-Rejection Novelty Shield
                </div>

                {/* Live Speed Indicator */}
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-black/85 backdrop-blur-md rounded text-[10px] font-mono text-slate-200 border border-white/30 shadow-md">
                  Corpus: <span className="text-white font-bold">250M+ Papers</span>
                </div>
              </div>

              {/* Text Info (High-Contrast & Highly Legible) */}
              <h4 className="text-base sm:text-lg font-bold text-white mb-1.5 flex items-center justify-between">
                <span>Manuscript Verification & Thesis Protection</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h4>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal">
                Cross-evaluates your proposed dissertation questions against 250M+ scholarly records across OpenAlex and Semantic Scholar so your publication is genuinely novel.
              </p>
            </div>

          </div>
        </div>

        {/* =========================================================================
         * SIDE-BY-SIDE: WITHOUT VS WITH OUR PLATFORM (Enhanced High-Visibility Cards)
         * ========================================================================= */}
        <div className="bg-transparent rounded-2xl p-5 sm:p-8 border border-white/20 mb-14">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-widest block mb-1">
              THE CLEAR DIFFERENCE
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight">
              OLD MANUAL STRUGGLE VS. RESEARCHGAP.AI
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/15">
            
            {/* The Old Way: Transparent Card with Rose Border */}
            <div className="space-y-3 pr-0 md:pr-4">
              <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs sm:text-sm uppercase font-mono mb-3">
                <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                WITHOUT RESEARCHGAP.AI (PURANA TARIKA)
              </div>

              {comparisonData.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-3 sm:p-3.5 rounded-xl bg-transparent border border-rose-500/35 hover:bg-rose-500/10 transition-colors flex items-start gap-3 shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/70 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold shadow-sm">
                    ✕
                  </div>
                  <div>
                    <span className="text-xs sm:text-[13px] font-bold text-white block mb-0.5">
                      {item.metric}
                    </span>
                    <span className="text-xs text-rose-100 font-medium leading-relaxed block">
                      {item.bad}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* The New Way: Transparent Card with Emerald Border */}
            <div className="space-y-3 pt-5 md:pt-0 pl-0 md:pl-6">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs sm:text-sm uppercase font-mono mb-3">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                WITH RESEARCHGAP.AI (SMART & AUTOMATED)
              </div>

              {comparisonData.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-3 sm:p-3.5 rounded-xl bg-transparent border border-emerald-500/35 hover:bg-emerald-500/10 transition-colors flex items-start gap-3 shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/70 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold shadow-sm">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs sm:text-[13px] font-bold text-white block mb-0.5">
                      {item.metric}
                    </span>
                    <span className="text-xs text-emerald-100 font-medium leading-relaxed block">
                      {item.good}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* =========================================================================
         * QUICK ACTION BAR
         * ========================================================================= */}
        <div className="text-center p-6 sm:p-8 rounded-2xl bg-transparent border border-white/20 relative overflow-hidden">
          <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-white mb-2">
            Save Months on Your Dissertation & Paper Publication
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            Instant literature synthesis, verifiable citation cards, automated 9-stage gap detection, and one-click IEEE LaTeX export.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-slate-200 transition shadow-[0_0_20px_rgba(255,255,255,0.6)] flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 fill-black" /> Open Scholar Workspace
            </Link>

            <Link
              href="/scholar-studio"
              className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5" /> Discover Papers via SerpAPI
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
