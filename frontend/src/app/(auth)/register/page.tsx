"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await fetch("http://localhost:8000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName
        })
      });

      if (resp.ok) {
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-royal-card p-8 rounded-3xl shadow-2xl border border-royal-border">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-royal-600 text-white font-bold flex items-center justify-center text-xl mx-auto mb-3 shadow-royal">
            AI
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Academic Account</h2>
          <p className="text-xs text-slate-500 mt-1">Start discovering research gaps and ingesting papers.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="flex items-center gap-2 bg-white border border-slate-300 px-3.5 py-2.5 rounded-xl focus-within:border-royal-600">
              <User className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Alex Vance"
                className="w-full text-xs outline-none bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Email</label>
            <div className="flex items-center gap-2 bg-white border border-slate-300 px-3.5 py-2.5 rounded-xl focus-within:border-royal-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scholar@university.edu"
                className="w-full text-xs outline-none bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="flex items-center gap-2 bg-white border border-slate-300 px-3.5 py-2.5 rounded-xl focus-within:border-royal-600">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs outline-none bg-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-royal-gradient hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-royal flex items-center justify-center gap-2 transition"
          >
            {loading ? "Creating Account..." : "Create Account"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-royal-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
