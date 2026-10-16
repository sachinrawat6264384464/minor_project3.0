from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.chunk import DocumentChunk
from app.models.paper import Paper
from app.rag.embeddings import embedding_service
from app.rag.bm25_retriever import bm25_retriever
from app.rag.hybrid_retriever import hybrid_retriever
from app.rag.citation_builder import citation_builder

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
        """
        # Fetch candidate chunks in project
        query_builder = db.query(DocumentChunk).filter(DocumentChunk.project_id == project_id)
        if paper_ids:
            query_builder = query_builder.filter(DocumentChunk.paper_id.in_(paper_ids))
        
        db_chunks = query_builder.all()
        if not db_chunks:
            return []

        # Convert ORM to dicts with paper metadata
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

        # 2. Dense Vector Retrieval (Cosine similarity on embeddings)
        query_vec = np.array(embedding_service.embed_query(query))
        dense_scored = []
        for c in chunks_data:
            if c["embedding"]:
                doc_vec = np.array(c["embedding"])
                norm = np.linalg.norm(query_vec) * np.linalg.norm(doc_vec)
                score = float(np.dot(query_vec, doc_vec) / norm) if norm > 0 else 0.0
                c_copy = c.copy()
                c_copy["dense_score"] = score
                dense_scored.append(c_copy)
        
        dense_scored.sort(key=lambda x: x.get("dense_score", 0), reverse=True)
        dense_results = dense_scored[:top_k*2]

        # 3. Strategy Routing
        if strategy == "bm25":
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

import numpy as np
rag_orchestrator = RAGOrchestrator()
