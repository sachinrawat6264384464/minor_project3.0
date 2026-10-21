"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, 
  Sparkles, 
  Target, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Search,
  BookOpen
} from "lucide-react";

interface QueryPreset {
  id: string;
  queryText: string;
  category: string;
  targetClusterIndex: number;
  diamondCoords: { x: number; y: number };
  nearestChunks: {
    id: string;
    paperTitle: string;
    section: string;
    page: number;
    similarity: number;
    coords: { x: number; y: number };
    verbatimQuote: string;
  }[];
}

const PRESET_QUERIES: QueryPreset[] = [
  {
    id: "q-1",
    queryText: "What are the reported empirical bottlenecks of Vision Transformers under real-world hospital noise?",
    category: "Medical AI & Vision Transformers",
    targetClusterIndex: 0,
    diamondCoords: { x: 50, y: 38 },
    nearestChunks: [
      {
        id: "c-1",
        paperTitle: "Advancements in Vision Transformers (IEEE TNNLS)",
        section: "Limitations",
        page: 7,
        similarity: 0.942,
        coords: { x: 38, y: 48 },
        verbatimQuote: "Boundary prediction confidence drops by 31.4% under out-of-distribution scanner blur."
      },
      {
        id: "c-2",
        paperTitle: "Hierarchical Attention in CT Volumetrics",
        section: "Discussion",
        page: 11,
        similarity: 0.918,
        coords: { x: 44, y: 56 },
        verbatimQuote: "Quadratic attention latency renders 3D CT reconstruction unfeasible on edge clinical workstations."
      },
      {
        id: "c-3",
        paperTitle: "Robustness Bounds of Swin Architectures",
        section: "Methodology",
        page: 4,
        similarity: 0.895,
        coords: { x: 33, y: 54 },
        verbatimQuote: "Windowed self-attention lacks shift invariance when patient motion artifacts exceed 2mm."
      }
    ]
  },
  {
    id: "q-2",
    queryText: "How does BM25Okapi fuse with 384-dimensional dense vectors in Reciprocal Rank Fusion?",
    category: "Hybrid RAG Algorithms",
    targetClusterIndex: 1,
    diamondCoords: { x: 65, y: 34 },
    nearestChunks: [
      {
        id: "c-4",
        paperTitle: "Hybrid RAG for Scientific Discovery (ACM Surveys)",
        section: "Mathematical Formulation",
        page: 8,
        similarity: 0.961,
        coords: { x: 72, y: 42 },
        verbatimQuote: "RRF score = sum( 1 / (60 + rank_dense) + 1 / (60 + rank_bm25) ), guaranteeing lexical stability."
      },
      {
        id: "c-5",
        paperTitle: "Lexical & Dense Fusion in High-Precision Search",
        section: "Results",
        page: 14,
        similarity: 0.924,
        coords: { x: 78, y: 46 },
        verbatimQuote: "Exact formula matching improved by 41% compared to pure cosine vector lookup."
      },
      {
        id: "c-6",
        paperTitle: "Cross-Encoder Reranking at Academic Scale",
        section: "Architecture",
        page: 3,
        similarity: 0.903,
        coords: { x: 68, y: 52 },
        verbatimQuote: "BAAI/bge-reranker-base refines the top-60 candidates into 5 verifiable citation cards."
      }
    ]
  },
  {
    id: "q-3",
    queryText: "What counter-evidence exists disproving candidate gaps in PEFT adaptation for scientific graphs?",
    category: "9-Stage Research Gap Engine",
    targetClusterIndex: 2,
    diamondCoords: { x: 42, y: 32 },
    nearestChunks: [
      {
        id: "c-7",
        paperTitle: "Automated Research Gap Identification (JAIR)",
        section: "Counter-Evidence Verification",
        page: 6,
        similarity: 0.938,
        coords: { x: 26, y: 38 },
        verbatimQuote: "Counter-querying Google Scholar via SerpAPI confirmed 4 subsequent 2025 papers had already solved low-rank graph adapters."
      },
      {
        id: "c-8",
        paperTitle: "Thesis Novelty Metric in Peer Review",
        section: "Taxonomy Classification",
        page: 9,
        similarity: 0.911,
        coords: { x: 22, y: 46 },
        verbatimQuote: "Gaps lacking counter-evidence verification suffer a 74% rejection rate at top-tier conferences."
      },
      {
        id: "c-9",
        paperTitle: "Benchmark Deficiencies in Multi-Hop Reasoning",
        section: "Discussion",
        page: 12,
        similarity: 0.887,
        coords: { x: 30, y: 48 },
        verbatimQuote: "Valid gap: No public dataset benchmarks multi-hop reasoning over retracted publications."
      }
    ]
  }
];

