import numpy as np
from typing import List
from app.core.config import settings

class LocalEmbeddingService:
    def __init__(self):
        self.model_name = settings.EMBEDDING_MODEL_NAME
        self._model = None
        self._dimension = 384  # Standard bge-small-en-v1.5 dimension

    def _get_model(self):
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self._model = SentenceTransformer(self.model_name)
            except Exception as e:
                print(f"SentenceTransformers load note: {e}. Using deterministic local embedding vector fallback.")
                self._model = False
        return self._model

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed a list of document passages."""
        if not texts:
            return []
        
        model = self._get_model()
        if model:
            try:
                embeddings = model.encode(texts, normalize_embeddings=True)
                return embeddings.tolist()
            except Exception as e:
                print(f"Error encoding with model: {e}")

        # Deterministic lightweight vector fallback
        return [self._fallback_embed(t) for t in texts]

    def embed_query(self, query: str) -> List[float]:
        """Embed a single search query."""
        model = self._get_model()
        if model:
            try:
                # BGE model prompt recommendation for queries
                query_text = f"Represent this sentence for searching relevant passages: {query}"
                embedding = model.encode(query_text, normalize_embeddings=True)
                return embedding.tolist()
            except Exception as e:
                print(f"Error encoding query: {e}")

        return self._fallback_embed(query)

    def _fallback_embed(self, text: str) -> List[float]:
        """Generates a deterministic 384-dim normalized vector based on character hash distributions."""
        vec = np.zeros(self._dimension, dtype=np.float32)
        text_clean = text.lower()
        for idx, char in enumerate(text_clean):
            pos = (ord(char) * (idx + 1)) % self._dimension
            vec[pos] += 1.0
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()

embedding_service = LocalEmbeddingService()
