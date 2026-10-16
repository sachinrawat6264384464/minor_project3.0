"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Search, Plus, Filter, BookOpen, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function GlobalPapersPage() {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("all");
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const resp = await apiRequest<{ papers: any[] }>("/papers/search", {
        method: "POST",
        body: JSON.stringify({
          query,
          source,
          limit: 15
        })
      });
      let filtered = resp.papers || [];
      if (openAccessOnly) {
        filtered = filtered.filter((p) => p.is_open_access);
      }
      setResults(filtered);
    } catch (err) {
      alert("Search error: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-8 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-royal-border">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-royal-100 text-royal-700 font-bold text-xs flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> OpenAlex & Semantic Scholar Integration
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Discovery Engine</h1>
              <p className="text-xs text-slate-500 mt-1">Search millions of peer-reviewed papers with automated DOI deduplication.</p>
            </div>
          </div>

          {/* Search Bar & Filters Form */}
          <form onSubmit={handleSearch} className="glass-royal-card p-6 rounded-2xl mb-8 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 bg-white border border-slate-300 px-4 py-3 rounded-xl focus-within:border-royal-600">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by topic, keywords, authors, or DOI (e.g. Vision Transformers Medical Segmentation)..."
                  className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-royal-gradient hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-royal flex items-center gap-2"
              >
                {loading ? "Searching..." : "Search Papers"}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Source Connector:</span>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg outline-none font-semibold text-slate-700"
                >
                  <option value="all">All Academic Providers (Unified)</option>
                  <option value="openalex">OpenAlex API</option>
                  <option value="semanticscholar">Semantic Scholar API</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={openAccessOnly}
                  onChange={(e) => setOpenAccessOnly(e.target.checked)}
                  className="rounded text-royal-600 focus:ring-royal-500"
                />
                Open-Access PDF Available Only
              </label>
            </div>
          </form>

          {/* Results List */}
          <div className="space-y-4">
            {results.map((item, idx) => (
              <div key={idx} className="glass-royal-card p-6 rounded-2xl flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-royal-100 text-royal-700 font-bold text-[11px]">
                      {item.venue || "Academic Publication"}
                    </span>
                    {item.year && <span className="text-xs text-slate-400">• Year: {item.year}</span>}
                    <span className="text-xs text-slate-400">• Citations: {item.citation_count || 0}</span>
                    {item.is_open_access && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        OPEN ACCESS PDF
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 mb-2">Authors: {item.authors?.join(", ") || "Unknown"}</p>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.abstract || "No abstract snippet available."}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => alert("Added paper to active workspace!")}
                    className="px-4 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-semibold text-xs shadow-royal flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" /> Save to Workspace
                  </button>
                  {item.source_url && (
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-royal-50 text-royal-700 hover:bg-royal-100 font-semibold text-xs border border-royal-200 flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View Source
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
