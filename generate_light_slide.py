import fitz
import os
import shutil

svg_light = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="50%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>

    <radialGradient id="cyanGlowLight" cx="20%" cy="10%" r="50%">
      <stop offset="0%" stop-color="#0284C7" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#0284C7" stop-opacity="0"/>
    </radialGradient>

    <linearGradient id="cardGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F8FAFC"/>
    </linearGradient>

    <linearGradient id="heroMetricGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EEF2FF"/>
      <stop offset="100%" stop-color="#E0E7FF"/>
    </linearGradient>

    <pattern id="gridPatternLight" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(15, 23, 42, 0.03)" stroke-width="1"/>
    </pattern>
  </defs>

  <style>
    .font-sans { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; }
    .font-mono { font-family: 'Consolas', 'Courier New', monospace; }
  </style>

  <!-- 1. Background Layers -->
  <rect width="1920" height="1080" fill="url(#bgGradLight)"/>
  <rect width="1920" height="1080" fill="url(#gridPatternLight)"/>
  <rect width="1920" height="1080" fill="url(#cyanGlowLight)"/>

  <!-- HEADER -->
  <g transform="translate(80, 54)">
    <rect width="365" height="32" rx="16" fill="rgba(2, 132, 199, 0.08)" stroke="rgba(2, 132, 199, 0.25)" stroke-width="1.2"/>
    <circle cx="20" cy="16" r="4.5" fill="#0284C7"/>
    <text x="34" y="21" class="font-mono" font-size="12" font-weight="700" fill="#0369A1" letter-spacing="1.2">SYSTEM SPECIFICATIONS // CHAPTER 2</text>
  </g>

  <text x="80" y="132" class="font-sans" font-size="38" font-weight="800" fill="#0F172A" letter-spacing="-0.5">
    Functional &amp; <tspan fill="#0284C7">Non-Functional</tspan> Requirements
  </text>
  <text x="80" y="162" class="font-sans" font-size="15" font-weight="500" fill="#64748B">
    Architectural capabilities, intelligent RAG pipelines, and enterprise performance benchmarks of ResearchGap.ai
  </text>

  <g transform="translate(1540, 78)">
    <rect width="300" height="66" rx="10" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.1)" stroke-width="1"/>
    <text x="24" y="28" class="font-mono" font-size="11" font-weight="700" fill="#64748B" letter-spacing="1">SYSTEM MATURITY</text>
    <text x="24" y="49" class="font-sans" font-size="15" font-weight="700" fill="#0284C7">ACADEMIC RAG PLATFORM</text>
  </g>

  <line x1="80" y1="184" x2="1840" y2="184" stroke="rgba(15, 23, 42, 0.1)" stroke-width="1"/>

  <!-- LEFT: FUNCTIONAL REQUIREMENTS -->
  <g transform="translate(80, 206)">
    <text x="0" y="24" class="font-sans" font-size="18" font-weight="800" fill="#0284C7" letter-spacing="0.8">⚙️ FUNCTIONAL REQUIREMENTS</text>
    <rect x="710" y="4" width="130" height="26" rx="6" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.12)" stroke-width="1"/>
    <text x="775" y="21" class="font-mono" font-size="11.5" font-weight="700" fill="#475569" text-anchor="middle">6 Core Modules</text>
    <line x1="0" y1="36" x2="840" y2="36" stroke="#0284C7" stroke-width="2.5"/>
  </g>

  <!-- FR-01 -->
  <g transform="translate(80, 258)">
    <rect width="840" height="96" rx="10" fill="url(#cardGradLight)" stroke="rgba(15, 23, 42, 0.12)" stroke-width="1"/>
    <rect width="4.5" height="96" rx="2" fill="#0284C7"/>
    <rect x="20" y="18" width="58" height="24" rx="5" fill="rgba(2, 132, 199, 0.1)" stroke="rgba(2, 132, 199, 0.3)" stroke-width="1"/>
    <text x="49" y="34" class="font-mono" font-size="11.5" font-weight="800" fill="#0284C7" text-anchor="middle">FR-01</text>
    <text x="92" y="35" class="font-sans" font-size="16.5" font-weight="700" fill="#0F172A">Multi-Source Literature Ingestion</text>
    <text x="92" y="60" class="font-sans" font-size="13" font-weight="400" fill="#475569">
      Automated PDF upload parsing paired with live <tspan font-weight="600" fill="#0F172A">OpenAlex &amp; Semantic Scholar API</tspan> query stream.
    </text>
    <text x="92" y="79" class="font-mono" font-size="11.5" fill="#0369A1">➔ Supports arXiv, PubMed, DOI deduplication, and open-access PDF resolution</text>
  </g>

  <!-- FR-02 -->
  <g transform="translate(80, 368)">
    <rect width="840" height="96" rx="10" fill="url(#cardGradLight)" stroke="rgba(15, 23, 42, 0.12)" stroke-width="1"/>
    <rect width="4.5" height="96" rx="2" fill="#0284C7"/>
    <rect x="20" y="18" width="58" height="24" rx="5" fill="rgba(2, 132, 199, 0.1)" stroke="rgba(2, 132, 199, 0.3)" stroke-width="1"/>
    <text x="49" y="34" class="font-mono" font-size="11.5" font-weight="800" fill="#0284C7" text-anchor="middle">FR-02</text>
    <text x="92" y="35" class="font-sans" font-size="16.5" font-weight="700" fill="#0F172A">Structural Academic Layout Segmentation</text>
    <text x="92" y="60" class="font-sans" font-size="13" font-weight="400" fill="#475569">
      High-velocity <tspan font-weight="600" fill="#0F172A">PyMuPDF</tspan> parsing isolating Abstract, Methodology, Findings, and Limitations.
    </text>
    <text x="92" y="79" class="font-mono" font-size="11.5" fill="#0369A1">➔ Preserves hierarchical font styles, formulas, and exact bounding boxes</text>
  </g>

  <!-- FR-03 -->
  <g transform="translate(80, 478)">
    <rect width="840" height="96" rx="10" fill="url(#cardGradLight)" stroke="rgba(15, 23, 42, 0.12)" stroke-width="1"/>
    <rect width="4.5" height="96" rx="2" fill="#0284C7"/>
    <rect x="20" y="18" width="58" height="24" rx="5" fill="rgba(2, 132, 199, 0.1)" stroke="rgba(2, 132, 199, 0.3)" stroke-width="1"/>
    <text x="49" y="34" class="font-mono" font-size="11.5" font-weight="800" fill="#0284C7" text-anchor="middle">FR-03</text>
    <text x="92" y="35" class="font-sans" font-size="16.5" font-weight="700" fill="#0F172A">Dual-Path Hybrid RAG Engine</text>
    <text x="92" y="60" class="font-sans" font-size="13" font-weight="400" fill="#475569">
      Fuses <tspan font-weight="600" fill="#0F172A">Dense Semantic (BGE 384-d on PgVector)</tspan> + <tspan font-weight="600" fill="#0F172A">Sparse Lexical (BM25Okapi)</tspan>.
    </text>
    <text x="92" y="79" class="font-mono" font-size="11.5" fill="#0369A1">➔ Reciprocal Rank Fusion: RRF_score(d) = Σ [ 1 / (60 + rank(d)) ]</text>
  </g>

  <!-- FR-04 -->
  <g transform="translate(80, 588)">
    <rect width="840" height="96" rx="10" fill="url(#cardGradLight)" stroke="rgba(15, 23, 42, 0.12)" stroke-width="1"/>
    <rect width="4.5" height="96" rx="2" fill="#0284C7"/>
    <rect x="20" y="18" width="58" height="24" rx="5" fill="rgba(2, 132, 199, 0.1)" stroke="rgba(2, 132, 199, 0.3)" stroke-width="1"/>
    <text x="49" y="34" class="font-mono" font-size="11.5" font-weight="800" fill="#0284C7" text-anchor="middle">FR-04</text>
    <text x="92" y="35" class="font-sans" font-size="16.5" font-weight="700" fill="#0F172A">Cross-Encoder Relevance Re-Ranking</text>
    <text x="92" y="60" class="font-sans" font-size="13" font-weight="400" fill="#475569">
      Top candidate context passages pairwise re-scored using <tspan font-weight="600" fill="#0F172A">BAAI/bge-reranker-base</tspan>.
    </text>
    <text x="92" y="79" class="font-mono" font-size="11.5" fill="#0369A1">➔ Filters noisy candidates, ensuring only highest-relevance evidence reaches LLM</text>
  </g>

  <!-- FR-05 -->
  <g transform="translate(80, 698)">
    <rect width="840" height="96" rx="10" fill="url(#cardGradLight)" stroke="rgba(15, 23, 42, 0.12)" stroke-width="1"/>
    <rect width="4.5" height="96" rx="2" fill="#0284C7"/>
    <rect x="20" y="18" width="58" height="24" rx="5" fill="rgba(2, 132, 199, 0.1)" stroke="rgba(2, 132, 199, 0.3)" stroke-width="1"/>
    <text x="49" y="34" class="font-mono" font-size="11.5" font-weight="800" fill="#0284C7" text-anchor="middle">FR-05</text>
    <text x="92" y="35" class="font-sans" font-size="16.5" font-weight="700" fill="#0F172A">Verifiable Citation Anchoring (Zero-Hallucination)</text>
    <text x="92" y="60" class="font-sans" font-size="13" font-weight="400" fill="#475569">
      Directly binds every synthesized statement to <tspan font-weight="600" fill="#0F172A">Paper Title, Year, DOI, exact Page, &amp; Excerpt</tspan>.
    </text>
    <text x="92" y="79" class="font-mono" font-size="11.5" fill="#0369A1">➔ Strict ground-truth validation: answers flag "insufficient evidence" if unproven</text>
  </g>

  <!-- FR-06 -->
  <g transform="translate(80, 808)">
    <rect width="840" height="96" rx="10" fill="url(#cardGradLight)" stroke="rgba(15, 23, 42, 0.12)" stroke-width="1"/>
    <rect width="4.5" height="96" rx="2" fill="#0284C7"/>
    <rect x="20" y="18" width="58" height="24" rx="5" fill="rgba(2, 132, 199, 0.1)" stroke="rgba(2, 132, 199, 0.3)" stroke-width="1"/>
    <text x="49" y="34" class="font-mono" font-size="11.5" font-weight="800" fill="#0284C7" text-anchor="middle">FR-06</text>
    <text x="92" y="35" class="font-sans" font-size="16.5" font-weight="700" fill="#0F172A">9-Stage Gap Discovery &amp; Novelty Rating</text>
    <text x="92" y="60" class="font-sans" font-size="13" font-weight="400" fill="#475569">
      Isolates real scientific blindspots across literature corpus with an automated <tspan font-weight="600" fill="#0F172A">0–100% Novelty Score</tspan>.
    </text>
    <text x="92" y="79" class="font-mono" font-size="11.5" fill="#0369A1">➔ Counter-evidence verification cross-checks claims against 250M+ global publications</text>
  </g>

  <!-- RIGHT: NON-FUNCTIONAL REQUIREMENTS -->
  <g transform="translate(1000, 206)">
    <text x="0" y="24" class="font-sans" font-size="18" font-weight="800" fill="#4F46E5" letter-spacing="0.8">⚡ NON-FUNCTIONAL REQUIREMENTS</text>
    <rect x="670" y="4" width="170" height="26" rx="6" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.12)" stroke-width="1"/>
    <text x="755" y="21" class="font-mono" font-size="11.5" font-weight="700" fill="#475569" text-anchor="middle">5 Enterprise Benchmarks</text>
    <line x1="0" y1="36" x2="840" y2="36" stroke="#4F46E5" stroke-width="2.5"/>
  </g>

  <!-- NFR-01: Performance & Speed -->
  <g transform="translate(1000, 258)">
    <rect width="840" height="154" rx="12" fill="url(#heroMetricGradLight)" stroke="rgba(99, 102, 241, 0.25)" stroke-width="1.2"/>
    <rect x="22" y="16" width="28" height="28" rx="6" fill="#FFFFFF" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1"/>
    <text x="36" y="35" class="font-sans" font-size="16" text-anchor="middle">⚡</text>
    <text x="60" y="35" class="font-sans" font-size="15" font-weight="800" fill="#B45309" letter-spacing="0.5">PERFORMANCE &amp; SPEED BENCHMARKS</text>

    <!-- Metric Box 1 -->
    <g transform="translate(22, 54)">
      <rect width="250" height="82" rx="8" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
      <text x="125" y="36" class="font-mono" font-size="22" font-weight="800" fill="#D97706" text-anchor="middle">&lt; 250 ms</text>
      <text x="125" y="56" class="font-sans" font-size="11.5" font-weight="600" fill="#1E293B" text-anchor="middle">Hybrid Retrieval Latency</text>
      <text x="125" y="70" class="font-sans" font-size="10" font-weight="500" fill="#64748B" text-anchor="middle">Tested over 100,000+ chunks</text>
    </g>

    <!-- Metric Box 2 -->
    <g transform="translate(295, 54)">
      <rect width="250" height="82" rx="8" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
      <text x="125" y="36" class="font-mono" font-size="22" font-weight="800" fill="#D97706" text-anchor="middle">&lt; 2.0 sec</text>
      <text x="125" y="56" class="font-sans" font-size="11.5" font-weight="600" fill="#1E293B" text-anchor="middle">PDF Layout Parsing</text>
      <text x="125" y="70" class="font-sans" font-size="10" font-weight="500" fill="#64748B" text-anchor="middle">Standard 15-page IEEE paper</text>
    </g>

    <!-- Metric Box 3 -->
    <g transform="translate(568, 54)">
      <rect width="250" height="82" rx="8" fill="#FFFFFF" stroke="rgba(15, 23, 42, 0.08)" stroke-width="1"/>
      <text x="125" y="36" class="font-mono" font-size="22" font-weight="800" fill="#D97706" text-anchor="middle">&lt; 3.5 sec</text>
      <text x="125" y="56" class="font-sans" font-size="11.5" font-weight="600" fill="#1E293B" text-anchor="middle">LLM Synthesis Latency</text>
      <text x="125" y="70" class="font-sans" font-size="10" font-weight="500" fill="#64748B" text-anchor="middle">Fast inference via Groq/OpenAI</text>
    </g>
  </g>

  <!-- NFR-02 -->
  <g transform="translate(1000, 428)">
    <rect width="840" height="106" rx="10" fill="url(#cardGradLight)" stroke="rgba(15, 23, 42, 0.12)" stroke-width="1"/>
    <rect x="22" y="16" width="28" height="28" rx="6" fill="rgba(37, 99, 235, 0.1)" stroke="rgba(37, 99, 235, 0.3)" stroke-width="1"/>
    <text x="36" y="35" class="font-sans" font-size="15" text-anchor="middle">📈</text>
    <text x="60" y="35" class="font-sans" font-size="15" font-weight="800" fill="#1D4ED8" letter-spacing="0.5">SCALABILITY ARCHITECTURE</text>
    <text x="22" y="66" class="font-sans" font-size="13.5" font-weight="400" fill="#334155">
      Stateless <tspan font-weight="700" fill="#0F172A">FastAPI async ASGI workers</tspan> paired with <tspan font-weight="700" fill="#0F172A">Neon serverless PostgreSQL</tspan> connection pooling.
    </text>
    <text x="22" y="88" class="font-mono" font-size="12" fill="#2563EB">
      • Horizontal auto-scaling under peak user queries with dynamic connection eviction
    </text>
  </g>

  <!-- NFR-03 -->
  <g transform="translate(1000, 550)">
    <rect width="840" height="106" rx="10" fill="url(#cardGradLight)" stroke="rgba(15, 23, 42, 0.12)" stroke-width="1"/>
    <rect x="22" y="16" width="28" height="28" rx="6" fill="rgba(16, 185, 129, 0.1)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1"/>
    <text x="36" y="35" class="font-sans" font-size="15" text-anchor="middle">🔒</text>
    <text x="60" y="35" class="font-sans" font-size="15" font-weight="800" fill="#047857" letter-spacing="0.5">SECURITY &amp; ACCESS CONTROL</text>
    <text x="22" y="66" class="font-sans" font-size="13.5" font-weight="400" fill="#334155">
      Stateless <tspan font-weight="700" fill="#0F172A">JWT Bearer authorization (HS256)</tspan> with <tspan font-weight="700" fill="#0F172A">bcrypt 12-round salted hashing</tspan>.
    </text>
    <text x="22" y="88" class="font-mono" font-size="12" fill="#059669">
      • Zero-knowledge password storage + prompt security guardrails blocking credential scraping
    </text>
  </g>

  <!-- NFR-04 -->
  <g transform="translate(1000, 672)">
    <rect width="840" height="106" rx="10" fill="url(#cardGradLight)" stroke="rgba(15, 23, 42, 0.12)" stroke-width="1"/>
    <rect x="22" y="16" width="28" height="28" rx="6" fill="rgba(147, 51, 234, 0.1)" stroke="rgba(147, 51, 234, 0.3)" stroke-width="1"/>
    <text x="36" y="35" class="font-sans" font-size="15" text-anchor="middle">🛡️</text>
    <text x="60" y="35" class="font-sans" font-size="15" font-weight="800" fill="#7E22CE" letter-spacing="0.5">DATA PRIVACY &amp; ISOLATION</text>
    <text x="22" y="66" class="font-sans" font-size="13.5" font-weight="400" fill="#334155">
      Strict multi-tenant workspace isolation enforced through <tspan font-weight="700" fill="#0F172A">project_id foreign-key row segregation</tspan>.
    </text>
    <text x="22" y="88" class="font-mono" font-size="12" fill="#9333EA">
      • Zero data-training leakage: uploaded academic papers are strictly private to the user workspace
    </text>
  </g>

  <!-- NFR-05 -->
  <g transform="translate(1000, 794)">
    <rect width="840" height="110" rx="10" fill="url(#cardGradLight)" stroke="rgba(15, 23, 42, 0.12)" stroke-width="1"/>
    <rect x="22" y="16" width="28" height="28" rx="6" fill="rgba(219, 39, 119, 0.1)" stroke="rgba(219, 39, 119, 0.3)" stroke-width="1"/>
    <text x="36" y="35" class="font-sans" font-size="15" text-anchor="middle">🔄</text>
    <text x="60" y="35" class="font-sans" font-size="15" font-weight="800" fill="#BE185D" letter-spacing="0.5">HIGH AVAILABILITY &amp; RELIABILITY</text>
    <text x="22" y="66" class="font-sans" font-size="13.5" font-weight="400" fill="#334155">
      4-Tier active LLM failover architecture ensures 99.9% uptime during third-party API rate limits:
    </text>
    <text x="22" y="90" class="font-mono" font-size="12" font-weight="700" fill="#BE185D">
      1. OpenAI (GPT-4o) ➔ 2. Groq (LLaMA-3.3-70B) ➔ 3. Google Gemini 2.0 ➔ 4. Local Ollama
    </text>
  </g>

  <!-- FOOTER -->
  <line x1="80" y1="924" x2="1840" y2="924" stroke="rgba(15, 23, 42, 0.1)" stroke-width="1"/>

  <g transform="translate(80, 944)">
    <circle cx="6" cy="11" r="4.5" fill="#10B981"/>
    <text x="20" y="15" class="font-sans" font-size="13" font-weight="500" fill="#64748B">
      ResearchGap.ai System Design Specifications &middot; Minor Project Chapter 2 Requirements Specification
    </text>
  </g>

  <g transform="translate(1420, 944)">
    <text x="420" y="15" class="font-mono" font-size="12" font-weight="700" fill="#475569" text-anchor="end">
      NEXT.JS 15 &middot; FASTAPI &middot; NEON PGVECTOR &middot; BGE-RERANKER
    </text>
  </g>
</svg>
"""

# Render Light Version
doc_light = fitz.open("svg", svg_light.encode("utf-8"))
pix_light = doc_light[0].get_pixmap(dpi=150)
png_light_path = "d:/minor3.0/requirements_slide_light.png"
pix_light.save(png_light_path)
print(f"Light PNG rendered: {png_light_path}")

artifact_dir = r"C:\Users\Dell 5490T\.gemini\antigravity\brain\97c064e8-441f-4472-9c8b-367db08e6c70"
if os.path.exists(artifact_dir):
    artifact_light = os.path.join(artifact_dir, "requirements_slide_light.png")
    shutil.copyfile(png_light_path, artifact_light)
    print(f"Copied light PNG to artifact dir: {artifact_light}")
