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
  Share2,
  LogIn,
  UserPlus
} from "lucide-react";

import FloatingRAGBot, { openAuthConcierge } from "@/components/ui/FloatingRAGBot";
import VectorPointGalaxyCanvas from "@/components/landing/VectorPointGalaxyCanvas";
import CylinderOrbitalShowcase3D from "@/components/landing/CylinderOrbitalShowcase3D";
import HighLevelSystemArchitecture3D from "@/components/landing/HighLevelSystemArchitecture3D";
import WhyYouNeedThisPlatform from "@/components/landing/WhyYouNeedThisPlatform";
import ArchitectureFlowVisualizer from "@/components/landing/ArchitectureFlowVisualizer";
import DashboardShowcaseGallery from "@/components/landing/DashboardShowcaseGallery";
import { ResearchTorchDarkBackground } from "@/components/landing/ResearchTorchDarkBackground";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"rag" | "matrix" | "novelty">("rag");

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black relative">
      {/* Floating Corner Grounded RAG Chatbot Widget */}
      <FloatingRAGBot />

      {/* =========================================================================
       * CLEAN TRANSPARENT HEADER: NO BORDER, NO MENU, PERFECTLY ALIGNED
       * ========================================================================= */}
      <div className="sticky top-0 z-50 w-full px-6 md:px-12 pt-6 pb-2 bg-transparent pointer-events-none">
        <header className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          
          {/* Left: Logo & Platform Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black font-black text-sm flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.7)]">
              AI
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-base sm:text-lg font-black tracking-tight uppercase font-sans text-white">
                ResearchGap<span className="text-slate-400">.ai</span>
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-white/10 text-slate-300 rounded-full">
                v3.0 Architecture
              </span>
            </div>
          </div>

          {/* Right: Authentication Action Buttons (Opens Chatbot Concierge Directly) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => openAuthConcierge("login")}
              className="px-4 py-2 text-xs sm:text-[13px] font-sans font-semibold tracking-wider text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition flex items-center gap-1.5 border border-white/10 hover:border-white/30 backdrop-blur-md cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => openAuthConcierge("register")}
              className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs sm:text-[13px] font-sans tracking-wider rounded-full transition shadow-[0_0_25px_rgba(255,255,255,0.7)] flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" /> Sign Up
            </button>
          </div>

        </header>
      </div>

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
       * CONTINUOUS ARCHITECTURAL BLUEPRINT GRID WRAPPER (HERO TO FOOTER)
       * ========================================================================= */}
      <div className="relative w-full blueprint-matrix-grid">
        {/* Interactive Dark Torch Effect with Secret Research Artifacts */}
        <ResearchTorchDarkBackground />

        {/* Subtle Ambient Radial Lighting for Cosmic Depth */}
        <div 
          className="pointer-events-none absolute inset-0 z-0 opacity-40"
          style={{
            background: "radial-gradient(ellipse 90% 60% at 50% 10%, rgba(255, 255, 255, 0.05), transparent 80%)",
          }}
        />

        {/* =========================================================================
         * SECTION 1: WHY RESEARCHERS MUST USE THIS (Placed Directly After Hero)
         * ========================================================================= */}
        <section id="why-use-platform" className="relative z-10 w-full bg-transparent">
          <WhyYouNeedThisPlatform />
        </section>

        {/* =========================================================================
         * SECTION 2: HIGH-LEVEL SYSTEM ARCHITECTURE & 3D INTERACTIVE FLOW (5-Tier)
         * ========================================================================= */}
        <section id="system-architecture" className="relative z-10 bg-transparent">
          <HighLevelSystemArchitecture3D />
        </section>

        {/* =========================================================================
         * SECTION 3: 360° CYLINDRICAL ORBITAL PAPER SHOWCASE (Moved to Section 3)
         * ========================================================================= */}
        <section id="orbital-papers" className="relative z-10 bg-transparent">
          <CylinderOrbitalShowcase3D />
        </section>

        {/* =========================================================================
         * SECTION 4: 9-STAGE RESEARCH GAP & SYSTEM FLOW (Matching ARCHITECTURE.md)
         * ========================================================================= */}
        <section id="architecture-stages" className="relative z-10 bg-transparent">
          <ArchitectureFlowVisualizer />
        </section>

        {/* =========================================================================
         * SECTION 5: LIVE WORKSPACE DASHBOARD SUITE GALLERY (Compact & Interactive)
         * ========================================================================= */}
        <section id="dashboard-gallery" className="relative z-10 bg-transparent">
          <DashboardShowcaseGallery />
        </section>

      <footer className="relative z-10 bg-transparent pt-20 pb-28 sm:pb-36 px-6 md:px-12 text-slate-400 text-xs font-mono">
        {/* Grand Architecture Question Headline (Moved to Footer in Big Bold Size) */}
        <div className="max-w-5xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white text-black text-[11px] font-mono font-bold uppercase tracking-widest rounded-full mb-5 shadow-[0_0_20px_rgba(255,255,255,0.7)]">
            <Sparkles className="w-3.5 h-3.5" />
            AI RESEARCH GAP FINDER // ARCHITECTURE
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white font-sans mb-4 leading-[1.05]">
            RESEARCH GAP FINDER
          </h2>

          <p className="text-xl sm:text-3xl font-extrabold uppercase tracking-wide text-slate-200 mb-6">
            WHAT IS <span className="underline decoration-white decoration-4 sm:decoration-8 underline-offset-8">RAG</span>, AND HOW DOES IT WORK <span className="underline decoration-white decoration-4 sm:decoration-8 underline-offset-8">INTERNALLY</span>?
          </p>

          <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-sans leading-relaxed">
            Automated research gap discovery powered by verifiable 3D indexed documents, PyMuPDF structural parsing, 384-dimensional BGE vector embeddings, BM25Okapi lexical retrieval, and counter-evidence limitation synthesis.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pt-10 border-t border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded bg-white text-black font-black text-xs flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.7)]">
                AI
              </div>
              <div>
                <span className="text-sm font-black text-white uppercase font-sans tracking-tight block leading-tight">
                  ResearchGap<span className="text-slate-400">.ai</span>
                </span>
                <span className="text-[10px] font-mono text-slate-300 font-semibold tracking-wider uppercase block">
                  Research Gap Finder
                </span>
              </div>
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

        {/* Grand Brand Display at Bottom of Footer (High-contrast, unclipped) */}
        <div className="pt-12 pb-6 text-center select-none border-t border-white/10 mt-10">
          <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white/80 via-white/50 to-white/20 font-sans block drop-shadow-[0_2px_20px_rgba(255,255,255,0.12)]">
            RESEARCH GAP FINDER
          </span>
          <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-slate-400 mt-3">
            Verifiable Academic Intelligence · Multi-Strategy Hybrid RAG
          </p>
        </div>
      </footer>
    </div>
  </div>
);
}
