"use client";

import Link from "next/link";
import { Search, User, Bell, Sparkles, LogOut } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-royal-border px-8 flex items-center justify-between shadow-sm sticky top-0 z-40">
      {/* Search Input Bar */}
      <div className="flex items-center gap-3 w-96 bg-royal-offwhite border border-slate-200 px-3.5 py-1.5 rounded-xl focus-within:border-royal-600 focus-within:ring-2 focus-within:ring-royal-100 transition-all">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search papers, DOI, authors, or topics..."
          className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 w-full"
        />
      </div>

      {/* Quick Action Profile Controls */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-royal-600 hover:bg-royal-50 rounded-xl transition">
          <Bell className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-royal-gradient text-white flex items-center justify-center font-bold text-xs shadow-royal">
            DR
          </div>
          <div className="text-xs hidden md:block">
            <p className="font-semibold text-slate-900 leading-tight">Dr. Alex Vance</p>
            <p className="text-[11px] text-slate-500">PhD Researcher</p>
          </div>
        </div>
      </div>
    </header>
  );
}
