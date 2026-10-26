"use client";

import { useState } from "react";
import { 
  Layers, 
  Cpu, 
  Database, 
  Server, 
  Globe, 
  Sparkles, 
  Search, 
  MessageSquare, 
  FileText, 
  Key, 
  ArrowDown, 
  ArrowRight,
  CheckCircle2, 
  Play, 
  Pause, 
  Filter, 
  FileCode,
  Zap,
  Activity
} from "lucide-react";

interface NodeDetail {
  id: string;
  tier: string;
  title: string;
  subtitle: string;
  protocol: string;
  tech: string[];
  inputs: string;
  outputs: string;
  description: string;
}

export default function HighLevelSystemArchitecture3D() {
  const [isLaserActive, setIsLaserActive] = useState<boolean>(true);
  const [selectedTierFilter, setSelectedTierFilter] = useState<"ALL" | "TIER_1" | "TIER_2" | "TIER_3" | "TIER_4" | "TIER_5">("ALL");
  const [activePipeline, setActivePipeline] = useState<"ALL" | "INGEST" | "RAG" | "GAPS">("ALL");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("PIPELINE_RAG");

  const nodeDetails: Record<string, NodeDetail> = {
    TIER_CLIENT: {
      id: "TIER_CLIENT",
      tier: "Tier 1: Client Presentation Layer",
      title: "Scholar Web Application",
      subtitle: "Next.js 15 App Router • React 19 • Tailwind CSS",
      protocol: "HTTPS / REST API + JWT Bearer",
      tech: ["Next.js 15", "React 19", "Tailwind CSS", "Framer Motion", "Zustand"],
      inputs: "Academic search keywords, DOIs, PDF uploads, research chat queries",
      outputs: "Interactive gap cards, expandable page-level citations, IEEE LaTeX exports",
      description: "Researcher-facing portal containing Scholar Studio (/scholar-studio), Literature Discovery (/papers), Grounded Chat (/chat/[id]), 9-Stage Gap Engine (/research-gaps/[id]), and Side-by-Side Comparison Matrix (/compare)."
    },
    TIER_GATEWAY: {
      id: "TIER_GATEWAY",
      tier: "Tier 2: API Gateway & Security",
      title: "FastAPI Application Controller",
      subtitle: "FastAPI :8000 • Uvicorn ASGI • Python 3.12",
      protocol: "OAuth2 Password Flow / JWT Bearer",
      tech: ["FastAPI 0.111", "OAuth2 JWT", "Pydantic v2", "bcrypt", "BackgroundTasks Queue"],
      inputs: "Authenticated HTTP Requests with Bearer token & Pydantic envelopes",
      outputs: "Validated JSON payloads dispatched to asynchronous background worker queues",
      description: "Central entrypoint managing OAuth2 authentication, workspace-level tenant isolation, rate limiting, and spawning non-blocking background workers for PDF parsing and RAG indexing."
    },
    PIPELINE_INGEST: {
      id: "PIPELINE_INGEST",
      tier: "Tier 3: Pipeline 1 (Ingestion)",
      title: "PyMuPDF Literature Ingestion Engine",
      subtitle: "500w Sliding Windows with 100w Overlap • SHA-256",
      protocol: "Binary PDF Stream Extraction",
      tech: ["PyMuPDF (fitz)", "SHA-256 Hasher", "Regex Section Classifier", "boto3 AWS S3"],
      inputs: "Raw academic PDF streams from Google Scholar or local uploads",
      outputs: "Normalized text passages with exact 1-indexed page numbers, section tags, and SHA-256 hash",
      description: "High-throughput layout stream parsing detecting Abstract, Methodology, Limitations, and Future Work headings, preserving exact 1-indexed page citations and DOI links."
    },
    PIPELINE_RAG: {
      id: "PIPELINE_RAG",
      tier: "Tier 3: Pipeline 2 (Hybrid RAG)",
      title: "Multi-Strategy Dual-Path Hybrid RAG",
      subtitle: "Dense BGE 384d + Sparse BM25Okapi + RRF (k=60)",
      protocol: "Reciprocal Rank Fusion + Cross-Encoder Reranking",
      tech: ["BAAI/bge-small-en-v1.5", "rank_bm25 (BM25Okapi)", "RRF (k=60)", "BAAI/bge-reranker-base"],
      inputs: "Research questions & hypothesis validation prompts",
      outputs: "Top-k passages with DOI, exact page number, and verbatim excerpt quote",
      description: "Simultaneous Dense Cosine search in pgvector and Sparse keyword matching via BM25Okapi. Reciprocal Rank Fusion (k=60) merges results, and BGE Cross-Encoder reranks for strict zero-hallucination citations."
    },
    PIPELINE_GAPS: {
      id: "PIPELINE_GAPS",
      tier: "Tier 3: Pipeline 3 (Gap Discovery)",
      title: "9-Stage Research Gap & Counter-Evidence Engine",
      subtitle: "Autonomous 4-Way Taxonomy Classification & Experiment Protocols",
      protocol: "Structured JSON Prompting + OpenAI API",
      tech: ["Autonomous Taxonomy Classifier", "SerpAPI Counter-Query", "OpenAI gpt-4o-mini", "Experiment Protocol Synthesizer"],
      inputs: "Isolated Limitations & Future Work sections across project corpus",
      outputs: "Candidate gaps, confidence scores, counter-evidence badges, and experiment designs",
      description: "Automates 9 scientific stages: targeted limitation extraction, taxonomy categorization (Generalization, Baselines, Reproducibility, Methodological), counter-evidence verification against newer papers, and actionable grant experiment protocols."
    },
    TIER_STORAGE: {
      id: "TIER_STORAGE",
      tier: "Tier 4: Cloud Persistence Tier",
      title: "Neon Serverless PostgreSQL 16 & pgvector",
      subtitle: "13 Relational Tables • 384d HNSW Vectors • S3 Storage",
      protocol: "PostgreSQL Wire Protocol (port 5432) + S3 REST",
      tech: ["Neon PostgreSQL 16", "pgvector Extension", "SQLAlchemy 2.0", "AWS S3 (boto3)"],
      inputs: "13 relational entity tables, 384-dimensional dense vectors, raw PDF binaries",
      outputs: "Sub-12ms vector cosine distance query results and transactional entities",
      description: "Stores Users, Projects, Papers, Sections, Chunks, Conversations, Gaps, and Evidence with strict foreign key cascading and sub-12ms HNSW vector distance lookups."
    },
    TIER_EXTERNAL: {
      id: "TIER_EXTERNAL",
      tier: "Tier 5: External AI & Academic Connectors",
      title: "Live Academic Web & Generative AI",
      subtitle: "SerpAPI (Scholar) • OpenAlex • Semantic Scholar • OpenAI",
      protocol: "Asynchronous HTTPS REST APIs",
      tech: ["SerpAPI (Google Scholar)", "OpenAlex REST", "Semantic Scholar Graph API", "OpenAI gpt-4o-mini"],
      inputs: "Academic search queries, paper DOIs, structured LLM prompt completions",
      outputs: "Live publication metadata, citation velocity, and grounded reasoning outputs",
      description: "Direct real-time integration with Google Scholar via SerpAPI, open-access DOI resolution via OpenAlex, and generative reasoning via OpenAI gpt-4o-mini."
    }
  };

  const selectedNode = nodeDetails[selectedNodeId] || nodeDetails["PIPELINE_RAG"];

  // Dynamic filter visibility helpers
  const isTier1InFocus = selectedTierFilter === "ALL" || selectedTierFilter === "TIER_1";
  const isTier2InFocus = selectedTierFilter === "ALL" || selectedTierFilter === "TIER_2";
  const isTier3InFocus = selectedTierFilter === "ALL" || selectedTierFilter === "TIER_3";
  const isTier4InFocus = selectedTierFilter === "ALL" || selectedTierFilter === "TIER_4";
  const isTier5InFocus = selectedTierFilter === "ALL" || selectedTierFilter === "TIER_5";

  return (
    <div className="relative w-full py-16 px-4 sm:px-6 lg:px-8 bg-transparent text-white overflow-hidden">
      {/* Component Styles for 60fps GPU-accelerated Flow Animations */}
      <style>{`
        @keyframes flowPacket {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(260%);
            opacity: 0;
          }
        }
        @keyframes flowPacketStaggered {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: translateY(260%);
            opacity: 0;
          }
        }
        @keyframes glowPulseWhite {
          0%, 100% {
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.12), inset 0 0 10px rgba(255, 255, 255, 0.05);
          }
          50% {
            box-shadow: 0 0 28px rgba(255, 255, 255, 0.28), inset 0 0 15px rgba(255, 255, 255, 0.1);
          }
        }
        @keyframes dashMove {
          to {
            stroke-dashoffset: -40;
          }
        }
        .animate-flow-packet {
          animation: flowPacket 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-flow-packet-delayed {
          animation: flowPacketStaggered 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.9s;
        }
        .animate-glow-white {
          animation: glowPulseWhite 3s ease-in-out infinite;
        }
        .animate-dash-stream {
          stroke-dasharray: 6 6;
          animation: dashMove 1.2s linear infinite;
        }
      `}</style>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-transparent border border-white/30 text-white text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 hover:border-white/60">
            <Activity className="w-3.5 h-3.5 text-white animate-pulse" />
            HIGH-LEVEL SYSTEM ARCHITECTURE & FLOW DIAGRAM
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            END-TO-END <span className="text-white underline decoration-white decoration-4 underline-offset-8">SYSTEM ARCHITECTURE</span>
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
            Clean 5-tier architectural flow mapping every component from scholar search and PyMuPDF section extraction, through dual-path Hybrid RAG, to 9-stage gap discovery and cloud persistence.
          </p>

          {/* DUAL FILTERS: TIER-WISE + PIPELINE FLOW */}
          <div className="flex flex-col items-center justify-center gap-3 mt-6">
            {/* Top Row: Flow Animation Toggle + Tier Filter Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setIsLaserActive(!isLaserActive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase flex items-center gap-2 border transition-all duration-300 ${
                  isLaserActive 
                    ? "bg-white text-black border-white shadow-[0_0_16px_rgba(255,255,255,0.4)]" 
                    : "bg-transparent border-white/20 text-neutral-300 hover:text-white hover:border-white/40"
                }`}
              >
                {isLaserActive ? <Pause className="w-3 h-3 text-black" /> : <Play className="w-3 h-3 text-white" />}
                {isLaserActive ? "Flow Streams: Active" : "Flow Streams: Paused"}
              </button>

              <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-transparent border border-white/25 text-xs shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <span className="text-[10px] font-mono text-neutral-400 px-2 font-bold flex items-center gap-1">
                  <Layers className="w-3 h-3 text-white" /> TIER FILTER:
                </span>
                {[
                  { id: "ALL", label: "All Tiers", targetNode: "PIPELINE_RAG" },
                  { id: "TIER_1", label: "Tier 1: Client", targetNode: "TIER_CLIENT" },
                  { id: "TIER_2", label: "Tier 2: Gateway", targetNode: "TIER_GATEWAY" },
                  { id: "TIER_3", label: "Tier 3: RAG Core", targetNode: "PIPELINE_RAG" },
                  { id: "TIER_4", label: "Tier 4: Storage", targetNode: "TIER_STORAGE" },
                  { id: "TIER_5", label: "Tier 5: External APIs", targetNode: "TIER_EXTERNAL" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTierFilter(t.id as any);
                      setActivePipeline("ALL");
                      setSelectedNodeId(t.targetNode);
                    }}
                    className={`px-2.5 py-1 rounded font-mono font-bold text-[11px] transition-all duration-200 ${
                      selectedTierFilter === t.id && activePipeline === "ALL"
                        ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.4)]" 
                        : "text-neutral-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Row: Specialized Pipeline Streams */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-transparent border border-white/20 text-xs shadow-[0_0_12px_rgba(255,255,255,0.04)]">
                <span className="text-[10px] font-mono text-neutral-400 px-2 font-bold flex items-center gap-1">
                  <Filter className="w-3 h-3 text-white" /> PIPELINE FLOWS:
                </span>
                {[
                  { id: "ALL", label: "All Flows", targetNode: "PIPELINE_RAG" },
                  { id: "INGEST", label: "Pipeline 1: Ingest Flow", targetNode: "PIPELINE_INGEST" },
                  { id: "RAG", label: "Pipeline 2: Hybrid RAG Flow", targetNode: "PIPELINE_RAG" },
                  { id: "GAPS", label: "Pipeline 3: 9-Stage Gap Flow", targetNode: "PIPELINE_GAPS" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePipeline(p.id as any);
                      setSelectedTierFilter("ALL");
                      setSelectedNodeId(p.targetNode);
                    }}
                    className={`px-2.5 py-1 rounded font-mono font-bold text-[11px] transition-all duration-200 ${
                      activePipeline === p.id && selectedTierFilter === "ALL"
                        ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.4)]" 
                        : "text-neutral-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {(selectedTierFilter !== "ALL" || activePipeline !== "ALL") && (
                <button
                  onClick={() => {
                    setSelectedTierFilter("ALL");
                    setActivePipeline("ALL");
                  }}
                  className="px-2.5 py-1 rounded text-[10px] font-mono font-bold text-neutral-300 border border-white/20 hover:text-white hover:border-white transition-all"
                >
                  Reset Filters ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
         * ARCHITECTURE CANVAS CONTAINER (Transparent Blueprint Aesthetic)
         * ========================================================================= */}
        <div className="relative rounded-2xl bg-transparent border border-white/25 p-5 sm:p-7 shadow-[0_0_35px_rgba(255,255,255,0.06)] hover:border-white/40 transition-all duration-500 space-y-6">
          
          {/* TIER 1: CLIENT PRESENTATION LAYER */}
          <div 
            onClick={() => setSelectedNodeId("TIER_CLIENT")}
            className={`rounded-xl p-4 bg-transparent border transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ${
              !isTier1InFocus ? "opacity-25 blur-[0.2px] hover:opacity-80" : "opacity-100"
            } ${
              selectedNodeId === "TIER_CLIENT" || selectedTierFilter === "TIER_1"
                ? "border-white shadow-[0_0_25px_rgba(255,255,255,0.25)] ring-1 ring-white/60 animate-glow-white"
                : "border-white/25 hover:border-white/70 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-neutral-800/80 gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded bg-white text-black font-extrabold text-xs flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  1
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                    Tier 1: Client Presentation Layer
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-400">Next.js 15 App Router • React 19 • Tailwind CSS • Zustand • TanStack Query</span>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-transparent border border-white/40 text-neutral-200 font-bold w-fit shadow-[0_0_10px_rgba(255,255,255,0.06)]">
                HTTPS / REST API + JWT Bearer
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
              {[
                { 
                  title: "Scholar Studio", 
                  route: "/scholar-studio", 
                  tech: "SerpAPI Google Scholar • Staging", 
                  desc: "Live Google Scholar search, interactive paper staging, checkbox selection, and batch vectorization.",
                  isRelevant: activePipeline === "ALL" || activePipeline === "INGEST"
                },
                { 
                  title: "Global Discovery", 
                  route: "/papers", 
                  tech: "OpenAlex • Semantic Scholar", 
                  desc: "200M+ paper multi-source federation with automated open-access DOI resolution and PDF links.",
                  isRelevant: activePipeline === "ALL" || activePipeline === "INGEST"
                },
                { 
                  title: "Grounded Chat", 
                  route: "/chat/[id]", 
                  tech: "Zero-Hallucination • Page Citations", 
                  desc: "Strictly grounded Q&A with expandable page-level citation cards and verbatim excerpt jumps.",
                  isRelevant: activePipeline === "ALL" || activePipeline === "RAG"
                },
                { 
                  title: "9-Stage Gap Finder", 
                  route: "/research-gaps/[id]", 
                  tech: "4-Way Taxonomy • SerpAPI Counter-Query", 
                  desc: "Automated limitation extraction, counter-evidence verification, and grant experiment designs.",
                  isRelevant: activePipeline === "ALL" || activePipeline === "GAPS"
                },
                { 
                  title: "Compare & Export", 
                  route: "/compare", 
                  tech: "Side-by-Side Matrix • IEEE LaTeX", 
                  desc: "Comparative literature matrix across datasets, metrics, and limitations with 1-click IEEE LaTeX export.",
                  isRelevant: activePipeline === "ALL" || activePipeline === "GAPS"
                },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-2.5 rounded-lg bg-transparent border transition-all duration-200 ${
                    item.isRelevant 
                      ? "border-neutral-800/80 hover:border-white/60 hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] opacity-100" 
                      : "border-neutral-800/30 opacity-30"
                  }`}
                >
                  <h4 className="font-bold text-white text-xs">{item.title}</h4>
                  <span className="text-[10px] font-mono text-neutral-300 block my-0.5">{item.route}</span>
                  <span className="text-[9px] font-mono text-neutral-400 block mb-1 text-white/70">{item.tech}</span>
                  <p className="text-[11px] text-neutral-400 leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CONNECTOR 1 -> 2 (DYNAMIC ANIMATED FLOW CONDUIT) */}
          <div className={`flex flex-col items-center justify-center -my-2 relative py-1 transition-opacity duration-300 ${
            selectedTierFilter !== "ALL" && selectedTierFilter !== "TIER_1" && selectedTierFilter !== "TIER_2" ? "opacity-20" : "opacity-100"
          }`}>
            <div className="w-1 h-7 rounded-full bg-neutral-800/90 border border-white/20 relative overflow-hidden flex items-center justify-center">
              {isLaserActive && (
                <>
                  <div className="w-1.5 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff] absolute top-0 animate-flow-packet" />
                  <div className="w-1.5 h-3 rounded-full bg-white/70 shadow-[0_0_8px_#ffffff] absolute top-0 animate-flow-packet-delayed" />
                </>
              )}
            </div>

            <div className="px-3.5 py-1 my-0.5 rounded-full bg-black/90 border border-white/50 text-white text-[10px] font-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm z-10 transition-all duration-300 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <span className={`w-1.5 h-1.5 rounded-full ${isLaserActive ? "bg-white shadow-[0_0_8px_#ffffff] animate-ping" : "bg-neutral-600"}`} />
              <span>OAuth2 JWT Bearer REST Requests</span>
              <ArrowDown className={`w-3 h-3 text-white ${isLaserActive ? "animate-bounce" : ""}`} />
            </div>

            <div className="w-1 h-7 rounded-full bg-neutral-800/90 border border-white/20 relative overflow-hidden flex items-center justify-center">
              {isLaserActive && (
                <>
                  <div className="w-1.5 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff] absolute top-0 animate-flow-packet" />
                  <div className="w-1.5 h-3 rounded-full bg-white/70 shadow-[0_0_8px_#ffffff] absolute top-0 animate-flow-packet-delayed" />
                </>
              )}
            </div>
          </div>

          {/* TIER 2: API GATEWAY */}
          <div 
            onClick={() => setSelectedNodeId("TIER_GATEWAY")}
            className={`rounded-xl p-4 bg-transparent border transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ${
              !isTier2InFocus ? "opacity-25 blur-[0.2px] hover:opacity-80" : "opacity-100"
            } ${
              selectedNodeId === "TIER_GATEWAY" || selectedTierFilter === "TIER_2"
                ? "border-white shadow-[0_0_25px_rgba(255,255,255,0.25)] ring-1 ring-white/60 animate-glow-white"
                : "border-white/25 hover:border-white/70 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-neutral-800/80 gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded bg-white text-black font-extrabold text-xs flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  2
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                    Tier 2: API Gateway & Security Controllers
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-400">FastAPI 0.111 :8000 • Uvicorn ASGI • Python 3.12</span>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-transparent border border-white/40 text-neutral-200 font-bold w-fit shadow-[0_0_10px_rgba(255,255,255,0.06)]">
                Swagger OpenAPI 3.0 /docs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className={`p-3 rounded-lg bg-transparent border transition-all duration-200 ${
                activePipeline === "ALL" || activePipeline === "INGEST" || activePipeline === "RAG" 
                  ? "border-neutral-800/80 hover:border-white/50 hover:shadow-[0_0_12px_rgba(255,255,255,0.1)] opacity-100" 
                  : "border-neutral-800/30 opacity-30"
              }`}>
                <h4 className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-white" /> FastAPI Application Router
                </h4>
                <span className="text-[9px] font-mono text-neutral-400 block mb-1">FastAPI 0.111 • Pydantic v2 • CORS</span>
                <p className="text-[11px] text-neutral-400 leading-relaxed">Asynchronous routing, CORS middleware, strict Pydantic v2 schemas, and standardized envelopes.</p>
              </div>

              <div className={`p-3 rounded-lg bg-transparent border transition-all duration-200 ${
                activePipeline === "ALL" || activePipeline === "RAG" 
                  ? "border-neutral-800/80 hover:border-white/50 hover:shadow-[0_0_12px_rgba(255,255,255,0.1)] opacity-100" 
                  : "border-neutral-800/30 opacity-30"
              }`}>
                <h4 className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-white" /> OAuth2 Security Guard
                </h4>
                <span className="text-[9px] font-mono text-neutral-400 block mb-1">OAuth2 Password Flow • Bcrypt • JWT</span>
                <p className="text-[11px] text-neutral-400 leading-relaxed">Bcrypt password hashing, JWT bearer validation, and workspace-level tenant isolation.</p>
              </div>

              <div className={`p-3 rounded-lg bg-transparent border transition-all duration-200 ${
                activePipeline === "ALL" || activePipeline === "INGEST" || activePipeline === "GAPS" 
                  ? "border-neutral-800/80 hover:border-white/50 hover:shadow-[0_0_12px_rgba(255,255,255,0.1)] opacity-100" 
                  : "border-neutral-800/30 opacity-30"
              }`}>
                <h4 className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-white" /> Async BackgroundTasks Queue
                </h4>
                <span className="text-[9px] font-mono text-neutral-400 block mb-1">Asyncio Workers • Non-Blocking Queue</span>
                <p className="text-[11px] text-neutral-400 leading-relaxed">Non-blocking background workers for PDF parsing, dense embeddings, and gap discovery.</p>
              </div>
            </div>
          </div>

          {/* CONNECTOR 2 -> 3 (DYNAMIC ANIMATED FLOW CONDUIT) */}
          <div className={`flex flex-col items-center justify-center -my-2 relative py-1 transition-opacity duration-300 ${
            selectedTierFilter !== "ALL" && selectedTierFilter !== "TIER_2" && selectedTierFilter !== "TIER_3" ? "opacity-20" : "opacity-100"
          }`}>
            <div className="w-1 h-7 rounded-full bg-neutral-800/90 border border-white/20 relative overflow-hidden flex items-center justify-center">
              {isLaserActive && (
                <>
                  <div className="w-1.5 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff] absolute top-0 animate-flow-packet" />
                  <div className="w-1.5 h-3 rounded-full bg-white/70 shadow-[0_0_8px_#ffffff] absolute top-0 animate-flow-packet-delayed" />
                </>
              )}
            </div>

            <div className="px-3.5 py-1 my-0.5 rounded-full bg-black/90 border border-white/50 text-white text-[10px] font-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm z-10 transition-all duration-300 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <span className={`w-1.5 h-1.5 rounded-full ${isLaserActive ? "bg-white shadow-[0_0_8px_#ffffff] animate-ping" : "bg-neutral-600"}`} />
              <span>Dispatches into 3 Specialized Pipelines</span>
              <ArrowDown className={`w-3 h-3 text-white ${isLaserActive ? "animate-bounce" : ""}`} />
            </div>

            <div className="w-1 h-7 rounded-full bg-neutral-800/90 border border-white/20 relative overflow-hidden flex items-center justify-center">
              {isLaserActive && (
                <>
                  <div className="w-1.5 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff] absolute top-0 animate-flow-packet" />
                  <div className="w-1.5 h-3 rounded-full bg-white/70 shadow-[0_0_8px_#ffffff] absolute top-0 animate-flow-packet-delayed" />
                </>
              )}
            </div>
          </div>

          {/* TIER 3: CORE PROCESSING ENGINES */}
          <div 
            onClick={() => setSelectedNodeId("PIPELINE_RAG")}
            className={`rounded-xl p-4 bg-transparent border transition-all duration-300 cursor-pointer ${
              !isTier3InFocus ? "opacity-25 blur-[0.2px] hover:opacity-80" : "opacity-100"
            } ${
              selectedTierFilter === "TIER_3"
                ? "border-white shadow-[0_0_25px_rgba(255,255,255,0.25)] ring-1 ring-white/60 animate-glow-white"
                : "border-white/25 hover:border-white/50"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-neutral-800/80 gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded bg-white text-black font-extrabold text-xs flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                    Tier 3: Core Processing Engines & Hybrid RAG Pipelines
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-400">Parallel Literature Ingestion • Dual-Retrieval Hybrid RAG • 9-Stage Gap Discovery</span>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-transparent border border-white/40 text-neutral-200 font-bold w-fit shadow-[0_0_10px_rgba(255,255,255,0.06)]">
                Zero-Hallucination Grounding
              </span>
            </div>

            {/* 3 Pipeline Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
              {/* Pipeline 1 */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId("PIPELINE_INGEST");
                }}
                className={`p-3.5 rounded-lg border transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ${
                  activePipeline === "ALL" || activePipeline === "INGEST" ? "opacity-100" : "opacity-30"
                } ${
                  selectedNodeId === "PIPELINE_INGEST" || activePipeline === "INGEST"
                    ? "bg-transparent border-white shadow-[0_0_20px_rgba(255,255,255,0.22)] ring-1 ring-white/60 animate-glow-white"
                    : "bg-transparent border-neutral-800/80 hover:border-white/60 hover:shadow-[0_0_15px_rgba(255,255,255,0.12)]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white border border-white/30">
                    PIPELINE 1
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">PDF Ingest Engine</span>
                </div>
                <h4 className="font-bold text-white text-xs mb-1">PyMuPDF Section Ingestion</h4>
                <span className="text-[9px] font-mono text-neutral-400 block mb-1.5">fitz • 500w Windows • SHA-256</span>
                <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">
                  Layout stream parsing, SHA-256 deduplication, regex section detection, and 500-word sliding windows (100w overlap) with 1-indexed page tagging.
                </p>
                <div className="space-y-1 text-[11px] text-neutral-300 pt-2 border-t border-neutral-800/80">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-white shrink-0" />
                    <span>Live Sourcing: SerpAPI + OpenAlex</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-white shrink-0" />
                    <span>Regex Split: Limitations, Methods, Future Work</span>
                  </div>
                </div>
              </div>

              {/* Pipeline 2 */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId("PIPELINE_RAG");
                }}
                className={`p-3.5 rounded-lg border transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ${
                  activePipeline === "ALL" || activePipeline === "RAG" ? "opacity-100" : "opacity-30"
                } ${
                  selectedNodeId === "PIPELINE_RAG" || activePipeline === "RAG"
                    ? "bg-transparent border-white shadow-[0_0_20px_rgba(255,255,255,0.22)] ring-1 ring-white/60 animate-glow-white"
                    : "bg-transparent border-neutral-800/80 hover:border-white/60 hover:shadow-[0_0_15px_rgba(255,255,255,0.12)]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white border border-white/30">
                    PIPELINE 2
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">Hybrid RAG Engine</span>
                </div>
                <h4 className="font-bold text-white text-xs mb-1">Dual-Path RRF Retriever</h4>
                <span className="text-[9px] font-mono text-neutral-400 block mb-1.5">BGE-384 + BM25Okapi + RRF (k=60)</span>
                <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">
                  Dense BGE 384d semantic vectors + BM25Okapi sparse lexical matching unified via Reciprocal Rank Fusion, with Cross-Encoder BGE reranking.
                </p>
                <div className="space-y-1 text-[11px] text-neutral-300 pt-2 border-t border-neutral-800/80">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-white shrink-0" />
                    <span>BAAI/bge-small-en-v1.5 + BM25Okapi</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-white shrink-0" />
                    <span>Cross-Encoder BGE Reranker for citations</span>
                  </div>
                </div>
              </div>

              {/* Pipeline 3 */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId("PIPELINE_GAPS");
                }}
                className={`p-3.5 rounded-lg border transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ${
                  activePipeline === "ALL" || activePipeline === "GAPS" ? "opacity-100" : "opacity-30"
                } ${
                  selectedNodeId === "PIPELINE_GAPS" || activePipeline === "GAPS"
                    ? "bg-transparent border-white shadow-[0_0_20px_rgba(255,255,255,0.22)] ring-1 ring-white/60 animate-glow-white"
                    : "bg-transparent border-neutral-800/80 hover:border-white/60 hover:shadow-[0_0_15px_rgba(255,255,255,0.12)]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white border border-white/30">
                    PIPELINE 3
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">Gap Engine</span>
                </div>
                <h4 className="font-bold text-white text-xs mb-1">9-Stage Gap Discovery</h4>
                <span className="text-[9px] font-mono text-neutral-400 block mb-1.5">4-Way Taxonomy • Counter-Evidence</span>
                <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">
                  Autonomous taxonomy classification across 4 axes, counter-evidence verification on newer papers, and grant experiment protocol generation.
                </p>
                <div className="space-y-1 text-[11px] text-neutral-300 pt-2 border-t border-neutral-800/80">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-white shrink-0" />
                    <span>Taxonomy: Generalization, Baselines</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-white shrink-0" />
                    <span>Counter-evidence verification & scoring</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONNECTOR 3 -> 4 & 5 (DUAL ANIMATED FLOW CONDUITS WITH PACKETS) */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 -my-2 relative py-1 transition-opacity duration-300 ${
            selectedTierFilter !== "ALL" && selectedTierFilter !== "TIER_3" && selectedTierFilter !== "TIER_4" && selectedTierFilter !== "TIER_5" ? "opacity-20" : "opacity-100"
          }`}>
            {/* Left Flow Conduit -> Tier 4 */}
            <div className="flex flex-col items-center">
              <div className="w-1 h-7 rounded-full bg-neutral-800/90 border border-white/20 relative overflow-hidden flex items-center justify-center">
                {isLaserActive && (
                  <>
                    <div className="w-1.5 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff] absolute top-0 animate-flow-packet" />
                    <div className="w-1.5 h-3 rounded-full bg-white/70 shadow-[0_0_8px_#ffffff] absolute top-0 animate-flow-packet-delayed" />
                  </>
                )}
              </div>
              <div className="px-3.5 py-1 my-0.5 rounded-full bg-black/90 border border-white/50 text-white text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm z-10 transition-all duration-300 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                <span className={`w-1.5 h-1.5 rounded-full ${isLaserActive ? "bg-white shadow-[0_0_8px_#ffffff] animate-ping" : "bg-neutral-600"}`} />
                <span>SQLAlchemy 2.0 / pgvector Cosine Query</span>
                <ArrowDown className={`w-3 h-3 text-white ${isLaserActive ? "animate-bounce" : ""}`} />
              </div>
              <div className="w-1 h-7 rounded-full bg-neutral-800/90 border border-white/20 relative overflow-hidden flex items-center justify-center">
                {isLaserActive && (
                  <>
                    <div className="w-1.5 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff] absolute top-0 animate-flow-packet" />
                    <div className="w-1.5 h-3 rounded-full bg-white/70 shadow-[0_0_8px_#ffffff] absolute top-0 animate-flow-packet-delayed" />
                  </>
                )}
              </div>
            </div>

            {/* Right Flow Conduit -> Tier 5 */}
            <div className="flex flex-col items-center">
              <div className="w-1 h-7 rounded-full bg-neutral-800/90 border border-white/20 relative overflow-hidden flex items-center justify-center">
                {isLaserActive && (
                  <>
                    <div className="w-1.5 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff] absolute top-0 animate-flow-packet" />
                    <div className="w-1.5 h-3 rounded-full bg-white/70 shadow-[0_0_8px_#ffffff] absolute top-0 animate-flow-packet-delayed" />
                  </>
                )}
              </div>
              <div className="px-3.5 py-1 my-0.5 rounded-full bg-black/90 border border-white/50 text-white text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-sm z-10 transition-all duration-300 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                <span className={`w-1.5 h-1.5 rounded-full ${isLaserActive ? "bg-white shadow-[0_0_8px_#ffffff] animate-ping" : "bg-neutral-600"}`} />
                <span>Async Academic APIs & OpenAI Prompting</span>
                <ArrowDown className={`w-3 h-3 text-white ${isLaserActive ? "animate-bounce" : ""}`} />
              </div>
              <div className="w-1 h-7 rounded-full bg-neutral-800/90 border border-white/20 relative overflow-hidden flex items-center justify-center">
                {isLaserActive && (
                  <>
                    <div className="w-1.5 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff] absolute top-0 animate-flow-packet" />
                    <div className="w-1.5 h-3 rounded-full bg-white/70 shadow-[0_0_8px_#ffffff] absolute top-0 animate-flow-packet-delayed" />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* TIER 4 & TIER 5 (CLOUD PERSISTENCE & EXTERNAL APIS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TIER 4 */}
            <div 
              onClick={() => setSelectedNodeId("TIER_STORAGE")}
              className={`rounded-xl p-4 bg-transparent border transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ${
                !isTier4InFocus ? "opacity-25 blur-[0.2px] hover:opacity-80" : "opacity-100"
              } ${
                selectedNodeId === "TIER_STORAGE" || selectedTierFilter === "TIER_4"
                  ? "border-white shadow-[0_0_25px_rgba(255,255,255,0.25)] ring-1 ring-white/60 animate-glow-white"
                  : "border-white/25 hover:border-white/70 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              }`}
            >
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-white text-black font-extrabold text-xs flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    4
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                    Tier 4: Cloud Persistence Tier
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-transparent text-white border border-white/20">
                  Neon Serverless 16
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className={`p-2.5 rounded bg-transparent border transition-all duration-200 flex items-center gap-2.5 ${
                  activePipeline === "ALL" || activePipeline === "INGEST" || activePipeline === "GAPS" 
                    ? "border-neutral-800/80 hover:border-white/50 opacity-100" 
                    : "border-neutral-800/30 opacity-30"
                }`}>
                  <Database className="w-4 h-4 text-white shrink-0" />
                  <div>
                    <h5 className="font-bold text-white text-xs">Neon PostgreSQL (13 Relational Tables)</h5>
                    <p className="text-[11px] text-neutral-400">Users, Projects, Papers, Sections, Chunks, Gaps & Verified Evidence</p>
                  </div>
                </div>

                <div className={`p-2.5 rounded bg-transparent border transition-all duration-200 flex items-center gap-2.5 ${
                  activePipeline === "ALL" || activePipeline === "RAG" 
                    ? "border-neutral-800/80 hover:border-white/50 opacity-100" 
                    : "border-neutral-800/30 opacity-30"
                }`}>
                  <Cpu className="w-4 h-4 text-white shrink-0" />
                  <div>
                    <h5 className="font-bold text-white text-xs">Neon pgvector Extension (384-dim Dense Vectors)</h5>
                    <p className="text-[11px] text-neutral-400">Sub-12ms cosine distance queries on document_chunks via HNSW (m=16, ef=64)</p>
                  </div>
                </div>

                <div className={`p-2.5 rounded bg-transparent border transition-all duration-200 flex items-center gap-2.5 ${
                  activePipeline === "ALL" || activePipeline === "INGEST" 
                    ? "border-neutral-800/80 hover:border-white/50 opacity-100" 
                    : "border-neutral-800/30 opacity-30"
                }`}>
                  <Server className="w-4 h-4 text-white shrink-0" />
                  <div>
                    <h5 className="font-bold text-white text-xs">Cloud S3 Object Storage Bucket (boto3)</h5>
                    <p className="text-[11px] text-neutral-400">Raw academic PDF binary streams and extracted media assets</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TIER 5 */}
            <div 
              onClick={() => setSelectedNodeId("TIER_EXTERNAL")}
              className={`rounded-xl p-4 bg-transparent border transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 ${
                !isTier5InFocus ? "opacity-25 blur-[0.2px] hover:opacity-80" : "opacity-100"
              } ${
                selectedNodeId === "TIER_EXTERNAL" || selectedTierFilter === "TIER_5"
                  ? "border-white shadow-[0_0_25px_rgba(255,255,255,0.25)] ring-1 ring-white/60 animate-glow-white"
                  : "border-white/25 hover:border-white/70 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              }`}
            >
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-white text-black font-extrabold text-xs flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    5
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                    Tier 5: External AI & Academic APIs
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-transparent text-white border border-white/20">
                  Live Academic Web
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className={`p-2.5 rounded bg-transparent border transition-all duration-200 flex items-center gap-2.5 ${
                  activePipeline === "ALL" || activePipeline === "INGEST" || activePipeline === "GAPS" 
                    ? "border-neutral-800/80 hover:border-white/50 opacity-100" 
                    : "border-neutral-800/30 opacity-30"
                }`}>
                  <Search className="w-4 h-4 text-white shrink-0" />
                  <div>
                    <h5 className="font-bold text-white text-xs">Google Scholar API (via SerpAPI)</h5>
                    <p className="text-[11px] text-neutral-400">Live publication retrieval, citation counts, and BibTeX citations</p>
                  </div>
                </div>

                <div className={`p-2.5 rounded bg-transparent border transition-all duration-200 flex items-center gap-2.5 ${
                  activePipeline === "ALL" || activePipeline === "INGEST" 
                    ? "border-neutral-800/80 hover:border-white/50 opacity-100" 
                    : "border-neutral-800/30 opacity-30"
                }`}>
                  <Globe className="w-4 h-4 text-white shrink-0" />
                  <div>
                    <h5 className="font-bold text-white text-xs">OpenAlex & Semantic Scholar APIs</h5>
                    <p className="text-[11px] text-neutral-400">Open-access DOI resolution and downloadable PDF URLs</p>
                  </div>
                </div>

                <div className={`p-2.5 rounded bg-transparent border transition-all duration-200 flex items-center gap-2.5 ${
                  activePipeline === "ALL" || activePipeline === "RAG" || activePipeline === "GAPS" 
                    ? "border-neutral-800/80 hover:border-white/50 opacity-100" 
                    : "border-neutral-800/30 opacity-30"
                }`}>
                  <Sparkles className="w-4 h-4 text-white shrink-0" />
                  <div>
                    <h5 className="font-bold text-white text-xs">OpenAI API (gpt-4o-mini)</h5>
                    <p className="text-[11px] text-neutral-400">Structured zero-hallucination JSON prompts for gap synthesis & Q&A</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
         * INSPECTOR DRAWER (Monochrome White & Slate Architecture Aesthetic)
         * ========================================================================= */}
        {selectedNode && (
          <div className="mt-6 p-5 rounded-xl bg-transparent border border-white/35 shadow-[0_0_30px_rgba(255,255,255,0.12)] transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-neutral-800/80 gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-neutral-300 uppercase tracking-widest block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse" />
                  Active Component Inspector
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white">{selectedNode.title}</h4>
                <p className="text-xs text-neutral-400">{selectedNode.subtitle}</p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-transparent border border-white/40 text-white w-fit shadow-[0_0_12px_rgba(255,255,255,0.08)]">
                Protocol: {selectedNode.protocol}
              </span>
            </div>

            <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
              {selectedNode.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-transparent border border-neutral-800/80">
                <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block mb-1">Technologies:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedNode.tech.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-transparent border border-white/30 text-white text-[10px] font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-transparent border border-neutral-800/80">
                <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block mb-1">Inputs:</span>
                <p className="text-white font-mono text-[11px] leading-snug">{selectedNode.inputs}</p>
              </div>

              <div className="p-3 rounded-lg bg-transparent border border-neutral-800/80">
                <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block mb-1">Outputs:</span>
                <p className="text-white font-mono text-[11px] leading-snug">{selectedNode.outputs}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
