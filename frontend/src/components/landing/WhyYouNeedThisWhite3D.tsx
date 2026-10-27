"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  AlertTriangle, 
  FileText, 
  Share2, 
  Layers, 
  Target,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";

export default function WhyYouNeedThisWhite3D() {
  const [activeTab, setActiveTab] = useState<"problems" | "novelty" | "citations">("problems");
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHoveredCanvas, setIsHoveredCanvas] = useState(false);

  // 3D Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };
    window.addEventListener("resize", handleResize);

    // Generate 3D Spherical Points
    interface Point3D {
      x: number;
      y: number;
      z: number;
      label?: string;
      color?: string;
      radius: number;
    }

    const points: Point3D[] = [];
    const labels = [
      "Page 7 Citation",
      "0% Hallucination",
      "Novelty Index 94%",
      "OpenAlex 10k",
      "BM25 + Dense RRF",
      "Counter-Evidence",
      "PyMuPDF Parsing",
      "IEEE LaTeX Export",
      "Research Gap #03",
      "ViT Bottleneck"
    ];

    const numPoints = 65;
    const sphereRadius = 140;

    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;
      points.push({
        x: sphereRadius * Math.cos(theta) * Math.sin(phi),
        y: sphereRadius * Math.sin(theta) * Math.sin(phi),
        z: sphereRadius * Math.cos(phi),
        label: i < labels.length ? labels[i] : undefined,
        color: i < labels.length ? "#2563EB" : "#94A3B8",
        radius: i < labels.length ? 5 : 2.5
      });
    }

    let angleX = 0.003;
    let angleY = 0.005;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - width / 2) * 0.0001;
      mouseY = (e.clientY - rect.top - height / 2) * 0.0001;
    };
    canvas.addEventListener("mousemove", onMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Soft ambient white/slate gradient backdrop
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, 220);
      bgGrad.addColorStop(0, "rgba(238, 242, 255, 0.7)");
      bgGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const rotX = angleX + mouseY;
      const rotY = angleY + mouseX;

      // Project & Sort 3D Points
      const projected = points.map((p) => {
        // Rotate around Y
        let x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
        let z1 = p.z * Math.cos(rotY) + p.x * Math.sin(rotY);

        // Rotate around X
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

      // Sort by Z for realistic depth
      projected.sort((a, b) => a.z2 - b.z2);

      // Draw connecting lines between close points
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.projX - p2.projX;
          const dy = p1.projY - p2.projY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 60) {
            const alpha = (1 - dist / 60) * 0.25 * ((p1.scale + p2.scale) / 2);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
          }
        }
      }

      // Draw 3D Spheres & Badges
      projected.forEach((p) => {
        const radius = Math.max(1, p.radius * p.scale);
        const alpha = Math.min(1, Math.max(0.15, (p.z2 + sphereRadius) / (2 * sphereRadius)));

        // Node Glow
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, radius + 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color === "#2563EB" 
          ? `rgba(37, 99, 235, ${alpha * 0.4})` 
          : `rgba(148, 163, 184, ${alpha * 0.2})`;
        ctx.fill();

        // Node Solid Core
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color === "#2563EB" 
          ? `rgba(30, 58, 138, ${alpha})` 
          : `rgba(100, 116, 139, ${alpha})`;
        ctx.fill();

        // Node Label (for key milestones)
        if (p.label && p.scale > 0.85) {
          ctx.font = "600 10px 'Space Grotesk', sans-serif";
          ctx.fillStyle = `rgba(15, 23, 42, ${alpha * 0.9})`;
          ctx.fillText(p.label, p.projX + 8, p.projY + 3);
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
      metric: "Time to complete Literature Review",
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
    <div className="relative w-full py-12 sm:py-16 md:py-20 px-3 sm:px-6 md:px-12 bg-gradient-to-b from-[#F8FAFC] via-[#FFFFFF] to-[#F1F5F9] text-[#0F172A] font-sans overflow-hidden border-y border-slate-200 shadow-xl">
      
      {/* Background Decorative Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Subtle Ambient Radial Light Spheres */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-blue-100/60 rounded-full blur-[100px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-indigo-50/70 rounded-full blur-[90px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* =========================================================================
         * SECTION HEADER: "AAPKE LIYE ISKA USE KARNA ZAROORI KYU HAI?"
         * ========================================================================= */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase mb-3 shadow-sm">
            <Sparkles className="w-3 h-3 text-blue-600 animate-pulse" />
            SCHOLAR ESSENTIAL // AAPKE LIYE ISKA USE KARNA KYU ZAROORI HAI?
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 font-sans uppercase leading-tight">
            WHY RESEARCHERS <span className="text-blue-600 underline decoration-blue-300 decoration-4 underline-offset-6">MUST USE</span> THIS PLATFORM
          </h2>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Har saal hazaron research papers sirf isliye reject ho jaate hain kyunki unka literature review purana hota hai ya unhone aisi problem pick kar li hoti hai jo pehle hi solve ho chuki hai. <br className="hidden sm:inline" />
            <strong className="text-slate-900 font-bold">ResearchGap.ai</strong> aapke 3 mahine ke hardwork ko 100% verified, peer-review proof aur novel banata hai.
          </p>
        </div>

        {/* =========================================================================
         * 3D CANVAS & INTERACTIVE VISUAL CORE (Interactive Orbit + Live Badges)
         * ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-14">
          
          {/* Left: 3D Interactive Vector Point Cloud & Knowledge Sphere Canvas */}
          <div className="lg:col-span-6 relative bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_10px_35px_rgba(15,23,42,0.06)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-mono font-bold text-slate-800 uppercase tracking-wider">
                  Live 3D Citation Constellation
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold border border-blue-100">
                Interactive 3D Orbit (Move Mouse)
              </span>
            </div>

            {/* Canvas */}
            <div className="relative w-full h-[280px] sm:h-[340px] md:h-[360px] flex items-center justify-center cursor-grab active:cursor-grabbing">
              <canvas ref={canvasRef} className="w-full h-full block" />
              
              {/* Overlay Hologram Stamp */}
              <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-lg border border-slate-200 shadow-sm flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-700">384-Dim Neon PgVector Index</span>
                </div>
                <span className="font-mono text-blue-600 font-bold">0 Hallucinations</span>
              </div>
            </div>
          </div>

          {/* Right: Key Value Pillars (Cards with Icons & Clear Explanations) */}
          <div className="lg:col-span-6 space-y-3">
            
            {/* Pillar 1: 0% Hallucination */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-400 group">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      1. 100% Verifiable Page-Number Citations
                    </h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono bg-emerald-100 text-emerald-800 rounded font-bold">
                      Zero Fake DOIs
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Generic ChatGPT or Copilot create fake citations that destroy academic credibility. Our platform links every claim directly to the paper title, DOI, exact page number, and verbatim excerpt.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 2: 9-Stage Research Gap Discovery */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-400 group">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      2. Automated Research Gap Engine (9-Stage)
                    </h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono bg-indigo-100 text-indigo-800 rounded font-bold">
                      Patent-Grade
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Identifies real scientific blind spots: Underexplored Questions, Limited Dataset Diversity, Generalization Weaknesses, and Baseline Gaps that supervisors and journal reviewers demand.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3: Counter-Evidence Verification */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-400 group">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      3. Counter-Evidence Verification (0–100% Novelty)
                    </h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono bg-amber-100 text-amber-800 rounded font-bold">
                      Anti-Rejection
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Prevents you from wasting months on an idea that was already published last month. It automatically checks candidate gaps against global 2025/2026 publications via Google Scholar & OpenAlex.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 4: 1-Click LaTeX & Overleaf */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-400 group">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      4. One-Click IEEEtran LaTeX & Overleaf Push
                    </h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono bg-purple-100 text-purple-800 rounded font-bold">
                      Camera-Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Say goodbye to manual BibTeX formatting. Export complete Literature Synthesis matrices and Gap Analysis directly as IEEE-formatted .tex files or launch straight into Overleaf.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
         * GENERATED 3D VISUAL SHOWCASE (2 HIGH-TECH SCIENTIFIC ILLUSTRATIONS)
         * ========================================================================= */}
        <div className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] font-mono font-bold text-blue-600 uppercase tracking-widest block mb-1.5">
              Visual Laboratory Intelligence
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
              How The Engine Accelerates Your Discovery
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Visual 1: Holographic Ingestion & Scientific Discovery Lens */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="relative w-full h-[180px] sm:h-[220px] rounded-xl overflow-hidden mb-3.5 border border-slate-100 bg-slate-50">
                <Image
                  src="/images/researcher_insight_3d.jpg"
                  alt="3D Academic Research Ingestion & Discovery Lens"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-mono font-bold text-blue-700 shadow-sm border border-slate-200">
                  PyMuPDF 500-Word Window Ingestion
                </div>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1 flex items-center justify-between">
                <span>Multi-Strategy Section Extraction</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                PyMuPDF structurally indexes Abstract, Methodology, Findings, and Limitations. Preserves paragraph hierarchy and exact bounding boxes for effortless navigation.
              </p>
            </div>

            {/* Visual 2: Novelty Shield & Verification Grid */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="relative w-full h-[180px] sm:h-[220px] rounded-xl overflow-hidden mb-3.5 border border-slate-100 bg-slate-50">
                <Image
                  src="/images/novelty_shield_3d.jpg"
                  alt="3D Research Manuscript Verification Shield"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-mono font-bold text-emerald-700 shadow-sm border border-slate-200">
                  Novelty Verification & Anti-Rejection
                </div>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1 flex items-center justify-between">
                <span>Manuscript Verification & Thesis Shield</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cross-evaluates your proposed dissertation questions against 250M+ scholarly records across OpenAlex and Semantic Scholar so your publication is genuinely novel.
              </p>
            </div>

          </div>
        </div>

        {/* =========================================================================
         * SIDE-BY-SIDE: WITHOUT VS WITH OUR PLATFORM (Direct Contrast)
         * ========================================================================= */}
        <div className="bg-white rounded-2xl p-4 sm:p-7 border border-slate-200 shadow-lg mb-12">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">
              The Clear Difference
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
              Old Manual Struggle vs. ResearchGap.ai
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            
            {/* The Old Way */}
            <div className="space-y-2.5 pr-0 md:pr-4">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs sm:text-sm uppercase font-mono mb-3">
                <XCircle className="w-4 h-4 shrink-0" />
                Without ResearchGap.ai (Purana Tarika)
              </div>

              {comparisonData.map((item, idx) => (
                <div key={idx} className="p-2.5 sm:p-3 rounded-lg bg-rose-50/50 border border-rose-100 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    ✕
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 block">
                      {item.metric}
                    </span>
                    <span className="text-[11px] text-rose-700 leading-snug">
                      {item.bad}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* The New Way */}
            <div className="space-y-2.5 pt-4 md:pt-0 pl-0 md:pl-6">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs sm:text-sm uppercase font-mono mb-3">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                With ResearchGap.ai (Smart & Automated)
              </div>

              {comparisonData.map((item, idx) => (
                <div key={idx} className="p-2.5 sm:p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-900 block">
                      {item.metric}
                    </span>
                    <span className="text-[11px] text-emerald-800 font-semibold leading-snug">
                      {item.good}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* =========================================================================
         * CALL TO ACTION: START YOUR LITERATURE SYNTHESIS NOW
         * ========================================================================= */}
        <div className="text-center bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />
          
          <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-4">
            Start Without Delay
          </span>

          <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight mb-4">
            Save Months on Your Dissertation & Paper Publication
          </h3>

          <p className="text-blue-100 text-xs sm:text-base max-w-2xl mx-auto mb-8 font-sans leading-relaxed">
            Abhi login karein, apne PDFs upload karein, aur verified citations ke saath apne research gaps aur novelty score ko instantly inspect karein.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 bg-white text-blue-900 hover:bg-slate-100 font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-full transition shadow-lg flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-blue-600" /> Open Scholar Workspace
            </Link>

            <Link
              href="/scholar-studio"
              className="px-8 py-3.5 bg-blue-800/60 hover:bg-blue-800 text-white border border-white/30 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full transition flex items-center gap-2"
            >
              <Search className="w-4 h-4" /> Discover Papers via SerpAPI
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
