from typing import List, Dict, Any

class CrossEncoderReranker:
    """
    Reranking RAG (Section 8.4 of Master Prompt):
    Uses cross-encoder relevance scoring to rerank retrieved candidates.
    """
    def rerank(
        self,
        query: str,
        chunks: List[Dict[str, Any]],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        if not chunks:
            return []

        # Try sentence-transformers CrossEncoder if installed
        try:
            from sentence_transformers import CrossEncoder
            model = CrossEncoder("BAAI/bge-reranker-base")
            pairs = [[query, c["content"]] for c in chunks]
            scores = model.predict(pairs)
            
            reranked = []
            for idx, score in enumerate(scores):
                c = chunks[idx].copy()
                c["rerank_score"] = float(score)
                reranked.append(c)
            
            reranked.sort(key=lambda x: x["rerank_score"], reverse=True)
            return reranked[:top_k]

        except Exception as e:
            print(f"Reranker note: {e}. Using RRF score ranking.")
            # Fallback to current score order
            return chunks[:top_k]

reranker = CrossEncoderReranker()
