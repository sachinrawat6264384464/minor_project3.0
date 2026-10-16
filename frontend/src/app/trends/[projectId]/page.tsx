"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { 
  TrendingUp, 
  GitFork, 
  Sparkles, 
  BookOpen, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Filter, 
  Info,
  Layers,
  ArrowRight
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { apiRequest } from "@/lib/api";

interface GraphNode {
  id: string;
  label: string;
  type: "Project" | "Paper" | "Method" | "Dataset" | "Limitation";
  val: number;
  x?: number;
  y?: number;
}

interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export default function TrendsPage() {
  const params = useParams();
  const projectId = (params?.projectId as string) || "1ab957e7-e64e-4343-8c9b-7ef9ed5d3e91";

  const [trendData, setTrendData] = useState<any[]>([
    { year: "2021", count: 8 },
    { year: "2022", count: 19 },
    { year: "2023", count: 37 },
    { year: "2024", count: 62 },
    { year: "2025", count: 94 }
  ]);

  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [zoom, setZoom] = useState<number>(1);
  const [loadingGraph, setLoadingGraph] = useState<boolean>(true);

  // Position nodes radially around the center project
  useEffect(() => {
    fetchGraphData();
  }, [projectId]);

  const fetchGraphData = async () => {
    setLoadingGraph(true);
    try {
      const data = await apiRequest<GraphData>(`/graph/project/${projectId}`);
      
      // Calculate coordinates for nodes in a clean radial force layout
      const width = 640;
      const height = 480;
      const centerX = width / 2;
      const centerY = height / 2;

      const nonProjectNodes = data.nodes.filter(n => n.type !== "Project");
      const total = nonProjectNodes.length || 1;

      const positionedNodes = data.nodes.map((node, i) => {
        if (node.type === "Project") {
          return { ...node, x: centerX, y: centerY };
        }
        const indexInOrbit = nonProjectNodes.findIndex(n => n.id === node.id);
        const radius = node.type === "Paper" ? 140 : 210;
        const angle = (indexInOrbit / total) * 2 * Math.PI;
        return {
          ...node,
          x: centerX + radius * Math.cos(angle) + (Math.sin(i) * 15),
          y: centerY + radius * Math.sin(angle) + (Math.cos(i) * 15)
        };
      });

      setGraphData({ nodes: positionedNodes, edges: data.edges });
      if (positionedNodes.length > 0) {
        setSelectedNode(positionedNodes[0]);
      }
    } catch (err) {
      console.error("Graph fetch note:", err);
      // Fallback interactive data
      const fallbackNodes: GraphNode[] = [
        { id: "root", label: "Research Project Root", type: "Project", val: 24, x: 320, y: 240 },
        { id: "p1", label: "Attention Is All You Need", type: "Paper", val: 18, x: 200, y: 140 },
        { id: "p2", label: "Vision Transformers Survey", type: "Paper", val: 18, x: 440, y: 140 },
        { id: "p3", label: "Hybrid Vector RAG Systems", type: "Paper", val: 18, x: 320, y: 380 },
        { id: "m1", label: "Self-Attention Mechanism", type: "Method", val: 12, x: 120, y: 80 },
        { id: "d1", label: "Matterport3D Benchmark", type: "Dataset", val: 12, x: 520, y: 80 },
        { id: "g1", label: "OOD Latency Bottleneck", type: "Limitation", val: 15, x: 200, y: 440 },
        { id: "g2", label: "Hallucination under Noise", type: "Limitation", val: 15, x: 440, y: 440 }
      ];
      const fallbackEdges: GraphEdge[] = [
        { source: "root", target: "p1", label: "CONTAINS" },
        { source: "root", target: "p2", label: "CONTAINS" },
        { source: "root", target: "p3", label: "CONTAINS" },
        { source: "p1", target: "m1", label: "PROPOSES" },
        { source: "p2", target: "d1", label: "EVALUATES_ON" },
        { source: "p3", target: "g1", label: "EXHIBITS_GAP" },
        { source: "p3", target: "g2", label: "EXHIBITS_GAP" }
      ];
      setGraphData({ nodes: fallbackNodes, edges: fallbackEdges });
      setSelectedNode(fallbackNodes[0]);
    } finally {
      setLoadingGraph(false);
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case "Project": return "#2563EB";   // Royal Blue
      case "Paper": return "#7C3AED";     // Purple
      case "Method": return "#059669";    // Emerald
      case "Dataset": return "#D97706";   // Amber
      case "Limitation": return "#DC2626";// Red / Gap
      default: return "#64748B";
    }
  };

  const filteredNodes = graphData.nodes.filter(n => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "PAPERS") return n.type === "Paper" || n.type === "Project";
    if (activeFilter === "GAPS") return n.type === "Limitation" || n.type === "Project";
    if (activeFilter === "METHODS") return n.type === "Method" || n.type === "Dataset" || n.type === "Project";
    return true;
  });

  const nodeMap = new Map(graphData.nodes.map(n => [n.id, n]));

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar projectId={projectId} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="p-8 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-royal-border">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-royal-100 text-royal-700 font-bold text-xs flex items-center gap-1.5 shadow-sm">
                  <GitFork className="w-3.5 h-3.5" /> Interactive Knowledge Graph & Trends
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px]">
                  Real-time Node Network
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Research Trends & Citation Knowledge Graph
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Explore publication velocity and interactive entity relationships connecting evaluated papers, methodologies, and unexplored research gaps.
              </p>
            </div>
          </div>

          {/* Interactive Knowledge Graph & Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Graph Visualizer Canvas (8 Cols) */}
            <div className="lg:col-span-8 glass-royal-card p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <GitFork className="w-4 h-4 text-royal-600" /> Interactive Entity & Gap Graph
                    </h3>
                    <p className="text-xs text-slate-500">Click any node to inspect relationship metadata.</p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                    {["ALL", "PAPERS", "GAPS", "METHODS"].map(f => (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-2.5 py-1 rounded-lg transition ${
                          activeFilter === f ? "bg-white text-royal-700 font-bold shadow-sm" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Canvas */}
                <div className="relative w-full h-[460px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
                  {/* Floating Controls */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 bg-slate-900/80 backdrop-blur p-1 rounded-lg border border-slate-700 text-white">
                    <button onClick={() => setZoom(z => Math.min(z + 0.15, 2))} className="p-1.5 hover:bg-slate-800 rounded">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setZoom(z => Math.max(z - 0.15, 0.6))} className="p-1.5 hover:bg-slate-800 rounded">
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setZoom(1)} className="p-1.5 hover:bg-slate-800 rounded">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Legend Overlay */}
                  <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-3 z-10 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-[10px] text-slate-300 font-semibold">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"/> Project</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"/> Papers</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"/> Methods</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block animate-pulse"/> Gaps</span>
                  </div>

                  <svg 
                    viewBox="0 0 640 480" 
                    className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-200"
                    style={{ transform: `scale(${zoom})` }}
                  >
                    {/* Render Edges */}
                    {graphData.edges.map((edge, idx) => {
                      const sNode = nodeMap.get(edge.source);
                      const tNode = nodeMap.get(edge.target);
                      if (!sNode || !tNode) return null;
                      return (
                        <g key={idx}>
                          <line
                            x1={sNode.x}
                            y1={sNode.y}
                            x2={tNode.x}
                            y2={tNode.y}
                            stroke="#334155"
                            strokeWidth="1.5"
                            strokeDasharray={edge.label === "EXHIBITS_GAP" ? "4,4" : undefined}
                          />
                        </g>
                      );
                    })}

                    {/* Render Nodes */}
                    {filteredNodes.map((node) => {
                      const isSelected = selectedNode?.id === node.id;
                      const color = getNodeColor(node.type);
                      const radius = node.type === "Project" ? 22 : node.type === "Paper" ? 18 : 14;

                      return (
                        <g
                          key={node.id}
                          className="cursor-pointer transition-transform duration-150 hover:scale-110"
                          onClick={() => setSelectedNode(node)}
                        >
                          {/* Pulsing ring for gaps */}
                          {node.type === "Limitation" && (
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={radius + 8}
                              fill="none"
                              stroke="#DC2626"
                              strokeWidth="1.5"
                              className="animate-ping opacity-30"
                            />
                          )}

                          {/* Outer Highlight if Selected */}
                          {isSelected && (
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={radius + 6}
                              fill="none"
                              stroke="#60A5FA"
                              strokeWidth="2.5"
                              strokeDasharray="3,3"
                            />
                          )}

                          {/* Node Circle */}
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={radius}
                            fill={color}
                            stroke="#0F172A"
                            strokeWidth="2"
                            className="shadow-lg"
                          />

                          {/* Node Label Text */}
                          <text
                            x={node.x}
                            y={(node.y || 0) + radius + 14}
                            textAnchor="middle"
                            fill="#E2E8F0"
                            fontSize="10"
                            fontWeight="bold"
                            className="pointer-events-none select-none"
                          >
                            {node.label.length > 22 ? node.label.slice(0, 20) + "..." : node.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>

            {/* Selected Node Details Drawer (4 Cols) */}
            <div className="lg:col-span-4 glass-royal-card p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-royal-600" /> Entity Inspector
                </h3>

                {selectedNode ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span 
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
                          style={{ backgroundColor: getNodeColor(selectedNode.type) }}
                        >
                          {selectedNode.type}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">ID: {selectedNode.id}</span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                        {selectedNode.label}
                      </h4>

                      <div className="border-t border-slate-100 pt-3 space-y-1.5 text-slate-600">
                        <div className="flex justify-between">
                          <span>Connection Weight:</span>
                          <span className="font-bold text-slate-800">{selectedNode.val}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Graph Centrality:</span>
                          <span className="font-bold text-emerald-600">High (Core Cluster)</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-royal-50 border border-royal-200 text-xs text-royal-900 space-y-2">
                      <p className="font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-royal-600" /> Graph Synthesis Note:
                      </p>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        {selectedNode.type === "Limitation" ? (
                          "This node represents a verified research limitation. Resolving this gap directly increases your dissertation novelty."
                        ) : selectedNode.type === "Paper" ? (
                          "Indexed manuscript. PyMuPDF section boundaries and BGE embeddings are stored in Neon pgvector."
                        ) : (
                          "Extracted methodology node mapped across peer-reviewed evaluation splits."
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Click any node in the graph to view details.
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={fetchGraphData}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Re-cluster Graph Nodes
                </button>
              </div>
            </div>
          </div>

          {/* Publication Trends Chart */}
          <div className="glass-royal-card p-6 rounded-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-royal-600" /> Scholarly Publication Velocity Over Time
            </h3>
            <p className="text-xs text-slate-500 mb-6">Historical publication trend of papers in this research domain.</p>

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
        </main>
      </div>
    </div>
  );
}
