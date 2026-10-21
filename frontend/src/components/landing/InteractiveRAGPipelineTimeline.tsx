"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Database, 
  Cpu, 
  FileText, 
  CheckCircle2, 
  Terminal,
  ShieldAlert,
  Search,
  BookOpen
} from "lucide-react";

interface PipelineStep {
  id: string;
  label: string;
  sublabel: string;
  pillType: "outline" | "solid";
  iconName: string;
  details: {
    title: string;
    description: string;
    techStack: string[];
    samplePayload: string;
  };
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: "step-1",
    label: "External data",
    sublabel: "Academic literature ingestion",
    pillType: "outline",
    iconName: "FileText",
    details: {
      title: "1. Multi-Source Literature Ingestion",
      description: "Harvests open-access papers across OpenAlex, Semantic Scholar, and SerpAPI Google Scholar. Custom PyMuPDF engine parses PDF streams into 500-word sliding windows preserving exact page numbers.",
      techStack: ["PyMuPDF fitz", "SerpAPI", "OpenAlex REST", "DOI Deduplication"],
      samplePayload: `{
  "paper_doi": "10.1109/TNNLS.2025.3401",
  "section": "Limitations",
  "page_number": 7,
  "chunk_word_count": 482,
  "content": "Under out-of-distribution blur and adversarial hospital noise, boundary prediction collapses..."
}`
    }
  },
  {
    id: "step-2",
    label: "Retrieve",
    sublabel: "Hybrid dense + sparse fusion",
    pillType: "outline",
    iconName: "Search",
    details: {
      title: "2. Dual Multi-Strategy Retrieval (RRF)",
      description: "Executes simultaneous Dense Cosine similarity via BAAI/bge-small-en-v1.5 (384d) in Neon pgvector and Sparse keyword matching via BM25Okapi. Reciprocal Rank Fusion combines both candidate ranks.",
      techStack: ["Neon pgvector (384d)", "BAAI/bge-small-en-v1.5", "rank_bm25", "RRF k=60"],
      samplePayload: `{
  "query_embedding_dim": 384,
  "dense_top_k": 30,
  "sparse_bm25_top_k": 30,
  "fused_rrf_top_k": 5,
  "top_candidate_score": 0.0328,
  "rerank_model": "BAAI/bge-reranker-base"
}`
    }
  },
  {
    id: "step-3",
    label: "LLM",
    sublabel: "Zero-hallucination prompt augment",
    pillType: "outline",
    iconName: "Cpu",
    details: {
      title: "3. Grounded Context Augmentation",
      description: "Injects top retrieved chunks into the prompt with strict attribution guardrails. Instructs OpenAI gpt-4o-mini to reject any statement not grounded in a cited page and excerpt.",
      techStack: ["gpt-4o-mini", "Zero-Hallucination Prompting", "Verbatim Citation Anchors"],
      samplePayload: `{
  "system_role": "Strict Academic Scholar",
  "constraints": [
    "Ground every claim with [Source X, Page Y]",
    "If evidence is missing, trigger Insufficient Evidence fallback"
  ],
  "injected_chunks_count": 3
}`
    }
  },
  {
    id: "step-4",
    label: "Answer",
    sublabel: "Verifiable citation cards",
    pillType: "solid",
    iconName: "CheckCircle2",
    details: {
      title: "4. Grounded Synthesis + Citation Cards",
      description: "Generates synthesized scholarly answers accompanied by interactive Citation Cards showing paper title, active DOI link, page index, and verbatim excerpt. Formulates candidate research gaps with counter-evidence validation.",
      techStack: ["Citation Card Builder", "9-Stage Gap Engine", "IEEE LaTeX Exporter", "Novelty Index"],
      samplePayload: `{
  "answer_text": "Vision Transformers exhibit high degradation under hospital sensor blur [Source 1, Page 7].",
  "citation_cards": [
    {
      "source_id": "1",
      "paper": "Advancements in ViT",
      "doi": "10.1109/TNNLS.2025.3401",
      "page": 7,
      "excerpt": "boundary prediction confidence collapses by 31.4%"
    }
  ],
  "counter_evidence_verified": true
}`
    }
  }
];

