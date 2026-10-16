import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Research Paper & Research Gap Finder",
  description: "Full-stack AI Platform for academic discovery, PDF RAG indexing, evidence-grounded Q&A, and candidate research gap analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-canvas text-slate-900 antialiased min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
