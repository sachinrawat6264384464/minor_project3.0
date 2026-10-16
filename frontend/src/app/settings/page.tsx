"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Settings, ShieldCheck, Cpu, Database, Save } from "lucide-react";

export default function SettingsPage() {
  const [llmModel, setLlmModel] = useState("gpt-4o-mini");
  const [embeddingModel, setEmbeddingModel] = useState("BAAI/bge-small-en-v1.5");
  const [topK, setTopK] = useState(5);
  const [enableReranker, setEnableReranker] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-8 max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-royal-border">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-royal-100 text-royal-700 font-bold text-xs flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" /> Platform & Engine Configuration
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings & RAG Configuration</h1>
              <p className="text-xs text-slate-500 mt-1">Configure vector models, LLM synthesis models, and retrieval candidate budgets.</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* LLM Model Selection */}
            <div className="glass-royal-card p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-royal-600" /> Synthesis LLM Model
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  llmModel === "gpt-4o-mini" ? "border-royal-600 bg-royal-50/60" : "border-slate-200 hover:border-royal-300"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-900">GPT-4o Mini (Default)</span>
                    <input
                      type="radio"
                      name="llm"
                      checked={llmModel === "gpt-4o-mini"}
                      onChange={() => setLlmModel("gpt-4o-mini")}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Fast, cost-effective structured extraction & grounded Q&A synthesis.</p>
                </label>

                <label className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  llmModel === "gpt-4o" ? "border-royal-600 bg-royal-50/60" : "border-slate-200 hover:border-royal-300"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-900">GPT-4o (High Quality)</span>
                    <input
                      type="radio"
                      name="llm"
                      checked={llmModel === "gpt-4o"}
                      onChange={() => setLlmModel("gpt-4o")}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Highest reasoning quality for complex multi-document gap synthesis.</p>
                </label>
              </div>
            </div>

            {/* Vector & RAG Parameters */}
            <div className="glass-royal-card p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-royal-600" /> Vector Index & Retrieval Parameters
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Local Embedding Model</label>
                  <select
                    value={embeddingModel}
                    onChange={(e) => setEmbeddingModel(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium outline-none focus:border-royal-600"
                  >
                    <option value="BAAI/bge-small-en-v1.5">BAAI/bge-small-en-v1.5 (Recommended Local BGE Model)</option>
                    <option value="sentence-transformers/all-MiniLM-L6-v2">sentence-transformers/all-MiniLM-L6-v2</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Retrieval Candidate Top-K ({topK} Passages)</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={15}
                    value={topK}
                    onChange={(e) => setTopK(Number(e.target.value))}
                    className="w-full accent-royal-600"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={enableReranker}
                      onChange={(e) => setEnableReranker(e.target.checked)}
                      className="rounded text-royal-600 focus:ring-royal-500"
                    />
                    Enable Cross-Encoder Reranking (`bge-reranker-base`)
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              {saved ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Configuration settings saved!
                </span>
              ) : <span />}

              <button
                type="submit"
                className="px-6 py-2.5 bg-royal-gradient hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-royal flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Preferences
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
