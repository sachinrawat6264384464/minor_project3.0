"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Sparkles, 
  ArrowRight, 
  X, 
  ExternalLink, 
  Cpu, 
  CheckCircle2, 
  Search,
  BookOpen,
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCw
} from "lucide-react";
import Link from "next/link";

interface AcademicDoc {
  id: string;
  title: string;
  shortTitle: string;
  venue: string;
  year: number;
  doi: string;
  category: string;
  pageCount: number;
  sections: {
    abstract: string;
    methods: string;
    limitations: string;
    keyMetric: string;
  };
  chunkSnippet: string;
  nearestVectorSim: number;
}

const ACADEMIC_DOCS: AcademicDoc[] = [
  {
    id: "doc-1",
    title: "Advancements in Vision Transformers for High-Res Medical Image Segmentation",
    shortTitle: "Medical ViT Segmentation",
    venue: "IEEE TNNLS",
    year: 2025,
    doi: "10.1109/TNNLS.2025.3401",
    category: "Vision Transformers",
    pageCount: 14,
    sections: {
      abstract: "Evaluates multi-head self-attention mechanisms across 45 MRI & CT benchmarks.",
      methods: "Hierarchical Swin Transformer with shifted windows and linear attention approximations.",
      limitations: "Severe latency degradation during high-res 3D volumetric tensor computation.",
      keyMetric: "Dice score: 89.4% (vs 86.1% baseline)"
    },
    chunkSnippet: "Page 7, Section 4.2 [Limitations]: 'Under out-of-distribution blur and adversarial hospital noise, boundary prediction confidence collapses by 31.4%.'",
    nearestVectorSim: 0.942
  },
  {
    id: "doc-2",
    title: "Hybrid Retrieval-Augmented Generation for Verifiable Scientific Discovery",
    shortTitle: "Hybrid RAG & Reciprocal Rank",
    venue: "ACM Computing Surveys",
    year: 2024,
    doi: "10.1145/3602102.360214",
    category: "Hybrid RAG Core",
    pageCount: 22,
    sections: {
      abstract: "Formulates Reciprocal Rank Fusion combining 384d BGE dense embeddings with sparse BM25Okapi.",
      methods: "Two-stage retrieval pipeline: Dense vector similarity filtered by lexical keyword match and Cross-Encoder rerank.",
      limitations: "Lack of standard benchmark for long-context multi-document cross-referencing in peer review.",
      keyMetric: "Citation accuracy: 99.2% verified"
    },
    chunkSnippet: "Page 11, Section 5 [Discussion]: 'Lexical matching is essential for non-natural technical terms such as mathematical symbols and author identifiers.'",
    nearestVectorSim: 0.918
  },
  {
    id: "doc-3",
    title: "Automated Research Gap Identification via Counter-Evidence Synthesis",
    shortTitle: "9-Stage Gap Discovery",
    venue: "JAIR (Journal of AI Research)",
    year: 2024,
    doi: "10.1613/jair.1.14920",
    category: "Research Gap Engine",
    pageCount: 18,
    sections: {
      abstract: "Introduces an automated 9-stage extraction protocol verifying paper limitations against subsequent publications.",
      methods: "PyMuPDF structural parsing targeting 'Limitations', 'Threats to Validity', and 'Future Work'.",
      limitations: "Requires human-in-the-loop validation for clinical or high-consequence hypothesis engineering.",
      keyMetric: "Novelty correlation: 0.88 with senior reviewers"
    },
    chunkSnippet: "Page 4, Section 3.1 [Extraction Protocol]: 'Limitation claims are indexed and counter-queried against Google Scholar via SerpAPI to eliminate previously solved problems.'",
    nearestVectorSim: 0.895
  },
  {
    id: "doc-4",
    title: "Parameter-Efficient Fine-Tuning Benchmarks on Scientific Knowledge Graphs",
    shortTitle: "PEFT & Graph Grounding",
    venue: "NeurIPS 2024",
    year: 2024,
    doi: "10.5555/neurips.2024.912",
    category: "Graph & Fine-Tuning",
    pageCount: 16,
    sections: {
      abstract: "Evaluates LoRA, QLoRA, and Prefix-Tuning for grounding generative models on complex scientific graphs.",
      methods: "Low-rank adaptation applied to transformer projection weights combined with entity-level graph embeddings.",
      limitations: "Omission of multi-hop relation constraints causes degraded reasoning across indirect citations.",
      keyMetric: "Parameter reduction: 98.2% with 94% retention"
    },
    chunkSnippet: "Page 9, Section 4.4 [Baseline Deficiencies]: 'Prior literature failed to compare against PEFT baselines when asserting multi-step reasoning capabilities.'",
    nearestVectorSim: 0.867
  },
  {
    id: "doc-5",
    title: "Zero-Hallucination Grounding in Scholarly Literature Synthesis",
    shortTitle: "Zero-Hallucination Synthesis",
    venue: "Nature Machine Intelligence",
    year: 2025,
    doi: "10.1038/s42256-025-0012",
    category: "LLM Grounding",
    pageCount: 20,
    sections: {
      abstract: "Defines strict verbatim attribution constraints preventing hallucinated claims during academic synthesis.",
      methods: "Constrained decoding with token-level source attribution masking and citation card verification.",
      limitations: "Strict grounding triggers 'Insufficient Evidence' fallbacks when cross-domain extrapolation is sought.",
      keyMetric: "Hallucination rate: <0.2% on PubMedQA"
    },
    chunkSnippet: "Page 15, Section 6.2: 'If a claim cannot be attributed to an exact page number and verbatim excerpt, the generation layer rejects the sentence.'",
    nearestVectorSim: 0.854
  },
  {
    id: "doc-6",
    title: "Neon pgvector: Serverless Scaling for Academic Embedding Indexes",
    shortTitle: "Serverless pgvector Store",
    venue: "VLDB 2025",
    year: 2025,
    doi: "10.14778/3551793.355180",
    category: "Vector Database",
    pageCount: 12,
    sections: {
      abstract: "Demonstrates HNSW indexing over 384-dimensional sentence vectors within serverless PostgreSQL.",
      methods: "Hierarchical Navigable Small World graphs partitioned by academic domain and project IDs.",
      limitations: "Cold-start latency upon resumption of idle serverless compute branches.",
      keyMetric: "Query latency: 11ms at 1M vectors"
    },
    chunkSnippet: "Page 6, Section 3.3 [HNSW Tuning]: 'Setting m=16, ef_construction=64 guarantees 98.6% recall for cosine distance retrieval.'",
    nearestVectorSim: 0.841
  }
];

