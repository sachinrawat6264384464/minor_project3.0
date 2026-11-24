from typing import List, Dict, Any, Optional
import numpy as np
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.models.chunk import DocumentChunk
from app.models.paper import Paper
from app.rag.embeddings import embedding_service
from app.rag.bm25_retriever import bm25_retriever
from app.rag.hybrid_retriever import hybrid_retriever
from app.rag.citation_builder import citation_builder
from app.core.config import settings

class RAGOrchestrator:
    def retrieve_context(
        self,
        db: Session,
        project_id: str,
        query: str,
        paper_ids: Optional[List[str]] = None,
        strategy: str = "hybrid",
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Orchestrates retrieval across Dense, Sparse, or Hybrid RAG pipelines.
        Supports PostgreSQL pgvector HNSW + GIN Full Text Search, with SQLite fallback.
        """
        is_postgres = not settings.DATABASE_URL.startswith("sqlite")

        if is_postgres:
            try:
                return self._retrieve_postgres(
                    db=db,
                    project_id=project_id,
                    query=query,
                    paper_ids=paper_ids,
                    strategy=strategy,
                    top_k=top_k
                )
            except Exception as e:
                print(f"PostgreSQL native retrieval note: {e}. Falling back to in-memory retrieval.")

        # Fallback for SQLite or connection issues
        return self._retrieve_fallback(
            db=db,
            project_id=project_id,
            query=query,
            paper_ids=paper_ids,
            strategy=strategy,
            top_k=top_k
        )

    def _retrieve_postgres(
        self,
        db: Session,
        project_id: str,
        query: str,
        paper_ids: Optional[List[str]] = None,
        strategy: str = "hybrid",
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Executes native database-level Dense (HNSW) and Sparse (GIN FTS) retrieval in PostgreSQL.
        """
        paper_filter = ""
        params: Dict[str, Any] = {
            "project_id": project_id,
            "dense_limit": top_k * 2,
            "sparse_limit": top_k * 2
        }

        if paper_ids and len(paper_ids) > 0:
            paper_filter = " AND c.paper_id IN :paper_ids "
            params["paper_ids"] = tuple(paper_ids)

        dense_results: List[Dict[str, Any]] = []
        sparse_results: List[Dict[str, Any]] = []

        # 1. Native Dense Vector Search (HNSW Cosine Distance)
        if strategy in ("dense", "hybrid"):
            query_vec = embedding_service.embed_query(query)
            qvec_str = "[" + ",".join(str(x) for x in query_vec) + "]"
            params["qvec"] = qvec_str

            dense_sql = text(f"""
                SELECT c.id, c.paper_id, c.content, c.section_name, c.page_number,
                       1 - (c.embedding_vec <=> CAST(:qvec AS vector)) as dense_score,
                       p.title as paper_title, p.doi as paper_doi, p.year as paper_year
                FROM document_chunks c
                LEFT JOIN papers p ON p.id = c.paper_id
                WHERE c.project_id = :project_id
                  AND c.embedding_vec IS NOT NULL
                  {paper_filter}
                ORDER BY c.embedding_vec <=> CAST(:qvec AS vector)
                LIMIT :dense_limit;
            """)

            res = db.execute(dense_sql, params).fetchall()
            for r in res:
                dense_results.append({
                    "id": str(r[0]),
                    "paper_id": str(r[1]),
                    "content": r[2] or "",
                    "section_name": r[3] or "General",
                    "page_number": r[4] or 1,
                    "dense_score": float(r[5]) if r[5] is not None else 0.0,
                    "paper": {
                        "id": str(r[1]),
                        "title": r[6] or "Indexed Paper",
                        "doi": r[7],
                        "year": r[8]
                    }
                })

        # 2. Native Sparse Full-Text Search (GIN Lexical Index)
        if strategy in ("bm25", "sparse", "hybrid"):
            clean_query = query.strip()
            params["query"] = clean_query

            # First try websearch_to_tsquery for natural academic phrases
            sparse_sql = text(f"""
                SELECT c.id, c.paper_id, c.content, c.section_name, c.page_number,
                       ts_rank_cd(c.tsv_content, websearch_to_tsquery('english', :query)) as sparse_score,
                       p.title as paper_title, p.doi as paper_doi, p.year as paper_year
                FROM document_chunks c
                LEFT JOIN papers p ON p.id = c.paper_id
                WHERE c.project_id = :project_id
                  AND c.tsv_content @@ websearch_to_tsquery('english', :query)
                  {paper_filter}
                ORDER BY sparse_score DESC
                LIMIT :sparse_limit;
            """)

            res = db.execute(sparse_sql, params).fetchall()
            if not res:
                # Fallback to plainto_tsquery
                fallback_sparse_sql = text(f"""
                    SELECT c.id, c.paper_id, c.content, c.section_name, c.page_number,
                           ts_rank_cd(c.tsv_content, plainto_tsquery('english', :query)) as sparse_score,
                           p.title as paper_title, p.doi as paper_doi, p.year as paper_year
                    FROM document_chunks c
                    LEFT JOIN papers p ON p.id = c.paper_id
                    WHERE c.project_id = :project_id
                      AND c.tsv_content @@ plainto_tsquery('english', :query)
                      {paper_filter}
                    ORDER BY sparse_score DESC
                    LIMIT :sparse_limit;
                """)
                res = db.execute(fallback_sparse_sql, params).fetchall()

            for r in res:
                sparse_results.append({
                    "id": str(r[0]),
                    "paper_id": str(r[1]),
                    "content": r[2] or "",
                    "section_name": r[3] or "General",
                    "page_number": r[4] or 1,
                    "sparse_score": float(r[5]) if r[5] is not None else 0.0,
                    "paper": {
                        "id": str(r[1]),
                        "title": r[6] or "Indexed Paper",
                        "doi": r[7],
                        "year": r[8]
                    }
                })

            # If FTS yielded 0 rows (e.g. out-of-vocabulary acronyms), run BM25 on dense results or project chunks
            if not sparse_results and dense_results:
                sparse_results = bm25_retriever.rank_chunks(query, dense_results, top_k=top_k * 2)

        # 3. Strategy Routing
        if strategy in ("bm25", "sparse"):
            return sparse_results[:top_k]
        elif strategy == "dense":
            return dense_results[:top_k]
        else:
            # Hybrid RRF (Default)
            return hybrid_retriever.reciprocal_rank_fusion(
                dense_results=dense_results,
                sparse_results=sparse_results,
                top_k=top_k
            )

    def _retrieve_fallback(
        self,
        db: Session,
        project_id: str,
        query: str,
        paper_ids: Optional[List[str]] = None,
        strategy: str = "hybrid",
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        In-memory fallback for SQLite environments.
        """
        query_builder = db.query(DocumentChunk).filter(DocumentChunk.project_id == project_id)
        if paper_ids:
            query_builder = query_builder.filter(DocumentChunk.paper_id.in_(paper_ids))
        
        db_chunks = query_builder.all()
        if not db_chunks:
            return []

        chunks_data = []
        for c in db_chunks:
            paper = db.query(Paper).filter(Paper.id == c.paper_id).first()
            chunks_data.append({
                "id": c.id,
                "paper_id": c.paper_id,
                "content": c.content,
                "section_name": c.section_name or "General",
                "page_number": c.page_number or 1,
                "embedding": c.embedding,
                "paper": {
                    "id": paper.id if paper else c.paper_id,
                    "title": paper.title if paper else "Indexed Paper",
                    "doi": paper.doi if paper else None,
                    "year": paper.year if paper else None
                }
            })

        # 1. Sparse BM25 Retrieval
        sparse_results = bm25_retriever.rank_chunks(query, chunks_data, top_k=top_k*2)

        # 2. Dense Vector Retrieval
        query_vec = np.array(embedding_service.embed_query(query))
        dense_scored = []
        for c in chunks_data:
            if c.get("embedding"):
                doc_vec = np.array(c["embedding"])
                norm = np.linalg.norm(query_vec) * np.linalg.norm(doc_vec)
                score = float(np.dot(query_vec, doc_vec) / norm) if norm > 0 else 0.0
                c_copy = c.copy()
                c_copy["dense_score"] = score
                dense_scored.append(c_copy)
        
        dense_scored.sort(key=lambda x: x.get("dense_score", 0), reverse=True)
        dense_results = dense_scored[:top_k*2]

        if strategy in ("bm25", "sparse"):
            return sparse_results[:top_k]
        elif strategy == "dense":
            return dense_results[:top_k]
        else:
            return hybrid_retriever.reciprocal_rank_fusion(
                dense_results=dense_results,
                sparse_results=sparse_results,
                top_k=top_k
            )

rag_orchestrator = RAGOrchestrator()
