"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  FolderKanban, 
  Search, 
  MessageSquare, 
  Sparkles, 
  GitCompare, 
  TrendingUp, 
  FileText, 
  BookOpen, 
  Layers,
  Settings,
  LogOut,
  ChevronDown,
  Activity,
  Plus,
  ShieldAlert,
  Database,
  Cpu,
  Workflow
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { Project } from "@/types";

interface SidebarProps {
  projectId?: string;
}

export default function Sidebar({ projectId }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [projectId]);

  const fetchProjects = async () => {
    try {
      const data = await apiRequest<Project[]>("/projects");
      setProjects(data);
      if (projectId) {
        const found = data.find((p) => p.id === projectId);
        if (found) setActiveProject(found);
      } else if (data.length > 0) {
        setActiveProject(data[0]);
      }
    } catch (err) {
      // Demo fallback
      const demoProjects: Project[] = [
        {
          id: "demo-proj-1",
          title: "Medical Imaging Vision Transformers",
          research_topic: "Medical Image Segmentation",
          user_id: "u1",
          paper_count: 8,
          created_at: "2026-10-09",
          updated_at: "2026-10-09"
        },
        {
          id: "demo-proj-2",
          title: "Hybrid RAG & Citation Correctness",
          research_topic: "RAG Architecture",
          user_id: "u1",
          paper_count: 14,
          created_at: "2026-10-08",
          updated_at: "2026-10-08"
        }
      ];
      setProjects(demoProjects);
      if (projectId) {
        const found = demoProjects.find((p) => p.id === projectId);
        if (found) setActiveProject(found);
      } else {
        setActiveProject(demoProjects[0]);
      }
    }
  };

  const currentProjId = projectId || activeProject?.id || "demo-proj-1";

  const mainNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: Layers },
    { label: "Scholar Studio (SerpAPI)", href: "/scholar-studio", icon: Database },
    { label: "Thesis Novelty Checker", href: "/novelty-checker", icon: ShieldAlert },
    { label: "Global Paper Discovery", href: "/papers", icon: Search },
    { label: "Working Architecture", href: "/working-architecture", icon: Workflow },
    { label: "System Architecture", href: "/architecture", icon: Cpu },
    { label: "Compare Papers", href: "/compare", icon: GitCompare },
    { label: "Literature Reports", href: "/reports", icon: FileText },
  ];

  const projectNavItems = [
    { label: "Workspace & Papers", href: `/workspace/${currentProjId}`, icon: BookOpen },
    { label: "Research Chat", href: `/chat/${currentProjId}`, icon: MessageSquare },
    { label: "Research Gap Finder", href: `/research-gaps/${currentProjId}`, icon: Sparkles },
    { label: "Novelty Checker (0-100%)", href: `/novelty-checker/${currentProjId}`, icon: ShieldAlert },
    { label: "Knowledge Graph", href: `/trends/${currentProjId}`, icon: TrendingUp },
  ];

  return (
    <aside className="w-64 glass-royal-sidebar min-h-screen p-5 flex flex-col justify-between border-r border-royal-800 shadow-2xl z-30">
      <div>
        {/* Brand Header */}
        <Link href="/dashboard" className="flex items-center gap-3 mb-6 px-2 group">
          <div className="w-10 h-10 rounded-xl bg-royal-600 group-hover:bg-royal-500 transition flex items-center justify-center text-white font-bold text-lg shadow-royal">
            AI
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base leading-tight tracking-tight">ResearchGap</h1>
            <p className="text-[11px] text-royal-400 font-semibold uppercase tracking-wider">AI Platform</p>
          </div>
        </Link>

        {/* Active Project Switcher Dropdown */}
        <div className="relative mb-6">
          <label className="px-2 text-[10px] font-bold text-royal-400 uppercase tracking-wider block mb-1.5">
            Active Workspace
          </label>
          
          <button
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            className="w-full px-3 py-2.5 rounded-xl bg-royal-800/80 hover:bg-royal-800 text-left border border-royal-700/60 flex items-center justify-between text-xs text-white transition shadow-sm"
          >
            <div className="truncate pr-2">
              <p className="font-bold text-white truncate">{activeProject?.title || "Select Project"}</p>
              <p className="text-[10px] text-royal-300 truncate">{activeProject?.research_topic}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-royal-400 flex-shrink-0" />
          </button>

          {showProjectDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-royal-900 border border-royal-700 rounded-xl shadow-2xl p-2 z-50 space-y-1">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveProject(p);
                    setShowProjectDropdown(false);
                    router.push(`/workspace/${p.id}`);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition ${
                    p.id === currentProjId ? "bg-royal-600 text-white font-bold" : "text-slate-300 hover:bg-royal-800"
                  }`}
                >
                  <p className="truncate font-semibold">{p.title}</p>
                  <p className="text-[10px] opacity-75 truncate">{p.research_topic}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Section 1: Main Platform */}
        <div className="space-y-1 mb-6">
          <p className="px-3 text-[10px] font-bold text-royal-400 uppercase tracking-wider mb-2">Platform</p>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-royal-600 text-white shadow-royal"
                    : "text-slate-300 hover:bg-royal-800 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-royal-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Navigation Section 2: Workspace Tools */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-royal-400 uppercase tracking-wider mb-2">Workspace Tools</p>
          {projectNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-royal-600 text-white shadow-royal"
                    : "text-slate-300 hover:bg-royal-800 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-royal-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Section: Settings & User Profile */}
      <div className="pt-4 border-t border-royal-800/80 space-y-2">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            pathname === "/settings" ? "bg-royal-600 text-white" : "text-slate-300 hover:bg-royal-800"
          }`}
        >
          <Settings className="w-4 h-4 text-royal-400" />
          Settings & RAG Config
        </Link>

        <div className="p-3 rounded-xl bg-royal-800/50 border border-royal-700/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-royal-600 text-white font-bold text-xs flex items-center justify-center">
              DR
            </div>
            <div className="text-[11px]">
              <p className="font-bold text-white leading-tight">Dr. Vance</p>
              <p className="text-[9px] text-royal-300">PhD Researcher</p>
            </div>
          </div>

          <Link href="/login" className="text-slate-400 hover:text-white transition">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
