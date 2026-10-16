"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { TrendingUp, Layers, GitFork, Sparkles } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { apiRequest } from "@/lib/api";

export default function TrendsPage() {
  const params = useParams();
  const projectId = params?.projectId as string;

  const [trendData, setTrendData] = useState<any[]>([
    { year: "2022", count: 12 },
    { year: "2023", count: 28 },
    { year: "2024", count: 45 },
    { year: "2025", count: 72 }
  ]);

  const [graphNodes, setGraphNodes] = useState<any[]>([
    { id: "1", label: "Vision Transformers", type: "Method" },
    { id: "2", label: "Medical Segmentation", type: "Topic" },
    { id: "3", label: "Synapse CT Dataset", type: "Dataset" },
    { id: "4", label: "High Latency Bottleneck", type: "Limitation" }
  ]);

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar projectId={projectId} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-8 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-royal-border">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-royal-100 text-royal-700 font-bold text-xs flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Research Analytics & Knowledge Graph
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trends & Knowledge Exploration</h1>
              <p className="text-xs text-slate-500 mt-1">Publication velocity over time and entity relationship visualizer.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Chart 1: Publication Velocity */}
            <div className="glass-royal-card p-6 rounded-2xl">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-royal-600" /> Publication Trends by Year
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="year" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Knowledge Graph Entity Visualizer */}
            <div className="glass-royal-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-royal-600" /> Knowledge Graph Entity Nodes
                </h3>
                <p className="text-xs text-slate-500 mb-6">Extracted entity relationships across ingested papers.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {graphNodes.map((node) => (
                  <div key={node.id} className="p-4 rounded-xl bg-royal-offwhite border border-slate-200 text-xs flex flex-col justify-between">
                    <span className="px-2 py-0.5 rounded bg-royal-100 text-royal-700 font-bold text-[10px] self-start mb-2">
                      {node.type}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{node.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
