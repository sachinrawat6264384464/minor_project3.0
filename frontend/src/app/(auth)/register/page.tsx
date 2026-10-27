"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/?auth=register");
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-mono text-xs">
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 shadow-2xl">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        Opening Candidate Auth Concierge...
      </div>
    </div>
  );
}
