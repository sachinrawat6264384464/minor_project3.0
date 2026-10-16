"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { 
  FileText, 
  Download, 
  Sparkles, 
  BookOpen, 
  Clock, 
  ExternalLink, 
  Code2, 
  Headphones, 
  Play, 
  Pause, 
  RotateCcw,
  Volume2,
  CheckCircle2,
  Radio
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface DialogueItem {
  speaker: string;
  role: string;
  gender: string;
  text: string;
}

interface PodcastData {
  project_id: string;
  title: string;
  speakers: string[];
  dialogue: DialogueItem[];
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"MARKDOWN" | "LATEX" | "PODCAST">("MARKDOWN");
  
  // LaTeX state
  const [latexCode, setLatexCode] = useState<string>("");
  const [bibCode, setBibCode] = useState<string>("");
  const [loadingLatex, setLoadingLatex] = useState(false);

  // Podcast state
  const [podcast, setPodcast] = useState<PodcastData | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState<number>(-1);
  const [loadingPodcast, setLoadingPodcast] = useState(false);

  const [reports] = useState([
    {
      id: "r1",
      title: "Systematic Literature Review & Gap Analysis",
      report_type: "LITERATURE_REVIEW",
      created_at: "2026-10-16",
      content: `# Systematic Literature Review: Deep Learning Paradigms & Evaluation Benchmarks\n\n## 1. Executive Summary\nSynthesized across peer-reviewed publications indexed via SerpAPI Google Scholar and PyMuPDF vector ingestion.\n\n## 2. Core Methodology Findings\n- Self-attention mechanisms enable parallel sequence representation.\n- Cross-attention improves multi-modal alignment across visual and textual tokens.\n\n## 3. Verified Research Gaps\n1. Critical vulnerability to out-of-distribution noise.\n2. Inadequate inference latency optimization under memory-constrained hardware.\n\n## 4. Suggested Validation Experiments\nDeploy dynamic entropy-gated token pruning and evaluate across unseen benchmark splits.`
    }
  ]);

  const [selectedReport, setSelectedReport] = useState(reports[0]);

  // Fetch LaTeX package
  const fetchLatexPackage = async () => {
    setLoadingLatex(true);
    try {
      const data = await apiRequest<any>("/reports/project/1ab957e7-e64e-4343-8c9b-7ef9ed5d3e91/latex");
      setLatexCode(data.tex_content);
      setBibCode(data.bib_content);
    } catch (err) {
      console.error("LaTeX fetch note:", err);
    } finally {
      setLoadingLatex(false);
    }
  };

  // Fetch Podcast Script
  const fetchPodcastScript = async () => {
    setLoadingPodcast(true);
    try {
      const data = await apiRequest<PodcastData>("/reports/project/1ab957e7-e64e-4343-8c9b-7ef9ed5d3e91/podcast-script");
      setPodcast(data);
    } catch (err) {
      console.error("Podcast fetch note:", err);
    } finally {
      setLoadingPodcast(false);
    }
  };

  useEffect(() => {
    fetchLatexPackage();
    fetchPodcastScript();
  }, []);

