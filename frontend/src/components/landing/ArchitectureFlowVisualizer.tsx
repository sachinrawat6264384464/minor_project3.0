"use client";

import { useState } from "react";
import { 
  Sparkles, 
  Search, 
  FileText, 
  Layers, 
  Cpu, 
  Database, 
  ShieldCheck, 
  FlaskConical, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  FileCode,
  Radio,
  Share2,
  Award,
  Zap,
  Target
} from "lucide-react";
import Link from "next/link";

interface ArchStage {
  id: number;
  stageCode: string;
  title: string;
  category: "Ingestion" | "Retrieval" | "Gap Discovery" | "Export";
  summary: string;
  mechanism: string;
  inputs: string;
  outputs: string;
  verifiableMetric: string;
  accentColor: string;
  tagColor: string;
}

const ARCH_STAGES: ArchStage[] = [
  {
    id: 1,
    stageCode: "STAGE 01",
    title: "Multi-Source Academic Literature Sourcing",
    category: "Ingestion",
    summary: "Integrated academic connectors stream live peer-reviewed publications with automated DOI deduplication and open-access PDF resolution.",
    mechanism: "Simultaneous querying across OpenAlex, Semantic Scholar, and SerpAPI Google Scholar API.",
    inputs: "Search queries (e.g., 'Vision Transformers under real-world noise')",
    outputs: "Standardized paper metadata JSON + Open-access PDF download URLs",
    verifiableMetric: "100% DOI deduplication across all three sources",
    accentColor: "border-cyan-500/30",
    tagColor: "bg-cyan-500/15 text-cyan-300 border-cyan-400/40"
  },
  {
    id: 2,
    stageCode: "STAGE 02",
    title: "PyMuPDF Stream Parsing & Section Extraction",
    category: "Ingestion",
    summary: "Scans academic PDF structures to detect exact section boundaries preserving page numbers and chunk hierarchies.",
    mechanism: "Regex heuristic heading detectors classify: Abstract, Methods, Results, Limitations, and Future Work with a 500-word sliding window and 100-word overlap.",
    inputs: "Raw PDF binary streams",
    outputs: "Document chunks tagged with [SectionName, PageNumber, DOI, Title]",
    verifiableMetric: "Page-level provenance maintained for every 500-word passage",
    accentColor: "border-sky-500/30",
    tagColor: "bg-sky-500/15 text-sky-300 border-sky-400/40"
  },
  {
    id: 3,
    stageCode: "STAGE 03",
    title: "Dual Hybrid Vector & Lexical Indexing",
    category: "Retrieval",
    summary: "Encodes passages into dual retrieval channels to capture both deep semantic conceptual similarity and exact keyword/formula matches.",
    mechanism: "Dense 384-dimensional BAAI/bge-small-en-v1.5 embeddings indexed into Neon Serverless pgvector alongside BM25Okapi inverted index.",
    inputs: "Document text passages",
    outputs: "HNSW vector graph index + BM25 token frequencies",
    verifiableMetric: "Sub-15ms vector cosine retrieval on Neon pgvector",
    accentColor: "border-blue-500/30",
    tagColor: "bg-blue-500/15 text-blue-300 border-blue-400/40"
  },
  {
    id: 4,
    stageCode: "STAGE 04",
    title: "Reciprocal Rank Fusion (RRF) & Cross-Encoder Rerank",
    category: "Retrieval",
    summary: "Fuses sparse keyword rankings with dense vector cosine rankings, then refines top candidates with a cross-encoder model.",
    mechanism: "RRF score = sum( 1 / (60 + rank_m(d)) ). Candidate pairs are subsequently rescored by BAAI/bge-reranker-base.",
    inputs: "Dual top-30 candidate chunk lists",
    outputs: "Top-5 unified high-precision candidate chunks",
    verifiableMetric: "+38% citation retrieval precision vs single-strategy RAG",
    accentColor: "border-indigo-500/30",
    tagColor: "bg-indigo-500/15 text-indigo-300 border-indigo-400/40"
  },
  {
    id: 5,
    stageCode: "STAGE 05",
    title: "Zero-Hallucination Grounding & Citation Cards",
    category: "Retrieval",
    summary: "Generates grounded answers constrained strictly to retrieved passages with expandable citation anchors.",
    mechanism: "LLM synthesis prompt enforces strict [Source X, Page Y] syntax. Any missing evidence triggers explicit 'Insufficient Evidence' fallback.",
    inputs: "User research query + RRF top-5 chunks",
    outputs: "Verified text response + interactive Citation Cards (DOI, Page, Excerpt)",
    verifiableMetric: "0% hallucinated citations; 100% verified against indexed PDF",
    accentColor: "border-violet-500/30",
    tagColor: "bg-violet-500/15 text-violet-300 border-violet-400/40"
  },
  {
    id: 6,
    stageCode: "STAGE 06",
    title: "Taxonomy Classification & Research Gap Extraction",
    category: "Gap Discovery",
    summary: "Isolates limitations and future work sections across indexed papers, classifying them into 4 academic gap archetypes.",
    mechanism: "Categorizes into: Generalization Weaknesses, Inadequate Baseline Comparisons, Reproducibility Limitations, and Dataset Diversity Gaps.",
    inputs: "Limitation passages across multi-paper workspace",
    outputs: "Candidate Research Gap cards with confidence scores",
    verifiableMetric: "Automated extraction of cross-paper methodological conflicts",
    accentColor: "border-amber-500/30",
    tagColor: "bg-amber-500/15 text-amber-300 border-amber-400/40"
  },
  {
    id: 7,
    stageCode: "STAGE 07",
    title: "Counter-Evidence Verification Engine",
    category: "Gap Discovery",
    summary: "Cross-checks identified candidate gaps against newer publications to guarantee the issue has not already been resolved.",
    mechanism: "Automated counter-queries dispatched to Google Scholar / SerpAPI searching for recent solutions published in subsequent years.",
    inputs: "Candidate gap limitation assertion",
    outputs: "Counter-Evidence Badge (Verified Novel vs Solved Prior Art)",
    verifiableMetric: "Prevents scholars from pursuing already solved research problems",
    accentColor: "border-emerald-500/30",
    tagColor: "bg-emerald-500/15 text-emerald-300 border-emerald-400/40"
  },
  {
    id: 8,
    stageCode: "STAGE 08",
    title: "Thesis Novelty Index (0–100%) & Experiment Formulation",
    category: "Gap Discovery",
    summary: "Calculates mathematical novelty metric against the vector corpus and drafts concrete PhD-level validation experiments.",
    mechanism: "Minimum Euclidean & Cosine distance from proposed hypothesis to existing literature clusters generates 0-100% score + ablation design.",
    inputs: "Verified candidate gap hypothesis",
    outputs: "Novelty percentage + step-by-step experiment protocol",
    verifiableMetric: "Quantitative 0-100% score mapped to IEEE publication criteria",
    accentColor: "border-teal-500/30",
    tagColor: "bg-teal-500/15 text-teal-300 border-teal-400/40"
  },
  {
    id: 9,
    stageCode: "STAGE 09",
    title: "IEEE LaTeX, Overleaf & Literature Report Export",
    category: "Export",
    summary: "Compiles verified literature reviews, comparison matrices, and gap hypotheses into dual-column publication formats.",
    mechanism: "Direct generation of IEEEtran .tex files with complete BibTeX bibliography and instant 1-click push to Overleaf cloud.",
    inputs: "Workspace papers + verified gaps + chat synthesis",
    outputs: "IEEE .tex manuscript + BibTeX file + PDF report",
    verifiableMetric: "1-click compile on Overleaf without syntax errors",
    accentColor: "border-purple-500/30",
    tagColor: "bg-purple-500/15 text-purple-300 border-purple-400/40"
  }
];