export default function InteractiveRAGPipelineTimeline() {
  const [activeStepIndex, setActiveStepIndex] = useState(3); // Default on "Answer" (as in Image 4)
  const currentStep = PIPELINE_STEPS[activeStepIndex];

  return (
    <div className="relative w-full py-20 px-4 md:px-8 bg-black text-white font-sans overflow-hidden border-t border-b border-white/10">
      
      {/* Background Starfield Canvas Simulation */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        
        {/* Core Explainer Statement (Matching Reference Image 4) */}
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-300 max-w-3xl mx-auto mb-14 leading-relaxed font-sans">
          An LLM first gets <span className="text-white font-black underline decoration-white decoration-2 underline-offset-4">relevant info</span> from{" "}
          <span className="text-white font-black underline decoration-white decoration-2 underline-offset-4">external data</span>, then{" "}
          <span className="text-white font-black underline decoration-white decoration-2 underline-offset-4">generates</span> the answer.
        </h3>

        {/* MASSIVE R - A - G ACRONYM BREAKDOWN (Exact Match from User's Reference Screenshot 4) */}
        <div className="max-w-2xl mx-auto text-left space-y-8 mb-16 pl-4 md:pl-12">
          
          {/* R - Retrieval */}
          <div className="group cursor-pointer" onClick={() => setActiveStepIndex(1)}>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-none font-sans group-hover:drop-shadow-[0_0_20px_#ffffff] transition">
                R
              </span>
              <span className="text-3xl sm:text-4xl md:text-5xl font-normal text-white font-sans tracking-tight">
                etrieval
              </span>
            </div>
            <p className="text-slate-400 font-mono text-sm md:text-base mt-1 tracking-wider pl-1">
              fetch relevant info
            </p>
          </div>

          {/* A - Augmented */}
          <div className="group cursor-pointer" onClick={() => setActiveStepIndex(2)}>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-none font-sans group-hover:drop-shadow-[0_0_20px_#ffffff] transition">
                A
              </span>
              <span className="text-3xl sm:text-4xl md:text-5xl font-normal text-white font-sans tracking-tight">
                ugmented
              </span>
            </div>
            <p className="text-slate-400 font-mono text-sm md:text-base mt-1 tracking-wider pl-1">
              add it to the prompt
            </p>
          </div>

          {/* G - Generation */}
          <div className="group cursor-pointer" onClick={() => setActiveStepIndex(3)}>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-none font-sans group-hover:drop-shadow-[0_0_20px_#ffffff] transition">
                G
              </span>
              <span className="text-3xl sm:text-4xl md:text-5xl font-normal text-white font-sans tracking-tight">
                eneration
              </span>
            </div>
            <p className="text-slate-400 font-mono text-sm md:text-base mt-1 tracking-wider pl-1">
              LLM writes the answer
            </p>
          </div>

        </div>

        {/* MOVEABLE DYNAMIC PIPELINE PILLS (Exact Match from User's Screenshot 4) */}
        <div className="relative pt-6 pb-4">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6">
            {PIPELINE_STEPS.map((step, idx) => {
              const isSelected = activeStepIndex === idx;

              return (
                <div key={step.id} className="flex items-center gap-2 sm:gap-4 md:gap-6">
                  {/* Pipeline Pill Button */}
                  <button
                    onClick={() => setActiveStepIndex(idx)}
                    className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                      step.pillType === "solid" || isSelected
                        ? "bg-white text-black font-bold shadow-[0_0_25px_rgba(255,255,255,0.8)] scale-105"
                        : "bg-black text-white border border-white hover:border-white hover:bg-white/10"
                    }`}
                  >
                    {step.label}
                  </button>

                  {/* Connecting Arrow (Except after last pill) */}
                  {idx < PIPELINE_STEPS.length - 1 && (
                    <div className="text-slate-400 font-mono text-sm select-none">
                      ➔
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* "before generating" Subtext Annotation (Direct from Reference Screenshot 4) */}
          <div className="mt-3 text-center">
            <span className="font-mono text-xs text-slate-400 tracking-wider">
              before generating
            </span>
          </div>
        </div>

        {/* INTERACTIVE STAGE DRILL-DOWN CARD */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="mt-10 p-6 md:p-8 rounded-2xl bg-white/5 border border-white/20 text-left backdrop-blur-md shadow-[0_0_40px_rgba(255,255,255,0.06)]"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              
              {/* Left Column: Stage Explanation */}
              <div className="space-y-4 md:w-3/5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-white text-black font-mono font-bold text-[10px] rounded uppercase">
                    Stage 0{activeStepIndex + 1}
                  </span>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    {currentStep.sublabel}
                  </span>
                </div>

                <h4 className="text-lg md:text-xl font-bold font-sans text-white">
                  {currentStep.details.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {currentStep.details.description}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {currentStep.details.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white/10 border border-white/20 rounded font-mono text-[10px] text-white"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Live JSON / Execution Payload */}
              <div className="md:w-2/5">
                <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-2 font-mono text-[10px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-white">
                    <Terminal className="w-3.5 h-3.5 text-white" />
                    Internal Pipeline Telemetry
                  </span>
                  <span className="text-emerald-400">STATUS: 200 OK</span>
                </div>

                <pre className="p-3 bg-black/80 border border-white/15 rounded-lg text-[11px] font-mono text-slate-200 overflow-x-auto leading-tight">
                  <code>{currentStep.details.samplePayload}</code>
                </pre>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
