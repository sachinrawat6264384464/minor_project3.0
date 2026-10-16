"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { 
  Layers, 
  Server, 
  Database, 
  Cpu, 
  Globe, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Terminal,
  ExternalLink,
  MessageSquare,
  GitCompare
} from "lucide-react";

export default function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState<"system" | "rag" | "database" | "gaps">("system");

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-8 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-royal-border">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-royal-100 text-royal-700 font-bold text-xs flex items-center gap-1.5 shadow-sm">
                <Layers className="w-3.5 h-3.5 text-royal-600" /> System Architecture & Technical Specifications
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                Neon pgvector + Hybrid RAG
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Architecture & Data Flow
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Deep architectural mapping of the Client Layer, FastAPI Gateway, Multi-Strategy Hybrid RAG Subsystem, Neon Serverless Vector Database, and External AI APIs.
            </p>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 mt-6">
              {[
                { id: "system", label: "System Architecture Overview", icon: Layers },
                { id: "rag", label: "Hybrid RAG Pipeline & Citations", icon: Cpu },
                { id: "gaps", label: "9-Stage Research Gap Engine", icon: Sparkles },
                { id: "database", label: "Neon pgvector & 13 Tables ERD", icon: Database },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                      isActive
                        ? "bg-royal-600 text-white shadow-royal"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: System Architecture Overview */}
          {activeTab === "system" && (
            <div className="space-y-8">
              {/* Architecture Tier Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Tier 1 */}
                <div className="bg-white p-5 rounded-2xl border border-royal-border shadow-card flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-royal-600 uppercase tracking-wider block mb-1">
                      Tier 1 · Client
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Next.js 15 + React 19</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Royal Blue & White UI with App Router, TanStack Query, and Framer Motion.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-royal-700">
                    Port :3000
                  </div>
                </div>

                {/* Tier 2 */}
                <div className="bg-white p-5 rounded-2xl border border-royal-border shadow-card flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                      Tier 2 · Gateway
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">FastAPI & Python 3.12</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Async REST controllers, Pydantic v2 schemas, JWT security, and background workers.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-700">
                    Port :8000
                  </div>
                </div>

                {/* Tier 3 */}
                <div className="bg-white p-5 rounded-2xl border border-royal-border shadow-card flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider block mb-1">
                      Tier 3 · Engine
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Hybrid RAG & Ingestion</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      PyMuPDF sectioning, BGE 384d vector embeddings, BM25Okapi lexical retrieval, and RRF.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-sky-700">
                    Local CPU/GPU
                  </div>
                </div>

                {/* Tier 4 */}
                <div className="bg-white p-5 rounded-2xl border border-royal-border shadow-card flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block mb-1">
                      Tier 4 · Database
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Neon Cloud PostgreSQL</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Native `pgvector` store, 13 relational tables, and S3-compatible object storage.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-700">
                    Serverless Postgres
                  </div>
                </div>

                {/* Tier 5 */}
                <div className="bg-white p-5 rounded-2xl border border-royal-border shadow-card flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
                      Tier 5 · APIs
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">External Connectors</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Google Scholar (SerpAPI), OpenAlex, Semantic Scholar, and OpenAI (gpt-4o-mini).
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-purple-700">
                    Cloud APIs
                  </div>
                </div>
              </div>

              {/* Visual Architecture Flow Diagram */}
              <div className="bg-white p-6 rounded-3xl border border-royal-border shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900">
                    Visual End-to-End Component Flow
                  </h2>
                  <span className="text-xs text-slate-500">Unidirectional Data Pipeline</span>
                </div>

                <div className="p-6 bg-slate-950 rounded-2xl text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <pre>{`
  [ Client Browser: Next.js 15 UI ]
      │
      │  HTTP REST / JSON Requests (Port :3000 -> :8000)
      ▼
  [ FastAPI Gateway Router & JWT Auth ]
      │
      ├──> Sourcing Route: /papers/search  ──> [ SerpAPI / Google Scholar / OpenAlex ]
      │
      ├──> Upload Route:   /papers/upload  ──> [ PyMuPDF Parser ] ──> [ Neon Object Storage ]
      │                                                │
      │                                                ▼
      │                                      [ BAAI/bge-small 384d ]
      │                                                │
      │                                                ▼
      ├──> Storage Connection              ──> [ Neon PostgreSQL (pgvector) ]
      │                                         ├── document_chunks (Vectors)
      │                                         ├── papers & paper_sections
      │                                         └── projects, users, chat
      │
      ├──> RAG Chat Route: /chat           ──> [ RAG Orchestrator ]
      │                                         ├── BM25 Okapi Sparse Search
      │                                         ├── Neon pgvector Dense Cosine Search
      │                                         ├── Reciprocal Rank Fusion (RRF)
      │                                         ├── Citation Builder (Page + Excerpt)
      │                                         └── [ OpenAI gpt-4o-mini Grounding ]
      │
      └──> Gap Discovery:  /research-gaps  ──> [ 9-Stage Research Gap Engine ]
                                                ├── Cross-paper Limitations Matrix
                                                ├── Counter-evidence Verification
                                                └── [ Hypotheses & Validation Protocol ]
                  `}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Hybrid RAG Pipeline & Citations */}
          {activeTab === "rag" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-royal-border shadow-card">
                <h2 className="text-lg font-bold text-slate-900 mb-2">
                  Dual-Path Hybrid Retrieval-Augmented Generation (RAG)
                </h2>
                <p className="text-xs text-slate-500 mb-6">
                  Solves the academic hallucination problem by combining lexical exactness with semantic conceptual search.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Dense Path */}
                  <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                      Path 1 · Dense Vector
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">BAAI/bge-small-en-v1.5</h3>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      Embeds queries and text into 384-dimensional dense vectors. Executes Cosine Similarity against Neon's `pgvector` store.
                    </p>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                      Semantic Concepts
                    </span>
                  </div>

                  {/* Sparse Path */}
                  <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                      Path 2 · Sparse Lexical
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">BM25Okapi Retrieval</h3>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      Tokenizes passages and scores keyword frequencies. Catches exact formulas, dataset names, author surnames, and acronyms.
                    </p>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                      Exact Keywords
                    </span>
                  </div>

                  {/* Fusion */}
                  <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                      Path 3 · Fusion
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Reciprocal Rank Fusion (RRF)</h3>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      Combines rankings using RRF formula (k=60), ensuring balanced candidate representation before CrossEncoder reranking.
                    </p>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Unified Ranking
                    </span>
                  </div>
                </div>

                {/* Grounding & Anti-Hallucination */}
                <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-royal-600 text-white flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Verifiable Citation Card Generation</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Every claim in the assistant's answer is linked to an exact source anchor. The Citation Builder constructs non-fabricated cards displaying the **Paper Title**, **DOI**, **Page Number (1-indexed)**, **Section Name**, and **Verbatim Excerpt**.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 9-Stage Research Gap Engine */}
          {activeTab === "gaps" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-royal-border shadow-card">
                <h2 className="text-lg font-bold text-slate-900 mb-2">
                  The 9-Stage Research Gap Analysis Pipeline
                </h2>
                <p className="text-xs text-slate-500 mb-6">
                  Identifies blind spots in current literature and validates candidate gaps against counter-evidence.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {[
                    { step: "01", title: "Scope Definition", desc: "User specifies target topic and binds paper corpus." },
                    { step: "02", title: "Corpus Discovery", desc: "Sourcing relevant peer-reviewed papers via Google Scholar." },
                    { step: "03", title: "Structured Extraction", desc: "Extracts Objectives, Methods, Limitations & Future Work." },
                    { step: "04", title: "Cross-Paper Matrix", desc: "Builds structured comparison grid of reported findings." },
                    { step: "05", title: "Candidate Gap Generation", desc: "Identifies generalization, baseline, or dataset omissions." },
                    { step: "06", title: "Counter-Evidence Verification", desc: "Cross-checks newer papers to ensure gap has not been solved." },
                    { step: "07", title: "Evidence Strength Rating", desc: "Scores confidence and strength (HIGH / MEDIUM / LOW)." },
                    { step: "08", title: "Hypothesis Formulation", desc: "Formulates specific, testable Proposed Research Questions." },
                    { step: "09", title: "Validation Protocol", desc: "Designs actionable experimental setups with metrics." },
                  ].map((s) => (
                    <div key={s.step} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                      <span className="text-[10px] font-extrabold text-royal-600 block mb-1">
                        STAGE {s.step}
                      </span>
                      <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
                      <p className="text-slate-500">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Database ERD */}
          {activeTab === "database" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-royal-border shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Neon Serverless PostgreSQL Database Schema (13 Tables)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Hosted on Neon Cloud with native `pgvector` vector embedding storage.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Connected & Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  {[
                    { name: "document_chunks", desc: "Text chunks with 384-dim dense vector embeddings, section labels, and page numbers." },
                    { name: "papers", desc: "Paper metadata (Title, DOI, Year, Authors, Venue, Citations, File Path, Findings)." },
                    { name: "paper_sections", desc: "PyMuPDF extracted sections (Abstract, Intro, Methods, Results, Limitations)." },
                    { name: "projects", desc: "User research workspaces binding collections and chat sessions." },
                    { name: "users", desc: "User accounts, password hashes, and authentication tokens." },
                    { name: "conversations", desc: "Chat session headers for project-specific research discussions." },
                    { name: "messages", desc: "Assistant and user messages with grounded citation card payloads." },
                    { name: "research_gap_analyses", desc: "9-stage analysis runs with topic, status, progress, and summary." },
                    { name: "candidate_gaps", desc: "Identified gap entries with category, score, question, and experiment." },
                    { name: "gap_evidence", desc: "Supporting and contradicting citations backing each candidate gap." },
                    { name: "reports", desc: "Generated literature surveys exported as Markdown or PDF." },
                    { name: "graph_entities", desc: "Nodes representing authors, institutions, and topics in the graph." },
                    { name: "graph_relationships", desc: "Edges representing citation and co-authorship relationships." },
                  ].map((tbl) => (
                    <div key={tbl.name} className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Database className="w-3.5 h-3.5 text-emerald-600" />
                        <h3 className="font-mono font-bold text-slate-900">{tbl.name}</h3>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{tbl.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
