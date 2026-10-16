# AI Research Paper & Research Gap Finder — Full-Stack AI Platform

An enterprise-grade, end-to-end AI platform designed for PhD scholars, academics, and research teams to discover academic papers, ingest PDFs with section-aware RAG indexing, conduct grounded Q&A with verifiable page-level citations, compare papers side-by-side, and analyze novel research gaps with counter-evidence validation.

---

## 🎨 Visual Design System: **Royal Blue & Royal White**
- **Primary Color Palette**: Deep Royal Blue (`#0F172A`), Royal Cobalt (`#1E3A8A` / `#2563EB`), Electric Royal (`#3B82F6`).
- **Canvas / Surfaces**: Crisp Royal White (`#FFFFFF`), Off-White canvas (`#FAFAFC`), Glassmorphism card surfaces with subtle slate borders (`#E2E8F0`).

---

## 🚀 Key System Features

1. **Academic Paper Discovery**: Integrated connectors for OpenAlex, Semantic Scholar, and SerpAPI with automated DOI deduplication and open-access PDF resolution.
2. **PDF Ingestion & Section Parsing**: PyMuPDF extraction detecting paper sections (*Abstract*, *Methods*, *Results*, *Limitations*, *Future Work*) preserving exact page numbers and chunk hierarchies.
3. **Multi-Strategy RAG Engine**:
   - Dense Vector Retrieval (`BAAI/bge-small-en-v1.5` embeddings via `pgvector` / local engine)
   - Sparse BM25 Lexical Retrieval
   - Hybrid RAG via Reciprocal Rank Fusion (RRF)
   - Verifiable Citation Cards mapping every claim to paper title, DOI, page number, and verbatim excerpt.
4. **9-Stage Research Gap Analysis Engine**:
   - Categorizes candidate gaps (*Underexplored Questions*, *Limited Dataset Diversity*, *Generalization Weaknesses*, *Baseline Gaps*).
   - **Counter-Evidence Verification**: Verifies candidate gaps against recent publications to ensure novelty.
   - Proposed Research Questions & Validation Experiment design.
5. **Side-by-Side Paper Comparison Matrix**: Structured grid comparing objectives, datasets, baselines, metrics, and limitations (explicitly marking unreported values as "Not reported").
6. **Trends & Knowledge Graph**: Publication velocity over time and interactive entity-relationship graph.
7. **Downloadable Literature Reports**: Instant Markdown and PDF export.

---

## 🛠️ Quick Start Guide

### 1. Backend Setup (FastAPI + Python 3.12)
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
- OpenAPI Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### 2. Frontend Setup (Next.js 15 + React 19 + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
- Access application UI: `http://localhost:3000`

---

## 🐳 Docker Deployment
```bash
docker-compose up --build -d
```

---

## 🧪 Automated Testing
```bash
# Backend pytest
cd backend
pytest

# Frontend unit tests
cd frontend
npm run test
```