  // Web Speech API Podcast Player
  const playPodcastAudio = () => {
    if (!podcast || !("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setCurrentSpeakerIndex(-1);
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlayingAudio(true);

    const speakItem = (index: number) => {
      if (index >= podcast.dialogue.length) {
        setIsPlayingAudio(false);
        setCurrentSpeakerIndex(-1);
        return;
      }

      setCurrentSpeakerIndex(index);
      const item = podcast.dialogue[index];
      const utterance = new SpeechSynthesisUtterance(item.text);

      // Distinct pitch for male / female hosts
      if (item.gender === "female") {
        utterance.pitch = 1.25;
        utterance.rate = 1.05;
      } else {
        utterance.pitch = 0.85;
        utterance.rate = 1.0;
      }

      utterance.onend = () => {
        speakItem(index + 1);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setCurrentSpeakerIndex(-1);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakItem(0);
  };

  const handleDownloadMarkdown = (r: typeof reports[0]) => {
    const blob = new Blob([r.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${r.title.replace(/\s+/g, "_")}.md`;
    a.click();
  };

  const handleDownloadTex = () => {
    const blob = new Blob([latexCode], { type: "application/x-tex" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "literature_review_manuscript.tex";
    a.click();
  };

  const handleDownloadBib = () => {
    const blob = new Blob([bibCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "references.bib";
    a.click();
  };

  // Open in Overleaf via POST form
  const handleOpenInOverleaf = () => {
    const form = document.createElement("form");
    form.action = "https://www.overleaf.com/docs";
    form.method = "POST";
    form.target = "_blank";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "snip";
    input.value = latexCode;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-8 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-royal-border">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-royal-100 text-royal-700 font-bold text-xs flex items-center gap-1.5 shadow-sm">
                  <FileText className="w-3.5 h-3.5" /> Academic Synthesis & Export Hub
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-[11px]">
                  IEEE LaTeX + Overleaf + Audio Podcast
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Literature Reports & Publication Exporter
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Export verified literature reviews to Markdown, publication-ready IEEE LaTeX with BibTeX, or listen to an AI research podcast overview.
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl text-xs font-bold self-start md:self-auto">
              <button
                onClick={() => setActiveTab("MARKDOWN")}
                className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === "MARKDOWN" ? "bg-white text-royal-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Markdown
              </button>
              <button
                onClick={() => setActiveTab("LATEX")}
                className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === "LATEX" ? "bg-white text-royal-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-blue-600" /> IEEE LaTeX & Overleaf
              </button>
              <button
                onClick={() => setActiveTab("PODCAST")}
                className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === "PODCAST" ? "bg-white text-royal-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Headphones className="w-3.5 h-3.5 text-purple-600" /> Audio Podcast
              </button>
            </div>
          </div>

          {/* TAB 1: MARKDOWN VIEW */}
          {activeTab === "MARKDOWN" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

              <div className="lg:col-span-2 glass-royal-card p-8 rounded-2xl flex flex-col justify-between border border-slate-200">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                    <h3 className="text-lg font-bold text-slate-900">{selectedReport.title}</h3>
                    <button
                      onClick={() => handleDownloadMarkdown(selectedReport)}
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
          )}

          {/* TAB 2: IEEE LATEX & OVERLEAF EXPORT */}
          {activeTab === "LATEX" && (
            <div className="space-y-6">
              {/* Action Toolbar */}
              <div className="glass-royal-card p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-royal-600" /> IEEEtran Double-Column Manuscript & BibTeX
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ready for thesis submission or conference paper drafting.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleDownloadTex}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download .tex
                  </button>
                  <button
                    onClick={handleDownloadBib}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download .bib
                  </button>
                  <button
                    onClick={handleOpenInOverleaf}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open in Overleaf
                  </button>
                </div>
              </div>

              {/* Code Preview Panes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LaTeX .tex source */}
                <div className="glass-royal-card p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800 font-mono">manuscript.tex (IEEEtran)</span>
                    <span className="text-[10px] text-slate-400 font-semibold">LaTeX Source</span>
                  </div>
                  <pre className="h-96 overflow-y-auto p-4 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs leading-relaxed border border-slate-800">
                    {latexCode || "% Generating IEEE LaTeX manuscript..."}
                  </pre>
                </div>

                {/* BibTeX .bib source */}
                <div className="glass-royal-card p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800 font-mono">references.bib (BibTeX)</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Citations</span>
                  </div>
                  <pre className="h-96 overflow-y-auto p-4 bg-slate-950 text-cyan-400 rounded-xl font-mono text-xs leading-relaxed border border-slate-800">
                    {bibCode || "% Compiling BibTeX entries..."}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTEBOOKLM AUDIO PODCAST MODE */}
          {activeTab === "PODCAST" && (
            <div className="space-y-6">
              {/* Audio Player Banner */}
              <div className="glass-royal-card p-6 rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 via-white to-royal-50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg ${isPlayingAudio ? "animate-pulse" : ""}`}>
                    <Radio className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] uppercase tracking-wider">
                      NotebookLM-Style Audio Synthesis
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">
                      {podcast?.title || "Academic Deep Dive Podcast"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Featuring Dr. Alex (Methodology Host) & Dr. Taylor (Critic & Research Gap Analyst)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={playPodcastAudio}
                    className={`px-6 py-3 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 ${
                      isPlayingAudio 
                        ? "bg-rose-600 hover:bg-rose-700 text-white" 
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="w-4 h-4" /> Pause Audio
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" /> Play Audio Discussion
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Dialogue Script Cards */}
              <div className="glass-royal-card p-8 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Live Podcast Transcript
                </h4>

                {podcast?.dialogue.map((item, idx) => {
                  const isCurrent = currentSpeakerIndex === idx;
                  const isAlex = item.speaker === "Dr. Alex";

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        isCurrent
                          ? "bg-purple-100/70 border-purple-400 shadow-md scale-[1.01]"
                          : isAlex
                          ? "bg-white border-slate-200"
                          : "bg-royal-50/50 border-royal-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isAlex ? "bg-blue-600" : "bg-purple-600"}`} />
                          <span className="font-extrabold text-slate-900 text-xs">{item.speaker}</span>
                          <span className="text-[10px] text-slate-500">({item.role})</span>
                        </div>
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-purple-700 animate-pulse">
                            <Volume2 className="w-3.5 h-3.5" /> Speaking Now
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed pl-4 border-l-2 border-slate-200">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
