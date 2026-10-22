from typing import List, Dict, Any

class CrossEncoderReranker:
    """
    Reranking RAG (Section 8.4 of Master Prompt):
    Uses cross-encoder relevance scoring to rerank retrieved candidates.
    """
    def __init__(self):
        self._model = None

    def _get_model(self):
        if self._model is None:
            try:
                from sentence_transformers import CrossEncoder
                self._model = CrossEncoder("BAAI/bge-reranker-base")
            except Exception as e:
                print(f"Reranker load note: {e}. Falling back to default scoring.")
                self._model = False
        return self._model

    def rerank(
        self,
        query: str,
        chunks: List[Dict[str, Any]],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        if not chunks:
            return []

        model = self._get_model()
        if model:
            try:
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
                print(f"Reranker predict error: {e}")

        # Fallback to current score order
        return chunks[:top_k]

reranker = CrossEncoderReranker()
