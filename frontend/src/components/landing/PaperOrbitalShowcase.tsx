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
      category: "Vision Transformers",
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
      title: "Hybrid Retrieval-Augmented Generation for Verifiable Scientific Discovery",
      authors: ["Dr. Aris Vance", "Dr. Lin Chen"],
      year: 2024,
      venue: "ACM Computing Surveys",
      category: "Hybrid RAG Architecture",
      abstract: "Evaluates Reciprocal Rank Fusion combining dense semantic embeddings with sparse BM25 lexical retrieval to eliminate citation hallucination.",
      platformActions: [
        "Index dense vectors with Neon PostgreSQL serverless pgvector",
        "Run Okapi BM25 sparse keyword queries for technical formulas",
        "Perform Cross-Encoder re-ranking on top-k fused candidate passages",
        "Export BibTeX citations directly for academic publication"
      ],
      gapInsight: "Lack of standardization for long-context multi-document cross-referencing in peer review.",
      suggestedQuestion: "Can multi-hop graph retrieval outperform linear hybrid RAG across multi-paper matrices?",
      suggestedExperiment: "Construct 50-node citation knowledge graph and measure top-1 answer precision vs vanilla RAG."
    },
    {
      id: "paper-3",
      title: "Automated Research Gap Identification via Counter-Evidence Synthesis",
      authors: ["Prof. Sarah Jenkins", "Dr. David K. Miller"],
      year: 2024,
      venue: "Journal of Artificial Intelligence Research",
      category: "Research Gap Formulation",
      abstract: "Introduces structured 9-stage extraction protocol that verifies candidate limitations against counter-evidence in adjacent publications.",
      platformActions: [
        "Automate limitation section isolation from PDF research papers",
        "Cross-verify claims against Google Scholar / SerpAPI citations",
        "Compute 0-100% Novelty Score against existing literature chunks",
        "Generate exportable Literature Review & Research Gap Reports in Markdown/PDF"
      ],
      gapInsight: "Limited automated hypothesis validation without human-in-the-loop experiment drafting.",
      suggestedQuestion: "How reliably can LLMs formulate ablation experiments matching senior PhD peer-reviewers?",
      suggestedExperiment: "Perform blind double-review study comparing AI gap suggestions against IEEE reviewer comments."
    }
  ];

  return (
    <section className="relative overflow-hidden py-16 px-6 md:px-12 text-black font-grotesk">
      {/* MOME BRUTALIST 360-DEGREE CONCENTRIC ORBITS */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[820px] h-[820px] rounded-full border-2 border-black/40 animate-spin-slow relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-black border-2 border-white" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-black" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-black border-2 border-white" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-black" />
        </div>

        <div className="absolute w-[600px] h-[600px] rounded-full border-2 border-dashed border-white/70 animate-spin-reverse-slow">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-black" />
          <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-white" />
        </div>

        <div className="absolute w-[400px] h-[400px] rounded-full border-2 border-black/50 animate-spin-slow" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white font-bold text-xs uppercase tracking-widest border border-white mb-4 shadow-[2px_2px_0px_0px_#FFFFFF]">
          <Zap className="w-3.5 h-3.5" />
          360° Academic Matrix Exploration
        </div>

        <h2 className="font-chiseled text-3xl md:text-5xl text-black tracking-tight mb-2 uppercase">
          PERIPHERAL EVIDENCE MATRIX
        </h2>

        <p className="text-xs md:text-sm uppercase font-semibold text-white drop-shadow-[1px_1px_0px_#000000] max-w-2xl mx-auto mb-12 leading-relaxed">
          Click any evaluated paper node to inspect platform capabilities, extracted limitations, and formulated validation hypotheses.
        </p>

        {/* Central Core & Radial Grid Showcase */}
        <div className="relative py-6 flex flex-col items-center">
          
          {/* Center AI Core Node */}
          <div className="w-20 h-20 bg-black text-white font-chiseled text-xl flex flex-col items-center justify-center border-3 border-white shadow-[6px_6px_0px_0px_#000000] mb-12 z-20">
            <Cpu className="w-7 h-7 text-white mb-0.5" />
            <span className="text-[9px] tracking-widest uppercase font-bold">RAG CORE</span>
          </div>

          {/* Paper Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl z-20">
            {showcasePapers.map((paper) => (
              <div
                key={paper.id}
                onClick={() => setSelectedPaper(paper)}
                className="p-6 bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000000] hover:shadow-[8px_8px_0px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer text-left transition-all duration-150 relative group"
              >
                {/* Node Marker Dot */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-black border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white" />
                </div>

                <div className="flex items-center justify-between mb-3 mt-1">
                  <span className="px-2 py-0.5 bg-black text-white font-bold text-[10px] uppercase tracking-wider">
                    {paper.category}
                  </span>
                  <span className="text-xs font-bold text-black font-mono">{paper.year}</span>
                </div>

                <h3 className="font-extrabold text-sm uppercase text-black mb-2 leading-tight">
                  {paper.title}
                </h3>

                <p className="text-xs text-slate-700 mb-4 line-clamp-3 leading-relaxed uppercase">
                  {paper.abstract}
                </p>

                <div className="pt-3 border-t-2 border-black flex items-center justify-between text-xs font-bold text-black uppercase tracking-wider">
                  <span>Inspect Methodology</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Paper Guidance Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black p-8 shadow-[12px_12px_0px_0px_#000000] max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPaper(null)}
              className="absolute top-6 right-6 p-2 bg-black text-white hover:bg-slate-800 transition border border-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-black text-white font-bold text-xs uppercase">
                {selectedPaper.category}
              </span>
              <span className="text-xs font-bold uppercase text-slate-700 font-mono">
                // {selectedPaper.venue} ({selectedPaper.year})
              </span>
            </div>

            <h2 className="font-chiseled text-xl md:text-2xl text-black mb-1 uppercase leading-tight">
              {selectedPaper.title}
            </h2>
            <p className="text-xs font-bold uppercase text-slate-600 mb-6 font-mono">
              Authors: {selectedPaper.authors.join(", ")}
            </p>

            {/* Content Blocks */}
            <div className="space-y-4">
              <div className="p-5 bg-[#F4F5F6] border-2 border-black">
                <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-black" /> Platform Execution Capabilities:
                </h4>
                <ul className="space-y-1.5 text-xs text-black uppercase font-medium">
                  {selectedPaper.platformActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold text-black">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Research Gap Insight */}
              <div className="p-5 bg-black text-white border-2 border-black text-xs space-y-3">
                <div>
                  <h4 className="text-xs font-extrabold uppercase text-white tracking-wider mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-white" /> Extracted Candidate Research Gap:
                  </h4>
                  <p className="text-slate-300 font-semibold uppercase">{selectedPaper.gapInsight}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-700">
                  <div>
                    <span className="font-bold text-white block mb-0.5 uppercase">Proposed Research Question:</span>
                    <p className="text-slate-300 italic">"{selectedPaper.suggestedQuestion}"</p>
                  </div>
                  <div>
                    <span className="font-bold text-white block mb-0.5 uppercase">Suggested Validation Experiment:</span>
                    <p className="text-slate-300">{selectedPaper.suggestedExperiment}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-6 pt-4 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] font-mono uppercase text-slate-600">
                PyMuPDF section extraction & BGE embedding ready.
              </span>

              <Link
                href="/dashboard"
                className="px-6 py-3 bg-black hover:bg-white text-white hover:text-black font-extrabold text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_#8C8C8C] transition flex items-center gap-2"
              >
                Open in Workspace <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
