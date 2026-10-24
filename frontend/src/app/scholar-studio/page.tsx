"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Square, 
  CheckSquare, 
  Trash2, 
  Upload, 
  FileText, 
  ArrowRight, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Layers, 
  RefreshCw, 
  ShieldCheck, 
  Database,
  MessageSquare,
  GitCompare,
  TrendingUp,
  AlertCircle,
  Code2
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { Project } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface StagingPaper {
  id?: string;
  title: string;
  doi?: string | null;
  abstract?: string | null;
  authors: string[];
  year?: number | null;
  venue?: string | null;
  citation_count?: number;
  source_url?: string | null;
  pdf_url?: string | null;
  is_open_access?: boolean;
  source?: string;
  has_code?: boolean;
  github_repo?: string | null;
  project_page?: string | null;
  selected?: boolean;
}

export default function ScholarStudioPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [researchIntent, setResearchIntent] = useState("");
  const [source, setSource] = useState("serpapi"); // "serpapi" = Google Scholar via SerpAPI
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<number, boolean>>({});

  // Staging papers
  const [papers, setPapers] = useState<StagingPaper[]>([]);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // Ingestion Processing Modal State
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<number>(0);
  const [processSuccess, setProcessSuccess] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await apiRequest<Project[]>("/projects");
      setProjects(data);
      if (data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
    } catch (err) {
      // Demo project fallback
      const demo: Project[] = [
        {
          id: "demo-proj-1",
          title: "Medical Imaging & Deep Transformers",
          research_topic: "Medical Diagnostics",
          user_id: "u1",
          paper_count: 5,
          created_at: "2026-10-10",
          updated_at: "2026-10-10"
        }
      ];
      setProjects(demo);
      setSelectedProjectId(demo[0].id);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!researchIntent.trim()) return;

    try {
      setLoading(true);
      const resp = await apiRequest<{ papers: StagingPaper[] }>("/papers/search", {
        method: "POST",
        body: JSON.stringify({
          query: researchIntent,
          source: source,
          limit: 10
        })
      });

      let fetched = resp.papers || [];
      if (openAccessOnly) {
        fetched = fetched.filter((p) => p.is_open_access || p.pdf_url);
      }

      // Pre-select all fetched papers by default for user review
      const initialized = fetched.map((p) => ({
        ...p,
        selected: true
      }));

      setPapers(initialized);
    } catch (err) {
      alert("Failed to fetch papers: " + err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectPaper = (index: number) => {
    setPapers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, selected: !p.selected } : p))
    );
  };

  const toggleSelectAll = (select: boolean) => {
    setPapers((prev) => prev.map((p) => ({ ...p, selected: select })));
  };

  const removePaper = (index: number) => {
    setPapers((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAbstractExpand = (index: number) => {
    setExpandedAbstracts((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Upload custom PDF directly into staging
  const handleCustomPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProjectId) return;

    try {
      setUploadingPdf(true);
      const formData = new FormData();
      formData.append("project_id", selectedProjectId);
      formData.append("file", file);

      const resp = await fetch("http://localhost:8000/api/v1/papers/upload", {
        method: "POST",
        body: formData
      });

      if (!resp.ok) throw new Error("PDF upload failed");
      const savedPaper = await resp.json();

      // Add uploaded PDF paper directly to the staging list as selected
      setPapers((prev) => [
        {
          id: savedPaper.id,
          title: savedPaper.title,
          abstract: savedPaper.abstract || "Uploaded custom research manuscript (Processed via PyMuPDF)",
          authors: savedPaper.authors || ["Uploaded Author"],
          year: savedPaper.year || 2026,
          venue: "Local Research Upload",
          citation_count: 0,
          pdf_url: savedPaper.local_file_path,
          is_open_access: true,
          source: "Local PDF Upload",
          selected: true
        },
        ...prev
      ]);

      alert(`"${file.name}" uploaded, parsed with PyMuPDF, and added to staging!`);
    } catch (err) {
      alert("Error uploading PDF: " + err);
    } finally {
      setUploadingPdf(false);
      e.target.value = "";
    }
  };

  // Batch process selected papers into Vector DB
  const handleBatchProcess = async () => {
    const selected = papers.filter((p) => p.selected);
    if (selected.length === 0) {
      alert("Please select at least one paper to process into the Vector Database.");
      return;
    }
    if (!selectedProjectId) {
      alert("Please select a target project workspace.");
      return;
    }

    try {
      setProcessing(true);
      setProcessStep(1); // Step 1: Downloading & Resolving PDFs
      setProcessSuccess(false);

      // Step simulation for rich feedback
      setTimeout(() => setProcessStep(2), 1200); // Step 2: PyMuPDF Section Parsing
      setTimeout(() => setProcessStep(3), 2200); // Step 3: Vector Embeddings & DB indexing

      const payload = {
        project_id: selectedProjectId,
        papers: selected.map((p) => ({
          title: p.title,
          doi: p.doi || null,
          abstract: p.abstract || null,
          authors: p.authors || [],
          year: p.year || 2024,
          venue: p.venue || null,
          citation_count: p.citation_count || 0,
          source_url: p.source_url || null,
          pdf_url: p.pdf_url || null,
          is_open_access: Boolean(p.is_open_access)
        }))
      };

      const result = await apiRequest<{ status: string; count: number; papers: any[] }>(
        "/papers/batch-process",
        {
          method: "POST",
          body: JSON.stringify(payload)
        }
      );

      setProcessedCount(result.count || selected.length);
      setProcessStep(4);
      setProcessSuccess(true);
    } catch (err) {
      alert("Batch processing error: " + err);
      setProcessing(false);
    }
  };

  const selectedCount = papers.filter((p) => p.selected).length;

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar projectId={selectedProjectId} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-8 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-royal-border gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-royal-100 text-royal-700 font-bold text-xs flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-royal-600" /> SerpAPI (Google Scholar) + Papers With Code + Scopus (Elsevier)
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-semibold text-xs flex items-center gap-1 border border-purple-200">
                  <Code2 className="w-3.5 h-3.5 text-purple-600" /> Code & Repositories
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs flex items-center gap-1 border border-emerald-200">
                  <Database className="w-3.5 h-3.5" /> Vector DB Preprocessing Studio
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Scholar Literature Studio & RAG Preprocessor
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Search and harvest papers across Google Scholar (SerpAPI), reproducible GitHub repositories from Papers With Code, and 90M+ peer-reviewed works from Elsevier Scopus. Inspect abstracts, verified citation metrics, and batch index them directly into your project's Vector Database.
              </p>
            </div>

            {/* Target Project Selector */}
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-royal-border shadow-sm">
              <Layers className="w-4 h-4 text-royal-600" />
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Target Project</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sourcing Input Bar */}
          <div className="bg-white p-6 rounded-2xl border border-royal-border shadow-card mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  What research paper do you want to write or research?
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={researchIntent}
                    onChange={(e) => setResearchIntent(e.target.value)}
                    placeholder="e.g. LLM hallucination mitigation, zero-knowledge proofs in healthcare, vision transformers..."
                    className="w-full pl-12 pr-4 py-3.5 text-sm rounded-xl border border-royal-border focus:border-royal-500 focus:ring-4 focus:ring-royal-100 outline-none transition text-slate-900 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Controls & Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Multi-Source Toggle: SerpAPI + Papers With Code + Scopus + All */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setSource("all")}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        source === "all"
                          ? "bg-royal-600 text-white font-bold shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      🌟 All Sources (Unified)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSource("serpapi")}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        source === "serpapi"
                          ? "bg-white text-royal-700 font-bold shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Google Scholar (SerpAPI)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSource("paperswithcode")}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        source === "paperswithcode"
                          ? "bg-white text-purple-700 font-bold shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      💻 Papers With Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setSource("scopus")}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        source === "scopus"
                          ? "bg-white text-amber-700 font-bold shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      📚 Scopus (Elsevier)
                    </button>
                  </div>

                  {/* Open-Access Filter */}
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={openAccessOnly}
                      onChange={(e) => setOpenAccessOnly(e.target.checked)}
                      className="rounded border-slate-300 text-royal-600 focus:ring-royal-500 w-4 h-4 cursor-pointer"
                    />
                    Only papers with direct downloadable PDF
                  </label>
                </div>

                {/* Fetch Button */}
                <button
                  type="submit"
                  disabled={loading || !researchIntent.trim()}
                  className="px-6 py-3 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-bold text-xs flex items-center gap-2 shadow-royal transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Sourcing Scholar Papers...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" /> Fetch from Google Scholar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Staging & Verification Stage */}
          {papers.length > 0 && (
            <div className="space-y-6">
              {/* Staging Summary & Action Bar */}
              <div className="bg-royal-50 border border-royal-200 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-royal-600 text-white flex items-center justify-center font-extrabold shadow-sm">
                    {selectedCount}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Preprocessing Staging Area: Verify Selected Papers
                    </h2>
                    <p className="text-xs text-slate-600">
                      Inspect titles and abstracts below. Select the ones you want indexed into the Vector DB.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleSelectAll(true)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSelectAll(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
                  >
                    Deselect All
                  </button>

                  {/* Primary Batch Ingestion Button */}
                  <button
                    type="button"
                    onClick={handleBatchProcess}
                    disabled={selectedCount === 0}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition disabled:opacity-50"
                  >
                    <Database className="w-4 h-4" />
                    Process {selectedCount} Selected Papers for Vector DB & RAG
                  </button>
                </div>
              </div>

              {/* Upload Custom PDF Card */}
              <div className="bg-white border border-dashed border-royal-300 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-royal-100 text-royal-600 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Have your own research paper manuscript or local PDF?
                    </h3>
                    <p className="text-xs text-slate-500">
                      Add custom research documents to this staging batch for section-aware vector indexing.
                    </p>
                  </div>
                </div>

                <label className="cursor-pointer px-4 py-2 rounded-xl bg-royal-100 hover:bg-royal-200 text-royal-800 font-bold text-xs flex items-center gap-2 transition flex-shrink-0">
                  {uploadingPdf ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading & Parsing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" /> Upload Local PDF
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleCustomPdfUpload}
                    disabled={uploadingPdf}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Staging Papers List */}
              <div className="space-y-4">
                {papers.map((paper, idx) => {
                  const isExpanded = expandedAbstracts[idx];
                  return (
                    <div
                      key={idx}
                      className={`p-6 rounded-2xl border transition-all ${
                        paper.selected
                          ? "bg-white border-royal-400 shadow-card ring-1 ring-royal-400/30"
                          : "bg-slate-50/60 border-slate-200 opacity-60 hover:opacity-90"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleSelectPaper(idx)}
                          className="mt-1 flex-shrink-0 text-royal-600 hover:text-royal-700 transition"
                        >
                          {paper.selected ? (
                            <CheckSquare className="w-6 h-6 text-royal-600" />
                          ) : (
                            <Square className="w-6 h-6 text-slate-400" />
                          )}
                        </button>

                        {/* Paper Content */}
                        <div className="flex-1 min-w-0">
                          {/* Badges & Meta */}
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {paper.citation_count !== undefined && paper.citation_count > 0 && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[11px] border border-amber-200 flex items-center gap-1">
                                ⭐ {paper.citation_count} Citations
                              </span>
                            )}
                            {paper.year && (
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                                {paper.year}
                              </span>
                            )}
                            {paper.venue && (
                              <span className="px-2.5 py-0.5 rounded-full bg-royal-50 text-royal-700 font-semibold text-[11px] truncate max-w-xs">
                                {paper.venue}
                              </span>
                            )}
                            {paper.pdf_url ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200 flex items-center gap-1">
                                📄 Full PDF Downloadable
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-200">
                                📝 Abstract Vector Indexing
                              </span>
                            )}
                            {paper.source && (
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 border ${
                                paper.source.includes("Papers With Code")
                                  ? "bg-purple-100 text-purple-800 border-purple-300"
                                  : paper.source.includes("Scopus")
                                  ? "bg-amber-100 text-amber-800 border-amber-300"
                                  : "bg-royal-50 text-royal-700 border-royal-200"
                              }`}>
                                {paper.source.includes("Papers With Code") && <Code2 className="w-3 h-3" />}
                                {paper.source.includes("Scopus") && <BookOpen className="w-3 h-3" />}
                                {paper.source}
                              </span>
                            )}
                            {(paper.has_code || paper.github_repo) && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300 flex items-center gap-1 shadow-2xs">
                                💻 Code Available
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {paper.title}
                          </h3>

                          {/* Authors */}
                          <p className="text-xs text-slate-500 mt-1 font-medium">
                            {paper.authors && paper.authors.length > 0
                              ? paper.authors.join(", ")
                              : "Academic Research Group"}
                          </p>

                          {/* Abstract Preview */}
                          {paper.abstract && (
                            <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                              <p className={isExpanded ? "" : "line-clamp-2"}>
                                {paper.abstract}
                              </p>
                              {paper.abstract.length > 150 && (
                                <button
                                  type="button"
                                  onClick={() => toggleAbstractExpand(idx)}
                                  className="mt-2 text-royal-600 hover:text-royal-700 font-bold flex items-center gap-1 text-[11px]"
                                >
                                  {isExpanded ? (
                                    <>
                                      <EyeOff className="w-3 h-3" /> Show Less
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-3 h-3" /> Read Full Abstract
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Action links & GitHub Repository */}
                          <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 border-t border-slate-100">
                            {paper.github_repo && (
                              <a
                                href={paper.github_repo}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold transition shadow-xs"
                              >
                                <Code2 className="w-3.5 h-3.5 text-purple-600" /> GitHub Repository
                              </a>
                            )}
                            {paper.source_url && (
                              <a
                                href={paper.source_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-slate-600 hover:text-royal-600 flex items-center gap-1 font-semibold"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> View Source / DOI
                              </a>
                            )}
                            {paper.pdf_url && (
                              <a
                                href={paper.pdf_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 font-bold"
                              >
                                📄 Direct PDF Link
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Discard Button */}
                        <button
                          type="button"
                          onClick={() => removePaper(idx)}
                          title="Discard paper from batch"
                          className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State / Prompt */}
          {papers.length === 0 && !loading && (
            <div className="p-12 text-center bg-white rounded-2xl border border-royal-border shadow-card">
              <div className="w-16 h-16 rounded-2xl bg-royal-50 text-royal-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Ready to Source Literature for Your Paper
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                Type the topic of the paper you wish to write above. SerpAPI will pull Google Scholar results with real citation metrics and direct PDF links into this staging studio.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "LLM Hallucination Mitigation",
                  "Federated Learning Differential Privacy",
                  "Vision Transformer Segmentation",
                  "Graph Neural Networks for Drug Discovery"
                ].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => {
                      setResearchIntent(sample);
                    }}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-royal-100 hover:text-royal-700 text-slate-700 font-medium transition"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Processing Modal Overlay */}
          {processing && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-royal-border space-y-6">
                <div className="text-center">
                  {!processSuccess ? (
                    <div className="w-16 h-16 rounded-2xl bg-royal-100 text-royal-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Database className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                  )}

                  <h3 className="text-xl font-extrabold text-slate-900">
                    {!processSuccess ? "Vector DB & RAG Ingestion" : "Processing Complete!"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {!processSuccess
                      ? "Downloading PDFs, extracting section boundaries, and generating vector embeddings..."
                      : `Successfully indexed ${processedCount} papers into your project's Vector Database.`}
                  </p>
                </div>

                {/* Progress Steps */}
                {!processSuccess ? (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          processStep >= 1 ? "bg-royal-600 text-white" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        1
                      </div>
                      <span className={processStep >= 1 ? "font-bold text-slate-800" : "text-slate-400"}>
                        Resolving and downloading full-text PDFs...
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          processStep >= 2 ? "bg-royal-600 text-white" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        2
                      </div>
                      <span className={processStep >= 2 ? "font-bold text-slate-800" : "text-slate-400"}>
                        PyMuPDF section segmentation (Abstract, Methods, Limitations)...
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          processStep >= 3 ? "bg-royal-600 text-white" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        3
                      </div>
                      <span className={processStep >= 3 ? "font-bold text-slate-800" : "text-slate-400"}>
                        Generating 384-dim BAAI/bge embeddings & storing DocumentChunks...
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-800 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        All document chunks are indexed and ready for grounded retrieval!
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        You can now chat with verifiable citations, analyze novelty research gaps, or compare these papers side-by-side.
                      </p>
                    </div>

                    {/* Action navigation buttons */}
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => router.push(`/chat/${selectedProjectId}`)}
                        className="w-full py-3 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-royal transition"
                      >
                        <MessageSquare className="w-4 h-4" /> Start Grounded RAG Chat with Citations
                      </button>

                      <button
                        onClick={() => router.push(`/research-gaps/${selectedProjectId}`)}
                        className="w-full py-3 rounded-xl bg-royal-100 hover:bg-royal-200 text-royal-800 font-bold text-xs flex items-center justify-center gap-2 transition"
                      >
                        <Sparkles className="w-4 h-4" /> Analyze Novel Research Gaps
                      </button>

                      <button
                        onClick={() => router.push(`/compare`)}
                        className="w-full py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition"
                      >
                        <GitCompare className="w-4 h-4" /> Open Side-by-Side Comparison Matrix
                      </button>

                      <button
                        onClick={() => setProcessing(false)}
                        className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-800 font-medium"
                      >
                        Stay in Literature Studio
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
