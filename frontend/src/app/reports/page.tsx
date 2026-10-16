"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { FileText, Download, Sparkles, BookOpen, Clock } from "lucide-react";

export default function ReportsPage() {
  const [reports, setReports] = useState([
    {
      id: "r1",
      title: "Medical Imaging Vision Transformers Literature Review",
      report_type: "LITERATURE_REVIEW",
      created_at: "2026-10-10",
      content: `# Systematic Literature Review: Vision Transformers in Medical Imaging\n\n## 1. Executive Summary\nSynthesized across 8 indexed papers. Identified high segmentation accuracy with 3D Swin backbones.`
    },
    {
      id: "r2",
      title: "Hybrid RAG & Research Gap Validation Report",
      report_type: "GAP_ANALYSIS",
      created_at: "2026-10-09",
      content: `# Research Gap Analysis Report\n\n## Candidate Gaps\n1. Limited Evaluation Under Out-of-Distribution Noise\n2. Inadequate Baseline Comparisons Against LoRA/QLoRA.`
    }
  ]);

  const [selectedReport, setSelectedReport] = useState(reports[0]);

  const handleDownload = (r: typeof reports[0]) => {
    const blob = new Blob([r.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${r.title.replace(/\s+/g, "_")}.md`;
    a.click();
  };

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
                  <FileText className="w-3.5 h-3.5" /> Generated Literature Reports
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Research Reports & Synthesis</h1>
              <p className="text-xs text-slate-500 mt-1">Downloadable systematic literature reviews and gap analysis reports.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reports List Column */}
            <div className="space-y-4">
              {reports.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className={`glass-royal-card p-5 rounded-2xl cursor-pointer transition border-l-4 ${
                    selectedReport.id === r.id ? "border-l-royal-600 bg-royal-50/50" : "border-l-transparent hover:border-l-royal-300"
                  }`}
                >
                  <span className="px-2.5 py-0.5 rounded bg-royal-100 text-royal-700 font-bold text-[10px] uppercase mb-2 inline-block">
                    {r.report_type}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">{r.title}</h4>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Generated {r.created_at}
                  </span>
                </div>
              ))}
            </div>

            {/* Markdown Report Preview & Download Pane */}
            <div className="lg:col-span-2 glass-royal-card p-8 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                  <h3 className="text-lg font-bold text-slate-900">{selectedReport.title}</h3>
                  <button
                    onClick={() => handleDownload(selectedReport)}
                    className="px-4 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-bold text-xs shadow-royal transition flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Markdown (.md)
                  </button>
                </div>

                <div className="prose prose-sm max-w-none text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap bg-royal-offwhite p-6 rounded-xl border border-slate-200">
                  {selectedReport.content}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
