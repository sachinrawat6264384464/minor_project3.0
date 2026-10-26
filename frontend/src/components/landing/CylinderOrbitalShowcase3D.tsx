"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  X, 
  Cpu, 
  Layers,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  MoveHorizontal,
  ExternalLink,
  RotateCw,
  Search,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export interface AcademicDoc {
  id: string;
  title: string;
  shortTitle: string;
  venue: string;
  year: number;
  doi: string;
  category: string;
  pageCount: number;
  techStack: string;
  pipelineRole: string;
  specHeader: string;
  specDetails: string;
  keyMetric: string;
  nearestVectorSim: number;
  sections: {
    abstract: string;
    methods: string;
    limitations: string;
    keyMetric: string;
  };
  chunkSnippet: string;
}

const ACADEMIC_DOCS: AcademicDoc[] = [
  {
    id: "tech-1",
    title: "Dual-Path Hybrid RAG: Reciprocal Rank Fusion (BGE-384 + BM25Okapi)",
    shortTitle: "Hybrid RAG & Reciprocal Rank Fusion",
    venue: "Dual Retrieval Engine",
    year: 2025,
    doi: "RRF.k60.bge-small.v1.5",
    category: "Hybrid Retrieval",
    pageCount: 384,
    techStack: "BAAI/bge-small-en-v1.5 • BM25Okapi • RRF (k=60)",
    pipelineRole: "Dense Cosine Similarity + Sparse Lexical Fusion",
    specHeader: "Reciprocal Rank Fusion (k=60):",
    specDetails: "Fuses 384d BGE dense semantic vectors with BM25Okapi sparse lexical scoring to resolve exact mathematical formulas, DOIs, and terminology without semantic drift.",
    keyMetric: "99.2% Grounded Citation Accuracy",
    nearestVectorSim: 0.942,
    sections: {
      abstract: "Solves vocabulary mismatch and out-of-vocabulary semantic loss in scientific literature queries by unifying dense vector space cosine distance with inverted-index BM25 lexical frequencies.",
      methods: "Dual async retrieval pipeline: queries dispatched in parallel to Neon pgvector (dense) and in-memory BM25Okapi corpus (sparse), fused via 1 / (60 + rank) reciprocal scoring.",
      limitations: "Requires tokenizer corpus calibration for deeply nested LaTeX equations and non-standard mathematical unicode.",
      keyMetric: "Citation accuracy: 99.2% verified across 45 academic benchmarks"
    },
    chunkSnippet: "Pipeline Core [RRF Fusion]: 'Reciprocal Rank Fusion with k=60 prevents dense vector bias on rare author names and specific chemical or algorithmic nomenclature.'"
  },
  {
    id: "tech-2",
    title: "Cross-Encoder Neural Reranking: Token-Level Cross-Attention",
    shortTitle: "Cross-Encoder Token Reranking",
    venue: "Deep Attention Scorer",
    year: 2025,
    doi: "BAAI.bge-reranker-base",
    category: "Neural Reranking",
    pageCount: 512,
    techStack: "BAAI/bge-reranker-base • Cross-Encoder Transformer",
    pipelineRole: "Candidate Re-scoring & Context Purification",
    specHeader: "Token Cross-Attention Scoring:",
    specDetails: "Executes bidirectional cross-attention across candidate chunk pairs, systematically purging false-positive vector collisions before context window injection.",
    keyMetric: "NDCG@10: +18.7% Precision Lift",
    nearestVectorSim: 0.918,
    sections: {
      abstract: "Eliminates bi-encoder semantic collisions where distinct scientific propositions share lexical surface structure by computing complete pairwise token attention.",
      methods: "Top-20 candidate chunks from Hybrid RAG are ingested into BAAI/bge-reranker-base; pairs scored with sigmoid relevance logits to isolate highest-verifiability passages.",
      limitations: "Quadratic token complexity (O(N^2)) limits real-time reranking pool to top-30 candidate passages per user turn.",
      keyMetric: "NDCG@10: +18.7% improvement over un-reranked vector search"
    },
    chunkSnippet: "Reranker Stage [Attention Audit]: 'Cross-Encoder reranking ensures extracted claims directly substantiate research hypotheses rather than merely sharing topical vocabulary.'"
  },
  {
    id: "tech-3",
    title: "9-Stage Research Gap Discovery & Counter-Evidence Verifier",
    shortTitle: "9-Stage Gap Discovery Engine",
    venue: "Autonomous Novelty Engine",
    year: 2025,
    doi: "GAP.ENGINE.STAGES.1-9",
    category: "Research Gap Engine",
    pageCount: 9,
    techStack: "Autonomous Taxonomy Classifier • SerpAPI Counter-Query",
    pipelineRole: "4-Taxonomy Categorization & Experiment Design",
    specHeader: "Taxonomy & Counter-Evidence Protocol:",
    specDetails: "Isolates paper Limitations & Future Work sections, classifies gaps into 4 taxonomies, and cross-verifies against subsequent publications via SerpAPI to eliminate solved problems.",
    keyMetric: "0.88 Expert Reviewer Correlation",
    nearestVectorSim: 0.895,
    sections: {
      abstract: "Automates end-to-end scientific gap discovery through structural section parsing, 4-way limitation taxonomy classification, and real-time counter-evidence falsification.",
      methods: "9-stage pipeline: Scope definition, corpus extraction, classification (Generalization, Baselines, Reproducibility, Methodological), counter-evidence verification, and hypothesis formulation.",
      limitations: "Requires user review for clinical or mission-critical experimental designs before wet-lab execution.",
      keyMetric: "Novelty correlation: 0.88 with senior academic peer reviewers"
    },
    chunkSnippet: "Gap Engine [Stage 4 Counter-Evidence]: 'Every candidate gap is queried against newer publications via Google Scholar API; claims addressed in subsequent work are filtered out.'"
  },
  {
    id: "tech-4",
    title: "Serverless Neon PostgreSQL 16 & pgvector HNSW Engine",
    shortTitle: "Serverless pgvector Store",
    venue: "Vector & Relational Core",
    year: 2025,
    doi: "NEON.PGVECTOR.HNSW.384D",
    category: "Vector Database",
    pageCount: 13,
    techStack: "Neon PostgreSQL 16 • pgvector HNSW • SQLAlchemy 2.0",
    pipelineRole: "Sub-12ms Cosine Vector Clustering",
    specHeader: "HNSW Graph Indexing (m=16, ef=64):",
    specDetails: "Sub-12ms cosine distance vector similarity indexing on 384-dim document chunks with project-isolated tenant security across 13 relational schemas.",
    keyMetric: "Query Latency: 11ms @ 1M Vectors",
    nearestVectorSim: 0.867,
    sections: {
      abstract: "Provides enterprise-grade cloud persistence with zero-cold-start compute branches, relational metadata integrity, and sub-second HNSW dense vector retrieval.",
      methods: "13 normalized relational tables coupled with pgvector HNSW index configured with m=16, ef_construction=64 for 98.6% recall at sub-15ms query latencies.",
      limitations: "High concurrency index re-building requires dedicated maintenance windows on heavy batch PDF uploads.",
      keyMetric: "Query latency: 11ms at 1,000,000 vectors with 98.6% recall"
    },
    chunkSnippet: "Vector Store [pgvector Tuning]: 'HNSW graph index partitioned by project_id guarantees multi-tenant workspace isolation and instant cosine distance searches.'"
  },
  {
    id: "tech-5",
    title: "PyMuPDF Section Ingestion & Sliding Window Architecture",
    shortTitle: "PyMuPDF Section Extraction",
    venue: "Document Ingestion Engine",
    year: 2025,
    doi: "FITZ.LAYOUT.PARSER.V2",
    category: "PDF Ingestion",
    pageCount: 500,
    techStack: "PyMuPDF (fitz) • Regex Section Heuristics • SHA-256",
    pipelineRole: "500w Sliding Windows with 100w Overlap",
    specHeader: "Academic Section Boundary Detection:",
    specDetails: "High-throughput layout stream parsing detecting Abstract, Methodology, Limitations, and Future Work, preserving exact 1-indexed page citations and DOI links.",
    keyMetric: "Throughput: 42 pages/sec with exact page mapping",
    nearestVectorSim: 0.854,
    sections: {
      abstract: "Processes multi-column scientific PDF layout streams, extracting clean text while preserving headings, formula blocks, table captions, and 1-indexed page metadata.",
      methods: "Regex academic heading heuristics scan for structural sections; documents are segmented into 500-word sliding windows with 100-word overlap and SHA-256 binary deduplication.",
      limitations: "OCR fallback required for legacy scanned non-searchable bitmap PDFs from pre-2000 archives.",
      keyMetric: "Throughput: 42 pages/sec with 100% verifiable page attribution"
    },
    chunkSnippet: "Ingestion Engine [Sliding Windows]: 'Every chunk preserves its source page number and academic section category, enabling verified page-jump citation cards.'"
  },
  {
    id: "tech-6",
    title: "Multi-Source Academic Sourcing & Open-Access Federation",
    shortTitle: "Federated Literature Sourcing",
    venue: "Global Discovery Gateway",
    year: 2025,
    doi: "SERP.OPENALEX.S2.FEDERATION",
    category: "Literature Discovery",
    pageCount: 200,
    techStack: "SerpAPI (Google Scholar) • OpenAlex • Semantic Scholar",
    pipelineRole: "200M+ Publication Multi-Query Federation",
    specHeader: "Federated Academic Graph Resolution:",
    specDetails: "Parallel multi-query federation querying 200M+ publications with automatic open-access PDF resolution, BibTeX citation generation, and citation velocity analytics.",
    keyMetric: "Corpus: 200M+ Papers | Direct PDF Link: 94.2%",
    nearestVectorSim: 0.841,
    sections: {
      abstract: "Unifies Google Scholar, OpenAlex, and Semantic Scholar APIs to provide instant multi-index paper discovery, automated open-access PDF staging, and BibTeX metadata.",
      methods: "Asynchronous multi-provider client dispatches parallel search queries, deduplicates by DOI and title Levenshtein distance, and retrieves open-access download URLs.",
      limitations: "Commercial paywalled publisher PDFs without open-access mirrors require manual user PDF upload into workspace.",
      keyMetric: "Discovery coverage: 200M+ academic publications with live citation metrics"
    },
    chunkSnippet: "Discovery Layer [Multi-Source]: 'Direct integration with OpenAlex and SerpAPI resolves legal open-access PDF binaries directly into the PyMuPDF staging queue.'"
  }
];

