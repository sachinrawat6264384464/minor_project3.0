# System Architecture: AI Research Paper & Research Gap Finder

An enterprise-grade, end-to-end AI platform designed for PhD scholars, academics, and research teams to discover academic papers, ingest PDFs with section-aware RAG indexing, conduct grounded Q&A with verifiable page-level citations, compare papers side-by-side, and analyze novel research gaps with counter-evidence validation.

---

## 1. High-Level System Architecture

```mermaid
graph TD
    classDef client fill:#1E3A8A,stroke:#3B82F6,stroke-width:2px,color:#FFFFFF;
    classDef api fill:#0F172A,stroke:#64748B,stroke-width:2px,color:#FFFFFF;
    classDef engine fill:#1E293B,stroke:#38BDF8,stroke-width:2px,color:#FFFFFF;
    classDef db fill:#064E3B,stroke:#10B981,stroke-width:2px,color:#FFFFFF;
    classDef external fill:#4C1D95,stroke:#A855F7,stroke-width:2px,color:#FFFFFF;

    subgraph Tier1["1. CLIENT PRESENTATION TIER (Next.js 15 + React 19)"]
        UI_MAIN["Frontend Web Application (Royal Blue & Royal White UI)"]
        UI_A["Scholar Studio & Staging\n(/scholar-studio)"]
        UI_B["Grounded RAG Chat\n(/chat/[id])"]
        UI_C["9-Stage Gap Discovery\n(/research-gaps/[id])"]
        UI_D["Side-by-Side Comparison\n(/compare)"]
    end

    subgraph Tier2["2. API GATEWAY & CONTROLLERS (FastAPI :8000)"]
        GATEWAY["FastAPI Application Router & Middleware"]
        AUTH["OAuth2 JWT Auth & Security Guard"]
    end

    subgraph Tier3["3. PROCESSING ENGINES & HYBRID RAG"]
        subgraph Sub_Discovery["Pipeline A: Literature Sourcing & Ingestion"]
            DISC_SVC["Academic Discovery Service\n(SerpAPI + OpenAlex + Semantic Scholar)"]
            INGEST["PyMuPDF Ingestion Engine\n(Section Boundaries + 500w Sliding Window)"]
        end
        
        subgraph Sub_RAG["Pipeline B: Multi-Strategy Hybrid RAG Engine"]
            RETRIEVER["Hybrid Fusion Retriever (RRF)\n(Dense BGE 384d + Sparse BM25Okapi)"]
            RERANK["Cross-Encoder Reranker\n(BAAI/bge-reranker-base)"]
            CITATIONS["Verifiable Citation Card Builder\n(Paper Title, DOI, Page Number, Excerpt)"]
            LLM_SVC["LLM Grounding Service\n(Strict Zero-Hallucination Prompting)"]
        end

        subgraph Sub_Gap["Pipeline C: 9-Stage Research Gap Engine"]
            GAP_SVC["9-Stage Research Gap Engine\n(Counter-Evidence Verification & Validation Experiments)"]
        end
    end

    subgraph Tier4["4. CLOUD PERSISTENCE TIER (Neon PostgreSQL + S3)"]
        NEON_PG[("Neon Serverless PostgreSQL\n(13 Relational Tables)")]
        NEON_VEC[("Neon pgvector Vector Store\n(384-dim Dense Embeddings)")]
        NEON_S3[("Neon Object Storage Bucket\n(Raw PDFs & Literature Media)")]
    end

    subgraph Tier5["5. EXTERNAL AI & ACADEMIC CONNECTORS"]
        EXT_SCHOLAR["Google Scholar API (via SerpAPI)"]
        EXT_OPENALEX["OpenAlex & Semantic Scholar"]
        EXT_OPENAI["OpenAI API (gpt-4o-mini)"]
    end

    %% Client to Gateway
    UI_MAIN -->|REST API / JSON| GATEWAY
    GATEWAY --> AUTH

    %% Gateway to Engines
    GATEWAY -->|Search & Batch Sourcing| DISC_SVC
    GATEWAY -->|Direct PDF Uploads| INGEST
    GATEWAY -->|Grounded RAG Queries| RETRIEVER
    GATEWAY -->|Gap Discovery Requests| GAP_SVC

    %% Engine to External
    DISC_SVC <-->|Live Google Scholar Search| EXT_SCHOLAR
    DISC_SVC <-->|Open-Access DOI Search| EXT_OPENALEX
    LLM_SVC <-->|Grounded Synthesis| EXT_OPENAI
    GAP_SVC <-->|Hypothesis Formulation| EXT_OPENAI

    %% Ingestion to Storage
    INGEST -->|Stores PDF Documents| NEON_S3
    INGEST -->|Computes & Saves 384d Vectors| NEON_VEC
    INGEST -->|Stores Metadata & Sections| NEON_PG

    %% RAG Pipeline Data Flow
    RETRIEVER <-->|Hybrid Cosine & Lexical Match| NEON_VEC
    RETRIEVER -->|Top Candidates| RERANK
    RERANK -->|Scored Chunks| CITATIONS
    CITATIONS -->|Enriched Citations| LLM_SVC
    
    %% Relational Persistence
    GATEWAY <-->|Projects, Users, Conversations| NEON_PG
    GAP_SVC <-->|Saves Gaps & Evidence| NEON_PG

    class UI_MAIN,UI_A,UI_B,UI_C,UI_D client;
    class GATEWAY,AUTH api;
    class INGEST,DISC_SVC,RETRIEVER,RERANK,CITATIONS,LLM_SVC,GAP_SVC engine;
    class NEON_PG,NEON_VEC,NEON_S3 db;
    class EXT_SCHOLAR,EXT_OPENALEX,EXT_OPENAI external;
```