export default function CylinderOrbitalShowcase3D() {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [activeDoc, setActiveDoc] = useState<AcademicDoc | null>(null);
  const [selectedDocForModal, setSelectedDocForModal] = useState<AcademicDoc | null>(null);
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);

  // Auto rotation
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.35) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Drag interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseXRef.current = e.clientX;
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMouseXRef.current;
    lastMouseXRef.current = e.clientX;
    setRotationAngle((prev) => (prev + deltaX * 0.45) % 360);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const count = ACADEMIC_DOCS.length;
  const radius = 330; // Radius of 3D orbital cylinder in pixels

  return (
    <div 
      className="relative w-full py-16 px-4 md:px-8 bg-black overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 3D Perspective Grid Floor on bottom */}
      <div className="absolute inset-x-0 bottom-0 h-[380px] perspective-grid-floor opacity-45 pointer-events-none z-0" />

      {/* Top Header & Section Tag */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-black text-[11px] font-mono font-bold uppercase tracking-widest rounded-full mb-4 shadow-[0_0_20px_rgba(255,255,255,0.7)]">
          <Sparkles className="w-3.5 h-3.5" />
          INTERVIEW QUESTION // 360° ARCHITECTURE
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase font-sans mb-3 leading-none">
          WHAT IS <span className="underline decoration-white decoration-4 underline-offset-8">RAG</span>, AND HOW DOES IT WORK <span className="underline decoration-white decoration-4 underline-offset-8">INTERNALLY</span>?
        </h2>

        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-sans mt-4">
          Explain it with verifiable 3D indexed documents. Drag or scrub the 360° cylinder to inspect how our PyMuPDF parser, 384d BGE vector embeddings, and citation cards index every paper.
        </p>

        {/* Orbit Controls */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setRotationAngle((prev) => (prev - 45) % 360)}
            className="p-2 rounded-full border border-white/20 bg-black/60 text-white hover:bg-white hover:text-black transition"
            title="Rotate Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition flex items-center gap-2 ${
              isAutoRotating 
                ? "bg-white text-black font-bold border-white shadow-[0_0_12px_rgba(255,255,255,0.6)]" 
                : "bg-black/60 text-slate-300 border-white/20 hover:text-white"
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? "animate-spin" : ""}`} />
            {isAutoRotating ? "Orbiting (360° Active)" : "Orbit Paused (Drag to Scrub)"}
          </button>

          <button
            onClick={() => setRotationAngle((prev) => (prev + 45) % 360)}
            className="p-2 rounded-full border border-white/20 bg-black/60 text-white hover:bg-white hover:text-black transition"
            title="Rotate Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Cylindrical Orbit Stage */}
      <div 
        className="relative w-full h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing perspective-stage z-10"
        onMouseDown={handleMouseDown}
      >
        <div 
          className="relative w-[260px] h-[340px] preserve-3d transition-transform duration-75"
          style={{
            transform: `rotateX(-10deg) rotateY(${rotationAngle}deg)`,
          }}
        >
          {ACADEMIC_DOCS.map((doc, index) => {
            const angle = (360 / count) * index;
            const isHovered = activeDoc?.id === doc.id;

            return (
              <div
                key={doc.id}
                onMouseEnter={() => {
                  setActiveDoc(doc);
                  setIsAutoRotating(false);
                }}
                onMouseLeave={() => {
                  setActiveDoc(null);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDocForModal(doc);
                }}
                className="absolute inset-0 w-[240px] h-[320px] rounded-lg transition-all duration-300 preserve-3d"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "visible",
                }}
              >
                {/* Wireframe Document Card (Matching User's Reference Screenshots) */}
                <div 
                  className={`relative w-full h-full p-4 rounded-lg bg-black/90 border transition-all duration-300 flex flex-col justify-between ${
                    isHovered 
                      ? "border-white bg-black shadow-[0_0_35px_rgba(255,255,255,0.7)] scale-105" 
                      : "border-white/40 hover:border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                  }`}
                >
                  {/* Subtle Wireframe Paper Fold Icon & Category */}
                  <div>
                    <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-white" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                          {doc.category}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-white/70 bg-white/10 px-1.5 py-0.5 rounded">
                        P.{doc.pageCount}
                      </span>
                    </div>

                    {/* Paper Title Wireframe Header */}
                    <div className="h-1 bg-white w-2/3 mb-2 rounded-full" />
                    <h3 className="text-xs font-bold text-white font-sans leading-snug line-clamp-2 mb-3">
                      {doc.shortTitle}
                    </h3>

                    {/* Wireframe Mock Text Lines (like in reference screenshot) */}
                    <div className="space-y-1.5 py-1">
                      <div className="h-0.5 bg-white/70 w-full rounded" />
                      <div className="h-0.5 bg-white/50 w-5/6 rounded" />
                      <div className="h-0.5 bg-white/40 w-4/6 rounded" />
                      <div className="h-0.5 bg-white/60 w-3/4 rounded" />
                    </div>

                    {/* Extracted limitation badge */}
                    <div className="mt-3 p-2 bg-white/5 border border-white/15 rounded text-[10px] font-sans text-slate-300 line-clamp-3">
                      <span className="text-white font-bold block mb-0.5">PyMuPDF Ingestion:</span>
                      {doc.sections.limitations}
                    </div>
                  </div>

                  {/* Bottom Metadata & Vector Score */}
                  <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-white/80">{doc.venue}</span>
                    <span className="px-1.5 py-0.5 bg-white text-black font-bold rounded text-[9px]">
                      Sim: {doc.nearestVectorSim}
                    </span>
                  </div>

                  {/* Corner Glow Highlight when hovered */}
                  {isHovered && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-[0_0_12px_#ffffff]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Active Card Inspector Bar */}
      <div className="relative z-20 max-w-3xl mx-auto mt-4 p-4 rounded-xl bg-black/90 border border-white/20 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-slate-400">Selected Paper Node:</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-white text-black rounded font-mono">
              {activeDoc ? activeDoc.venue : "HOVER ANY PAPER"}
            </span>
          </div>
          <p className="text-xs text-white font-sans font-medium line-clamp-1">
            {activeDoc ? activeDoc.title : "Hover or click on any 3D wireframe paper in the cylinder orbit above to preview full RAG chunks."}
          </p>
        </div>

        <button
          onClick={() => {
            if (activeDoc) setSelectedDocForModal(activeDoc);
            else setSelectedDocForModal(ACADEMIC_DOCS[0]);
          }}
          className="px-4 py-2 bg-white hover:bg-slate-200 text-black font-bold text-xs font-mono uppercase tracking-wider rounded-lg transition flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.4)] whitespace-nowrap"
        >
          Inspect Ingestion Details <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Modal for Selected Paper */}
      <AnimatePresence>
        {selectedDocForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="relative w-full max-w-2xl bg-black border border-white/40 p-6 md:p-8 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)] text-left text-white max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDocForModal(null)}
                className="absolute top-6 right-6 p-1.5 rounded-full border border-white/20 text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-white text-black font-mono font-bold text-[10px] rounded uppercase">
                  {selectedDocForModal.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedDocForModal.venue} // {selectedDocForModal.year}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold font-sans text-white mb-2 leading-tight">
                {selectedDocForModal.title}
              </h2>
              <p className="text-xs font-mono text-slate-400 mb-6">
                DOI: {selectedDocForModal.doi} | Pages: {selectedDocForModal.pageCount}
              </p>

              {/* Sections Breakdown */}
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-white/5 border border-white/15 rounded-lg">
                  <span className="text-white font-mono font-bold block mb-1 uppercase tracking-wider text-[11px]">
                    1. PyMuPDF Ingestion & Abstract:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{selectedDocForModal.sections.abstract}</p>
                </div>

                <div className="p-3.5 bg-white/5 border border-white/15 rounded-lg">
                  <span className="text-white font-mono font-bold block mb-1 uppercase tracking-wider text-[11px]">
                    2. Methodology & Architecture:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{selectedDocForModal.sections.methods}</p>
                </div>

                <div className="p-3.5 bg-white/10 border border-white/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-mono font-bold uppercase tracking-wider text-[11px]">
                      3. Extracted Research Limitation (Candidate Gap):
                    </span>
                    <span className="text-[10px] bg-white text-black font-mono font-bold px-1.5 py-0.5 rounded">
                      PAGE-LEVEL CITATION
                    </span>
                  </div>
                  <p className="text-slate-200 leading-relaxed italic">{selectedDocForModal.chunkSnippet}</p>
                </div>

                <div className="p-3.5 bg-white/5 border border-white/15 rounded-lg flex items-center justify-between">
                  <span className="text-slate-400 font-mono">BGE 384d Cosine Similarity:</span>
                  <span className="text-white font-mono font-bold text-sm">
                    {selectedDocForModal.nearestVectorSim} / 1.000
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-slate-400">
                  Ready for Grounded RAG Chat & 9-Stage Gap Discovery
                </span>

                <Link
                  href="/scholar-studio"
                  className="px-5 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-slate-200 transition flex items-center gap-2"
                >
                  Open in Scholar Studio <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