export default function VectorSpaceLaserScene() {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [showLaserBeams, setShowLaserBeams] = useState(true);
  const [activeChunkId, setActiveChunkId] = useState<string | null>(null);

  const currentPreset = PRESET_QUERIES[selectedPresetIndex];

  // Static Point Cloud Clusters (Coordinates in % of container)
  const clusterDefinitions = [
    {
      name: "Cluster 01: Medical ViT Embeddings",
      center: { x: 36, y: 50 },
      dots: [
        { x: -5, y: -4 }, { x: 2, y: -6 }, { x: -8, y: 2 }, { x: 6, y: 4 },
        { x: -3, y: 7 }, { x: 4, y: -2 }, { x: -6, y: -7 }, { x: 8, y: -5 },
        { x: -1, y: 9 }, { x: 7, y: 8 }, { x: -9, y: 0 }, { x: 1, y: 3 },
        { x: -4, y: 5 }, { x: 5, y: -7 }, { x: -7, y: -3 }, { x: 3, y: 6 },
      ]
    },
    {
      name: "Cluster 02: Hybrid RRF Lexical Space",
      center: { x: 74, y: 45 },
      dots: [
        { x: -6, y: -5 }, { x: 3, y: -7 }, { x: -7, y: 3 }, { x: 7, y: 5 },
        { x: -2, y: 8 }, { x: 5, y: -3 }, { x: -5, y: -8 }, { x: 9, y: -4 },
        { x: -2, y: 9 }, { x: 8, y: 7 }, { x: -8, y: 1 }, { x: 2, y: 4 },
      ]
    },
    {
      name: "Cluster 03: Gap & Counter-Evidence",
      center: { x: 25, y: 42 },
      dots: [
        { x: -4, y: -3 }, { x: 3, y: -5 }, { x: -6, y: 2 }, { x: 5, y: 3 },
        { x: -2, y: 6 }, { x: 4, y: -1 }, { x: -5, y: -6 }, { x: 7, y: -3 },
      ]
    }
  ];

  return (
    <div className="relative w-full py-16 px-4 md:px-8 bg-transparent overflow-hidden font-sans text-white">
      {/* Perspective Grid Floor */}
      <div className="absolute inset-x-0 bottom-0 h-[420px] perspective-grid-floor opacity-40 pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10 pt-4">
        {/* Preset Query Switcher Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {PRESET_QUERIES.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPresetIndex(idx);
                setActiveChunkId(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-all duration-200 flex items-center gap-2 ${
                selectedPresetIndex === idx
                  ? "bg-white text-black font-bold border-white shadow-[0_0_18px_rgba(255,255,255,0.8)] scale-105"
                  : "bg-black/60 text-slate-400 border-white/20 hover:text-white hover:border-white/50"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {preset.category}
            </button>
          ))}
        </div>

        {/* Current Query Banner */}
        <div className="max-w-3xl mx-auto p-3.5 bg-white/5 border border-white/20 rounded-xl backdrop-blur-md mb-8 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <Search className="w-4 h-4 text-white shrink-0" />
            <span className="text-white font-bold">Query:</span>
            <span className="text-slate-200 italic line-clamp-1 font-sans">
              "{currentPreset.queryText}"
            </span>
          </div>

          <button
            onClick={() => setShowLaserBeams(!showLaserBeams)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold border whitespace-nowrap transition ${
              showLaserBeams
                ? "bg-white text-black border-white shadow-[0_0_8px_#ffffff]"
                : "bg-transparent text-slate-400 border-white/20"
            }`}
          >
            {showLaserBeams ? "Laser Rays: ON" : "Laser Rays: OFF"}
          </button>
        </div>

        {/* 3D VECTOR SPACE CANVAS STAGE (Matching Reference Image 3 & 5) */}
        <div className="relative w-full h-[520px] rounded-2xl border border-white/20 bg-[#040404] overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.08)]">
          
          {/* Subtle Ambient Starfield in Background */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            {Array.from({ length: 45 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${(i * 29) % 95}%`,
                  left: `${(i * 37) % 95}%`,
                  opacity: (i % 5 + 1) * 0.15,
                }}
              />
            ))}
          </div>

          {/* Perspective Grid Floor at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-[260px] perspective-grid-floor-dense opacity-45 pointer-events-none" />

          {/* 3D WIREFRAME VECTOR DB CYLINDER (Precision 3D Mathematical SVG Architecture) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none select-none">
            <div className="relative w-64 h-28 flex items-center justify-center">
              <svg 
                className="absolute inset-0 w-full h-full overflow-visible"
                viewBox="0 0 256 112"
                fill="none"
              >
                <defs>
                  <linearGradient id="vdbTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="50%" stopColor="#080808" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>

                  <linearGradient id="vdbBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#222222" />
                    <stop offset="100%" stopColor="#050505" />
                  </linearGradient>

                  <filter id="vdbGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ffffff" floodOpacity="0.45" />
                  </filter>
                </defs>

                {/* Base Glow Aura */}
                <ellipse cx="128" cy="88" rx="116" ry="20" fill="rgba(255,255,255,0.06)" />

                {/* Cylinder Side Wall (Connected seamlessly from top rim to bottom rim) */}
                <path
                  d="M 12 36 
                     A 116 24 0 0 0 244 36 
                     L 244 76 
                     A 116 24 0 0 1 12 76 
                     Z"
                  fill="url(#vdbBodyGrad)"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                />

                {/* Intermediate HNSW Index Layer Ring */}
                <path
                  d="M 12 56 A 116 24 0 0 0 244 56"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />

                {/* Cylinder Top Cap Ellipse */}
                <ellipse
                  cx="128"
                  cy="36"
                  rx="116"
                  ry="24"
                  fill="url(#vdbTopGrad)"
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter="url(#vdbGlow)"
                />

                {/* Inner Concentric Radar Ring on Top Surface */}
                <ellipse
                  cx="128"
                  cy="36"
                  rx="88"
                  ry="16"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              </svg>

              {/* Vector DB Center Label */}
              <div className="relative z-10 text-center pb-6 select-none">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <Database className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span className="text-sm font-black tracking-widest text-white font-sans uppercase drop-shadow-[0_0_12px_#ffffff]">
                    VECTOR DB
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest block font-bold">
                  PGVECTOR · 384-DIM
                </span>
              </div>
            </div>
          </div>

          {/* SVG LASER BEAMS & TARGET LINES (Matching Reference Image 5) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {showLaserBeams &&
              currentPreset.nearestChunks.map((chunk) => (
                <g key={chunk.id}>
                  {/* Glowing Laser Ray from Diamond to Chunk */}
                  <line
                    x1={`${currentPreset.diamondCoords.x}%`}
                    y1={`${currentPreset.diamondCoords.y}%`}
                    x2={`${chunk.coords.x}%`}
                    y2={`${chunk.coords.y}%`}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="laser-beam"
                  />
                  {/* Subtle outer laser halo */}
                  <line
                    x1={`${currentPreset.diamondCoords.x}%`}
                    y1={`${currentPreset.diamondCoords.y}%`}
                    x2={`${chunk.coords.x}%`}
                    y2={`${chunk.coords.y}%`}
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth="4"
                  />
                </g>
              ))}
          </svg>

          {/* FLOATING POINT CLOUD CLUSTERS (Dense White Dots in Vector Space) */}
          {clusterDefinitions.map((cluster, cIdx) => (
            <div
              key={cIdx}
              className="absolute z-10 pointer-events-none"
              style={{
                top: `${cluster.center.y}%`,
                left: `${cluster.center.x}%`,
              }}
            >
              {/* Cluster Glow Core */}
              <div className="absolute -inset-10 bg-white/5 rounded-full blur-xl pointer-events-none" />
              
              {/* Cluster Dots */}
              {cluster.dots.map((dot, dIdx) => (
                <div
                  key={dIdx}
                  className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_#ffffff]"
                  style={{
                    transform: `translate(${dot.x * 7}px, ${dot.y * 5}px)`,
                    opacity: 0.65 + (dIdx % 4) * 0.1,
                  }}
                />
              ))}

              {/* Cluster Label Stamp */}
              <span className="absolute top-12 -left-16 text-[9px] font-mono uppercase tracking-widest text-slate-500 whitespace-nowrap">
                {cluster.name}
              </span>
            </div>
          ))}

          {/* GLOWING DIAMOND: "YOUR QUESTION" (Exact Match from User's Screenshot) */}
          <motion.div
            animate={{
              left: `${currentPreset.diamondCoords.x}%`,
              top: `${currentPreset.diamondCoords.y}%`,
            }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
          >
            {/* White Glowing Aura */}
            <div className="absolute -inset-8 bg-white/20 rounded-full blur-xl animate-pulse pointer-events-none" />

            {/* Diamond Rhombus Shape */}
            <div className="relative w-8 h-8 bg-white rotate-45 flex items-center justify-center shadow-[0_0_30px_10px_rgba(255,255,255,0.9)] border border-white">
              <div className="w-2.5 h-2.5 bg-black rotate-45" />
            </div>

            {/* "your question" Pill Badge Label (Above Diamond) */}
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-white text-black font-mono font-bold text-[10px] uppercase tracking-wider rounded whitespace-nowrap shadow-[0_0_12px_rgba(255,255,255,0.8)]">
              your question
            </div>

            {/* "3 nearest chunks" Sub-Badge (Under Diamond) */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-black/90 text-white border border-white/60 font-mono font-bold text-[9px] uppercase tracking-wider rounded whitespace-nowrap shadow-[0_0_12px_rgba(0,0,0,0.8)]">
              3 nearest chunks
            </div>
          </motion.div>

          {/* RETRIEVED 3 NEAREST CHUNKS (With Concentric Target Rings) */}
          {currentPreset.nearestChunks.map((chunk, idx) => {
            const isHovered = activeChunkId === chunk.id;

            return (
              <div
                key={chunk.id}
                onMouseEnter={() => setActiveChunkId(chunk.id)}
                onMouseLeave={() => setActiveChunkId(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
                style={{
                  left: `${chunk.coords.x}%`,
                  top: `${chunk.coords.y}%`,
                }}
              >
                {/* Concentric Pulsing Target Rings (from Screenshot 5) */}
                <div className="absolute -inset-4 rounded-full border border-white animate-target-pulse pointer-events-none" />
                <div className="absolute -inset-2 rounded-full border border-white/70 pointer-events-none" />

                {/* Chunk Dot Node */}
                <div className="relative w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-[0_0_16px_#ffffff]">
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                </div>

                {/* Similarity Badge */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-white text-black font-mono font-bold text-[9px] rounded whitespace-nowrap shadow-[0_0_8px_#ffffff]">
                  {chunk.similarity}
                </div>

                {/* Floating Preview Tooltip Card on Hover */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-6 left-1/2 -translate-x-1/2 w-64 p-3 bg-black/95 border border-white rounded-lg shadow-[0_0_25px_rgba(255,255,255,0.4)] z-50 text-left pointer-events-none"
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-b border-white/20 pb-1 mb-1.5">
                      <span className="text-white font-bold">Page {chunk.page}</span>
                      <span>Section: {chunk.section}</span>
                    </div>
                    <h4 className="text-[11px] font-bold text-white mb-1 leading-tight">
                      {chunk.paperTitle}
                    </h4>
                    <p className="text-[10px] text-slate-300 italic leading-snug">
                      "{chunk.verbatimQuote}"
                    </p>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom 3 Chunks Info Cards Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {currentPreset.nearestChunks.map((chunk, i) => (
            <div
              key={chunk.id}
              onMouseEnter={() => setActiveChunkId(chunk.id)}
              onMouseLeave={() => setActiveChunkId(null)}
              className={`p-4 rounded-xl border transition-all text-left ${
                activeChunkId === chunk.id
                  ? "bg-white/10 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "bg-black/60 border-white/20 hover:border-white/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-white text-black font-mono font-bold text-[10px] rounded uppercase">
                  Rank #{i + 1} Chunk
                </span>
                <span className="font-mono text-xs text-white font-bold">
                  Sim: {chunk.similarity}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white mb-1 font-sans">
                {chunk.paperTitle}
              </h4>
              <p className="text-[11px] font-mono text-slate-400 mb-2">
                Section: {chunk.section} | Page {chunk.page}
              </p>
              <p className="text-[11px] text-slate-200 italic line-clamp-2">
                "{chunk.verbatimQuote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
