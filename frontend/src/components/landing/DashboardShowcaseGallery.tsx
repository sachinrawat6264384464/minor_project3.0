"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Network, 
  Search, 
  MessageSquareCode, 
  ShieldCheck, 
  Maximize2, 
  X, 
  ArrowRight,
  CheckCircle2,
  Terminal,
  Activity
} from "lucide-react";

interface DashboardModule {
  id: string;
  code: string;
  tabLabel: string;
  badge: string;
  title: string;
  route: string;
  routeUrl: string;
  tagline: string;
  description: string;
  imageSrc: string;
  footerTag: string;
  icon: any;
  capabilities: string[];
  metrics: { label: string; val: string }[];
}

const DASHBOARD_MODULES: DashboardModule[] = [
  {
    id: "graph",
    code: "GRAPH // 01",
    tabLabel: "Citation Knowledge Graph",
    badge: "ENTITIES & CLUSTERS",
    title: "Interactive Entity & Research Trends Graph",
    route: "/trends/demo-project",
    routeUrl: "https://researchgap.ai/trends/workspace",
    tagline: "Radial Force-Directed Citation & Methodology Network",
    description: "Visualizes deep relationships between multi-hop academic papers, extracted algorithms, and domain limitations. Features interactive radial clustering, entity inspectors, and cross-paper gap mapping.",
    imageSrc: "/images/dashboard_knowledge_graph.png",
    footerTag: "CITATION NET",
    icon: Network,
    capabilities: [
      "Real-time radial force layout connecting papers to methodologies",
      "Interactive Entity Inspector with connection centrality metrics",
      "Automated isolation of unexplored research gap clusters"
    ],
    metrics: [
      { label: "Graph Centrality", val: "High (Core)" },
      { label: "Entity Types", val: "Paper, Method, Gap" },
      { label: "Cluster Depth", val: "Multi-Hop" }
    ]
  },
  {
    id: "studio",
    code: "STUDIO // 02",
    tabLabel: "Scholar Literature Studio",
    badge: "HARVEST & INGESTION",
    title: "Scholar Literature Studio & RAG Preprocessor",
    route: "/scholar-studio",
    routeUrl: "https://researchgap.ai/scholar-studio",
    tagline: "Multi-Source Academic Pipeline (SerpAPI + PapersWithCode + Scopus)",
    description: "Search and batch-harvest scientific literature across Google Scholar, Elsevier Scopus, and open-source GitHub code repositories. Automatically generates structured DOI metadata and streams to vector database.",
    imageSrc: "/images/dashboard_scholar_studio.png",
    footerTag: "RAG HARVESTER",
    icon: Search,
    capabilities: [
      "Unified query streaming across SerpAPI, PapersWithCode & Scopus",
      "Automated open-access PDF resolver with 100% DOI deduplication",
      "Instant batch-indexing directly into isolated Neon pgvector workspaces"
    ],
    metrics: [
      { label: "Source Coverage", val: "90M+ Papers" },
      { label: "Resolution", val: "Direct PDF / DOI" },
      { label: "Vector Pipeline", val: "Auto-Embed" }
    ]
  },
  {
    id: "chat",
    code: "CHAT // 03",
    tabLabel: "Literature Q&A Assistant",
    badge: "GROUNDED RAG",
    title: "Zero-Hallucination Literature Q&A Assistant",
    route: "/chat/demo-project",
    routeUrl: "https://researchgap.ai/chat/workspace",
    tagline: "Hybrid BM25 + Dense Vector RAG with Verifiable Page Anchors",
    description: "Ask deep methodology questions across your indexed paper corpus. Answers are strictly constrained to retrieved passages with clickable page-level citation anchors, eliminating hallucinations.",
    imageSrc: "/images/dashboard_literature_chat.png",
    footerTag: "GROUNDED RAG",
    icon: MessageSquareCode,
    capabilities: [
      "Strict zero-hallucination prompt guardrails with fallback alerts",
      "Interactive expandable Citation Cards linking to exact PDF page",
      "Pre-configured prompts for methodology conflicts & trade-offs"
    ],
    metrics: [
      { label: "Citation Recall", val: "99.2% Verified" },
      { label: "Reranker", val: "RRF Fusion Top-5" },
      { label: "Embedding", val: "BGE 384d Dense" }
    ]
  },
  {
    id: "gaps",
    code: "GAPS // 04",
    tabLabel: "Research Gap Finder",
    badge: "EVIDENCE ENGINE",
    title: "Empirical Research Gap Finder & Validation",
    route: "/research-gaps/demo-project",
    routeUrl: "https://researchgap.ai/research-gaps/workspace",
    tagline: "Automated Limitation Extraction & Counter-Evidence Verification",
    description: "Analyzes indexed publications to extract explicit author-stated bottlenecks, classifying them into 4 archetypes with counter-evidence checks to ensure proposed gaps have not already been solved.",
    imageSrc: "/images/dashboard_gap_validator.png",
    footerTag: "EVIDENCE ENGINE",
    icon: ShieldCheck,
    capabilities: [
      "4-Archetype taxonomy classification (Generalization, Dataset, Baseline)",
      "Automated counter-queries against recent publications",
      "Formulation of concrete PhD-level validation experiments"
    ],
    metrics: [
      { label: "Confidence Score", val: "88% High Strength" },
      { label: "Verification", val: "Counter-Evidence" },
      { label: "Synthesis", val: "IEEE LaTeX Export" }
    ]
  }
];

