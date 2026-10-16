"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { 
  FolderPlus, 
  BookOpen, 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  FileText, 
  Clock, 
  Plus,
  ArrowRight
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { Project } from "@/types";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<Project[]>("/projects");
      setProjects(data);
    } catch (err) {
      console.log("Using default demo projects");
      setProjects([
        {
          id: "demo-proj-1",
          title: "Deep Learning in Medical Imaging",
          description: "Evaluating segmentation accuracy & adversarial robustness",
          research_topic: "Medical Image Segmentation",
          primary_question: "How do vision transformers compare against U-Net under noise?",
          user_id: "user-1",
          paper_count: 8,
          created_at: "2026-10-09T12:00:00Z",
          updated_at: "2026-10-09T12:00:00Z"
        },
        {
          id: "demo-proj-2",
          title: "RAG Bottlenecks & Citation Validation",
          description: "Passage chunking strategies for peer-reviewed literature",
          research_topic: "Hybrid RAG Architecture",
          primary_question: "Can RRF fusion eliminate hallucinated academic citations?",
          user_id: "user-1",
          paper_count: 14,
          created_at: "2026-10-08T10:00:00Z",
          updated_at: "2026-10-08T10:00:00Z"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !topic) return;

    try {
      const newProj = await apiRequest<Project>("/projects", {
        method: "POST",
        body: JSON.stringify({
          title,
          research_topic: topic,
          primary_question: question
        })
      });
      setProjects([newProj, ...projects]);
      setShowCreateModal(false);
      setTitle("");
      setTopic("");
      setQuestion("");
    } catch (err) {
      alert("Failed to create project: " + err);
    }
  };

  const totalPapers = projects.reduce((acc, p) => acc + (p.paper_count || 0), 0);

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-8 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Research Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1">Manage active projects, paper collections, and research gap analyses.</p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-semibold text-sm shadow-royal transition flex items-center gap-2 self-start"
            >
              <Plus className="w-4 h-4" /> Create New Project
            </button>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="glass-royal-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">Active Projects</span>
                <div className="w-8 h-8 rounded-lg bg-royal-100 text-royal-700 flex items-center justify-center">
                  <FolderPlus className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{projects.length}</p>
            </div>

            <div className="glass-royal-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Papers Indexed</span>
                <div className="w-8 h-8 rounded-lg bg-royal-100 text-royal-700 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{totalPapers}</p>
            </div>

            <div className="glass-royal-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">Gap Analyses</span>
                <div className="w-8 h-8 rounded-lg bg-royal-100 text-royal-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">5</p>
            </div>

            <div className="glass-royal-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">Reports Generated</span>
                <div className="w-8 h-8 rounded-lg bg-royal-100 text-royal-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">3</p>
            </div>
          </div>

          {/* Research Projects Grid */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Your Research Projects</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="glass-royal-card p-6 rounded-2xl hover:border-royal-500 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-royal-50 text-royal-700 font-semibold text-xs border border-royal-200">
                      {proj.research_topic}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Oct 2026
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{proj.title}</h3>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-2">
                    {proj.primary_question || proj.description || "No primary question specified."}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-600">
                      📚 {proj.paper_count || 0} Ingested Papers
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/workspace/${proj.id}`}
                        className="px-3.5 py-1.5 rounded-lg bg-royal-600 hover:bg-royal-700 text-white font-semibold text-xs transition flex items-center gap-1.5"
                      >
                        Open Workspace <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-royal-border">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Research Project</h3>
            
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. LLM Reasoning Bottlenecks in Medical QA"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:border-royal-600 focus:ring-2 focus:ring-royal-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Research Topic / Domain *</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Natural Language Processing"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:border-royal-600 focus:ring-2 focus:ring-royal-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Research Question</label>
                <textarea
                  rows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What core scientific hypothesis are you investigating?"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:border-royal-600 focus:ring-2 focus:ring-royal-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-semibold text-xs shadow-royal"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
