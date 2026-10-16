"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { GitCompare, BookOpen, CheckCircle, HelpCircle } from "lucide-react";
import { PaperComparisonResult } from "@/types";

export default function PaperComparisonPage() {
  const [comparedPapers, setComparedPapers] = useState<PaperComparisonResult[]>([
    {
      paper_id: "p1",
      title: "Advancements in Vision Transformers for Medical Image Segmentation",
      authors: ["Dr. Elena Rostova", "Prof. Marcus Thorne"],
      year: 2025,
      objective: "Evaluate attention mechanisms & transformer computational scalability in high-res MRI segmentation.",
      methodology: "Swin Transformer backbone combined with U-Net decoder features and multi-scale attention fusion.",
      dataset: "Synapse Multi-Organ CT & ACDC Challenge dataset (120 scans)",
      evaluation_metrics: "Dice Similarity Coefficient (DSC), Hausdorff Distance 95 (HD95)",
      results: "Achieved 84.2% average Dice score, outperforming standard 3D U-Net by 3.4%.",
      limitations: "High computational latency and GPU memory requirements during 3D volume inference.",
      future_work: "Investigate quantized attention heads and PEFT adapters for lightweight hospital deployment."
    },
    {
      paper_id: "p2",
      title: "Evaluating RAG Passage Chunking Bottlenecks in Clinical Literature",
      authors: ["Sarah Jenkins", "Devon Patel"],
      year: 2024,
      objective: "Mitigate passage fragmentation and hallucinated references in peer-reviewed RAG systems.",
      methodology: "Section-aware parent-child document chunking with Reciprocal Rank Fusion (RRF) dense+sparse search.",
      dataset: "PubMedQA & BioASQ clinical QA datasets (5,000 QA pairs)",
      evaluation_metrics: "Citation Precision@k, Recall@k, Factuality Hallucination Rate",
      results: "Reduced hallucinated citations by 34% while maintaining 91.5% Recall@5.",
      limitations: "Requires initial PyMuPDF section parsing overhead for legacy PDF layouts.",
      future_work: "Extend hierarchical chunking to multi-modal figures and medical table parsing."
    }
  ]);

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-8 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-royal-border">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-royal-100 text-royal-700 font-bold text-xs flex items-center gap-1.5">
                  <GitCompare className="w-3.5 h-3.5" /> Side-by-Side Paper Matrix
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Paper Comparison Matrix</h1>
              <p className="text-xs text-slate-500 mt-1">Structured comparison of objectives, methods, datasets, metrics, and limitations.</p>
            </div>
          </div>

          {/* Comparison Grid Table */}
          <div className="overflow-x-auto glass-royal-card rounded-2xl shadow-sm border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-royal-gradient text-white">
                  <th className="p-4 text-xs font-bold uppercase w-48 border-r border-royal-800">Feature Field</th>
                  {comparedPapers.map((p) => (
                    <th key={p.paper_id} className="p-4 text-sm font-bold min-w-[320px] border-r border-royal-800">
                      {p.title}
                      <p className="text-[11px] font-normal text-royal-200 mt-1">{p.authors.join(", ")} ({p.year})</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                <tr>
                  <td className="p-4 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">Research Objective</td>
                  {comparedPapers.map((p) => (
                    <td key={p.paper_id} className="p-4 text-slate-800 border-r border-slate-200 leading-relaxed">{p.objective}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">Methodology / Model</td>
                  {comparedPapers.map((p) => (
                    <td key={p.paper_id} className="p-4 text-slate-800 border-r border-slate-200 leading-relaxed">{p.methodology}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">Dataset & Samples</td>
                  {comparedPapers.map((p) => (
                    <td key={p.paper_id} className="p-4 text-slate-800 border-r border-slate-200 leading-relaxed">{p.dataset}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">Evaluation Metrics</td>
                  {comparedPapers.map((p) => (
                    <td key={p.paper_id} className="p-4 text-slate-800 border-r border-slate-200 leading-relaxed">{p.evaluation_metrics}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">Key Results</td>
                  {comparedPapers.map((p) => (
                    <td key={p.paper_id} className="p-4 text-emerald-900 font-medium border-r border-slate-200 leading-relaxed">{p.results}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">Limitations</td>
                  {comparedPapers.map((p) => (
                    <td key={p.paper_id} className="p-4 text-amber-900 border-r border-slate-200 leading-relaxed">{p.limitations}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-slate-700 bg-slate-50 border-r border-slate-200">Future Work Stated</td>
                  {comparedPapers.map((p) => (
                    <td key={p.paper_id} className="p-4 text-royal-700 border-r border-slate-200 leading-relaxed">{p.future_work}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
