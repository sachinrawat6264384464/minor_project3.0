"use client";

import { useState } from "react";
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Cpu, 
  Layers,
  ShieldCheck,
  Zap,
  HelpCircle,
  FlaskConical,
  GitBranch,
  Circle
} from "lucide-react";
import Link from "next/link";

interface PaperNode {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  category: string;
  abstract: string;
  platformActions: string[];
  gapInsight: string;
  suggestedQuestion: string;
  suggestedExperiment: string;
}

export default function PaperOrbitalShowcase() {
  const [selectedPaper, setSelectedPaper] = useState<PaperNode | null>(null);

  const showcasePapers: PaperNode[] = [
    {
      id: "paper-1",
      title: "Advancements in Vision Transformers for High-Res Medical Image Segmentation",
      authors: ["Dr. Elena Rostova", "Prof. Marcus Thorne"],
      year: 2025,
      venue: "IEEE Transactions on Neural Networks",
      category: "Vision Transformers & Medical Imaging",
      abstract: "This paper analyzes attention mechanisms across 45 MRI benchmarks, highlighting computational latency bottlenecks during 3D volume inference.",
      platformActions: [
        "Ingest PyMuPDF text & section boundaries (Abstract, Methods, Results, Limitations)",
        "Build 384-dim BAAI/bge-small-en-v1.5 embeddings for vector search",
        "Ground RAG Chat with exact page-level citations & verbatim quotes",
        "Compare side-by-side against standard U-Net & ResNet baselines"
      ],
      gapInsight: "Underexplored empirical validation under adversarial noise & hospital deployment distribution shift.",
      suggestedQuestion: "How do modern Vision Transformers maintain calibration under severe sensor noise?",
      suggestedExperiment: "Run ablation benchmark comparing Swin Transformer vs quantized LoRA adapters on noisy MRI datasets."
    },
    {
      id: "paper-2",
      title: "Evaluating RAG Passage Chunking Bottlenecks in Clinical QA",
      authors: ["Sarah Jenkins", "Devon Patel"],
      year: 2024,
      venue: "ACM SIGKDD Conference",
      category: "Hybrid RAG & Vector Retrieval",
      abstract: "Passage fragmentation leads to hallucinated citations in medical RAG. We introduce section-aware parent-child chunking with RRF rank fusion.",
      platformActions: [
        "Extract section-aware Parent-Child chunk hierarchies preserving page numbers",
        "Execute Dense Vector Search + BM25 Lexical exact keyword lookup",
        "Apply Reciprocal Rank Fusion (RRF) to eliminate zero-score hallucinated references",
        "Export BibTeX citations directly for academic publication"
      ],
      gapInsight: "Hierarchical chunking limited to text passages; multi-modal medical figures and table parsing remain underexplored.",
      suggestedQuestion: "Can multi-modal RAG preserve factual precision across embedded medical chart tables?",
      suggestedExperiment: "Benchmark parent-child table parsing against BioASQ clinical question-answering corpus."
    },
    {
      id: "paper-3",
      title: "Benchmarking Automated Research Gap Mining Across Systematic Reviews",
      authors: ["Prof. Arthur Pendelton", "Dr. Hina Khan"],
      year: 2024,
      venue: "Artificial Intelligence Review",
      category: "Automated Research Gap Analysis",
      abstract: "Identifying novel research gaps requires multi-document evidence matrix construction. We evaluate candidate gap generation across 500 systematic reviews.",
      platformActions: [
        "Run 9-Stage Research Gap Analysis Engine across project papers",
        "Synthesize Cross-Paper Evidence Matrix comparing methods, datasets, and limitations",
        "Validate candidate gaps against recent publications for counter-evidence",
        "Generate exportable Literature Review & Research Gap Reports in Markdown/PDF"
      ],
      gapInsight: "Inadequate baseline comparisons against recent parameter-efficient fine-tuning (PEFT) models.",
      suggestedQuestion: "Does automatic gap hypothesis generation match domain expert peer-reviewer evaluation?",
      suggestedExperiment: "Conduct double-blind review comparing AI candidate gaps against PhD scholar thesis prospectuses."
    }
  ];

  return (
    <section className="py-24 px-8 relative overflow-hidden bg-gradient-to-b from-canvas via-royal-50/50 to-canvas border-y border-royal-border">
      
      {/* 360-DEGREE ROYAL BLUE CYBER ORBITAL RINGS BACKGROUND (Top, Bottom, Left, Right) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {/* Outer Ring 1 */}
        <div className="w-[850px] h-[850px] rounded-full border-2 border-royal-200/80 animate-spin-slow relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-royal-600 shadow-royal" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-royal-500 shadow-royal" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-royal-700 shadow-royal" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-royal-600 shadow-royal" />
        </div>

        {/* Middle Ring 2 */}
        <div className="absolute w-[620px] h-[620px] rounded-full border-2 border-dashed border-royal-400/60 animate-spin-reverse-slow">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-royal-400" />
          <div className="absolute bottom-1/4 right-1/4 w-3 h-3 rounded-full bg-royal-600" />
        </div>

        {/* Inner Ring 3 */}
        <div className="absolute w-[420px] h-[420px] rounded-full border-2 border-royal-300/60 animate-spin-slow opacity-80" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-royal-600 text-white font-bold text-xs mb-4 shadow-royal animate-pulse-glow">
          <Zap className="w-4 h-4" />
          360° Royal Blue Cyber-Orbital Research Matrix
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Interactive <span className="text-royal-gradient">Academic Orbital Matrix</span>
        </h2>

        <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto mb-16 leading-relaxed">
          Watch the papers rotate along 360-degree laser connection lines. Click on any research paper node to open step-by-step guidance on what you can perform on this platform!
        </p>

        {/* Central AI Core Node & Radial Grid Showcase */}
        <div className="relative py-8 flex flex-col items-center">
          
          {/* Glowing Center AI Core Node */}
          <div className="w-20 h-20 rounded-3xl bg-royal-gradient text-white font-black text-xl flex flex-col items-center justify-center shadow-royal-lg border-2 border-royal-400 mb-12 z-20 animate-pulse-glow">
            <Cpu className="w-8 h-8 text-white mb-0.5" />
            <span className="text-[10px] tracking-wider uppercase font-bold">RAG Core</span>
          </div>

          {/* SVG Connecting Laser Grid Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden md:block">
            <line x1="50%" y1="120" x2="20%" y2="280" stroke="#2563EB" strokeWidth="2" className="laser-line" />
            <line x1="50%" y1="120" x2="50%" y2="280" stroke="#2563EB" strokeWidth="2" className="laser-line" />
            <line x1="50%" y1="120" x2="80%" y2="280" stroke="#2563EB" strokeWidth="2" className="laser-line" />
          </svg>

          {/* Interactive Paper Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl z-20">
            {showcasePapers.map((paper, idx) => (
              <div
                key={paper.id}
                onClick={() => setSelectedPaper(paper)}
                className="glass-royal-card p-6 rounded-3xl cursor-pointer text-left transition-all duration-300 relative group border-2 border-royal-200 hover:border-royal-600 bg-white shadow-xl"
              >
                {/* Connection Node Dot */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-royal-600 border-2 border-white flex items-center justify-center shadow-royal">
                  <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                </div>

                <div className="flex items-center justify-between mb-3 mt-2">
                  <span className="px-3 py-1 rounded-full bg-royal-100 text-royal-700 font-bold text-[11px] group-hover:bg-royal-600 group-hover:text-white transition">
                    {paper.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{paper.year}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-royal-600 transition leading-snug">
                  {paper.title}
                </h3>

                <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                  {paper.abstract}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-royal-600 group-hover:translate-x-1 transition">
                  <span>Click for Platform Guidance</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Paper Guidance Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl border-2 border-royal-400 max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPaper(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-royal-600 text-white font-bold text-xs">
                {selectedPaper.category}
              </span>
              <span className="text-xs font-semibold text-slate-500">• {selectedPaper.venue} ({selectedPaper.year})</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 mb-2 leading-tight">
              {selectedPaper.title}
            </h2>
            <p className="text-xs text-slate-500 mb-6">Authors: {selectedPaper.authors.join(", ")}</p>

            {/* Guidance Content */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-royal-50/80 border border-royal-200">
                <h4 className="text-xs font-bold text-royal-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-royal-600" /> What You Can Do with this Paper on the Platform:
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  {selectedPaper.platformActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-royal-600 flex-shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Research Gap Insight */}
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Extracted Candidate Research Gap:
                </h4>
                <p className="text-slate-800 font-semibold mb-3">{selectedPaper.gapInsight}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-amber-200/60">
                  <div>
                    <span className="font-bold text-amber-950 block mb-0.5">Proposed Research Question:</span>
                    <p className="text-slate-700 italic">"{selectedPaper.suggestedQuestion}"</p>
                  </div>
                  <div>
                    <span className="font-bold text-amber-950 block mb-0.5">Suggested Validation Experiment:</span>
                    <p className="text-slate-700">{selectedPaper.suggestedExperiment}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Action */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                PyMuPDF section extraction & BGE embedding ready.
              </span>

              <Link
                href="/dashboard"
                className="px-6 py-3 bg-royal-gradient text-white font-bold text-xs rounded-xl shadow-royal hover:opacity-95 transition flex items-center gap-2"
              >
                Try this Paper in Workspace <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
