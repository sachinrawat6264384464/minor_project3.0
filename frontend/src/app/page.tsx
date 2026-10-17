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
  Globe,
  Bot,
  Activity,
  Check,
  Shield,
  Target,
  Brain,
  ChevronRight,
  ExternalLink,
  Radio
} from "lucide-react";
import CursorGlow from "@/components/ui/CursorGlow";
import FloatingRAGBot from "@/components/ui/FloatingRAGBot";
import PaperOrbitalShowcase from "@/components/landing/PaperOrbitalShowcase";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#8C8C8C] flex flex-col justify-between relative font-grotesk text-black selection:bg-black selection:text-white">
      {/* Subtle Glow */}
      <CursorGlow />

      {/* Floating Corner RAG AI Chatbot Widget */}
      <FloatingRAGBot />

      {/* TOP NAVBAR: MOME BRUTALIST ARCHITECTURAL HEADER */}
      <header className="px-6 md:px-12 py-4 flex items-center justify-between border-b-2 border-black bg-black text-white sticky top-0 z-50 shadow-[0_4px_0px_0px_#FFFFFF]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white text-black font-chiseled text-xl flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_0px_#FFFFFF]">
            AI
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tighter uppercase font-grotesk">
              ResearchGap // V3.0
            </span>
            <span className="hidden sm:inline-block ml-3 px-2 py-0.5 text-[9px] bg-white text-black font-bold uppercase tracking-widest">
              Central Academic Architecture
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/novelty-checker"
            className="text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition hidden md:block"
          >
            Thesis Novelty
          </Link>
          <Link
            href="/scholar-studio"
            className="text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition hidden sm:block"
          >
            Scholar Studio
          </Link>
          <Link
            href="/login"
            className="text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition"
          >
            Sign In
          </Link>
          <Link 
            href="/dashboard" 
            className="px-5 py-2.5 bg-white hover:bg-black text-black hover:text-white font-extrabold text-xs uppercase tracking-wider border-2 border-white shadow-[3px_3px_0px_0px_#FFFFFF] transition flex items-center gap-2"
          >
            Launch Platform <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* HERO SECTION: MOME BRUTALIST POSTER COMPOSITION */}
        <section className="pt-10 pb-16 px-6 md:px-12 max-w-[1440px] mx-auto relative">
          
          {/* TOP METADATA ROW - Modeled after MOME Symposium Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b-2 border-black pb-4 mb-8">
            <div className="flex items-center gap-4">
              <span className="font-chiseled text-xl md:text-2xl text-white tracking-tight drop-shadow-[2px_2px_0px_#000000]">
                ONLINE STREAM // ACTIVE
              </span>
              <span className="px-2 py-0.5 bg-black text-white text-[11px] font-bold uppercase tracking-widest border border-white">
                MOME AUDITORIUM EDITORIAL
              </span>
            </div>

            <div className="text-left md:text-right font-grotesk text-xs font-bold text-black uppercase tracking-wider max-w-sm leading-tight">
              INTERNATIONAL SYMPOSIUM OF SYSTEMATIC LITERATURE REVIEW & NOVELTY EXTRACTION
              <div className="mt-1 text-[10px] text-white bg-black px-2 py-0.5 inline-block">
                NEON PGVECTOR // 9-STAGE GAP ENGINE // 2026
              </div>
            </div>
          </div>

          {/* MAIN POSTER HEADLINE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            
            {/* LEFT COLUMN: Oversized Faceted Typography */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Faceted Poster Headlines */}
              <div className="space-y-1">
                <div className="font-chiseled text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-black leading-none tracking-tight">
                  PERI
                </div>
                <div className="font-chiseled text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-black leading-none tracking-tight">
                  PHERAL
                </div>
                <div className="font-chiseled text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-none tracking-tight drop-shadow-[4px_4px_0px_#000000]">
                  PRIORITIES:!
                </div>
                <div className="font-chiseled text-2xl sm:text-4xl md:text-5xl text-black pt-2 tracking-wide">
                  4TH RESEARCH GAP & NOVELTY ENGINE
                </div>
              </div>

              {/* Architectural Subtitle Box */}
              <div className="p-5 bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000000] text-black">
                <p className="text-xs md:text-sm font-semibold uppercase leading-relaxed tracking-wide">
                  Synthesize OpenAlex, Semantic Scholar, and SerpAPI Google Scholar. Ingest PDF papers via PyMuPDF section parsing, query with Reciprocal Rank Fusion, and formulate candidate research gaps validated against counter-evidence.
                </p>
                <div className="mt-3 pt-3 border-t-2 border-black flex flex-wrap items-center gap-3 text-[11px] font-bold">
                  <span className="bg-black text-white px-2 py-0.5">01 // BGE VECTOR EMBEDDINGS</span>
                  <span className="bg-black text-white px-2 py-0.5">02 // IEEE LATEX & OVERLEAF</span>
                  <span className="bg-black text-white px-2 py-0.5">03 // THESIS NOVELTY (0-100%)</span>
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-3">
                <Link 
                  href="/dashboard" 
                  className="px-8 py-4 bg-black hover:bg-white text-white hover:text-black font-extrabold text-xs uppercase tracking-widest border-2 border-black shadow-[5px_5px_0px_0px_#FFFFFF] transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Start Research Workspace <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/novelty-checker" 
                  className="px-8 py-4 bg-white hover:bg-black text-black hover:text-white font-extrabold text-xs uppercase tracking-widest border-2 border-black shadow-[5px_5px_0px_0px_#000000] transition flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Check Thesis Novelty
                </Link>
                <Link 
                  href="/scholar-studio" 
                  className="px-8 py-4 bg-[#757980] hover:bg-black text-white font-extrabold text-xs uppercase tracking-widest border-2 border-black shadow-[5px_5px_0px_0px_#000000] transition flex items-center gap-2"
                >
                  <Search className="w-4 h-4" /> Scholar Studio
                </Link>
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Brutalist Architecture Diagram Card */}
            <div className="lg:col-span-5 relative">
              
              {/* Outer Brutalist Frame */}
              <div className="bg-white border-3 border-black p-6 shadow-[8px_8px_0px_0px_#000000] space-y-6">
                
                {/* Header Stamp */}
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <span className="px-2.5 py-1 bg-black text-white font-bold text-xs uppercase tracking-wider">
                    SYSTEM PIPELINE ARCHITECTURE
                  </span>
                  <span className="text-xs font-bold uppercase text-black font-mono">
                    28-29 JANUARY 2026
                  </span>
                </div>

                {/* 3 Academic Sources Badges */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                  <div className="p-3 bg-[#E6E7E9] border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                    <div className="font-extrabold text-black">OPENALEX</div>
                    <div className="text-[9px] uppercase text-slate-700">Open API</div>
                  </div>
                  <div className="p-3 bg-[#E6E7E9] border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                    <div className="font-extrabold text-black">SEMANTIC</div>
                    <div className="text-[9px] uppercase text-slate-700">Scholar Graph</div>
                  </div>
                  <div className="p-3 bg-[#E6E7E9] border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                    <div className="font-extrabold text-black">SERPAPI</div>
                    <div className="text-[9px] uppercase text-slate-700">Google Scholar</div>
                  </div>
                </div>

                {/* RAG Core Hub Box */}
                <div className="p-5 bg-black text-white border-2 border-white shadow-[4px_4px_0px_0px_#8C8C8C] text-center space-y-2">
                  <div className="font-chiseled text-2xl tracking-wide text-white">
                    HYBRID RRF CORE
                  </div>
                  <p className="text-xs font-grotesk uppercase text-slate-300 tracking-wider">
                    Dense Vector (BAAI/bge-small-en-v1.5) + Sparse BM25Okapi + Neon pgvector
                  </p>
                  <div className="flex justify-center gap-2 pt-1 text-[10px] font-bold font-mono">
                    <span className="bg-white text-black px-2 py-0.5">PyMuPDF Chunks</span>
                    <span className="bg-white text-black px-2 py-0.5">Citations</span>
                    <span className="bg-white text-black px-2 py-0.5">Grounded Output</span>
                  </div>
                </div>

                {/* Live Assistant Query Demo */}
                <div className="p-4 bg-[#F4F5F6] border-2 border-black space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold uppercase text-black">Live Academic Query:</span>
                    <span className="text-[10px] bg-black text-white px-2 py-0.5 font-bold">100% CITED</span>
                  </div>
                  <div className="p-2.5 bg-white border border-black font-mono text-[11px] text-black">
                    "What are the reported empirical bottlenecks of Vision Transformers under real-world hospital noise?"
                  </div>
                  <div className="p-2.5 bg-black text-white border border-black font-grotesk text-[11px] leading-relaxed">
                    <span className="font-bold text-emerald-400 block mb-1">✓ IDENTIFIED RESEARCH GAP:</span>
                    "High sensitivity to out-of-distribution blur. Evaluation splits are restricted to homogeneous datasets. Source: IEEE TNNLS [Page 7]."
                  </div>
                </div>

                {/* Bottom 4 Feature Indicators */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase text-center">
                  <div className="p-2 bg-white border border-black shadow-[2px_2px_0px_0px_#000000]">
                    ✓ Overleaf & LaTeX .tex
                  </div>
                  <div className="p-2 bg-white border border-black shadow-[2px_2px_0px_0px_#000000]">
                    ✓ Audio Podcast Mode
                  </div>
                  <div className="p-2 bg-white border border-black shadow-[2px_2px_0px_0px_#000000]">
                    ✓ Novelty Score (0-100%)
                  </div>
                  <div className="p-2 bg-white border border-black shadow-[2px_2px_0px_0px_#000000]">
                    ✓ Knowledge Graph 2D
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* 4 HORIZONTAL BANNERS ROW - MOME STYLE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t-2 border-black">
            <div className="p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
              <span className="font-chiseled text-2xl text-black block mb-1">01 // RAG</span>
              <h4 className="font-extrabold text-sm uppercase text-black">Multi-Strategy Hybrid</h4>
              <p className="text-xs uppercase text-slate-600 mt-1">Dense BGE vectors + BM25Okapi reciprocal rank fusion.</p>
            </div>

            <div className="p-5 bg-black text-white border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF]">
              <span className="font-chiseled text-2xl text-white block mb-1">02 // GAPS</span>
              <h4 className="font-extrabold text-sm uppercase text-white">9-Stage Engine</h4>
              <p className="text-xs uppercase text-slate-300 mt-1">Cross-paper limitation extraction with counter-evidence checks.</p>
            </div>

            <div className="p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
              <span className="font-chiseled text-2xl text-black block mb-1">03 // NOVELTY</span>
              <h4 className="font-extrabold text-sm uppercase text-black">Prior-Art Checker</h4>
              <p className="text-xs uppercase text-slate-600 mt-1">Calculates 0–100% novelty index comparing against pgvector.</p>
            </div>

            <div className="p-5 bg-black text-white border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF]">
              <span className="font-chiseled text-2xl text-white block mb-1">04 // EXPORT</span>
              <h4 className="font-extrabold text-sm uppercase text-white">IEEE LaTeX & Audio</h4>
              <p className="text-xs uppercase text-slate-300 mt-1">1-click Overleaf submission and NotebookLM-style podcast.</p>
            </div>
          </div>

        </section>

        {/* 360-DEGREE ORBITAL SHOWCASE SECTION (BRUTALIST CONCRETE STYLING) */}
        <div className="border-t-2 border-b-2 border-black bg-[#7D8187] py-12">
          <PaperOrbitalShowcase />
        </div>

        {/* 4-STEP WORKFLOW POSTER SECTION */}
        <section id="how-it-works" className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest border border-white inline-block mb-3">
              METHODOLOGY PROTOCOL
            </span>
            <h2 className="font-chiseled text-3xl md:text-5xl text-black uppercase tracking-tight">
              HOW THE PLATFORM WORKS
            </h2>
            <p className="text-xs md:text-sm font-bold uppercase text-white mt-1 drop-shadow-[1px_1px_0px_#000000]">
              Systematic Academic Pipeline from Ingestion to Defense
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Search & Ingest", desc: "Discover papers via OpenAlex & SerpAPI Google Scholar, or upload custom PDF manuscripts." },
              { step: "02", title: "PyMuPDF Section Parse", desc: "Extract section boundaries (Abstract, Methods, Limitations) with exact page tracking." },
              { step: "03", title: "Hybrid RAG Synthesis", desc: "Query indexed collection with live OpenAI/Gemini answers grounded in source citations." },
              { step: "04", title: "Novelty & LaTeX Export", desc: "Compute 0-100% novelty score and export ready-to-publish IEEE .tex manuscripts directly to Overleaf." }
            ].map((st, i) => (
              <div key={i} className="p-6 bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000000] text-left">
                <span className="font-chiseled text-4xl text-black block mb-2">{st.step}</span>
                <h4 className="font-extrabold text-sm uppercase text-black mb-2">{st.title}</h4>
                <p className="text-xs text-slate-700 leading-relaxed uppercase">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER: MOME CENTRAL EUROPEAN EDITORIAL STAMP */}
      <footer className="bg-black text-white border-t-4 border-black pt-14 pb-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white text-black font-chiseled text-lg flex items-center justify-center font-bold">
                AI
              </div>
              <span className="text-base font-extrabold uppercase font-grotesk tracking-tight text-white">
                ResearchGap
              </span>
            </div>
            <p className="text-slate-400 uppercase text-[11px] leading-relaxed mb-4">
              Academic Platform for paper discovery, PyMuPDF section parsing, grounded hybrid RAG, and candidate research gap analysis.
            </p>
            <span className="px-2 py-1 bg-white text-black font-bold uppercase text-[10px]">
              MOME Constructivist Theme
            </span>
          </div>

          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider mb-3 pb-1 border-b border-white">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-slate-400 font-bold uppercase text-[11px]">
              <li><Link href="/dashboard" className="hover:text-white transition">Research Dashboard</Link></li>
              <li><Link href="/scholar-studio" className="hover:text-white transition">Scholar Studio (SerpAPI)</Link></li>
              <li><Link href="/novelty-checker" className="hover:text-white transition">Thesis Novelty Checker</Link></li>
              <li><Link href="/reports" className="hover:text-white transition">IEEE LaTeX & Overleaf Exporter</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider mb-3 pb-1 border-b border-white">
              Core Technologies
            </h4>
            <ul className="space-y-2 text-slate-400 font-mono text-[11px]">
              <li><span className="text-white">EMBEDDINGS:</span> BAAI/bge-small-en-v1.5</li>
              <li><span className="text-white">DATABASE:</span> Neon Serverless pgvector</li>
              <li><span className="text-white">LEXICAL:</span> rank-bm25 BM25Okapi</li>
              <li><span className="text-white">LLM:</span> OpenAI gpt-4o-mini / Gemini</li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider mb-3 pb-1 border-b border-white">
              Academic Standards
            </h4>
            <ul className="space-y-2 text-slate-400 uppercase text-[11px] font-bold">
              <li>• OpenAlex Global Research API</li>
              <li>• SerpAPI Google Scholar</li>
              <li>• IEEEtran Dual-Column Format</li>
              <li>• 100% Page-Level Citations</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[10px] uppercase font-mono">
          <div>
            © 2026 AI Research Gap Finder. Moholy-Nagy Academic Poster Identity.
          </div>
          <div>
            Work in Context // Central European Photography & AI Research
          </div>
        </div>
      </footer>
    </div>
  );
}
