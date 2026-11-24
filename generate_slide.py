import fitz
import os
import shutil

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080C16"/>
      <stop offset="50%" stop-color="#0D1322"/>
      <stop offset="100%" stop-color="#070A12"/>
    </linearGradient>

    <radialGradient id="cyanGlow" cx="25%" cy="10%" r="45%">
      <stop offset="0%" stop-color="#0284C7" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#0284C7" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="indigoGlow" cx="80%" cy="85%" r="45%">
      <stop offset="0%" stop-color="#6366F1" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#6366F1" stop-opacity="0"/>
    </radialGradient>

    <linearGradient id="heroMetricGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E1B4B" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0F172A" stop-opacity="0.9"/>
    </linearGradient>

    <!-- Card Background Gradient -->
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#131B2E" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#0F172A" stop-opacity="0.85"/>
    </linearGradient>

    <!-- Grid Pattern -->
    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.02)" stroke-width="1"/>
    </pattern>
  </defs>

  <style>
    .font-sans { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; }
    .font-mono { font-family: 'Consolas', 'Courier New', monospace; }
  </style>

  <!-- 1. Background Layers -->
  <rect width="1920" height="1080" fill="url(#bgGrad)"/>
  <rect width="1920" height="1080" fill="url(#gridPattern)"/>
  <rect width="1920" height="1080" fill="url(#cyanGlow)"/>
  <rect width="1920" height="1080" fill="url(#indigoGlow)"/>

  <!-- =========================================================================
       HEADER SECTION
       ========================================================================= -->
  <!-- Top Category Badge -->
  <g transform="translate(80, 54)">
    <rect width="365" height="32" rx="16" fill="rgba(14, 165, 233, 0.12)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1.2"/>
    <circle cx="20" cy="16" r="4.5" fill="#38BDF8"/>
    <text x="34" y="21" class="font-mono" font-size="12" font-weight="700" fill="#38BDF8" letter-spacing="1.2">SYSTEM SPECIFICATIONS // CHAPTER 2</text>
  </g>

  <!-- Title & Subtitle -->
  <text x="80" y="132" class="font-sans" font-size="38" font-weight="800" fill="#FFFFFF" letter-spacing="-0.5">
    Functional &amp; <tspan fill="#38BDF8">Non-Functional</tspan> Requirements
  </text>
  <text x="80" y="162" class="font-sans" font-size="15" font-weight="500" fill="#94A3B8">
    Architectural capabilities, intelligent RAG pipelines, and enterprise performance benchmarks of ResearchGap.ai
  </text>

  <!-- Header Right Meta Badge -->
  <g transform="translate(1540, 78)">
    <rect width="300" height="66" rx="10" fill="rgba(15, 23, 42, 0.6)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
    <text x="24" y="28" class="font-mono" font-size="11" font-weight="700" fill="#64748B" letter-spacing="1">SYSTEM MATURITY</text>
    <text x="24" y="49" class="font-sans" font-size="15" font-weight="700" fill="#38BDF8">ACADEMIC RAG PLATFORM</text>
  </g>

  <!-- Header Horizontal Divider Line -->
  <line x1="80" y1="184" x2="1840" y2="184" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>

  <!-- =========================================================================
       LEFT COLUMN: FUNCTIONAL REQUIREMENTS (FR)
       ========================================================================= -->
  <!-- Column Header Bar -->
  <g transform="translate(80, 206)">
    <text x="0" y="24" class="font-sans" font-size="18" font-weight="800" fill="#38BDF8" letter-spacing="0.8">
      ⚙️ FUNCTIONAL REQUIREMENTS
    </text>
    <!-- Counter Badge -->
    <rect x="710" y="4" width="130" height="26" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1"/>
    <text x="775" y="21" class="font-mono" font-size="11.5" font-weight="700" fill="#CBD5E1" text-anchor="middle">6 Core Modules</text>
    <!-- Accent Line -->
    <line x1="0" y1="36" x2="840" y2="36" stroke="#0284C7" stroke-width="2.5"/>
  </g>

  <!-- FR-01 Card -->
  <g transform="translate(80, 258)">
    <rect width="840" height="96" rx="10" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1"/>
    <rect width="4.5" height="96" rx="2" fill="#0284C7"/>
    <!-- Badge -->
    <rect x="20" y="18" width="58" height="24" rx="5" fill="rgba(14, 165, 233, 0.15)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1"/>
    <text x="49" y="34" class="font-mono" font-size="11.5" font-weight="800" fill="#38BDF8" text-anchor="middle">FR-01</text>
    <!-- Content -->
    <text x="92" y="35" class="font-sans" font-size="16.5" font-weight="700" fill="#FFFFFF">Multi-Source Literature Ingestion</text>
    <text x="92" y="60" class="font-sans" font-size="13" font-weight="400" fill="#94A3B8">
      Automated PDF upload parsing paired with live <tspan font-weight="600" fill="#E2E8F0">OpenAlex &amp; Semantic Scholar API</tspan> live query stream.
    </text>
    <text x="92" y="79" class="font-mono" font-size="11.5" fill="#38BDF8">➔ Supports arXiv, PubMed, DOI deduplication, and open-access PDF resolution</text>
  </g>

  <!-- FR-02 Card -->
  <g transform="translate(80, 368)">
    <rect width="840" height="96" rx="10" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1"/>
    <rect width="4.5" height="96" rx="2" fill="#0284C7"/>
    <!-- Badge -->
    <rect x="20" y="18" width="58" height="24" rx="5" fill="rgba(14, 165, 233, 0.15)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1"/>
    <text x="49" y="34" class="font-mono" font-size="11.5" font-weight="800" fill="#38BDF8" text-anchor="middle">FR-02</text>
    <!-- Content -->
    <text x="92" y="35" class="font-sans" font-size="16.5" font-weight="700" fill="#FFFFFF">Structural Academic Layout Segmentation</text>
    <text x="92" y="60" class="font-sans" font-size="13" font-weight="400" fill="#94A3B8">
      High-velocity <tspan font-weight="600" fill="#E2E8F0">PyMuPDF</tspan> parsing isolating Abstract, Methodology, Results, and Limitations.
    </text>
    <text x="92" y="79" class="font-mono" font-size="11.5" fill="#38BDF8">➔ Preserves hierarchical font styles, formulas, and exact bounding boxes</text>
  </g>

  <!-- FR-03 Card -->
  <g transform="translate(80, 478)">
    <rect width="840" height="96" rx="10" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1"/>
    <rect width="4.5" height="96" rx="2" fill="#0284C7"/>
    <!-- Badge -->
    <rect x="20" y="18" width="58" height="24" rx="5" fill="rgba(14, 165, 233, 0.15)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1"/>
    <text x="49" y="34" class="font-mono" font-size="11.5" font-weight="800" fill="#38BDF8" text-anchor="middle">FR-03</text>
    <!-- Content -->
    <text x="92" y="35" class="font-sans" font-size="16.5" font-weight="700" fill="#FFFFFF">Dual-Path Hybrid RAG Engine</text>
    <text x="92" y="60" class="font-sans" font-size="13" font-weight="400" fill="#94A3B8">
      Fuses <tspan font-weight="600" fill="#E2E8F0">Dense Semantic (BGE 384-d on PgVector)</tspan> + <tspan font-weight="600" fill="#E2E8F0">Sparse Lexical (BM25Okapi)</tspan>.
    </text>
    <text x="92" y="79" class="font-mono" font-size="11.5" fill="#38BDF8">➔ Reciprocal Rank Fusion: RRF_score(d) = Σ [ 1 / (60 + rank(d)) ]</text>
  </g>

  <!-- FR-04 Card -->
  <g transform="translate(80, 588)">
    <rect width="840" height="96" rx="10" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1"/>
    <rect width="4.5" height="96" rx="2" fill="#0284C7"/>
    <!-- Badge -->
    <rect x="20" y="18" width="58" height="24" rx="5" fill="rgba(14, 165, 233, 0.15)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1"/>
    <text x="49" y="34" class="font-mono" font-size="11.5" font-weight="800" fill="#38BDF8" text-anchor="middle">FR-04</text>
    <!-- Content -->
    <text x="92" y="35" class="font-sans" font-size="16.5" font-weight="700" fill="#FFFFFF">Cross-Encoder Relevance Re-Ranking</text>
    <text x="92" y="60" class="font-sans" font-size="13" font-weight="400" fill="#94A3B8">
      Top candidate context passages pairwise re-scored using <tspan font-weight="600" fill="#E2E8F0">BAAI/bge-reranker-base</tspan>.
    </text>
    <text x="92" y="79" class="font-mono" font-size="11.5" fill="#38BDF8">➔ Filters noisy candidates, ensuring only highest-relevance evidence reaches LLM</text>
  </g>

  <!-- FR-05 Card -->
  <g transform="translate(80, 698)">
    <rect width="840" height="96" rx="10" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1"/>
    <rect width="4.5" height="96" rx="2" fill="#0284C7"/>
    <!-- Badge -->
    <rect x="20" y="18" width="58" height="24" rx="5" fill="rgba(14, 165, 233, 0.15)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1"/>
    <text x="49" y="34" class="font-mono" font-size="11.5" font-weight="800" fill="#38BDF8" text-anchor="middle">FR-05</text>
    <!-- Content -->
    <text x="92" y="35" class="font-sans" font-size="16.5" font-weight="700" fill="#FFFFFF">Verifiable Citation Anchoring (Zero-Hallucination)</text>
    <text x="92" y="60" class="font-sans" font-size="13" font-weight="400" fill="#94A3B8">
      Directly binds every synthesized statement to <tspan font-weight="600" fill="#E2E8F0">Paper Title, Year, DOI, exact Page, &amp; Excerpt</tspan>.
    </text>
    <text x="92" y="79" class="font-mono" font-size="11.5" fill="#38BDF8">➔ Strict ground-truth validation: answers flag "insufficient evidence" if unproven</text>
  </g>

  <!-- FR-06 Card -->
  <g transform="translate(80, 808)">
    <rect width="840" height="96" rx="10" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1"/>
    <rect width="4.5" height="96" rx="2" fill="#0284C7"/>
    <!-- Badge -->
    <rect x="20" y="18" width="58" height="24" rx="5" fill="rgba(14, 165, 233, 0.15)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1"/>
    <text x="49" y="34" class="font-mono" font-size="11.5" font-weight="800" fill="#38BDF8" text-anchor="middle">FR-06</text>
    <!-- Content -->
    <text x="92" y="35" class="font-sans" font-size="16.5" font-weight="700" fill="#FFFFFF">9-Stage Gap Discovery &amp; Novelty Rating</text>
    <text x="92" y="60" class="font-sans" font-size="13" font-weight="400" fill="#94A3B8">
      Isolates real scientific blindspots across literature corpus with an automated <tspan font-weight="600" fill="#E2E8F0">0–100% Novelty Score</tspan>.
    </text>
    <text x="92" y="79" class="font-mono" font-size="11.5" fill="#38BDF8">➔ Counter-evidence verification cross-checks claims against 250M+ global publications</text>
  </g>


  <!-- =========================================================================
       RIGHT COLUMN: NON-FUNCTIONAL REQUIREMENTS (NFR)
       ========================================================================= -->
  <!-- Column Header Bar -->
  <g transform="translate(1000, 206)">
    <text x="0" y="24" class="font-sans" font-size="18" font-weight="800" fill="#818CF8" letter-spacing="0.8">
      ⚡ NON-FUNCTIONAL REQUIREMENTS
    </text>
    <!-- Counter Badge -->
    <rect x="670" y="4" width="170" height="26" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1"/>
    <text x="755" y="21" class="font-mono" font-size="11.5" font-weight="700" fill="#CBD5E1" text-anchor="middle">5 Enterprise Benchmarks</text>
    <!-- Accent Line -->
    <line x1="0" y1="36" x2="840" y2="36" stroke="#6366F1" stroke-width="2.5"/>
  </g>

  <!-- NFR-01: Performance & Speed Benchmarks (Featured Hero Widget) -->
  <g transform="translate(1000, 258)">
    <rect width="840" height="154" rx="12" fill="url(#heroMetricGrad)" stroke="rgba(99, 102, 241, 0.35)" stroke-width="1.2"/>
    <rect x="22" y="16" width="28" height="28" rx="6" fill="rgba(245, 158, 11, 0.2)" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1"/>
    <text x="36" y="35" class="font-sans" font-size="16" text-anchor="middle">⚡</text>
    <text x="60" y="35" class="font-sans" font-size="15" font-weight="800" fill="#FBBF24" letter-spacing="0.5">PERFORMANCE &amp; SPEED BENCHMARKS</text>

    <!-- Metric Box 1 -->
    <g transform="translate(22, 54)">
      <rect width="250" height="82" rx="8" fill="rgba(0, 0, 0, 0.45)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
      <text x="125" y="36" class="font-mono" font-size="22" font-weight="800" fill="#FBBF24" text-anchor="middle">&lt; 250 ms</text>
      <text x="125" y="56" class="font-sans" font-size="11.5" font-weight="600" fill="#CBD5E1" text-anchor="middle">Hybrid Retrieval Latency</text>
      <text x="125" y="70" class="font-sans" font-size="10" font-weight="400" fill="#94A3B8" text-anchor="middle">Tested over 100,000+ chunks</text>
    </g>

    <!-- Metric Box 2 -->
    <g transform="translate(295, 54)">
      <rect width="250" height="82" rx="8" fill="rgba(0, 0, 0, 0.45)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
      <text x="125" y="36" class="font-mono" font-size="22" font-weight="800" fill="#FBBF24" text-anchor="middle">&lt; 2.0 sec</text>
      <text x="125" y="56" class="font-sans" font-size="11.5" font-weight="600" fill="#CBD5E1" text-anchor="middle">PDF Layout Parsing</text>
      <text x="125" y="70" class="font-sans" font-size="10" font-weight="400" fill="#94A3B8" text-anchor="middle">Standard 15-page IEEE paper</text>
    </g>

    <!-- Metric Box 3 -->
    <g transform="translate(568, 54)">
      <rect width="250" height="82" rx="8" fill="rgba(0, 0, 0, 0.45)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
      <text x="125" y="36" class="font-mono" font-size="22" font-weight="800" fill="#FBBF24" text-anchor="middle">&lt; 3.5 sec</text>
      <text x="125" y="56" class="font-sans" font-size="11.5" font-weight="600" fill="#CBD5E1" text-anchor="middle">LLM Synthesis Latency</text>
      <text x="125" y="70" class="font-sans" font-size="10" font-weight="400" fill="#94A3B8" text-anchor="middle">Fast inference via Groq/OpenAI</text>
    </g>
  </g>

  <!-- NFR-02: Scalability Architecture -->
  <g transform="translate(1000, 428)">
    <rect width="840" height="106" rx="10" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1"/>
    <rect x="22" y="16" width="28" height="28" rx="6" fill="rgba(59, 130, 246, 0.15)" stroke="rgba(59, 130, 246, 0.35)" stroke-width="1"/>
    <text x="36" y="35" class="font-sans" font-size="15" text-anchor="middle">📈</text>
    <text x="60" y="35" class="font-sans" font-size="15" font-weight="800" fill="#60A5FA" letter-spacing="0.5">SCALABILITY ARCHITECTURE</text>
    
    <text x="22" y="66" class="font-sans" font-size="13.5" font-weight="400" fill="#CBD5E1">
      Stateless <tspan font-weight="700" fill="#FFFFFF">FastAPI async ASGI workers</tspan> paired with <tspan font-weight="700" fill="#FFFFFF">Neon serverless PostgreSQL</tspan> connection pooling.
    </text>
    <text x="22" y="88" class="font-mono" font-size="12" fill="#60A5FA">
      • Horizontal auto-scaling under peak user queries with dynamic connection eviction
    </text>
  </g>

  <!-- NFR-03: Security & Access Control -->
  <g transform="translate(1000, 550)">
    <rect width="840" height="106" rx="10" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1"/>
    <rect x="22" y="16" width="28" height="28" rx="6" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.35)" stroke-width="1"/>
    <text x="36" y="35" class="font-sans" font-size="15" text-anchor="middle">🔒</text>
    <text x="60" y="35" class="font-sans" font-size="15" font-weight="800" fill="#34D399" letter-spacing="0.5">SECURITY &amp; ACCESS CONTROL</text>
    
    <text x="22" y="66" class="font-sans" font-size="13.5" font-weight="400" fill="#CBD5E1">
      Stateless <tspan font-weight="700" fill="#FFFFFF">JWT Bearer authorization (HS256)</tspan> with <tspan font-weight="700" fill="#FFFFFF">bcrypt 12-round salted hashing</tspan>.
    </text>
    <text x="22" y="88" class="font-mono" font-size="12" fill="#34D399">
      • Zero-knowledge password storage + prompt security guardrails blocking credential scraping
    </text>
  </g>

  <!-- NFR-04: Data Privacy & Isolation -->
  <g transform="translate(1000, 672)">
    <rect width="840" height="106" rx="10" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1"/>
    <rect x="22" y="16" width="28" height="28" rx="6" fill="rgba(168, 85, 247, 0.15)" stroke="rgba(168, 85, 247, 0.35)" stroke-width="1"/>
    <text x="36" y="35" class="font-sans" font-size="15" text-anchor="middle">🛡️</text>
    <text x="60" y="35" class="font-sans" font-size="15" font-weight="800" fill="#C084FC" letter-spacing="0.5">DATA PRIVACY &amp; ISOLATION</text>
    
    <text x="22" y="66" class="font-sans" font-size="13.5" font-weight="400" fill="#CBD5E1">
      Strict multi-tenant workspace isolation enforced through <tspan font-weight="700" fill="#FFFFFF">project_id foreign-key row segregation</tspan>.
    </text>
    <text x="22" y="88" class="font-mono" font-size="12" fill="#C084FC">
      • Zero data-training leakage: uploaded academic papers are strictly private to the user workspace
    </text>
  </g>

  <!-- NFR-05: High Availability & Multi-LLM Reliability -->
  <g transform="translate(1000, 794)">
    <rect width="840" height="110" rx="10" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.09)" stroke-width="1"/>
    <rect x="22" y="16" width="28" height="28" rx="6" fill="rgba(236, 72, 153, 0.15)" stroke="rgba(236, 72, 153, 0.35)" stroke-width="1"/>
    <text x="36" y="35" class="font-sans" font-size="15" text-anchor="middle">🔄</text>
    <text x="60" y="35" class="font-sans" font-size="15" font-weight="800" fill="#F472B6" letter-spacing="0.5">HIGH AVAILABILITY &amp; RELIABILITY</text>
    
    <text x="22" y="66" class="font-sans" font-size="13.5" font-weight="400" fill="#CBD5E1">
      4-Tier active LLM failover architecture ensures 99.9% uptime during third-party API rate limits:
    </text>
    <text x="22" y="90" class="font-mono" font-size="12" font-weight="700" fill="#F472B6">
      1. OpenAI (GPT-4o) ➔ 2. Groq (LLaMA-3.3-70B) ➔ 3. Google Gemini 2.0 ➔ 4. Local Ollama
    </text>
  </g>


  <!-- =========================================================================
       FOOTER STATUS BAR
       ========================================================================= -->
  <line x1="80" y1="924" x2="1840" y2="924" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>

  <g transform="translate(80, 944)">
    <circle cx="6" cy="11" r="4.5" fill="#10B981"/>
    <text x="20" y="15" class="font-sans" font-size="13" font-weight="500" fill="#64748B">
      ResearchGap.ai System Design Specifications &middot; Minor Project Chapter 2 Requirements Specification
    </text>
  </g>

  <g transform="translate(1420, 944)">
    <text x="420" y="15" class="font-mono" font-size="12" font-weight="700" fill="#94A3B8" text-anchor="end">
      NEXT.JS 15 &middot; FASTAPI &middot; NEON PGVECTOR &middot; BGE-RERANKER
    </text>
  </g>

</svg>
"""

# Save SVG
svg_path = "d:/minor3.0/requirements_slide.svg"
with open(svg_path, "w", encoding="utf-8") as f:
    f.write(svg_content)

print("SVG written successfully.")

# Convert to High-Resolution PNG (1920x1080)
doc = fitz.open("svg", svg_content.encode("utf-8"))
pix = doc[0].get_pixmap(dpi=150) # 150 DPI gives sharp, beautiful resolution
png_path = "d:/minor3.0/requirements_slide.png"
pix.save(png_path)
print(f"PNG rendered: {png_path} ({pix.width}x{pix.height})")

# Copy to artifact folder for Antigravity viewer
artifact_dir = r"C:\Users\Dell 5490T\.gemini\antigravity\brain\97c064e8-441f-4472-9c8b-367db08e6c70"
if os.path.exists(artifact_dir):
    artifact_png = os.path.join(artifact_dir, "requirements_slide.png")
    shutil.copyfile(png_path, artifact_png)
    print(f"Copied to artifact dir: {artifact_png}")