---

## 2. Layer-by-Layer Architectural Decomposition

### Tier 1: Frontend Client (Next.js 15, React 19, Tailwind CSS)
* **Framework:** Next.js 15 App Router with React 19 Server/Client Components.
* **Design Aesthetic:** Royal Blue (`#0F172A`, `#1E3A8A`, `#2563EB`) & Royal White (`#FFFFFF`, `#FAFAFC`) glassmorphic UI.
* **Core Views:**
  1. [`/scholar-studio`](file:///d:/minor3.0/frontend/src/app/scholar-studio/page.tsx): Live Google Scholar sourcing, interactive staging, checkbox verification, and batch RAG vector indexing.
  2. [`/papers`](file:///d:/minor3.0/frontend/src/app/papers/page.tsx): Multi-source discovery across OpenAlex, SerpAPI, and Semantic Scholar.
  3. [`/workspace/[projectId]`](file:///d:/minor3.0/frontend/src/app/workspace/%5BprojectId%5D/page.tsx): Workspace dashboard, collection manager, custom PDF uploader, and interactive citation graph.
  4. [`/chat/[projectId]`](file:///d:/minor3.0/frontend/src/app/chat/%5BprojectId%5D/page.tsx): Grounded conversation interface featuring expandable, verifiable citation cards.
  5. [`/research-gaps/[projectId]`](file:///d:/minor3.0/frontend/src/app/research-gaps/%5BprojectId%5D/page.tsx): Interactive 9-stage research gap review with counter-evidence badges and suggested experiment designs.
  6. [`/compare`](file:///d:/minor3.0/frontend/src/app/compare/page.tsx): Side-by-side comparison matrix of datasets, methods, metrics, and limitations.
  7. [`/trends/[projectId]`](file:///d:/minor3.0/frontend/src/app/trends/%5BprojectId%5D/page.tsx): Bibliometric momentum and publication velocity over time.

---

### Tier 2: Backend API & Gateway (FastAPI, Python 3.12, Uvicorn)
* **Framework:** FastAPI with asynchronous endpoints, Pydantic v2 schemas, and dependency injection.
* **Authentication:** OAuth2 password flow with JWT Bearer tokens and bcrypt password hashing.
* **Auto-Documentation:** OpenAPI 3.0 / Swagger accessible at `http://localhost:8000/docs`.

---

### Tier 3: Ingestion & Document Parsing Pipeline
* **Engine:** PyMuPDF (`fitz`) for PDF stream processing and text rendering.
* **Heading Heuristics:** Scans for structural academic headings using regular expressions:
  - `Abstract`, `Introduction`, `Methodology`, `Results`, `Discussion`, `Limitations`, `Future Work`, `Conclusion`, `References`.
* **Sliding Window Chunking:** 500-word passages with a 100-word overlap. Chunks preserve:
  - Page number (1-indexed)
  - Section category
  - Parent paper DOI and Title

---

### Tier 4: Multi-Strategy Hybrid RAG Engine

```mermaid
sequenceDiagram
    autonumber
    actor User as Researcher
    participant UI as Chat Frontend
    participant API as FastAPI /chat
    participant Orch as RAG Orchestrator
    participant BM25 as Sparse BM25
    participant BGE as Dense Vector (BGE)
    participant Neon as Neon pgvector DB
    participant RRF as Hybrid Fusion (RRF)
    participant LLM as LLM Grounding Service
    participant OpenAI as OpenAI (gpt-4o-mini)

    User->>UI: Enters academic question
    UI->>API: POST /api/v1/chat {query, project_id}
    API->>Orch: retrieve_context(query)
    
    par Dual Retrieval
        Orch->>BM25: rank_chunks(query, tokenized_corpus)
        BM25-->>Orch: Sparse ranked list
    and
        Orch->>BGE: embed_query(query)
        BGE-->>Orch: 384-dim query vector
        Orch->>Neon: Cosine similarity search (document_chunks)
        Neon-->>Orch: Dense ranked list
    end

    Orch->>RRF: reciprocal_rank_fusion(dense, sparse, k=60)
    RRF-->>Orch: Unified top_k candidate chunks
    Orch-->>API: Context chunks with Section & Page metadata
    
    API->>LLM: generate_grounded_answer(query, chunks)
    LLM->>OpenAI: Prompt with strict [Source X] constraints
    OpenAI-->>LLM: Grounded answer with verbatim citation anchors
    LLM-->>API: Answer + Citation Cards (DOI, Page, Excerpt)
    API-->>UI: MessageResponse JSON
    UI-->>User: Displays verified answer + interactive citation cards
```

* **Sparse Retrieval:** `BM25Okapi` catches exact dataset names, algorithms, and author surnames.
* **Dense Retrieval:** `BAAI/bge-small-en-v1.5` embeds query and document chunks into 384-dimensional vectors.
* **Hybrid Fusion:** Reciprocal Rank Fusion:
  $$RRF\_Score(d) = \sum_{m \in \{\text{dense}, \text{sparse}\}} \frac{1}{60 + \text{rank}_m(d)}$$
* **Reranking:** Cross-Encoder `BAAI/bge-reranker-base` scores candidate pairs.
* **Zero-Hallucination Grounding:** Restricts LLM answers to retrieved chunks. Absence of evidence triggers explicit notification: *"Insufficient evidence found in the indexed paper collection."*

---

### Tier 5: 9-Stage Research Gap Analysis Engine
1. **Scope Definition:** Pinpoints the domain and selected paper corpus.
2. **Corpus Extraction:** Focuses extraction on *Limitations*, *Discussion*, and *Future Work* sections.
3. **Taxonomy Classification:** Categorizes candidates into:
   - *Generalization Weaknesses* (e.g. untested under domain shift)
   - *Inadequate Baseline Comparisons* (e.g. omitting PEFT/LoRA in LLM benchmarks)
   - *Reproducibility Limitations* (e.g. proprietary datasets without public release)
   - *Methodological Constraints*
4. **Counter-Evidence Verification:** Cross-verifies candidates against newer publications to eliminate solved problems.
5. **Hypothesis Formulation:** Produces concrete *Proposed Research Questions* and *Validation Experiment Protocols*.

---

### Tier 6: Cloud Infrastructure (Neon PostgreSQL + S3 Storage)

```mermaid
erDiagram
    USERS ||--o{ PROJECTS : owns
    PROJECTS ||--o{ PAPERS : contains
    PROJECTS ||--o{ CONVERSATIONS : has
    PROJECTS ||--o{ RESEARCH_GAP_ANALYSES : tracks
    PAPERS ||--o{ PAPER_SECTIONS : segmented_into
    PAPERS ||--o{ DOCUMENT_CHUNKS : chunked_into
    CONVERSATIONS ||--o{ MESSAGES : contains
    RESEARCH_GAP_ANALYSES ||--o{ CANDIDATE_GAPS : identifies
    CANDIDATE_GAPS ||--o{ GAP_EVIDENCE : verified_by

    USERS {
        string id PK
        string email
        string hashed_password
        string full_name
        boolean is_active
    }

    PROJECTS {
        string id PK
        string user_id FK
        string title
        string research_topic
    }

    PAPERS {
        string id PK
        string project_id FK
        string title
        string doi
        string abstract
        json authors
        int year
        string venue
        int citation_count
        string local_file_path
        string ingestion_status
        json extracted_findings
    }

    DOCUMENT_CHUNKS {
        string id PK
        string paper_id FK
        string project_id FK
        int chunk_index
        text content
        string section_name
        int page_number
        vector_384 embedding
    }

    CANDIDATE_GAPS {
        string id PK
        string analysis_id FK
        string title
        string category
        text description
        float confidence_score
        string evidence_strength
        text potential_question
        text suggested_experiment
    }
```

* **Neon Serverless PostgreSQL:** Hosts all relational entities with automatic connection pooling (`pool_pre_ping=True`).
* **`pgvector` Extension:** Stores 384-dimensional dense vectors directly in `document_chunks`.
* **Neon Object Storage (S3 / Tigris):** Stores raw PDF files and extracted media via `boto3`.

---

## 3. Technology Stack Reference

| Layer | Component | Technology Selected |
| :--- | :--- | :--- |
| **Frontend UI** | Application Framework | Next.js 15 (App Router), React 19 |
| | Styling & Animation | Tailwind CSS v3, Framer Motion |
| | State & Query Management | Zustand, TanStack React Query v5 |
| | Icons & Graphics | Lucide React |
| **Backend API** | Web Framework | FastAPI, Uvicorn, Python 3.12 |
| | Validation & Settings | Pydantic v2, Pydantic-Settings |
| | PDF Extraction | PyMuPDF (`fitz`) |
| **AI & RAG** | Vector Embeddings | `BAAI/bge-small-en-v1.5` (Sentence-Transformers) |
| | Lexical Retrieval | `rank_bm25` (BM25Okapi) |
| | Reranking Engine | `BAAI/bge-reranker-base` (Cross-Encoder) |
| | Generative LLM | OpenAI `gpt-4o-mini` (with offline fallback) |
| **Persistence** | Database | Neon Serverless PostgreSQL |
| | Vector Engine | `pgvector` PostgreSQL Extension |
| | ORM | SQLAlchemy 2.0 |
| | Media & PDF Storage | Neon S3 Object Storage (`boto3`) |
| **External Connectors** | Academic Search | SerpAPI (Google Scholar), OpenAlex, Semantic Scholar |