export default function DashboardShowcaseGallery() {
  const [activeTab, setActiveTab] = useState<string>("graph");
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const activeModule = DASHBOARD_MODULES.find(m => m.id === activeTab) || DASHBOARD_MODULES[0];

  return (
    <div className="relative w-full py-20 px-4 sm:px-6 md:px-8 text-white select-none bg-black">
      
      {/* Blueprint grid accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        
        {/* Section Header (Pure Black & White Brutalist HUD) */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-black text-[11px] font-mono font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(255,255,255,0.7)]">
            <Activity className="w-3.5 h-3.5 fill-black" />
            LIVE WORKSPACE SUITE // 4 CORE ENGINES
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight font-sans">
            WORKSPACE <span className="underline decoration-white decoration-4 underline-offset-8">DASHBOARD MODULES</span>
          </h2>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-mono">
            Direct production-grade interfaces for literature ingestion, knowledge graph intelligence, grounded RAG verification, and empirical gap discovery.
          </p>
        </div>

        {/* Dynamic Selector Tabs (Sci-Fi Black & White HUD Pills) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {DASHBOARD_MODULES.map((mod) => {
            const Icon = mod.icon;
            const isActive = mod.id === activeTab;

            return (
              <button
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                className={`relative px-4 sm:px-5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 border ${
                  isActive
                    ? "bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.5)] scale-[1.02]"
                    : "bg-black text-neutral-300 border-white/25 hover:border-white hover:text-white"
                }`}
              >
                {/* Micro corner notches on buttons */}
                <span className={`absolute top-0 left-0 w-1.5 h-1.5 border-t border-l ${isActive ? "border-black" : "border-white"}`} />
                <span className={`absolute top-0 right-0 w-1.5 h-1.5 border-t border-r ${isActive ? "border-black" : "border-white"}`} />
                <span className={`absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l ${isActive ? "border-black" : "border-white"}`} />
                <span className={`absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r ${isActive ? "border-black" : "border-white"}`} />

                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-black" : "text-white"}`} />
                <span>{mod.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
         * MAIN SPOTLIGHT STAGE (Cyberpunk HUD Corner-Bracket Mega Frame)
         * ========================================================================= */}
        <div className="relative rounded-xl bg-black border border-white/35 p-5 sm:p-7 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.95)]">
          
          {/* 4 Outer Corner Sci-Fi HUD Reticle Brackets (Like Image 1) */}
          <span className="absolute -top-[2px] -left-[2px] w-5 h-5 border-t-2 border-l-2 border-white rounded-tl-[4px] pointer-events-none" />
          <span className="absolute -top-[2px] -right-[2px] w-5 h-5 border-t-2 border-r-2 border-white rounded-tr-[4px] pointer-events-none" />
          <span className="absolute -bottom-[2px] -left-[2px] w-5 h-5 border-b-2 border-l-2 border-white rounded-bl-[4px] pointer-events-none" />
          <span className="absolute -bottom-[2px] -right-[2px] w-5 h-5 border-b-2 border-r-2 border-white rounded-br-[4px] pointer-events-none" />

          {/* Side Tick Marks on Left & Right Midpoints */}
          <span className="absolute top-1/2 -left-[8px] -translate-y-1/2 w-3 h-[2px] bg-white pointer-events-none" />
          <span className="absolute top-1/2 -right-[8px] -translate-y-1/2 w-3 h-[2px] bg-white pointer-events-none" />

          {/* Top HUD Telemetry Status Strip */}
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white border-b border-white/15 pb-3 mb-6">
            <span className="font-extrabold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              SYSTEM CORE // {activeModule.code}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-neutral-400">STATUS:</span>
              <span className="px-2 py-0.5 rounded bg-white text-black font-extrabold text-[9px]">
                ONLINE ◼
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 7 Columns: Workstation Frame with Corner Brackets */}
            <div className="lg:col-span-7 space-y-3">
              
              {/* Image Frame Container with HUD Brackets */}
              <div className="relative rounded-lg overflow-hidden border border-white/40 bg-black shadow-2xl group">
                
                {/* Inner corner brackets */}
                <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white z-20 pointer-events-none" />
                <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white z-20 pointer-events-none" />
                <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white z-20 pointer-events-none" />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white z-20 pointer-events-none" />

                {/* Top Window Bar */}
                <div className="px-3.5 py-2 bg-black border-b border-white/20 flex items-center justify-between text-xs font-mono">
                  
                  {/* Traffic Light Dots in Black & White Minimal Style */}
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white/40 inline-block" />
                    <span className="w-2 h-2 rounded-full bg-white/40 inline-block" />
                    <span className="w-2 h-2 rounded-full bg-white inline-block" />
                  </div>

                  {/* URL Bar */}
                  <div className="px-3 py-0.5 bg-white/10 rounded text-[10px] text-neutral-300 border border-white/15 font-mono max-w-[240px] truncate">
                    <span className="text-white font-bold">rg://</span>
                    <span className="truncate">{activeModule.routeUrl.replace("https://", "")}</span>
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={() => setFullscreenImage(activeModule.imageSrc)}
                    className="p-1 rounded bg-white text-black hover:bg-neutral-200 transition"
                    title="Inspect Fullscreen"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Compact, High-Contrast Image Container */}
                <div 
                  className="relative aspect-[16/9.5] w-full overflow-hidden bg-black cursor-pointer"
                  onClick={() => setFullscreenImage(activeModule.imageSrc)}
                >
                  <Image
                    src={activeModule.imageSrc}
                    alt={activeModule.title}
                    fill
                    className="object-contain object-top transition-transform duration-500 group-hover:scale-[1.01]"
                    priority
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded bg-white text-black font-mono font-bold text-xs flex items-center gap-2 shadow-2xl">
                      <Maximize2 className="w-3.5 h-3.5" /> Fullscreen Inspection
                    </span>
                  </div>
                </div>

                {/* Bottom Frame Status */}
                <div className="px-3.5 py-1.5 bg-black border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span className="flex items-center gap-1.5 text-white font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    WORKSPACE MODULE ACTIVE
                  </span>
                  {/* Telemetry Bar like Image 1 */}
                  <div className="flex items-center gap-1">
                    <span className="w-12 h-[2px] bg-white inline-block" />
                    <span className="w-8 h-[2px] border-b border-dotted border-white/60 inline-block" />
                  </div>
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Black & White HUD Details */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Badge & Title */}
              <div>
                <span className="px-2.5 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase tracking-wider bg-white text-black inline-block mb-2">
                  {activeModule.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-sans leading-tight">
                  {activeModule.title}
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  {activeModule.tagline}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                {activeModule.description}
              </p>

              {/* Verified Capabilities Checklist */}
              <div className="p-3.5 bg-black border border-white/20 rounded-lg space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Engine Architecture Capabilities:
                </span>
                {activeModule.capabilities.map((cap, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-white font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>

              {/* Architecture Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                {activeModule.metrics.map((m, idx) => (
                  <div key={idx} className="p-2 bg-black border border-white/20 rounded">
                    <span className="text-[9px] text-neutral-400 uppercase tracking-wider block">{m.label}</span>
                    <span className="text-xs font-bold text-white mt-0.5 block truncate">{m.val}</span>
                  </div>
                ))}
              </div>

              {/* Direct Launch Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={activeModule.route}
                  className="px-5 py-2.5 rounded bg-white hover:bg-neutral-200 text-black font-extrabold text-xs font-mono uppercase tracking-wider transition shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-center gap-2"
                >
                  Launch Workspace <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => setFullscreenImage(activeModule.imageSrc)}
                  className="px-4 py-2.5 rounded bg-black hover:bg-white/10 text-white font-mono text-xs transition border border-white/30 flex items-center gap-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" /> Fullscreen
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Telemetry Bar */}
          <div className="mt-6 pt-3 border-t border-white/15 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-wider text-neutral-400">
            <span>RESEARCHGAP.AI // AUTONOMOUS KNOWLEDGE CORE</span>
            <div className="flex items-center gap-1">
              <span className="w-16 h-[2px] bg-white inline-block" />
              <span className="w-10 h-[2px] border-b border-dotted border-white/60 inline-block" />
            </div>
          </div>

        </div>

        {/* =========================================================================
         * 4 THUMBNAIL CARDS: EXACT CYBERPUNK HUD BORDER DESIGN (FROM USER IMAGE 1)
         * ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DASHBOARD_MODULES.map((mod) => {
            const isSelected = mod.id === activeTab;

            return (
              <div
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                className={`relative bg-black rounded-lg border p-3.5 sm:p-4 cursor-pointer transition-all select-none ${
                  isSelected
                    ? "border-white shadow-[0_0_25px_rgba(255,255,255,0.4)] scale-[1.02]"
                    : "border-white/30 hover:border-white/70"
                }`}
              >
                {/* 4 Corner Sci-Fi HUD Notches / Reticle Brackets (Like Image 1) */}
                <span className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-white rounded-tl-[3px] pointer-events-none" />
                <span className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t-2 border-r-2 border-white rounded-tr-[3px] pointer-events-none" />
                <span className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-white rounded-bl-[3px] pointer-events-none" />
                <span className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-white rounded-br-[3px] pointer-events-none" />

                {/* Side Horizontal Tick Marks (Like Image 1) */}
                <span className="absolute top-1/2 -left-[5px] -translate-y-1/2 w-1.5 h-[2px] bg-white pointer-events-none" />
                <span className="absolute top-1/2 -right-[5px] -translate-y-1/2 w-1.5 h-[2px] bg-white pointer-events-none" />

                {/* Card Top Row (Header Left & Header Right like Image 1) */}
                <div className="flex items-center justify-between font-mono text-[10px] text-white tracking-widest uppercase mb-2">
                  <span className="font-extrabold">{mod.code.split(" // ")[0]}</span>
                  <span className="text-[9px] text-neutral-300 font-bold">
                    ONLINE ◼
                  </span>
                </div>

                {/* Compact Thumbnail Frame */}
                <div className="relative aspect-[16/10] w-full rounded overflow-hidden bg-black mb-2.5 border border-white/20">
                  <Image
                    src={mod.imageSrc}
                    alt={mod.title}
                    fill
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>

                {/* Module Title */}
                <h4 className="text-xs font-bold text-white font-sans truncate">{mod.tabLabel}</h4>

                {/* Card Bottom Row (Footer Left & Telemetry Bar like Image 1) */}
                <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                  <span className="font-bold text-neutral-300">{mod.footerTag}</span>
                  {/* Telemetry Progress Bar from Image 1 */}
                  <div className="flex items-center gap-1">
                    <span className="w-7 h-[2px] bg-white inline-block" />
                    <span className="w-5 h-[2px] border-b border-dotted border-white/50 inline-block" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Fullscreen Modal in Pure Black & White */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
          onClick={() => setFullscreenImage(null)}
        >
          <div 
            className="relative max-w-6xl w-full max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute -top-12 right-0 p-2.5 rounded bg-white text-black hover:bg-neutral-200 transition font-bold"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full h-[80vh] rounded-lg overflow-hidden border-2 border-white shadow-[0_0_80px_rgba(255,255,255,0.3)] bg-black">
              {/* Corner brackets on modal */}
              <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white z-20 pointer-events-none" />
              <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white z-20 pointer-events-none" />
              <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white z-20 pointer-events-none" />
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white z-20 pointer-events-none" />

              <Image
                src={fullscreenImage}
                alt="Fullscreen Dashboard Preview"
                fill
                className="object-contain"
                sizes="95vw"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
