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
  GitCompare,
  Search,
  Workflow,
  ChevronRight,
  ShieldAlert,
  Binary,
  FolderKanban,
  FileCode,
  Compass
} from "lucide-react";

export default function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState<"flow" | "system" | "rag" | "gaps" | "database" | "techstack">("flow");
  const [selectedFlowStep, setSelectedFlowStep] = useState<number>(1);

  const flowSteps = [
    {
      step: 1,
      title: "User Entry & Workspace Auth",
      tagline: "Session initialization, project provisioning, and workspace binding",
      userAction: "Researcher signs in via JWT auth and creates a dedicated research project (e.g., 'Attention Mechanisms in Medical Imaging').",
      backendAction: "FastAPI validates credentials, hashes passwords with bcrypt, and initializes isolated project collections in Neon PostgreSQL.",
      techStack: [
        { name: "Next.js 15 App Router", type: "Frontend" },
        { name: "FastAPI (Python 3.12)", type: "API" },
        { name: "OAuth2 Bearer JWT", type: "Security" },
        { name: "Neon Serverless Postgres", type: "Database" },
        { name: "SQLAlchemy 2.0", type: "ORM" }
      ],
      inputPayload: '{ "email": "scholar@university.edu", "topic": "Medical Imaging ViTs" }',
      outputPayload: '{ "project_id": "proj_9f2a4", "status": "READY", "token": "eyJhbGci..." }',
      icon: FolderKanban,
      color: "from-blue-600 to-indigo-600"
    },
    {
      step: 2,
      title: "Academic Paper Search & Sourcing",
      tagline: "Live multi-source literature discovery with metadata aggregation",
      userAction: "User searches keywords or DOIs in Scholar Studio (/scholar-studio) or Global Discovery (/papers).",
      backendAction: "Asynchronously queries Google Scholar via SerpAPI, OpenAlex, and Semantic Scholar. Aggregates titles, DOIs, abstracts, citation counts, and open-access PDF URLs.",
      techStack: [
        { name: "SerpAPI (Google Scholar)", type: "External API" },
        { name: "OpenAlex Open API", type: "External API" },
        { name: "Semantic Scholar", type: "External API" },
        { name: "httpx (Async HTTP)", type: "Networking" },
        { name: "TanStack React Query v5", type: "Client State" }
      ],
      inputPayload: 'GET /api/v1/papers/scholar/search?query=vision+transformers+medical&limit=10',
      outputPayload: '[ { "title": "Swin UNETR for 3D Segmentation", "doi": "10.1109/...", "year": 2024, "citations": 240, "pdf_url": "https://arxiv.org/pdf/..." } ]',
      icon: Search,
      color: "from-sky-600 to-blue-600"
    },
    {
      step: 3,
      title: "Staging, PDF Ingestion & Section Parsing",
      tagline: "Deduplication, PDF stream decoding, and structural heading heuristics",
      userAction: "Researcher checks selected papers or uploads private PDF files to the staging queue.",
      backendAction: "Calculates SHA-256 hash to avoid duplicate ingestion. PyMuPDF extracts text streams page-by-page. Regex heuristics segment document into Abstract, Intro, Methods, Results, Limitations, and Future Work.",
      techStack: [
        { name: "PyMuPDF (fitz)", type: "PDF Engine" },
        { name: "Neon S3 Object Storage", type: "Storage" },
        { name: "SHA-256 Deduplication", type: "Integrity" },
        { name: "Regex Section Classifier", type: "Heuristics" }
      ],
      inputPayload: 'POST /api/v1/papers/upload { "project_id": "proj_9f2a4", "file": "paper_v2.pdf" }',
      outputPayload: '{ "paper_id": "pap_77a", "pages": 14, "sections_detected": ["Abstract", "Methods", "Limitations", "Future Work"] }',
      icon: FileCode,
      color: "from-indigo-600 to-purple-600"
    },
    {
      step: 4,
      title: "Section-Aware Chunking & Vector Indexing",
      tagline: "500-word sliding windows with page provenance and 384-dim dense embeddings",
      userAction: "Paper indexing progress bar tracks document decomposition in real time.",
      backendAction: "Splits text using a 500-word sliding window with 100-word overlap. Tagged with exact page number and section category. Generates 384-dim dense vectors and writes to pgvector.",
      techStack: [
        { name: "BAAI/bge-small-en-v1.5", type: "Embedding Model" },
        { name: "Neon pgvector", type: "Vector Store" },
        { name: "PyTorch & Sentence-Transformers", type: "ML Core" },
        { name: "rank_bm25", type: "Sparse Index" }
      ],
      inputPayload: '{ "chunk_size": 500, "overlap": 100, "page_number": 4, "section": "Limitations" }',
      outputPayload: '{ "chunk_id": "chk_091", "embedding_dims": 384, "pgvector_status": "INDEXED" }',
      icon: Binary,
      color: "from-purple-600 to-pink-600"
    },
    {
      step: 5,
      title: "Multi-Strategy Dual-Retrieval Hybrid RAG",
      tagline: "BM25 lexical exactness combined with BGE dense semantics via RRF fusion",
      userAction: "Researcher asks questions in Chat (/chat/[id]) or triggers automated evidence retrieval.",
      backendAction: "Runs concurrent dual retrieval: BM25Okapi for exact formulas/datasets, and Neon pgvector Cosine similarity for semantic concepts. Merges results with Reciprocal Rank Fusion (k=60) and BGE Cross-Encoder reranking.",
      techStack: [
        { name: "Reciprocal Rank Fusion (RRF)", type: "Algorithm" },
        { name: "BAAI/bge-reranker-base", type: "Cross-Encoder" },
        { name: "BM25Okapi", type: "Lexical Match" },
        { name: "Cosine Distance Operator (<=>)", type: "pgvector" }
      ],
      inputPayload: 'POST /api/v1/chat { "query": "What are current dataset limitations for 3D CT scan ViTs?" }',
      outputPayload: '{ "top_chunks": 5, "rrf_score_range": [0.031, 0.015], "top_sources": ["Page 6 (Limitations)", "Page 8 (Discussion)"] }',
      icon: Cpu,
      color: "from-amber-600 to-orange-600"
    },
    {
      step: 6,
      title: "9-Stage Research Gap Discovery Engine",
      tagline: "Taxonomy classification, counter-evidence verification, and hypothesis formulation",
      userAction: "Researcher navigates to Research Gaps (/research-gaps/[id]) and clicks 'Run Gap Analysis'.",
      backendAction: "Executes 9 structured analysis stages: Scopes corpus -> Extracts limitations across papers -> Classifies taxonomy (Generalization, Baselines, Reproducibility) -> Formulates novel research questions.",
      techStack: [
        { name: "OpenAI gpt-4o-mini", type: "Generative AI" },
        { name: "9-Stage Analysis Service", type: "Backend Engine" },
        { name: "JSON Structured Output Schema", type: "LLM Guard" },
        { name: "Postgres Gap Schema", type: "Persistence" }
      ],
      inputPayload: 'POST /api/v1/gaps/run { "analysis_id": "ana_42b", "topic": "Vision Transformers in CT" }',
      outputPayload: '{ "candidate_gaps_count": 4, "categories": ["Generalization Weaknesses", "Reproducibility Limitations"] }',
      icon: Sparkles,
      color: "from-emerald-600 to-teal-600"
    },
    {
      step: 7,
      title: "Counter-Evidence Verification & Experiment Protocol",
      tagline: "Checking newer literature to eliminate solved problems and formulating validation setups",
      userAction: "Reviews candidate gaps with evidence strength badges (HIGH/MED/LOW) and suggested experiments.",
      backendAction: "Cross-verifies candidate gaps against the most recent publications in the collection to ensure the problem remains open. Automatically generates proposed validation experiments and metrics.",
      techStack: [
        { name: "Counter-Evidence Validator", type: "Verification" },
        { name: "Validation Experiment Synthesizer", type: "Prompt Engine" },
        { name: "Confidence Scorer (0.0 - 1.0)", type: "Evaluation" }
      ],
      inputPayload: '{ "candidate_gap_id": "gap_88c", "verify_against_recent": true }',
      outputPayload: '{ "confidence": 0.88, "evidence_strength": "HIGH", "suggested_experiment": "Benchmark on ImageNet-C & NIH-ChestXRay under 5-fold cross validation" }',
      icon: ShieldCheck,
      color: "from-teal-600 to-cyan-600"
    },
    {
      step: 8,
      title: "Final Results, Verifiable Citations & Academic Export",
      tagline: "Interactive gap cards, grounded chat answers, and one-click LaTeX manuscript generation",
      userAction: "User explores interactive gap cards, examines page-level citations, tests thesis novelty score, and exports IEEE LaTeX/PDF reports.",
      backendAction: "Constructs verifiable citation cards with DOI, page number, and verbatim quotes. Report service compiles publication-ready IEEE LaTeX manuscripts with BibTeX entries.",
      techStack: [
        { name: "Verifiable Citation Builder", type: "Grounding" },
        { name: "Thesis Novelty Scorer (0-100%)", type: "Evaluation" },
        { name: "IEEE LaTeX & BibTeX Exporter", type: "Publishing" },
        { name: "ReportLab PDF Engine", type: "Document Generation" }
      ],
      inputPayload: 'GET /api/v1/reports/export/latex?project_id=proj_9f2a4',
      outputPayload: '{ "format": "latex_ieee", "download_url": "/static/reports/literature_review.tex", "citations_linked": 18 }',
      icon: FileText,
      color: "from-blue-700 to-slate-900"
    }
  ];

  const currentStep = flowSteps.find(s => s.step === selectedFlowStep) || flowSteps[0];
  const StepIcon = currentStep.icon;

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
                <Layers className="w-3.5 h-3.5 text-royal-600" /> System Architecture & Execution Lifecycle
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                End-to-End Pipeline Verified
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Architecture & Execution Flow
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-4xl">
              Complete architectural walkthrough mapping every phase: from initial user entry and live paper search, through PyMuPDF sectioning, Hybrid RAG indexing, 9-stage research gap analysis, to verifiable citations and LaTeX manuscript export.
            </p>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 mt-6">
              {[
                { id: "flow", label: "1. End-to-End User Flow (Steps 1–8)", icon: Workflow },
                { id: "system", label: "2. 5-Tier System Architecture", icon: Layers },
                { id: "rag", label: "3. Dual-Path Hybrid RAG & Citations", icon: Cpu },
                { id: "gaps", label: "4. 9-Stage Research Gap Engine", icon: Sparkles },
                { id: "database", label: "5. Neon pgvector & 13 Tables ERD", icon: Database },
                { id: "techstack", label: "6. Technology Stack Matrix", icon: Terminal },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
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

          {/* ======================================================== */}
          {/* TAB 1: END-TO-END USER FLOW (INTERACTIVE PIPELINE)      */}
          {/* ======================================================== */}
          {activeTab === "flow" && (
            <div className="space-y-8">
              {/* Pipeline Step Navigator */}
              <div className="bg-white p-6 rounded-3xl border border-royal-border shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-royal-600" />
                      Sequential Pipeline Navigator (Click any step to inspect)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Step-by-step trace of how a query moves through our backend engines to generate evidence-backed research gaps.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-royal-50 text-royal-700 border border-royal-200">
                    Step {selectedFlowStep} of {flowSteps.length}
                  </span>
                </div>

                {/* Horizontal Step Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                  {flowSteps.map((s) => {
                    const isSelected = selectedFlowStep === s.step;
                    const SIcon = s.icon;
                    return (
                      <button
                        key={s.step}
                        onClick={() => setSelectedFlowStep(s.step)}
                        className={`p-3 rounded-2xl text-left border transition flex flex-col justify-between ${
                          isSelected
                            ? "bg-royal-600 text-white border-royal-600 shadow-md ring-2 ring-royal-300"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                          }`}>
                            0{s.step}
                          </span>
                          <SIcon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-400"}`} />
                        </div>
                        <span className="text-[11px] font-bold line-clamp-2 leading-tight">
                          {s.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step Detail Card */}
              <div className="bg-white rounded-3xl border border-royal-border shadow-card overflow-hidden">
                {/* Step Header Banner */}
                <div className={`p-6 bg-gradient-to-r ${currentStep.color} text-white`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/20">
                      <StepIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-extrabold uppercase tracking-wider">
                          Phase 0{currentStep.step}
                        </span>
                        <span className="text-xs text-white/80 font-medium">
                          {currentStep.tagline}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black mt-0.5 tracking-tight">
                        {currentStep.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Step Body */}
                <div className="p-8 space-y-6">
                  {/* Two Columns: User Action vs System Action */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Action */}
                    <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider mb-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        Researcher / Client Action
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {currentStep.userAction}
                      </p>
                    </div>

                    {/* Backend Action */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider mb-2">
                        <Server className="w-4 h-4 text-royal-600" />
                        Backend System Execution
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {currentStep.backendAction}
                      </p>
                    </div>
                  </div>

                  {/* Technologies Used in this Step */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-royal-600" />
                      Technologies & Libraries Utilized in This Phase
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentStep.techStack.map((tech, idx) => (
                        <div 
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-2 shadow-xs"
                        >
                          <span className="font-bold text-slate-900">{tech.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-royal-100 text-royal-700 font-semibold">
                            {tech.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Input vs Output Payload Simulation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Input Payload / Event Trigger
                      </span>
                      <pre className="p-4 bg-slate-950 text-sky-300 font-mono text-[11px] rounded-xl overflow-x-auto border border-slate-800">
                        {currentStep.inputPayload}
                      </pre>
                    </div>
                    <div>
                      <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Output Result / State Transition
                      </span>
                      <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto border border-slate-800">
                        {currentStep.outputPayload}
                      </pre>
                    </div>
                  </div>

                  {/* Navigation Footer for Steps */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedFlowStep(prev => Math.max(1, prev - 1))}
                      disabled={selectedFlowStep === 1}
                      className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ← Previous Phase
                    </button>
                    <span className="text-xs text-slate-400 font-medium">
                      Press Next to advance the pipeline trace
                    </span>
                    <button
                      onClick={() => setSelectedFlowStep(prev => Math.min(flowSteps.length, prev + 1))}
                      disabled={selectedFlowStep === flowSteps.length}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-royal-600 text-white hover:bg-royal-700 shadow-royal disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      Next Phase →
                    </button>
                  </div>
                </div>
              </div>

              {/* Complete Architecture Summary Flowchart */}
              <div className="bg-white p-6 rounded-3xl border border-royal-border shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-royal-600" />
                    Global Pipeline ASCII Architecture Map
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">Unidirectional Reactive Flow</span>
                </div>

                <div className="p-6 bg-slate-950 rounded-2xl text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <pre>{`
  [ Researcher Browser: Next.js 15 App Router ]
        │
        │  1. OAuth2 JWT Auth / Project Selection (:3000 -> :8000)
        ▼
  [ FastAPI Gateway Router ]
        │
        ├── 2. Live Literature Search ───────> [ SerpAPI (Google Scholar) / OpenAlex / Semantic Scholar ]
        │                                                     │
        │                                                     ▼
        │                                      [ Metadata: Title, DOI, Year, PDF URL ]
        │                                                     │
        ├── 3. Ingestion & Section Parsing <──────────────────┘
        │      ├── SHA-256 Hash Deduplication
        │      ├── Raw PDF to Neon S3 Storage
        │      └── PyMuPDF (fitz) Structural Headings:
        │          (Abstract, Intro, Methods, Results, Limitations, Future Work)
        │
        ├── 4. Section-Aware Chunking (500w Window / 100w Overlap)
        │      ├── Dense Path: BAAI/bge-small-en-v1.5 ──> 384d Vectors
        │      ├── Sparse Path: BM25Okapi Tokenization
        │      └── Storage: Neon PostgreSQL (pgvector extension)
        │
        ├── 5. Dual-Retrieval Hybrid RAG Subsystem
        │      ├── pgvector Cosine Distance (<=>) [Dense Semantics]
        │      ├── BM25 Okapi Match [Exact Formulas / Datasets / Authors]
        │      └── Reciprocal Rank Fusion (RRF k=60) + BGE Cross-Encoder Reranker
        │
        ├── 6. 9-Stage Research Gap & Counter-Evidence Engine
        │      ├── Extract limitations & future work cross-corpus
        │      ├── Taxonomy Classification (Generalization, Baselines, Reproducibility)
        │      ├── Counter-Evidence Verification (Cross-check newer literature)
        │      └── Formulate Testable Hypotheses & Validation Experiments
        │
        └── 7. Verifiable Scholar Deliverables
               ├── Interactive Research Gap Cards (Confidence, Evidence Strength)
               ├── Zero-Hallucination Grounded Chat with Page & Excerpt Anchors
               ├── Cross-Paper Comparison Matrix (/compare)
               ├── Thesis Novelty Checker (0-100% Score)
               └── Publication-Ready IEEE LaTeX (.tex) & BibTeX (.bib) Export
                  `}</pre>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: SYSTEM ARCHITECTURE (TIER BREAKDOWN)              */}
          {/* ======================================================== */}
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
                      Royal Blue & White UI with App Router, TanStack Query, Zustand, and Framer Motion.
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

              {/* Architectural Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-royal-border shadow-card">
                  <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-royal-600" />
                    Security & Data Isolation
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Every project workspace acts as a strict multi-tenant boundary. Vector similarity searches are pre-filtered by <code>project_id</code> directly inside PostgreSQL, ensuring zero cross-project leakage of proprietary literature or research notes.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl font-mono text-[11px] text-slate-700 border border-slate-200">
                    SELECT * FROM document_chunks WHERE project_id = :p_id ORDER BY embedding &lt;=&gt; :query_vec LIMIT 10;
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-royal-border shadow-card">
                  <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600" />
                    Cloud Resilience & Connection Pooling
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    FastAPI utilizes SQLAlchemy 2.0 with Neon's cloud connection pooling (<code>pool_pre_ping=True</code>). If the serverless Neon instance suspends, the pool automatically warms up with sub-second reconnect latency.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl font-mono text-[11px] text-slate-700 border border-slate-200">
                    create_engine(DATABASE_URL, pool_size=10, max_overflow=20, pool_pre_ping=True)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: HYBRID RAG PIPELINE & CITATIONS                  */}
          {/* ======================================================== */}
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

          {/* ======================================================== */}
          {/* TAB 4: 9-STAGE RESEARCH GAP ENGINE                       */}
          {/* ======================================================== */}
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

          {/* ======================================================== */}
          {/* TAB 5: DATABASE ERD & SCHEMA                             */}
          {/* ======================================================== */}
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

          {/* ======================================================== */}
          {/* TAB 6: TECHNOLOGY STACK MATRIX                           */}
          {/* ======================================================== */}
          {activeTab === "techstack" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-royal-border shadow-card overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Complete Technology Stack Matrix
                    </h2>
                    <p className="text-xs text-slate-500">
                      Categorized inventory of all production frameworks, ML models, databases, and APIs.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-royal-100 text-royal-700 text-xs font-bold">
                    Full Stack Python & TypeScript
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/75">
                        <th className="p-3 font-bold text-slate-900">Layer</th>
                        <th className="p-3 font-bold text-slate-900">Component</th>
                        <th className="p-3 font-bold text-slate-900">Technology Selected</th>
                        <th className="p-3 font-bold text-slate-900">Purpose / Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-3 font-bold text-royal-700">Frontend UI</td>
                        <td className="p-3 font-medium text-slate-900">Web Framework</td>
                        <td className="p-3 font-mono text-royal-600">Next.js 15 (App Router) + React 19</td>
                        <td className="p-3">Server & client components, responsive layout, fast routing</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-royal-700">Frontend UI</td>
                        <td className="p-3 font-medium text-slate-900">Styling & Motion</td>
                        <td className="p-3 font-mono text-royal-600">Tailwind CSS v3 + Framer Motion</td>
                        <td className="p-3">Royal Blue & White theme, micro-animations, glassmorphism</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-royal-700">Frontend UI</td>
                        <td className="p-3 font-medium text-slate-900">Client State</td>
                        <td className="p-3 font-mono text-royal-600">TanStack React Query v5 + Zustand</td>
                        <td className="p-3">Asynchronous server state caching, project selection persistence</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-700">Backend API</td>
                        <td className="p-3 font-medium text-slate-900">REST Gateway</td>
                        <td className="p-3 font-mono text-slate-800">FastAPI + Uvicorn (Python 3.12)</td>
                        <td className="p-3">High-concurrency async endpoints, auto OpenAPI/Swagger docs</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-700">Backend API</td>
                        <td className="p-3 font-medium text-slate-900">Security & Schemas</td>
                        <td className="p-3 font-mono text-slate-800">Pydantic v2 + OAuth2 JWT Bearer</td>
                        <td className="p-3">Input validation, password hashing (bcrypt), token security</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-sky-700">Document Engine</td>
                        <td className="p-3 font-medium text-slate-900">PDF Ingestion</td>
                        <td className="p-3 font-mono text-sky-800">PyMuPDF (fitz) + Regex Rules</td>
                        <td className="p-3">Page-level text extraction, section classification, metadata parsing</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-sky-700">AI & RAG</td>
                        <td className="p-3 font-medium text-slate-900">Dense Embeddings</td>
                        <td className="p-3 font-mono text-sky-800">BAAI/bge-small-en-v1.5</td>
                        <td className="p-3">384-dimensional dense semantic vectors for literature chunks</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-sky-700">AI & RAG</td>
                        <td className="p-3 font-medium text-slate-900">Lexical Retrieval</td>
                        <td className="p-3 font-mono text-sky-800">rank_bm25 (BM25Okapi)</td>
                        <td className="p-3">Exact keyword, formula, dataset, and author surname matching</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-sky-700">AI & RAG</td>
                        <td className="p-3 font-medium text-slate-900">Reranker & Fusion</td>
                        <td className="p-3 font-mono text-sky-800">RRF (k=60) + BAAI/bge-reranker-base</td>
                        <td className="p-3">Combines dense & sparse rankings, re-scores top candidates</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-purple-700">Generative AI</td>
                        <td className="p-3 font-medium text-slate-900">Synthesis Engine</td>
                        <td className="p-3 font-mono text-purple-800">OpenAI gpt-4o-mini</td>
                        <td className="p-3">9-stage gap formulation, counter-evidence checks, chat grounding</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-emerald-700">Persistence</td>
                        <td className="p-3 font-medium text-slate-900">Relational + Vector DB</td>
                        <td className="p-3 font-mono text-emerald-800">Neon Serverless PostgreSQL (pgvector)</td>
                        <td className="p-3">13 relational tables + native 384d vector cosine distance index</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-emerald-700">Persistence</td>
                        <td className="p-3 font-medium text-slate-900">Object Storage</td>
                        <td className="p-3 font-mono text-emerald-800">Neon S3 Object Storage (boto3)</td>
                        <td className="p-3">Raw PDF documents and extracted literature media blobs</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-amber-700">Publishing</td>
                        <td className="p-3 font-medium text-slate-900">Document Exporter</td>
                        <td className="p-3 font-mono text-amber-800">ReportLab + IEEE LaTeX Exporter</td>
                        <td className="p-3">Compiles survey reports, BibTeX entries, and downloadable PDFs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