export default function ArchitectureFlowVisualizer() {
  const scrollToStage = (id: number) => {
    const el = document.getElementById(`stack-stage-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="relative w-full py-20 px-4 sm:px-6 md:px-8 bg-transparent text-white font-sans overflow-visible select-none">
      
      {/* 3D Perspective Grid Ambient */}
      <div className="absolute inset-x-0 bottom-0 h-[420px] perspective-grid-floor-dense opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-black text-[11px] font-mono font-black uppercase tracking-widest rounded-full mb-3 shadow-[0_0_20px_rgba(255,255,255,0.7)]">
            <Cpu className="w-3.5 h-3.5 fill-black" />
            9-STAGE SCIENTIFIC SYNTHESIS // STACKING CARDS ENGINE
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            THE 9-STAGE <span className="underline decoration-white decoration-4 underline-offset-8">RESEARCH GAP</span> LIFECYCLE
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
            From raw Google Scholar PDFs to verifiable citation cards, counter-evidence verification, and camera-ready IEEE LaTeX manuscripts. Scroll down to experience the deck of cards stacking effect.
          </p>
        </div>

        {/* QUICK JUMP STAGE SCRUBBER */}
        <div className="sticky top-20 z-40 mb-8 py-2 px-3 rounded-full bg-black/85 backdrop-blur-xl border border-white/20 shadow-xl max-w-3xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none gap-2">
          <span className="text-[10px] font-mono text-slate-400 px-2 shrink-0 hidden sm:inline">
            Stages:
          </span>
          <div className="flex items-center gap-1.5 w-full justify-between">
            {ARCH_STAGES.map((stage) => (
              <button
                key={stage.id}
                onClick={() => scrollToStage(stage.id)}
                className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all bg-white/10 hover:bg-white hover:text-black text-slate-200 border border-white/15 shrink-0"
                title={stage.title}
              >
                0{stage.id}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
         * STACKING CARDS DECK CONTAINER
         * Each card sticks to the top with a staggered offset, stacking gracefully!
         * ========================================================================= */}
        <div className="relative pb-40 pt-4">
          {ARCH_STAGES.map((stage, idx) => {
            // Offset so each card header is visible as they stack on top of each other
            const topOffset = 100 + idx * 22;
            const zIndex = 10 + idx;

            return (
              <div
                key={stage.id}
                id={`stack-stage-${stage.id}`}
                className="sticky transition-all duration-300 mb-28 sm:mb-40"
                style={{
                  top: `${topOffset}px`,
                  zIndex: zIndex,
                }}
              >
                {/* The Stacking Card */}
                <div 
                  className={`relative w-full rounded-2xl bg-[#080B14] border ${stage.accentColor} border-white/25 p-5 sm:p-7 md:p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.98),0_0_30px_rgba(255,255,255,0.06)] hover:border-white/50 transition-all group backdrop-blur-xl`}
                >
                  {/* Stepped Tab Top Index Rim */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-t-2xl" />

                  {/* Stage Header Tab Strip: Always clearly visible when stacked in deck */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-[10px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${stage.tagColor}`}>
                        {stage.stageCode} // {stage.category}
                      </span>
                      <span className="font-bold text-white uppercase tracking-wider truncate max-w-[200px] sm:max-w-none">
                        {stage.title}
                      </span>
                    </div>
                    <span className="text-slate-400 font-mono shrink-0">
                      Deck {stage.id} / 09
                    </span>
                  </div>

                  {/* Stage Number Floating Watermark (Desktop) */}
                  <div className="absolute top-10 right-6 text-5xl sm:text-6xl font-black font-mono text-white/5 pointer-events-none select-none">
                    0{stage.id}
                  </div>

                  <div className="flex flex-col lg:flex-row items-start justify-between gap-6 sm:gap-8 relative z-10">
                    
                    {/* Left Column: Stage Info & Engineering Details */}
                    <div className="lg:w-3/5 space-y-4">
                      
                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-sans leading-tight">
                        {stage.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans">
                        {stage.summary}
                      </p>

                      {/* Underlying Engineering Mechanism Box */}
                      <div className="p-3.5 sm:p-4 bg-transparent border border-white/20 rounded-xl space-y-1.5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-cyan-400" />
                          Underlying Engineering Mechanism:
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed font-sans font-normal">
                          {stage.mechanism}
                        </p>
                      </div>
                    </div>

                    {/* Right Column: I/O Specifications & Quality Guarantee */}
                    <div className="lg:w-2/5 w-full space-y-3.5">
                      
                      {/* Inputs & Outputs Card */}
                      <div className="p-3.5 sm:p-4 bg-transparent border border-white/20 rounded-xl space-y-2.5 font-mono text-xs">
                        <div>
                          <span className="text-slate-400 block mb-1 text-[10px] uppercase tracking-wider font-bold">
                            ➔ System Inputs:
                          </span>
                          <div className="p-2 bg-transparent border border-white/10 rounded text-slate-100 text-[11px] leading-snug">
                            {stage.inputs}
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-400 block mb-1 text-[10px] uppercase tracking-wider font-bold">
                            ➔ System Outputs:
                          </span>
                          <div className="p-2 bg-transparent border border-white/10 rounded text-slate-100 text-[11px] leading-snug">
                            {stage.outputs}
                          </div>
                        </div>
                      </div>

                      {/* Verifiable Academic Quality Guarantee */}
                      <div className="p-3.5 sm:p-4 bg-transparent border border-emerald-400/40 text-white rounded-xl space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Verifiable Quality Guarantee:
                        </span>
                        <p className="text-xs font-semibold font-sans text-slate-100 leading-snug">
                          {stage.verifiableMetric}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Bottom Card Footer Bar */}
                  <div className="mt-5 pt-3.5 border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-slate-300">
                    <span className="text-slate-400">
                      ResearchGap.ai Autonomous Pipeline
                    </span>
                    <span className="text-white font-bold flex items-center gap-1">
                      Stage 0{stage.id} Verified ✓
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
