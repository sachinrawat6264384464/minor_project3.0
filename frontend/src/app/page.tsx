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
  ChevronRight
} from "lucide-react";
import CursorGlow from "@/components/ui/CursorGlow";
import FloatingRAGBot from "@/components/ui/FloatingRAGBot";
import PaperOrbitalShowcase from "@/components/landing/PaperOrbitalShowcase";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F0F6FE] flex flex-col justify-between relative font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Mouse Glowing Cursor Effect */}
      <CursorGlow />

      {/* Floating Corner RAG AI Chatbot Widget */}
      <FloatingRAGBot />

      {/* TOP NAVBAR: ROYAL BLUE BACKGROUND & CENTER MENU REMOVED PER REQUEST */}
      <header className="px-10 py-4 flex items-center justify-between border-b border-royal-800 bg-[#0F172A] text-white sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-lg shadow-md border border-blue-400">
            AI
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight">ResearchGap</span>
        </div>

        {/* Center menu removed as requested */}

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-bold text-slate-300 hover:text-white transition hidden sm:block"
          >
            Sign In
          </Link>
          <Link 
            href="/dashboard" 
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 border border-blue-400"
          >
            Launch Platform <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Hero Banner */}
      <main className="flex-1">
        {/* HERO SECTION WITH ROYAL BLUE ACCENTS */}
        <section className="pt-10 pb-16 px-8 max-w-[1440px] mx-auto relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Headline, Badges, CTAs */}
            <div className="lg:col-span-5 space-y-6 text-left pt-2">
              
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-blue-700 font-bold text-xs shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                9-Stage Evidence-Backed Research Gap Discovery Platform
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.08] tracking-tight">
                Accelerate Academic Discovery with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-950 via-blue-700 to-blue-600 relative">
                  Verifiable RAG & Gap Intelligence
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-400 opacity-70" viewBox="0 0 300 12" fill="none">
                    <path d="M1 11C50 3 150 3 299 11" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal max-w-lg">
                Search OpenAlex, Semantic Scholar, and SerpAPI Google Scholar. Ingest PDF paper collections with section-aware RAG indexing, compare literature side-by-side, and extract novel research gaps validated against counter-evidence.
              </p>

              {/* 4 Feature Badges Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-1.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">OpenAlex & SerpAPI</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">Real-time academic search & metadata</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-1.5">
                  <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Hybrid RRF Search</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">Vector + Keyword for better recall</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-1.5">
                  <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Section-Aware RAG</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">Structured indexing & smart retrieval</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-1.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">PyMuPDF Parsing</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">100% Page-Level Citations</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-1">
                <Link 
                  href="/dashboard" 
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-lg hover:opacity-95 transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Start Research Workspace <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/papers" 
                  className="px-8 py-3.5 rounded-2xl bg-white border-2 border-blue-200 text-slate-800 font-bold text-xs hover:border-blue-600 transition flex items-center gap-2 shadow-sm"
                >
                  <Search className="w-4 h-4 text-blue-600" /> Discover Papers
                </Link>
              </div>

              {/* Handwritten Annotation Bottom-Left */}
              <div className="pt-2 text-xs font-semibold text-blue-700 italic flex items-center gap-2">
                <span>Smarter Research</span>
                <span>→</span>
                <span className="underline decoration-blue-400">Deeper Insights</span>
                <span>→</span>
                <span>Greater Impact</span>
              </div>
            </div>

            {/* RIGHT COLUMN: DIAGRAM & AI ASSISTANT CARD WITH CONNECTING ARROWS */}
            <div className="lg:col-span-7 relative pt-2">

              {/* Handwritten Annotation Top-Right */}
              <div className="text-right mb-1 pr-6">
                <span className="text-xs font-bold text-blue-700 italic font-serif tracking-wide">
                  From Research Papers to Real Insights ⤵
                </span>
              </div>

              {/* Outer Diagram Card */}
              <div className="bg-white/95 border-2 border-blue-200/90 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
                
                {/* SVG CONNECTING ARROWS OVERLAY */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden md:block">
                  <defs>
                    <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3B82F6" />
                    </marker>
                    <marker id="arrow-purple" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#8B5CF6" />
                    </marker>
                  </defs>

                  {/* OpenAlex -> Central RAG */}
                  <path d="M 120 70 C 120 120, 230 110, 255 135" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="4 4" markerEnd="url(#arrow-purple)" />
                  
                  {/* Semantic Scholar -> Central RAG */}
                  <path d="M 260 70 L 260 125" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="4 4" markerEnd="url(#arrow-blue)" />

                  {/* Google Scholar -> Central RAG */}
                  <path d="M 400 70 C 400 120, 290 110, 265 135" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="4 4" markerEnd="url(#arrow-purple)" />

                  {/* Central RAG -> Right Assistant Card */}
                  <path d="M 305 160 L 375 160" fill="none" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrow-blue)" />

                  {/* Academic Papers PDF Stack -> UP into Central RAG */}
                  <path d="M 260 250 L 260 195" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="4 4" markerEnd="url(#arrow-purple)" />
                </svg>

                {/* Top 3 Provider Cards */}
                <div className="grid grid-cols-3 gap-4 relative z-20">
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl text-center shadow-sm hover:border-emerald-400 transition">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">OpenAlex</h5>
                    <p className="text-[10px] text-slate-500">Global research index</p>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-2xl text-center shadow-sm hover:border-blue-400 transition">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-1">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">Semantic Scholar</h5>
                    <p className="text-[10px] text-slate-500">AI literature search</p>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-2xl text-center shadow-sm hover:border-red-400 transition">
                    <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 font-black flex items-center justify-center mx-auto mb-1 text-xs">
                      G
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">Google Scholar</h5>
                    <p className="text-[10px] text-slate-500">Academic search engine</p>
                  </div>
                </div>

                {/* Main Middle Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-20">
                  
                  {/* Left 4 Steps Column */}
                  <div className="md:col-span-4 space-y-2 text-[11px]">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-50/80 border border-blue-100 shadow-sm">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">1</span>
                      <div>
                        <p className="font-bold text-slate-900">Search & Collect</p>
                        <p className="text-[9px] text-slate-500">Find relevant papers & metadata</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-50/80 border border-blue-100 shadow-sm">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">2</span>
                      <div>
                        <p className="font-bold text-slate-900">Parse & Index</p>
                        <p className="text-[9px] text-slate-500">Section parsing with PyMuPDF</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-50/80 border border-blue-100 shadow-sm">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">3</span>
                      <div>
                        <p className="font-bold text-slate-900">RAG Retrieval</p>
                        <p className="text-[9px] text-slate-500">Hybrid RRF (Vector + Keyword)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-50/80 border border-blue-100 shadow-sm">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">4</span>
                      <div>
                        <p className="font-bold text-slate-900">Analyze & Find Gaps</p>
                        <p className="text-[9px] text-slate-500">Compare & validate counter-evidence</p>
                      </div>
                    </div>
                  </div>

                  {/* Center RAG Circle & PDF Stack Column */}
                  <div className="md:col-span-3 flex flex-col items-center justify-center p-2 text-center">
                    {/* Glowing RAG Circle */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white font-black flex flex-col items-center justify-center shadow-2xl shadow-blue-500/30 border-4 border-blue-300 animate-pulse-glow">
                      <Brain className="w-8 h-8 text-white mb-0.5" />
                      <span className="text-[11px] font-extrabold">RAG</span>
                      <span className="text-[7px] text-blue-200 tracking-tighter uppercase">(Retrieval-Augmented)</span>
                    </div>

                    {/* PDF Stack Below */}
                    <div className="mt-4 flex flex-col items-center">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <div className="absolute top-0 left-0 w-9 h-11 bg-red-100 border border-red-300 rounded-md rotate-[-8deg] shadow-sm" />
                        <div className="absolute top-1 left-1 w-9 h-11 bg-white border border-slate-300 rounded-md rotate-[4deg] shadow-sm flex items-center justify-center">
                          <span className="text-[8px] font-bold text-red-600">pdf</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-600 font-bold mt-1">Academic Papers (PDF)</span>
                    </div>
                  </div>

                  {/* Right Side AI Research Assistant Card Column */}
                  <div className="md:col-span-5 bg-white border-2 border-blue-200 rounded-2xl p-4 shadow-xl shadow-blue-500/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm">
                        AI Research Assistant
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Validated Gap Found
                      </span>
                    </div>

                    {/* Query Search Bar with Solid Blue Circular Button */}
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-800 flex items-center justify-between gap-2 shadow-inner">
                      <span>What are the research gaps in transformer-based medical imaging segmentation?</span>
                      <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                        <Search className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* 4 Quick Filter Pills */}
                    <div className="grid grid-cols-2 gap-1 text-[9px] font-bold">
                      <span className="p-1 rounded bg-slate-100 text-slate-700 text-center flex items-center justify-center gap-1">📊 Side-by-Side Comparison</span>
                      <span className="p-1 rounded bg-slate-100 text-slate-700 text-center flex items-center justify-center gap-1">📑 Citations (Page-Level)</span>
                      <span className="p-1 rounded bg-slate-100 text-slate-700 text-center flex items-center justify-center gap-1">💡 Novel Research Gaps</span>
                      <span className="p-1 rounded bg-slate-100 text-slate-700 text-center flex items-center justify-center gap-1">🛡️ Counter-Evidence</span>
                    </div>

                    {/* Gap Result Card */}
                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] space-y-1">
                      <h5 className="font-bold text-slate-900">Limited Generalization in Cross-Domain Settings</h5>
                      <p className="text-[10px] text-slate-600 leading-relaxed">
                        Most studies focus on single-dataset evaluation. There is a clear lack of cross-domain validation for transformer models in medical imaging segmentation.
                      </p>
                      <a href="/workspace/demo-proj-1" className="text-[9px] font-bold text-blue-600 flex items-center gap-1 pt-1 hover:underline">
                        🔗 Source: IEEE TNNLS (Page 7) <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom 4 Value Cards Bar */}
              <div className="grid grid-cols-4 gap-3 mt-4 text-center">
                <div className="p-3 rounded-2xl bg-white border border-purple-100 shadow-sm flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <p className="text-xs font-bold text-slate-900">Verifiable Citations</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-sm flex items-center justify-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs font-bold text-slate-900">Find Real Research Gaps</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-sm flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <p className="text-xs font-bold text-slate-900">Faster Discovery</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-pink-100 shadow-sm flex items-center justify-center gap-2">
                  <Brain className="w-4 h-4 text-pink-600" />
                  <p className="text-xs font-bold text-slate-900">Smarter Decisions</p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 360-DEGREE CYBER ORBITAL SHOWCASE SECTION */}
        <PaperOrbitalShowcase />

        {/* 4-Step Visual Workflow */}
        <section id="how-it-works" className="py-24 px-8 max-w-6xl mx-auto text-center">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wider mb-4 inline-block">
            System Workflow
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-12">How the Platform Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Search & Upload", desc: "Discover papers via OpenAlex/SerpAPI or upload PDF research documents." },
              { step: "02", title: "PyMuPDF Ingestion", desc: "Extract sections (Abstract, Methods, Results, Limitations) with page tracking." },
              { step: "03", title: "Grounded RAG Chat", desc: "Ask questions with Reciprocal Rank Fusion & non-fabricated page citations." },
              { step: "04", title: "Gap Validation & Report", desc: "Synthesize cross-paper evidence matrix & export literature review reports." }
            ].map((st, i) => (
              <div key={i} className="glass-royal-card p-6 rounded-2xl text-left relative">
                <span className="text-3xl font-black text-blue-600 block mb-3">{st.step}</span>
                <h4 className="text-base font-bold text-slate-900 mb-2">{st.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Rich Royal Blue & Royal White Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-8 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 text-xs">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 font-bold flex items-center justify-center text-sm shadow-md">
                AI
              </div>
              <span className="text-lg font-bold text-white tracking-tight">ResearchGap</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-4">
              Full-stack AI Platform for paper discovery, PyMuPDF section parsing, grounded hybrid RAG, and candidate research gap analysis.
            </p>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-blue-300 font-semibold text-[10px]">
              Royal Blue & Royal White Design System
            </span>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4">Platform Pages</h4>
            <ul className="space-y-2.5 text-slate-400 font-medium">
              <li><Link href="/dashboard" className="hover:text-white transition">Research Dashboard</Link></li>
              <li><Link href="/papers" className="hover:text-white transition">Global Paper Discovery</Link></li>
              <li><Link href="/compare" className="hover:text-white transition">Paper Comparison Matrix</Link></li>
              <li><Link href="/reports" className="hover:text-white transition">Literature Reports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4">RAG & Engine Architecture</h4>
            <ul className="space-y-2.5 text-slate-400 font-medium">
              <li><span className="text-slate-300">embeddings:</span> BAAI/bge-small-en-v1.5</li>
              <li><span className="text-slate-300">lexical:</span> rank-bm25</li>
              <li><span className="text-slate-300">fusion:</span> Reciprocal Rank Fusion (RRF)</li>
              <li><span className="text-slate-300">analysis:</span> 9-Stage Gap Engine</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4">Academic Integrations</h4>
            <ul className="space-y-2.5 text-slate-400 font-medium">
              <li className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-blue-400" /> OpenAlex Open API</li>
              <li className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-blue-400" /> Semantic Scholar</li>
              <li className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-blue-400" /> SerpAPI Google Scholar</li>
              <li className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-blue-400" /> PyMuPDF Section Parser</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-800 text-center text-slate-500 text-[11px]">
          © 2026 AI Research Paper & Research Gap Finder. Designed for PhD Scholars, Postgraduate Researchers, and Academic Teams.
        </div>
      </footer>
    </div>
  );
}
