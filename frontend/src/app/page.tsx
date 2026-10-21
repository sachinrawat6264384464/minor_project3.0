"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Search, 
  FileText, 
  GitCompare, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  Zap, 
  Cpu, 
  Layers, 
  Terminal,
  ExternalLink,
  ChevronRight,
  Database,
  Radio,
  Share2
} from "lucide-react";

import CursorGlow from "@/components/ui/CursorGlow";
import FloatingRAGBot from "@/components/ui/FloatingRAGBot";
import VectorPointGalaxyCanvas from "@/components/landing/VectorPointGalaxyCanvas";
import CylinderOrbitalShowcase3D from "@/components/landing/CylinderOrbitalShowcase3D";
import InteractiveRAGPipelineTimeline from "@/components/landing/InteractiveRAGPipelineTimeline";
import VectorSpaceLaserScene from "@/components/landing/VectorSpaceLaserScene";
import ArchitectureFlowVisualizer from "@/components/landing/ArchitectureFlowVisualizer";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"rag" | "matrix" | "novelty">("rag");

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black relative overflow-x-hidden">
      {/* Dynamic Cursor Glow */}
      <CursorGlow />

      {/* Floating Corner Grounded RAG Chatbot Widget */}
      <FloatingRAGBot />

      {/* =========================================================================
       * TOP NAVIGATION HEADER: SLEEK OBSIDIAN GLASS
       * ========================================================================= */}
      <header className="sticky top-0 z-50 px-6 md:px-12 py-3.5 bg-black/80 backdrop-blur-md border-b border-white/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white text-black font-black text-sm flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.7)]">
            AI
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-tight uppercase font-sans text-white">
              ResearchGap<span className="text-slate-400">.ai</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest bg-white/10 text-slate-300 border border-white/20 rounded">
              v3.0 Architecture
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-slate-300">
          <a href="#orbital-papers" className="hover:text-white transition">360° Papers</a>
          <a href="#how-rag-works" className="hover:text-white transition">R-A-G Formula</a>
          <a href="#vector-db" className="hover:text-white transition">Vector Space</a>
          <a href="#architecture-stages" className="hover:text-white transition">9-Stage Flow</a>
          <Link href="/compare" className="hover:text-white transition">Comparison Matrix</Link>
          <Link href="/novelty-checker" className="hover:text-white transition">Thesis Novelty</Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/scholar-studio"
            className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white border border-white/20 hover:border-white rounded-lg transition hidden sm:inline-flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" /> Scholar Studio
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-white hover:bg-slate-200 text-black font-bold text-xs font-mono uppercase tracking-wider rounded-lg transition shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-center gap-1.5"
          >
            Launch Platform <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* =========================================================================
       * HERO SECTION: PURE COSMIC RAG PARTICLE STAGE (Clean, Minimal, Uncluttered)
       * ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Vector Point Galaxy Canvas in Background */}
        <div className="absolute inset-0 z-0">
          <VectorPointGalaxyCanvas interactive={true} />
        </div>

        {/* 3D Perspective Grid Floor on bottom of Hero */}
        <div className="absolute inset-x-0 bottom-0 h-[260px] perspective-grid-floor opacity-35 pointer-events-none z-0" />
      </section>

      {/* =========================================================================
       * SECTION 1: 360° CYLINDRICAL ORBITAL PAPER SHOWCASE (Matching User Image 1 & 2)
       * ========================================================================= */}
      <section id="orbital-papers">
        <CylinderOrbitalShowcase3D />
      </section>

      {/* =========================================================================
       * SECTION 2: THE R-A-G CORE FORMULA & DYNAMIC TIMELINE (Matching User Image 4)
       * ========================================================================= */}
      <section id="how-rag-works">
        <InteractiveRAGPipelineTimeline />
      </section>

      {/* =========================================================================
       * SECTION 3: 3D VECTOR SPACE & NEAREST CHUNKS LASER SCENE (Matching User Image 3 & 5)
       * ========================================================================= */}
      <section id="vector-db">
        <VectorSpaceLaserScene />
      </section>

      {/* =========================================================================
       * SECTION 4: 9-STAGE RESEARCH GAP & SYSTEM FLOW (Matching ARCHITECTURE.md)
       * ========================================================================= */}
      <section id="architecture-stages">
        <ArchitectureFlowVisualizer />
      </section>

      {/* =========================================================================
       * SECTION 5: SIDE-BY-SIDE PAPER COMPARISON MATRIX PREVIEW
       * ========================================================================= */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto text-white border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-black text-[11px] font-mono font-bold uppercase tracking-widest rounded-full mb-3 shadow-[0_0_20px_rgba(255,255,255,0.7)]">
            <GitCompare className="w-3.5 h-3.5" />
            SYNTHESIS MATRIX
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            SIDE-BY-SIDE <span className="underline decoration-white decoration-4 underline-offset-8">EVIDENCE COMPARISON</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-3">
            Compare multiple papers across objectives, datasets, baselines, and reported limitations. Explicitly marks unreported values to prevent misleading scientific assumptions.
          </p>
        </div>

        {/* Matrix Grid Preview */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/20 backdrop-blur-md overflow-x-auto shadow-[0_0_40px_rgba(255,255,255,0.05)]">
          <table className="w-full text-left text-xs font-sans min-w-[700px]">
            <thead>
              <tr className="border-b border-white/20 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-4">Evaluation Dimension</th>
                <th className="py-3 px-4 text-white">Paper 01: Medical ViT (2025)</th>
                <th className="py-3 px-4 text-white">Paper 02: Hybrid RAG (2024)</th>
                <th className="py-3 px-4 text-white">Paper 03: Gap Synthesis (2024)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-300">
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-white">Primary Objective</td>
                <td className="py-3.5 px-4">High-res 3D volumetric MRI segmentation</td>
                <td className="py-3.5 px-4">Reciprocal Rank Fusion with citation guardrails</td>
                <td className="py-3.5 px-4">Automated 9-stage limitation extraction</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-white">Evaluated Datasets</td>
                <td className="py-3.5 px-4">BraTS 2024, MSD Liver (45 MRI benchmarks)</td>
                <td className="py-3.5 px-4">PubMedQA, BioASQ, SciFact</td>
                <td className="py-3.5 px-4">OpenAlex 10,000 CS/AI sample corpus</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-white">Key Reported Metric</td>
                <td className="py-3.5 px-4 text-emerald-400 font-mono">Dice: 89.4% (vs 86.1% baseline)</td>
                <td className="py-3.5 px-4 text-emerald-400 font-mono">Citation recall: 99.2% verified</td>
                <td className="py-3.5 px-4 text-emerald-400 font-mono">Novelty correlation: 0.88 with reviewers</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-white">Extracted Limitation</td>
                <td className="py-3.5 px-4 text-amber-300 italic">Sensitive to hospital scanner blur [Page 7]</td>
                <td className="py-3.5 px-4 text-amber-300 italic">Requires multi-hop graph tuning [Page 11]</td>
                <td className="py-3.5 px-4 text-amber-300 italic">Requires human doctor signoff [Page 4]</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-white">Thesis Novelty Index</td>
                <td className="py-3.5 px-4 font-mono text-white font-bold">88.4% Novel</td>
                <td className="py-3.5 px-4 font-mono text-white font-bold">92.1% Novel</td>
                <td className="py-3.5 px-4 font-mono text-white font-bold">95.6% Novel</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              Interactive side-by-side comparison matrix with exportable IEEE LaTeX tables.
            </span>
            <Link
              href="/compare"
              className="text-white hover:underline flex items-center gap-1 font-bold"
            >
              Open Full Compare Matrix <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
       * SECTION 6: CALL-TO-ACTION & PLATFORM LAUNCH
       * ========================================================================= */}
      <section className="py-24 px-4 md:px-8 bg-black relative overflow-hidden border-t border-white/20">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(255,255,255,0.7)]">
            <Zap className="w-3.5 h-3.5" />
            READY FOR SCIENTIFIC SYNTHESIS
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            ACCELERATE YOUR DISSERTATION & PEER-REVIEWED PUBLICATION
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-sans leading-relaxed">
            Stop searching manually across fragmented tabs. Ingest your literature corpus, generate 100% verifiable answers with exact page numbers, discover genuine research gaps, and export IEEE LaTeX papers directly to Overleaf.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-xl bg-white text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition shadow-[0_0_35px_rgba(255,255,255,0.7)] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Enter Research Workspace
            </Link>

            <Link
              href="/novelty-checker"
              className="px-8 py-4 rounded-xl bg-black border border-white/40 text-white font-mono font-bold text-xs uppercase tracking-widest hover:border-white hover:bg-white/10 transition flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Check Thesis Novelty (0–100%)
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
       * FOOTER: MINIMAL OBSIDIAN ARCHITECTURE
       * ========================================================================= */}
      <footer className="border-t border-white/15 bg-black py-12 px-6 md:px-12 text-slate-400 text-xs font-mono">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-white text-black font-black text-xs flex items-center justify-center">
                AI
              </div>
              <span className="text-sm font-bold text-white uppercase font-sans tracking-tight">
                ResearchGap.ai
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Enterprise-grade academic literature synthesis, multi-strategy hybrid RAG, and automated 9-stage research gap discovery.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
              System Modules
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/dashboard" className="hover:text-white transition">Scholar Dashboard</Link></li>
              <li><Link href="/scholar-studio" className="hover:text-white transition">Scholar Studio (SerpAPI)</Link></li>
              <li><Link href="/compare" className="hover:text-white transition">Literature Matrix</Link></li>
              <li><Link href="/novelty-checker" className="hover:text-white transition">Thesis Novelty Index</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
              Engineering Architecture
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>• Dense Vectors: BAAI/bge-small-en-v1.5</li>
              <li>• Inverted Index: BM25Okapi Lexical</li>
              <li>• Cloud Store: Neon pgvector (384-dim)</li>
              <li>• Ingestion: PyMuPDF 500w Window</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
              Export Standards
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>• IEEEtran Dual-Column LaTeX (.tex)</li>
              <li>• Overleaf Cloud 1-Click Push</li>
              <li>• BibTeX Citation Export</li>
              <li>• Markdown & PDF Research Reports</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
          <div>
            © 2026 AI Research Gap Finder. All rights reserved.
          </div>
          <div>
            Full-Stack Next.js 15 · FastAPI · Neon pgvector Architecture
          </div>
        </div>
      </footer>
    </div>
  );
}
