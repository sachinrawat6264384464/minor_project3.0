"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { 
  Workflow, 
  Layers, 
  Database, 
  Cpu, 
  Sparkles, 
  Server, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  FileText, 
  Search, 
  MessageSquare, 
  Key, 
  FileCode, 
  BookOpen, 
  Split, 
  Play, 
  Pause, 
  ZoomIn, 
  Eye, 
  Table2, 
  Network,
  Share2,
  ExternalLink,
  Info,
  ChevronRight,
  Filter,
  Check
} from "lucide-react";

export default function WorkingArchitecturePage() {
  const [activeSection, setActiveSection] = useState<"flow" | "erd" | "table" | "sequence">("flow");
  const [isAnimationActive, setIsAnimationActive] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<string | null>("PROJECTS");
  const [selectedNode, setSelectedNode] = useState<string | null>("GATEWAY");
  const [searchTableQuery, setSearchTableQuery] = useState("");
  const [activePipelineFilter, setActivePipelineFilter] = useState<"ALL" | "INGEST" | "RAG" | "GAPS">("ALL");

  // Relationships Table Data
  const relationshipsData = [
    {
      source: "User",
      sourceType: "Parent",
      relation: "owns",
      target: "Project",
      targetType: "Child",
      cardinality: "1 : N (One-to-Many)",
      meaning: "Ek researcher user multiple distinct research projects/workspaces bana sakta hai.",
      cascade: "CASCADE DELETE",
      fk: "projects.user_id -> users.id"
    },
    {
      source: "Project",
      sourceType: "Parent",
      relation: "contains",
      target: "Paper",
      targetType: "Child",
      cardinality: "1 : N (One-to-Many)",
      meaning: "Ek project ke andar multiple academic papers fetch ya upload hote hain.",
      cascade: "CASCADE DELETE",
      fk: "papers.project_id -> projects.id"
    },
    {
      source: "Paper",
      sourceType: "Parent",
      relation: "segmented into",
      target: "PaperSection",
      targetType: "Child",
      cardinality: "1 : N (One-to-Many)",
      meaning: "Ek paper structural academic headings (Abstract, Methodology, Limitations, Future Work) me divide hota hai.",
      cascade: "CASCADE DELETE",
      fk: "paper_sections.paper_id -> papers.id"
    },
    {
      source: "Paper",
      sourceType: "Parent",
      relation: "chunked into",
      target: "DocumentChunk",
      targetType: "Child",
      cardinality: "1 : N (One-to-Many)",
      meaning: "Ek paper ko 500-word sliding window (100w overlap) ke sath multiple chunks me toda jata hai.",
      cascade: "CASCADE DELETE",
      fk: "document_chunks.paper_id -> papers.id"
    },
    {
      source: "Project",
      sourceType: "Parent",
      relation: "scopes",
      target: "DocumentChunk",
      targetType: "Child",
      cardinality: "1 : N (One-to-Many)",
      meaning: "Retrieval ke waqt project-level vector boundary filter karne ke liye chunk me project_id foreign key hoti hai.",
      cascade: "SCOPED RETRIEVAL",
      fk: "document_chunks.project_id -> projects.id"
    },
    {
      source: "Project",
      sourceType: "Parent",
      relation: "has",
      target: "Conversation",
      targetType: "Child",
      cardinality: "1 : N (One-to-Many)",
      meaning: "Ek project me researcher multiple chat threads khol sakta hai.",
      cascade: "CASCADE DELETE",
      fk: "conversations.project_id -> projects.id"
    },
    {
      source: "Conversation",
      sourceType: "Parent",
      relation: "has",
      target: "Message",
      targetType: "Child",
      cardinality: "1 : N (One-to-Many)",
      meaning: "Ek chat thread ke andar multiple user prompts aur assistant answers store hote hain.",
      cascade: "CASCADE DELETE",
      fk: "messages.conversation_id -> conversations.id"
    },
    {
      source: "Project",
      sourceType: "Parent",
      relation: "tracks",
      target: "ResearchGapAnalysis",
      targetType: "Child",
      cardinality: "1 : N (One-to-Many)",
      meaning: "Ek project me user alag-alag topics par multiple gap analysis runs execute kar sakta hai.",
      cascade: "CASCADE DELETE",
      fk: "research_gap_analyses.project_id -> projects.id"
    },
    {
      source: "ResearchGapAnalysis",
      sourceType: "Parent",
      relation: "identifies",
      target: "CandidateGap",
      targetType: "Child",
      cardinality: "1 : N (One-to-Many)",
      meaning: "Ek analysis session me AI multiple research gaps generate karti hai.",
      cascade: "CASCADE DELETE",
      fk: "candidate_gaps.analysis_id -> research_gap_analyses.id"
    },
    {
      source: "CandidateGap",
      sourceType: "Parent",
      relation: "verified by",
      target: "GapEvidence",
      targetType: "Child",
      cardinality: "1 : N (One-to-Many)",
      meaning: "Ek gap ko substantiate ya refute karne ke liye multiple supporting/contradicting evidence snippets judte hain.",
      cascade: "CASCADE DELETE",
      fk: "gap_evidence.candidate_gap_id -> candidate_gaps.id"
    },
    {
      source: "Paper",
      sourceType: "Parent",
      relation: "provides",
      target: "GapEvidence",
      targetType: "Child",
      cardinality: "1 : N (One-to-Many)",
      meaning: "Ek paper ke paragraphs alag-alag gaps ke liye evidence ban sakte hain.",
      cascade: "SET NULL / REFERENCE",
      fk: "gap_evidence.paper_id -> papers.id"
    }
  ];

  // Filtered table
  const filteredTable = relationshipsData.filter(item => 
    item.source.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
    item.target.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
    item.relation.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
    item.meaning.toLowerCase().includes(searchTableQuery.toLowerCase())
  );

  // ERD Entities Details
  const erdEntities: Record<string, {
    title: string;
    table: string;
    color: string;
    fields: { name: string; type: string; isPk?: boolean; isFk?: boolean; ref?: string; desc: string }[];
    parents: string[];
    children: string[];
  }> = {
    USERS: {
      title: "Users",
      table: "users",
      color: "border-sky-500 bg-sky-950/40 text-sky-200",
      fields: [
        { name: "id", type: "UUID / String", isPk: true, desc: "Unique User Identifier" },
        { name: "email", type: "String (Unique)", desc: "Researcher account email" },
        { name: "hashed_password", type: "String", desc: "bcrypt hash token" },
        { name: "full_name", type: "String", desc: "Scholar Name & Title" },
        { name: "is_active", type: "Boolean", desc: "Account security status" },
        { name: "created_at", type: "DateTime", desc: "Registration timestamp" },
      ],
      parents: [],
      children: ["PROJECTS"]
    },
    PROJECTS: {
      title: "Projects",
      table: "projects",
      color: "border-blue-500 bg-blue-950/40 text-blue-200",
      fields: [
        { name: "id", type: "UUID / String", isPk: true, desc: "Primary Workspace Container ID" },
        { name: "user_id", type: "UUID / String", isFk: true, ref: "users.id", desc: "Foreign Key -> Owner User" },
        { name: "title", type: "String", desc: "Research Project Title" },
        { name: "research_topic", type: "String", desc: "Domain Scope (e.g. ViTs in CT Scans)" },
        { name: "created_at", type: "DateTime", desc: "Workspace creation date" },
      ],
      parents: ["USERS"],
      children: ["PAPERS", "CONVERSATIONS", "RESEARCH_GAP_ANALYSES", "DOCUMENT_CHUNKS", "REPORTS"]
    },
    PAPERS: {
      title: "Papers",
      table: "papers",
      color: "border-indigo-500 bg-indigo-950/40 text-indigo-200",
      fields: [
        { name: "id", type: "UUID / String", isPk: true, desc: "Paper Record Primary Key" },
        { name: "project_id", type: "UUID / String", isFk: true, ref: "projects.id", desc: "FK -> Parent Project" },
        { name: "doi", type: "String (Indexed)", desc: "Digital Object Identifier" },
        { name: "title", type: "String (Indexed)", desc: "Academic Publication Title" },
        { name: "authors", type: "JSON", desc: "List of authors and affiliations" },
        { name: "year", type: "Integer", desc: "Publication year" },
        { name: "citation_count", type: "Integer", desc: "Citation velocity metric" },
        { name: "file_hash", type: "String (SHA-256)", desc: "Deduplication digest" },
        { name: "ingestion_status", type: "Enum", desc: "PENDING | PROCESSING | INDEXED" },
        { name: "extracted_findings", type: "JSON", desc: "Extracted Limitations & Findings" },
      ],
      parents: ["PROJECTS"],
      children: ["PAPER_SECTIONS", "DOCUMENT_CHUNKS", "GAP_EVIDENCE"]
    },
    PAPER_SECTIONS: {
      title: "Paper Sections",
      table: "paper_sections",
      color: "border-purple-500 bg-purple-950/40 text-purple-200",
      fields: [
        { name: "id", type: "UUID / String", isPk: true, desc: "Section Record PK" },
        { name: "paper_id", type: "UUID / String", isFk: true, ref: "papers.id", desc: "FK -> Parent Paper" },
        { name: "section_name", type: "String", desc: "Abstract, Methodology, Limitations, Future Work" },
        { name: "start_page", type: "Integer", desc: "Page where heading begins" },
        { name: "end_page", type: "Integer", desc: "Page where heading ends" },
        { name: "content", type: "Text", desc: "Extracted verbatim section text" },
      ],
      parents: ["PAPERS"],
      children: []
    },
    DOCUMENT_CHUNKS: {
      title: "Document Chunks",
      table: "document_chunks",
      color: "border-cyan-500 bg-cyan-950/40 text-cyan-200",
      fields: [
        { name: "id", type: "UUID / String", isPk: true, desc: "Chunk Record PK" },
        { name: "paper_id", type: "UUID / String", isFk: true, ref: "papers.id", desc: "FK -> Parent Paper" },
        { name: "project_id", type: "UUID / String", isFk: true, ref: "projects.id", desc: "FK -> Scoped Project" },
        { name: "chunk_index", type: "Integer", desc: "Sequential passage index" },
        { name: "content", type: "Text", desc: "500-word sliding passage" },
        { name: "page_number", type: "Integer", desc: "1-indexed exact source page" },
        { name: "section_name", type: "String", desc: "Parent academic heading" },
        { name: "embedding", type: "Vector(384)", desc: "BGE dense semantic vector" },
      ],
      parents: ["PAPERS", "PROJECTS"],
      children: []
    },
    CONVERSATIONS: {
      title: "Conversations",
      table: "conversations",
      color: "border-emerald-500 bg-emerald-950/40 text-emerald-200",
      fields: [
        { name: "id", type: "UUID / String", isPk: true, desc: "Chat Session PK" },
        { name: "project_id", type: "UUID / String", isFk: true, ref: "projects.id", desc: "FK -> Parent Project" },
        { name: "title", type: "String", desc: "Conversation subject line" },
        { name: "created_at", type: "DateTime", desc: "Thread start timestamp" },
      ],
      parents: ["PROJECTS"],
      children: ["MESSAGES"]
    },
    MESSAGES: {
      title: "Messages",
      table: "messages",
      color: "border-teal-500 bg-teal-950/40 text-teal-200",
      fields: [
        { name: "id", type: "UUID / String", isPk: true, desc: "Message Record PK" },
        { name: "conversation_id", type: "UUID / String", isFk: true, ref: "conversations.id", desc: "FK -> Parent Chat" },
        { name: "role", type: "String", desc: "user | assistant | system" },
        { name: "content", type: "Text", desc: "Grounded conversational answer" },
        { name: "citations", type: "JSON", desc: "Array of verifiable citation anchors" },
      ],
      parents: ["CONVERSATIONS"],
      children: []
    },
    RESEARCH_GAP_ANALYSES: {
      title: "Research Gap Analyses",
      table: "research_gap_analyses",
      color: "border-amber-500 bg-amber-950/40 text-amber-200",
      fields: [
        { name: "id", type: "UUID / String", isPk: true, desc: "Gap Run PK" },
        { name: "project_id", type: "UUID / String", isFk: true, ref: "projects.id", desc: "FK -> Scoped Project" },
        { name: "topic", type: "String", desc: "Analysis domain scope" },
        { name: "status", type: "Enum", desc: "RUNNING | COMPLETED | FAILED" },
        { name: "progress", type: "Float", desc: "Percentage 0.0 - 1.0" },
        { name: "summary", type: "Text", desc: "Synthesis overview" },
      ],
      parents: ["PROJECTS"],
      children: ["CANDIDATE_GAPS"]
    },
    CANDIDATE_GAPS: {
      title: "Candidate Gaps",
      table: "candidate_gaps",
      color: "border-rose-500 bg-rose-950/40 text-rose-200",
      fields: [
        { name: "id", type: "UUID / String", isPk: true, desc: "Candidate Gap PK" },
        { name: "analysis_id", type: "UUID / String", isFk: true, ref: "research_gap_analyses.id", desc: "FK -> Gap Run" },
        { name: "title", type: "String", desc: "Gap formulation title" },
        { name: "category", type: "String", desc: "Generalization | Baselines | Reproducibility" },
        { name: "confidence_score", type: "Float", desc: "Confidence Metric (0.0 - 1.0)" },
        { name: "evidence_strength", type: "Enum", desc: "HIGH | MEDIUM | LOW" },
        { name: "potential_question", type: "Text", desc: "PhD research question" },
        { name: "suggested_experiment", type: "Text", desc: "Experimental benchmark setup" },
      ],
      parents: ["RESEARCH_GAP_ANALYSES"],
      children: ["GAP_EVIDENCE"]
    },
    GAP_EVIDENCE: {
      title: "Gap Evidence",
      table: "gap_evidence",
      color: "border-fuchsia-500 bg-fuchsia-950/40 text-fuchsia-200",
      fields: [
        { name: "id", type: "UUID / String", isPk: true, desc: "Evidence Snippet PK" },
        { name: "candidate_gap_id", type: "UUID / String", isFk: true, ref: "candidate_gaps.id", desc: "FK -> Parent Gap" },
        { name: "paper_id", type: "UUID / String", isFk: true, ref: "papers.id", desc: "FK -> Cited Paper" },
        { name: "paper_title", type: "String", desc: "Publication Title" },
        { name: "page_number", type: "String", desc: "Exact source page" },
        { name: "excerpt", type: "Text", desc: "Verbatim quote from section" },
        { name: "evidence_type", type: "Enum", desc: "SUPPORTING | CONTRADICTING" },
      ],
      parents: ["CANDIDATE_GAPS", "PAPERS"],
      children: []
    },
    REPORTS: {
      title: "Reports",
      table: "reports",
      color: "border-slate-500 bg-slate-900/60 text-slate-200",
      fields: [
        { name: "id", type: "UUID / String", isPk: true, desc: "Report Export PK" },
        { name: "project_id", type: "UUID / String", isFk: true, ref: "projects.id", desc: "FK -> Parent Project" },
        { name: "title", type: "String", desc: "Literature review document title" },
        { name: "format", type: "Enum", desc: "PDF | LATEX | MARKDOWN" },
        { name: "content", type: "Text", desc: "Compiled report text" },
      ],
      parents: ["PROJECTS"],
      children: []
    }
  };

  // 6 End-to-End Sequence Stages
  const sequenceSteps = [
    {
      num: "01",
      title: "User Sign In & Workspace Setup",
      trigger: "Researcher logs in or creates workspace",
      badge: "Session & Auth",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      flowDesc: "Researcher frontend par login karta hai -> FastAPI JWT authenticate karti hai -> Neon Postgres me projects table me entry create hoti hai.",
      source: "Client Frontend (/login, /workspace)",
      connector: "OAuth2 Password Flow + JWT Bearer",
      destination: "FastAPI Gateway (:8000) -> Neon PostgreSQL",
      dataPayload: '{ "email": "phd@oxford.ac.uk", "project_title": "Attention in Medical Imaging" }',
      resultState: "Created isolated project container with dedicated papers, chunks, chats, and gap collections."
    },
    {
      num: "02",
      title: "Discovery & Live Literature Search",
      trigger: "Researcher queries keywords or DOIs in Scholar Studio",
      badge: "External Aggregation",
      badgeColor: "bg-sky-500/20 text-sky-400 border-sky-500/30",
      flowDesc: "Frontend /scholar-studio me user query daalta hai -> FastAPI async service concurrent httpx call karti hai SerpAPI (Google Scholar), OpenAlex, aur Semantic Scholar ko -> Results deduplicate hoke frontend par staging list me show hote hain.",
      source: "Scholar Studio (/scholar-studio, /papers)",
      connector: "Asynchronous HTTPX Connection Pool",
      destination: "SerpAPI (Google Scholar) + OpenAlex + Semantic Scholar APIs",
      dataPayload: 'GET /api/v1/papers/scholar/search?query=vision+transformers+medical&limit=10',
      resultState: "Structured list with Title, Authors, Year, Citations, DOI, and Open-Access PDF links with staging checkboxes."
    },
    {
      num: "03",
      title: "PDF Ingestion & Section Parsing",
      trigger: "User checks papers and clicks 'Ingest / Add to Workspace'",
      badge: "Document Parsing",
      badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      flowDesc: "User papers select karke 'Ingest' click karta hai -> Background task PDF stream download karta hai -> SHA-256 hash check hoti hai -> PyMuPDF (fitz) layout aur page-level text extract karta hai -> Regex se sections (Limitations, Methodology, etc.) identify hote hain -> Raw PDF Neon S3 me jata hai, metadata papers aur paper_sections table me jata hai.",
      source: "FastAPI BackgroundTasks Queue",
      connector: "PyMuPDF (fitz) Stream Pipeline + AWS S3 Boto3",
      destination: "Neon S3 Object Storage + Neon PostgreSQL (papers, paper_sections)",
      dataPayload: '{ "file_hash": "e3b0c44298fc...", "sections": ["Abstract", "Methods", "Limitations", "Future Work"] }',
      resultState: "Deduplicated PDF saved in S3, structured metadata with 1-indexed page boundaries stored in DB."
    },
    {
      num: "04",
      title: "Section-Aware Chunking & Hybrid RAG Vector Indexing",
      trigger: "Automatic continuation following PDF parsing",
      badge: "Hybrid Embeddings",
      badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      flowDesc: "500-word sliding window (100-word overlap) se text chunk hota hai -> Dense vector (BAAI/bge-small-en-v1.5, 384 dimensions) generate hoke pgvector me save hota hai -> Sparse terms BM25Okapi index me store hote hain.",
      source: "RAG Ingestion Service",
      connector: "Sentence-Transformers + rank_bm25 Tokenizer",
      destination: "Neon pgvector (document_chunks table) + In-Memory BM25 Index",
      dataPayload: '{ "chunk_index": 12, "words": 500, "overlap": 100, "page": 6, "section": "Limitations", "dims": 384 }',
      resultState: "Dual-indexed document chunks ready for combined lexical keyword and semantic vector search."
    },
    {
      num: "05",
      title: "9-Stage Research Gap Discovery & Counter-Evidence",
      trigger: "User clicks 'Run Gap Analysis' in /research-gaps",
      badge: "Novelty Synthesis",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      flowDesc: "User /research-gaps me click karta hai -> System sirf Limitations aur Future Work sections filter karta hai -> OpenAI gpt-4o-mini taxonomy classification karti hai -> Counter-evidence check newer papers se verify karta hai ki gap already solve to nahi ho gaya -> Confidence score aur Validation Experiment plan generate hoke candidate_gaps aur gap_evidence tables me persist ho jate hain.",
      source: "9-Stage Gap Discovery Orchestrator",
      connector: "Structured JSON Output Constraints + OpenAI API",
      destination: "Neon PostgreSQL (candidate_gaps, gap_evidence tables)",
      dataPayload: '{ "topic": "CT Scans ViT", "candidate_gaps": 4, "counter_evidence_checks": 12, "confidence": 0.88 }',
      resultState: "Actionable research questions, taxonomy tags (Generalization/Baselines), and concrete experiment protocols."
    },
    {
      num: "06",
      title: "Grounded RAG Chat with Verifiable Citation Cards",
      trigger: "Researcher asks academic questions in Research Chat",
      badge: "Grounded Retrieval",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      flowDesc: "User question poochta hai -> Dense cosine match + Sparse lexical match dono run hote hain -> Reciprocal Rank Fusion (RRF k=60) aur Cross-Encoder Reranker se top chunks nikalte hain -> Strict Zero-Hallucination prompt ke sath OpenAI ko bheja jata hai -> Output me exact Paper Title, DOI, Page Number aur Excerpt ke sath Interactive Citation Cards render hote hain.",
      source: "Chat Controller (/api/v1/chat)",
      connector: "Reciprocal Rank Fusion (RRF k=60) + BGE Cross-Encoder Reranker",
      destination: "Client Chat UI (/chat/[id]) with Expandable Citation Cards",
      dataPayload: '{ "query": "What are current dataset limitations for ViTs?", "citations_count": 4, "pages": [6, 8, 11] }',
      resultState: "Verifiable, halluncination-free response with clickable page-level citations and IEEE LaTeX export."
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#070B14] text-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-6 md:p-8 max-w-[1440px] mx-auto w-full">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-royal-950 via-[#0C152B] to-[#0A1020] border border-royal-800/60 p-6 md:p-8 shadow-2xl mb-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-royal-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="px-3 py-1 rounded-full bg-royal-600/20 border border-royal-500/40 text-royal-300 font-bold text-xs flex items-center gap-1.5 shadow-sm">
                    <Workflow className="w-3.5 h-3.5 text-royal-400" />
                    Working Architecture & Execution Engine
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live System Synchronized
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  System Working Architecture & Visual Flow
                </h1>
                <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
                  Interactive operational flow of the AI Research Paper & Research Gap Finder. Features real-time visual data streams (blue laser pulses), relational entity model with 1:N cardinality, and deep step-by-step component interactions for classroom & client demonstrations.
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 self-start md:self-auto">
                <button
                  onClick={() => setIsAnimationActive(!isAnimationActive)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition shadow-lg ${
                    isAnimationActive 
                      ? "bg-royal-600/30 border-royal-500 text-royal-200 hover:bg-royal-600/40"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {isAnimationActive ? <Pause className="w-3.5 h-3.5 text-royal-300" /> : <Play className="w-3.5 h-3.5 text-slate-300" />}
                  {isAnimationActive ? "Laser Flow Active" : "Laser Flow Paused"}
                </button>
              </div>
            </div>

            {/* Quick Section Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2.5 mt-7 pt-6 border-t border-royal-900/80">
              {[
                { id: "flow", label: "1. Visual System Architecture (Animated Flow)", icon: Network },
                { id: "erd", label: "2. Visual Entity-Relationship (ER) Diagram", icon: Database },
                { id: "table", label: "3. Relationships & Cardinality Breakdown (Table)", icon: Table2 },
                { id: "sequence", label: "4. End-to-End Sequence & Component Interaction", icon: Layers },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      isActive
                        ? "bg-royal-600 text-white shadow-royal scale-[1.02]"
                        : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60"
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
          {/* SECTION 1: VISUAL SYSTEM ARCHITECTURE FLOW (PROPER BOXES) */}
          {/* ======================================================== */}
          {activeSection === "flow" && (
            <div className="space-y-6">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Filter className="w-4 h-4 text-royal-400" />
                  <span className="font-semibold text-slate-300">Highlight Pipeline Flow:</span>
                  {(["ALL", "INGEST", "RAG", "GAPS"] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setActivePipelineFilter(p)}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                        activePipelineFilter === p 
                          ? "bg-royal-600 text-white" 
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {p === "ALL" ? "All Pipelines" : p === "INGEST" ? "Pipeline 1: Sourcing & Ingest" : p === "RAG" ? "Pipeline 2: Hybrid RAG" : "Pipeline 3: 9-Stage Gap"}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                  Blue laser arrows represent active data exchange
                </div>
              </div>

              {/* Main Visual Canvas Container */}
              <div className="relative rounded-3xl bg-[#0B101E] border border-royal-800/60 p-6 md:p-8 shadow-2xl overflow-hidden">
                {/* SVG Flow Canvas for Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <defs>
                    <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="50%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#60A5FA" />
                    </linearGradient>
                    <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Connecting lines will match the layout grid */}
                  {/* Tier 1 -> Tier 2 */}
                  <path 
                    d="M 50% 120 L 50% 170" 
                    stroke="url(#laserGrad)" 
                    strokeWidth="2.5" 
                    fill="none" 
                    filter="url(#laserGlow)"
                    className={isAnimationActive ? "laser-beam" : ""}
                  />
                  {/* Tier 2 -> Pipelines */}
                  <path 
                    d="M 50% 250 L 25% 320 M 50% 250 L 50% 320 M 50% 250 L 75% 320" 
                    stroke="url(#laserGrad)" 
                    strokeWidth="2.5" 
                    fill="none" 
                    filter="url(#laserGlow)"
                    className={isAnimationActive ? "laser-beam" : ""}
                  />
                </svg>

                <div className="relative z-10 space-y-10">
                  {/* TIER 1: CLIENT PRESENTATION LAYER */}
                  <div className="border border-blue-500/30 rounded-2xl p-5 bg-gradient-to-b from-blue-950/40 to-slate-900/60 shadow-lg">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-500/20">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">1</span>
                        <h2 className="text-sm font-bold text-blue-200 tracking-wide uppercase">Tier 1: Client Presentation Layer (Next.js 15 + React 19 + Tailwind CSS)</h2>
                      </div>
                      <span className="text-[11px] font-semibold text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800">
                        Royal Blue Glassmorphic UI
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
                      {[
                        { title: "Scholar Studio", route: "/scholar-studio", icon: Search, desc: "Live Google Scholar search & interactive paper staging" },
                        { title: "Global Discovery", route: "/papers", icon: Globe, desc: "OpenAlex & Semantic Scholar multi-source query" },
                        { title: "Grounded Chat", route: "/chat/[id]", icon: MessageSquare, desc: "Zero-hallucination Q&A with expandable citation cards" },
                        { title: "9-Stage Gap Finder", route: "/research-gaps/[id]", icon: Sparkles, desc: "Automated bottleneck discovery & validation experiments" },
                        { title: "Compare & Export", route: "/compare", icon: FileText, desc: "Side-by-side matrix & IEEE LaTeX / PDF export" },
                      ].map((item, idx) => (
                        <div 
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-royal-500 transition group hover:shadow-royal cursor-pointer"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <item.icon className="w-4 h-4 text-royal-400 group-hover:text-royal-300 transition" />
                            <h3 className="font-bold text-xs text-white group-hover:text-royal-200">{item.title}</h3>
                          </div>
                          <span className="text-[10px] font-mono text-royal-300 bg-royal-950/60 px-1.5 py-0.5 rounded border border-royal-800 block w-fit mb-1.5">
                            {item.route}
                          </span>
                          <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FLOW ARROW 1 -> 2 */}
                  <div className="flex items-center justify-center my-2">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-royal-500/50 text-royal-300 text-xs font-mono shadow-royal">
                      <span className="w-2 h-2 rounded-full bg-royal-400 animate-ping" />
                      REST API / JSON Requests + JWT Bearer Tokens
                      <ArrowDown className="w-3.5 h-3.5 text-royal-400 animate-bounce" />
                    </div>
                  </div>

                  {/* TIER 2: API GATEWAY & CONTROLLERS */}
                  <div className="border border-indigo-500/40 rounded-2xl p-5 bg-gradient-to-b from-indigo-950/40 to-slate-900/60 shadow-lg">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-indigo-500/20">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">2</span>
                        <h2 className="text-sm font-bold text-indigo-200 tracking-wide uppercase">Tier 2: API Gateway & Security Layer (FastAPI :8000 + Python 3.12)</h2>
                      </div>
                      <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-800">
                        Swagger OpenAPI 3.0 /docs
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700">
                        <div className="flex items-center gap-2 mb-2 text-indigo-300 font-bold text-xs">
                          <Server className="w-4 h-4 text-indigo-400" />
                          Application Router & Middleware
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Asynchronous route handling, CORS middleware, Pydantic v2 schema validation, and standardized error envelopes.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700">
                        <div className="flex items-center gap-2 mb-2 text-indigo-300 font-bold text-xs">
                          <Key className="w-4 h-4 text-indigo-400" />
                          OAuth2 JWT Auth & Security Guard
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Stateless authentication, bcrypt password hashing, token expiration, and project isolation authorization checks.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700">
                        <div className="flex items-center gap-2 mb-2 text-indigo-300 font-bold text-xs">
                          <Split className="w-4 h-4 text-indigo-400" />
                          Asynchronous Background Tasks
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Non-blocking PDF stream ingestion, vector embeddings computation, and multi-stage gap analysis job processing.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FLOW ARROW 2 -> 3 */}
                  <div className="flex items-center justify-center my-2">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-royal-500/50 text-royal-300 text-xs font-mono shadow-royal">
                      <span className="w-2 h-2 rounded-full bg-royal-400 animate-ping" />
                      Dispatches to Dedicated Engine Pipelines
                      <ArrowDown className="w-3.5 h-3.5 text-royal-400 animate-bounce" />
                    </div>
                  </div>

                  {/* TIER 3: CORE PROCESSING PIPELINES */}
                  <div className="border border-sky-500/40 rounded-2xl p-5 bg-gradient-to-b from-sky-950/30 to-slate-900/60 shadow-lg">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-sky-500/20">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-sky-600 text-white font-extrabold text-xs flex items-center justify-center">3</span>
                        <h2 className="text-sm font-bold text-sky-200 tracking-wide uppercase">Tier 3: Core Processing Pipelines & Hybrid RAG Engines</h2>
                      </div>
                      <span className="text-[11px] font-semibold text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-800">
                        Multi-Strategy Parallel Processing
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Pipeline A */}
                      <div className={`p-4 rounded-2xl border transition-all ${activePipelineFilter === "INGEST" || activePipelineFilter === "ALL" ? "bg-slate-900/90 border-blue-500 shadow-royal" : "bg-slate-900/40 border-slate-800 opacity-60"}`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700">
                            Pipeline 1
                          </span>
                          <span className="text-xs font-bold text-blue-400">Literature Sourcing & Ingest</span>
                        </div>
                        <h3 className="font-bold text-sm text-white mb-2">PyMuPDF Section Ingestion</h3>
                        <ul className="space-y-2 text-xs text-slate-300">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                            <span><strong>Live Sourcing:</strong> SerpAPI (Scholar) + OpenAlex concurrent HTTPX fetch</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                            <span><strong>SHA-256 Hash:</strong> Deduplication check before byte storage</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                            <span><strong>Section Split:</strong> Regex heading detector (Limitations, Methods, Future Work)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                            <span><strong>Sliding Chunking:</strong> 500-word windows with 100-word overlap</span>
                          </li>
                        </ul>
                      </div>

                      {/* Pipeline B */}
                      <div className={`p-4 rounded-2xl border transition-all ${activePipelineFilter === "RAG" || activePipelineFilter === "ALL" ? "bg-slate-900/90 border-cyan-500 shadow-royal" : "bg-slate-900/40 border-slate-800 opacity-60"}`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700">
                            Pipeline 2
                          </span>
                          <span className="text-xs font-bold text-cyan-400">Dual-Retrieval Hybrid RAG</span>
                        </div>
                        <h3 className="font-bold text-sm text-white mb-2">Reciprocal Rank Fusion (RRF)</h3>
                        <ul className="space-y-2 text-xs text-slate-300">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                            <span><strong>Sparse Retrieval:</strong> BM25Okapi for exact formulas, algorithms & datasets</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                            <span><strong>Dense Retrieval:</strong> BAAI/bge-small-en-v1.5 (384d semantic vectors)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                            <span><strong>RRF Fusion (k=60):</strong> Unified candidate rank aggregation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                            <span><strong>Cross-Encoder:</strong> BGE Reranker scores top chunks for zero-hallucination</span>
                          </li>
                        </ul>
                      </div>

                      {/* Pipeline C */}
                      <div className={`p-4 rounded-2xl border transition-all ${activePipelineFilter === "GAPS" || activePipelineFilter === "ALL" ? "bg-slate-900/90 border-amber-500 shadow-royal" : "bg-slate-900/40 border-slate-800 opacity-60"}`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700">
                            Pipeline 3
                          </span>
                          <span className="text-xs font-bold text-amber-400">Novelty & Counter-Evidence</span>
                        </div>
                        <h3 className="font-bold text-sm text-white mb-2">9-Stage Research Gap Engine</h3>
                        <ul className="space-y-2 text-xs text-slate-300">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                            <span><strong>Targeted Scan:</strong> Isolates Limitations & Future Work sections</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                            <span><strong>Taxonomy:</strong> Generalization, Baselines, Reproducibility gaps</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                            <span><strong>Counter-Evidence:</strong> Checks newer papers to verify unresolved status</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                            <span><strong>Experiment Protocol:</strong> Synthesizes actionable test benches</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* FLOW ARROW 3 -> 4 & 5 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs font-mono shadow-royal">
                        <span>Database Persistence (SQLAlchemy 2.0)</span>
                        <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-purple-500/50 text-purple-300 text-xs font-mono shadow-royal">
                        <span>External API Connectors & LLM Prompts</span>
                        <ArrowDown className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                    </div>
                  </div>

                  {/* TIER 4 & 5: STORAGE & EXTERNAL CONNECTORS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* TIER 4: PERSISTENCE */}
                    <div className="border border-emerald-500/40 rounded-2xl p-5 bg-gradient-to-b from-emerald-950/30 to-slate-900/60 shadow-lg">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-500/20">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">4</span>
                          <h2 className="text-sm font-bold text-emerald-200 tracking-wide uppercase">Tier 4: Cloud Persistence Tier</h2>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                          Neon Serverless
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center gap-3">
                          <Database className="w-6 h-6 text-emerald-400 shrink-0" />
                          <div>
                            <h4 className="font-bold text-xs text-white">Neon PostgreSQL (13 Relational Tables)</h4>
                            <p className="text-[11px] text-slate-400">Stores Users, Projects, Papers, Sections, Conversations, Gaps & Evidence</p>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center gap-3">
                          <Cpu className="w-6 h-6 text-cyan-400 shrink-0" />
                          <div>
                            <h4 className="font-bold text-xs text-white">Neon pgvector Extension (384-dim Vectors)</h4>
                            <p className="text-[11px] text-slate-400">Sub-second cosine distance search directly on document_chunks table</p>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center gap-3">
                          <Server className="w-6 h-6 text-blue-400 shrink-0" />
                          <div>
                            <h4 className="font-bold text-xs text-white">Cloud S3 Object Storage Bucket (boto3)</h4>
                            <p className="text-[11px] text-slate-400">High-throughput binary PDF stream & extracted figure media storage</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TIER 5: EXTERNAL CONNECTORS */}
                    <div className="border border-purple-500/40 rounded-2xl p-5 bg-gradient-to-b from-purple-950/30 to-slate-900/60 shadow-lg">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-purple-500/20">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center">5</span>
                          <h2 className="text-sm font-bold text-purple-200 tracking-wide uppercase">Tier 5: External AI & Academic APIs</h2>
                        </div>
                        <span className="text-[11px] font-semibold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800">
                          Live Academic Web
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center gap-3">
                          <Search className="w-6 h-6 text-sky-400 shrink-0" />
                          <div>
                            <h4 className="font-bold text-xs text-white">Google Scholar API (via SerpAPI)</h4>
                            <p className="text-[11px] text-slate-400">Live academic indexing, citation counts, and BibTeX citations</p>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center gap-3">
                          <Globe className="w-6 h-6 text-indigo-400 shrink-0" />
                          <div>
                            <h4 className="font-bold text-xs text-white">OpenAlex & Semantic Scholar APIs</h4>
                            <p className="text-[11px] text-slate-400">Open-access DOI resolution and downloadable PDF URLs</p>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center gap-3">
                          <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />
                          <div>
                            <h4 className="font-bold text-xs text-white">OpenAI API (gpt-4o-mini)</h4>
                            <p className="text-[11px] text-slate-400">Strict zero-hallucination structured JSON prompts for gap synthesis & grounded Q&A</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 2: VISUAL ENTITY-RELATIONSHIP (ER) DIAGRAM        */}
          {/* ======================================================== */}
          {activeSection === "erd" && (
            <div className="space-y-6">
              {/* ERD Header & Inspector Banner */}
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-royal-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-royal-400" />
                    Interactive Relational Entity-Relationship Diagram (ERD)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Click any entity box to inspect its primary keys, foreign keys, and highlighted 1:N or N:1 relational pathways.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">PK: Primary Key</span>
                  <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">FK: Foreign Key</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">1 : N Cardinality</span>
                </div>
              </div>

              {/* ERD Canvas Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left/Middle: Entity Cards Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(erdEntities).map(([key, entity]) => {
                    const isSelected = selectedEntity === key;
                    const isParentOfSelected = selectedEntity ? erdEntities[selectedEntity]?.parents.includes(key) : false;
                    const isChildOfSelected = selectedEntity ? erdEntities[selectedEntity]?.children.includes(key) : false;

                    let borderHighlight = "border-slate-800 hover:border-slate-600";
                    if (isSelected) borderHighlight = "border-royal-500 ring-2 ring-royal-500/50 shadow-royal-lg";
                    else if (isParentOfSelected) borderHighlight = "border-amber-500 ring-1 ring-amber-500/50";
                    else if (isChildOfSelected) borderHighlight = "border-emerald-500 ring-1 ring-emerald-500/50";

                    return (
                      <div
                        key={key}
                        onClick={() => setSelectedEntity(key)}
                        className={`rounded-2xl bg-slate-900/90 p-4 border transition-all cursor-pointer ${borderHighlight}`}
                      >
                        {/* Table Header */}
                        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800">
                          <div>
                            <h3 className="font-bold text-sm text-white flex items-center gap-2">
                              {entity.title}
                              {isSelected && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-royal-600 text-white font-extrabold">
                                  SELECTED
                                </span>
                              )}
                            </h3>
                            <span className="text-[11px] font-mono text-slate-400">table: {entity.table}</span>
                          </div>

                          <div className="text-right">
                            {isParentOfSelected && (
                              <span className="text-[10px] font-extrabold text-amber-400 block">Parent (1)</span>
                            )}
                            {isChildOfSelected && (
                              <span className="text-[10px] font-extrabold text-emerald-400 block">Child (N)</span>
                            )}
                          </div>
                        </div>

                        {/* Fields List */}
                        <div className="space-y-1.5">
                          {entity.fields.slice(0, 5).map((field, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs py-0.5 border-b border-slate-800/40">
                              <div className="flex items-center gap-1.5">
                                {field.isPk && (
                                  <span className="text-[9px] font-bold px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                    PK
                                  </span>
                                )}
                                {field.isFk && (
                                  <span className="text-[9px] font-bold px-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                    FK
                                  </span>
                                )}
                                <span className="font-mono text-slate-200">{field.name}</span>
                              </div>
                              <span className="font-mono text-[11px] text-slate-400">{field.type}</span>
                            </div>
                          ))}
                          {entity.fields.length > 5 && (
                            <p className="text-[10px] text-slate-500 text-center pt-1 font-mono">
                              + {entity.fields.length - 5} additional attributes
                            </p>
                          )}
                        </div>

                        {/* Cardinality Connectors Summary */}
                        <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Children: {entity.children.length} (1:N)</span>
                          <span>Parents: {entity.parents.length} (N:1)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Selected Entity Deep Inspector Drawer */}
                {selectedEntity && erdEntities[selectedEntity] && (
                  <div className="lg:col-span-1 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0A1020] border border-royal-700/60 p-5 shadow-2xl h-fit sticky top-24">
                    <div className="pb-3 border-b border-royal-800">
                      <span className="text-[10px] font-mono font-bold text-royal-400 uppercase tracking-wider block mb-1">
                        Relational Entity Inspector
                      </span>
                      <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                        {erdEntities[selectedEntity].title}
                      </h3>
                      <span className="text-xs font-mono text-slate-400 block mt-0.5">
                        Physical Table: `{erdEntities[selectedEntity].table}`
                      </span>
                    </div>

                    {/* Parents & Children Badges */}
                    <div className="my-4 space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-amber-400 uppercase mb-1.5 flex items-center gap-1.5">
                          <ArrowRight className="w-3.5 h-3.5" /> Parents (N : 1 Relationships):
                        </h4>
                        {erdEntities[selectedEntity].parents.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {erdEntities[selectedEntity].parents.map(p => (
                              <button
                                key={p}
                                onClick={() => setSelectedEntity(p)}
                                className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-200 text-xs font-mono hover:bg-amber-900/60"
                              >
                                {p} &larr; (1:N)
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic">None (Root Entity)</p>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-emerald-400 uppercase mb-1.5 flex items-center gap-1.5">
                          <ArrowRight className="w-3.5 h-3.5" /> Children (1 : N Relationships):
                        </h4>
                        {erdEntities[selectedEntity].children.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {erdEntities[selectedEntity].children.map(c => (
                              <button
                                key={c}
                                onClick={() => setSelectedEntity(c)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs font-mono hover:bg-emerald-900/60"
                              >
                                {c} &rarr; (1:N)
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic">None (Terminal Leaf Entity)</p>
                        )}
                      </div>
                    </div>

                    {/* Complete Attributes Table */}
                    <div className="mt-4">
                      <h4 className="text-xs font-bold text-slate-300 uppercase mb-2">Complete Column Schema</h4>
                      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                        {erdEntities[selectedEntity].fields.map((f, i) => (
                          <div key={i} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono font-bold text-white flex items-center gap-1.5">
                                {f.name}
                                {f.isPk && <span className="text-[9px] px-1 bg-amber-500/20 text-amber-300 rounded border border-amber-500/40">PK</span>}
                                {f.isFk && <span className="text-[9px] px-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/40">FK</span>}
                              </span>
                              <span className="font-mono text-[11px] text-royal-400">{f.type}</span>
                            </div>
                            <p className="text-[11px] text-slate-400">{f.desc}</p>
                            {f.ref && (
                              <span className="text-[10px] text-amber-400/90 font-mono block mt-1">
                                References: {f.ref}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 3: RELATIONSHIPS & CARDINALITY BREAKDOWN TABLE    */}
          {/* ======================================================== */}
          {activeSection === "table" && (
            <div className="space-y-6">
              {/* Header with Search */}
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-royal-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Table2 className="w-5 h-5 text-royal-400" />
                    3. Relationships aur Cardinality ka Detailed Breakdown
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    System ke relational entities ke aapas ke connections, foreign keys aur cardinalities (1:N, N:1) ka exact table format:
                  </p>
                </div>

                <div className="w-full md:w-80">
                  <div className="flex items-center gap-2.5 bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-xl">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search entity, relation, or meaning..."
                      value={searchTableQuery}
                      onChange={(e) => setSearchTableQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs text-slate-200 placeholder-slate-500 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Styled Relational Table */}
              <div className="overflow-x-auto rounded-2xl border border-royal-800/60 bg-slate-900/90 shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-royal-950 to-slate-900 border-b border-royal-800 text-xs font-bold text-royal-200 uppercase tracking-wider">
                      <th className="py-3.5 px-4">#</th>
                      <th className="py-3.5 px-4">Source Entity</th>
                      <th className="py-3.5 px-4">Relation</th>
                      <th className="py-3.5 px-4">Target Entity</th>
                      <th className="py-3.5 px-4">Cardinality Type</th>
                      <th className="py-3.5 px-4">Foreign Key Link</th>
                      <th className="py-3.5 px-4 min-w-[280px]">Kaam aur Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
                    {filteredTable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-royal-950/40 transition">
                        <td className="py-3.5 px-4 font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-400" />
                          {row.source}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded font-mono text-royal-300 bg-royal-950/80 border border-royal-800">
                            {row.relation}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-300">
                          {row.target}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-royal-600/20 text-royal-300 border border-royal-500/30 whitespace-nowrap">
                            {row.cardinality}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                          {row.fk}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 leading-relaxed font-normal">
                          {row.meaning}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SECTION 4: END-TO-END SEQUENCE & COMPONENT INTERACTION   */}
          {/* ======================================================== */}
          {activeSection === "sequence" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-royal-800/80">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-royal-400" />
                  4. End-to-End Sequence & Component Interaction (Kaun Kisse Connect Hai)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Researcher entry se lekar final verifiable citations aur thesis novelty check tak ka complete execution cycle:
                </p>
              </div>

              {/* Step Cards with Visual Sequences */}
              <div className="space-y-5">
                {sequenceSteps.map((step, idx) => (
                  <div 
                    key={idx}
                    className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0B1120] to-slate-900 border border-slate-800 hover:border-royal-600/60 transition shadow-xl relative overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-royal-600 text-white font-extrabold text-sm flex items-center justify-center shadow-royal">
                          {step.num}
                        </span>
                        <div>
                          <h3 className="font-bold text-base text-white">{step.title}</h3>
                          <span className="text-xs text-slate-400">{step.trigger}</span>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${step.badgeColor}`}>
                        {step.badge}
                      </span>
                    </div>

                    {/* Detailed Hindi/English Explanation */}
                    <div className="p-3.5 rounded-xl bg-royal-950/40 border border-royal-800/60 text-xs text-royal-200 mb-4 leading-relaxed">
                      <span className="font-bold text-white block mb-0.5">Execution Step:</span>
                      {step.flowDesc}
                    </div>

                    {/* Connectivity Flow Diagram */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Source Component:</span>
                        <p className="font-bold text-white">{step.source}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-royal-900 text-xs flex flex-col justify-center">
                        <span className="text-[10px] text-royal-400 uppercase font-mono block mb-1">Communication Protocol:</span>
                        <p className="font-bold text-royal-300 font-mono text-[11px] flex items-center gap-1.5">
                          <ArrowRight className="w-3.5 h-3.5 text-royal-400" />
                          {step.connector}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Target Component / DB:</span>
                        <p className="font-bold text-emerald-300">{step.destination}</p>
                      </div>
                    </div>

                    {/* Data Payload & Deliverable */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
                        <span className="text-[10px] text-slate-500 uppercase block mb-1">Sample Payload / API Call:</span>
                        <code>{step.dataPayload}</code>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-200">
                        <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">Deliverable Outcome:</span>
                        <p>{step.resultState}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