export default function CylinderOrbitalShowcase3D() {
  const [selectedDocForModal, setSelectedDocForModal] = useState<AcademicDoc | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [hoveredDocId, setHoveredDocId] = useState<string | null>(null);

  // References for ultra-smooth 60/120fps hardware-accelerated RAF animation
  const containerRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);

  const rotationAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const tiltXRef = useRef(0);
  const targetTiltXRef = useRef(0);
  const tiltYRef = useRef(-8);
  const targetTiltYRef = useRef(-8);

  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isPausedRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const velocityXRef = useRef(0);
  const lastActiveIndexRef = useRef(0);

  const count = ACADEMIC_DOCS.length;
  const stepAngle = 360 / count; // 60 deg

  // Continuous buttery RAF loop (no CSS transition conflicts, zero jitter)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isDraggingRef.current) {
        // Handle friction momentum if released with drag velocity
        if (Math.abs(velocityXRef.current) > 0.05) {
          targetAngleRef.current += velocityXRef.current;
          velocityXRef.current *= 0.92; // smooth damping
        } else if (!isPausedRef.current && !isHoveredRef.current) {
          // Slow, continuous majestic auto-orbit (~11 deg/sec)
          targetAngleRef.current += 11 * dt;
        }
      }

      // Smooth lerp (Exponential smoothing eliminates all micro-stutters)
      const diff = targetAngleRef.current - rotationAngleRef.current;
      rotationAngleRef.current += diff * 0.12;

      // Smooth tilt lerp
      tiltXRef.current += (targetTiltXRef.current - tiltXRef.current) * 0.08;
      tiltYRef.current += (targetTiltYRef.current - tiltYRef.current) * 0.08;

      if (cylinderRef.current) {
        cylinderRef.current.style.transform = `rotateX(${tiltYRef.current.toFixed(2)}deg) rotateY(${(rotationAngleRef.current + tiltXRef.current).toFixed(2)}deg)`;
      }

      // Compute active front-facing card index
      const normalizedAngle = ((-rotationAngleRef.current % 360) + 360) % 360;
      const frontIndex = Math.round(normalizedAngle / stepAngle) % count;
      if (frontIndex !== lastActiveIndexRef.current) {
        lastActiveIndexRef.current = frontIndex;
        setActiveCardIndex(frontIndex);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [count, stepAngle]);

  // Sync pause state ref
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Drag interaction handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    dragDistanceRef.current = 0;
    velocityXRef.current = 0;
    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      // Ignore if pointer capture fails
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      const normX = Math.max(-1, Math.min(1, (localX / rect.width - 0.5) * 2));
      const normY = Math.max(-1, Math.min(1, (localY / rect.height - 0.5) * 2));

      // Subtle, damped tilt limits (prevent excessive distortion)
      targetTiltXRef.current = normX * 6;
      targetTiltYRef.current = -8 + normY * -5;
    }

    if (isDraggingRef.current) {
      const deltaX = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      dragDistanceRef.current += Math.abs(deltaX);

      // Sensitivity calibrated for natural finger / mouse drag
      targetAngleRef.current += deltaX * 0.45;
      velocityXRef.current = deltaX * 0.45;
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handlePointerLeave = () => {
    isDraggingRef.current = false;
    isHoveredRef.current = false;
    targetTiltXRef.current = 0;
    targetTiltYRef.current = -8;
  };

  // Step rotation controls
  const rotatePrev = useCallback(() => {
    velocityXRef.current = 0;
    // Snap cleanly to previous card
    targetAngleRef.current += stepAngle;
  }, [stepAngle]);

  const rotateNext = useCallback(() => {
    velocityXRef.current = 0;
    // Snap cleanly to next card
    targetAngleRef.current -= stepAngle;
  }, [stepAngle]);

  const rotateToIndex = (targetIdx: number) => {
    velocityXRef.current = 0;
    const current = lastActiveIndexRef.current;
    let diff = targetIdx - current;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    targetAngleRef.current -= diff * stepAngle;
  };

  // Mobile / Desktop responsive cylinder radius
  // 6 cards of 310px width need ~390px radius for comfortable spatial circumference
  const radius = 390;

  return (
    <div 
      ref={containerRef}
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      {/* 3D Perspective Grid Floor on bottom with generous depth */}
      <div className="absolute inset-x-0 bottom-0 h-[480px] perspective-grid-floor opacity-40 pointer-events-none z-0" />

      {/* =========================================================================
       * SECTION HEADER: BOLD, PREMIUM, HIGH-CONTRAST (Matching User Request)
       * ========================================================================= */}
      <div className="relative z-20 max-w-5xl mx-auto text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-black text-[11px] font-mono font-black uppercase tracking-widest mb-4 shadow-[0_0_25px_rgba(255,255,255,0.7)]">
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          360° SPATIAL PIPELINE // ARCHITECTURAL ENGINES
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white font-sans leading-tight">
          CORE AI & RETRIEVAL <span className="underline decoration-white decoration-4 sm:decoration-6 underline-offset-8">PIPELINE ENGINES</span>
        </h2>

        <p className="text-neutral-400 text-xs sm:text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
          Interactive 360° cylindrical architecture stage showcasing the 6 specialized AI & retrieval engines powering ResearchGap.ai. Drag left or right to orbit, hover to pause, or click any module for full specifications.
        </p>

        {/* Quick Navigation Control Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
          <button
            onClick={rotatePrev}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white hover:text-black text-white border border-white/20 transition-all flex items-center gap-1.5 font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            title="Rotate Left"
          >
            <ChevronLeft className="w-4 h-4" /> PREV ENGINE
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 font-bold ${
              isPaused 
                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.5)]" 
                : "bg-white/10 hover:bg-white/20 text-white border-white/20"
            }`}
            title="Toggle Continuous Orbit"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            {isPaused ? "RESUME ORBIT" : "PAUSE ORBIT"}
          </button>

          <button
            onClick={rotateNext}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white hover:text-black text-white border border-white/20 transition-all flex items-center gap-1.5 font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            title="Rotate Right"
          >
            NEXT ENGINE <ChevronRight className="w-4 h-4" />
          </button>

          {/* Active Module Indicator Badge */}
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-neutral-300 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MODULE {activeCardIndex + 1}/06:</span>
            <span className="font-bold text-white uppercase">{ACADEMIC_DOCS[activeCardIndex]?.category}</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 3D CYLINDRICAL ORBIT STAGE (Generous Height, Zero Jitter)
       * ========================================================================= */}
      <div 
        className="relative w-full h-[540px] sm:h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing perspective-stage z-10 touch-none"
        onPointerDown={handlePointerDown}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          setHoveredDocId(null);
        }}
      >
        {/* The 3D Rotating Cylinder (Updated directly by RAF for 60/120fps fluid GPU motion) */}
        <div 
          ref={cylinderRef}
          className="relative w-[300px] sm:w-[320px] h-[400px] sm:h-[430px] preserve-3d will-change-transform"
        >
          {ACADEMIC_DOCS.map((doc, index) => {
            const angle = stepAngle * index;
            const isHovered = hoveredDocId === doc.id;
            const isFrontCard = activeCardIndex === index;

            return (
              <div
                key={doc.id}
                onMouseEnter={() => {
                  setHoveredDocId(doc.id);
                }}
                onMouseLeave={() => {
                  setHoveredDocId(null);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Only open if it was a click, not a significant drag gesture
                  if (dragDistanceRef.current > 6) return;
                  setSelectedDocForModal(doc);
                }}
                className="absolute inset-0 w-[290px] sm:w-[310px] h-[390px] sm:h-[420px] rounded-xl transition-all duration-200 preserve-3d"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "visible",
                }}
              >
                {/* Advanced Technology Architecture Card */}
                <div 
                  className={`relative w-full h-full p-5 rounded-xl bg-black/95 backdrop-blur-xl border transition-colors duration-200 flex flex-col justify-between cursor-pointer ${
                    isHovered || isFrontCard
                      ? "border-white shadow-[0_0_40px_rgba(255,255,255,0.45)] ring-1 ring-white/60" 
                      : "border-white/25 hover:border-white/60 shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                  }`}
                >
                  {/* Subtle Top Glowing Line */}
                  <div className={`absolute top-0 inset-x-6 h-[2px] rounded-full transition-opacity duration-300 ${isFrontCard || isHovered ? "bg-white opacity-100 shadow-[0_0_12px_#fff]" : "bg-white/20 opacity-40"}`} />

                  {/* Top Technology Header */}
                  <div>
                    <div className="flex items-center justify-between border-b border-white/20 pb-2.5 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-white" />
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
                          {doc.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-white/90 bg-white/10 px-2 py-0.5 rounded border border-white/20 font-semibold">
                        {doc.venue}
                      </span>
                    </div>

                    {/* Technology Title */}
                    <div className="h-0.5 bg-white w-2/3 mb-2 rounded-full" />
                    <h3 className="text-sm sm:text-[15px] font-extrabold text-white font-sans leading-snug line-clamp-2 mb-1.5">
                      {doc.shortTitle}
                    </h3>

                    {/* Integrated Tech Stack Badge */}
                    <div className="text-[10px] font-mono text-neutral-400 mb-2.5 truncate">
                      {doc.techStack}
                    </div>

                    {/* Dynamic Spec Header & Description */}
                    <div className="p-3 bg-white/[0.04] border border-white/20 rounded-lg text-[11px] font-sans text-neutral-200 line-clamp-4 leading-relaxed">
                      <span className="text-white font-bold block mb-1 text-[10px] uppercase tracking-wider font-mono">
                        {doc.specHeader}
                      </span>
                      {doc.specDetails}
                    </div>
                  </div>

                  {/* Bottom Benchmark & Latency Score */}
                  <div>
                    <div className="pt-2.5 border-t border-white/20 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-neutral-300 text-[10px] truncate max-w-[170px] font-medium">
                        {doc.keyMetric}
                      </span>
                      <span className="px-2 py-0.5 bg-white text-black font-extrabold rounded text-[10px] shadow-[0_0_10px_rgba(255,255,255,0.6)]">
                        SIM {doc.nearestVectorSim}
                      </span>
                    </div>

                    <div className="mt-2 text-[9px] font-mono text-neutral-400 flex items-center justify-between">
                      <span className="uppercase tracking-widest text-neutral-400">STAGE 0{index + 1}</span>
                      <span className="text-white hover:underline flex items-center gap-1 font-semibold">
                        View Spec <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>

                  {/* Corner Diamond Highlight on Hover */}
                  {(isHovered || isFrontCard) && (
                    <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_14px_#ffffff] pointer-events-none" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orbit Step Ticker & Gesture Cue */}
      <div className="relative z-20 max-w-xl mx-auto mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2 rounded-full bg-white/[0.04] border border-white/15 backdrop-blur-md text-[11px] font-mono text-neutral-300">
        <div className="flex items-center gap-2">
          <MoveHorizontal className="w-3.5 h-3.5 text-white animate-pulse" />
          <span>Drag horizontally to rotate 360° or select engine:</span>
        </div>

        {/* Numbered Dots */}
        <div className="flex items-center gap-1.5">
          {ACADEMIC_DOCS.map((doc, i) => (
            <button
              key={doc.id}
              onClick={() => rotateToIndex(i)}
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-all ${
                activeCardIndex === i 
                  ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.8)] scale-110" 
                  : "bg-white/10 text-neutral-400 hover:text-white hover:bg-white/20"
              }`}
              title={doc.shortTitle}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
       * DETAILED ARCHITECTURE MODAL (Deep Inspection)
       * ========================================================================= */}
      <AnimatePresence>
        {selectedDocForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="relative w-full max-w-2xl bg-black border border-white/40 p-6 md:p-8 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.25)] text-left text-white max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDocForModal(null)}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/20 text-neutral-300 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-white text-black font-mono font-bold text-[10px] rounded uppercase">
                  {selectedDocForModal.category}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  Core Architecture Spec // {selectedDocForModal.year}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold font-sans text-white mb-2 leading-tight">
                {selectedDocForModal.title}
              </h2>
              <p className="text-xs font-mono text-neutral-300 mb-6">
                Tech Stack: <span className="text-white font-bold">{selectedDocForModal.techStack}</span>
              </p>

              {/* Sections Breakdown */}
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-white/[0.03] border border-white/20 rounded-lg">
                  <span className="text-white font-mono font-bold block mb-1 uppercase tracking-wider text-[11px]">
                    1. Architecture Overview & Role:
                  </span>
                  <p className="text-neutral-300 leading-relaxed">{selectedDocForModal.sections.abstract}</p>
                </div>

                <div className="p-4 bg-white/[0.03] border border-white/20 rounded-lg">
                  <span className="text-white font-mono font-bold block mb-1 uppercase tracking-wider text-[11px]">
                    2. Implementation & Algorithms:
                  </span>
                  <p className="text-neutral-300 leading-relaxed">{selectedDocForModal.sections.methods}</p>
                </div>

                <div className="p-4 bg-white/[0.03] border border-white/35 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.06)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white font-mono font-bold uppercase tracking-wider text-[11px]">
                      3. Production Pipeline Audit & Verification:
                    </span>
                    <span className="text-[10px] bg-white text-black font-mono font-bold px-2 py-0.5 rounded">
                      ACTIVE SPEC
                    </span>
                  </div>
                  <p className="text-neutral-200 leading-relaxed italic">{selectedDocForModal.chunkSnippet}</p>
                </div>

                <div className="p-4 bg-white/[0.03] border border-white/20 rounded-lg flex items-center justify-between">
                  <span className="text-neutral-400 font-mono">Performance Benchmark:</span>
                  <span className="text-white font-mono font-bold text-sm">
                    {selectedDocForModal.keyMetric}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-neutral-400">
                  Deployed in Next.js 15 + FastAPI architecture
                </span>

                <Link
                  href="/scholar-studio"
                  className="px-5 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                >
                  Explore in Scholar Studio <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
