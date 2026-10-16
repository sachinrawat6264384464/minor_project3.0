import math
from typing import List, Dict, Any
from rank_bm25 import BM25Okapi

class BM25Retriever:
    def rank_chunks(self, query: str, chunks: List[Dict[str, Any]], top_k: int = 10) -> List[Dict[str, Any]]:
        """
        Rank a list of chunk dicts using BM25Okapi lexical retrieval.
        """
        if not chunks:
            return []

        tokenized_corpus = [chunk["content"].lower().split() for chunk in chunks]
        tokenized_query = query.lower().split()

        bm25 = BM25Okapi(tokenized_corpus)
        doc_scores = bm25.get_scores(tokenized_query)

        scored_chunks = []
        for idx, score in enumerate(doc_scores):
            if score > 0.001:  # Filter zero scores
                c = chunks[idx].copy()
                c["bm25_score"] = float(score)
                scored_chunks.append(c)

        scored_chunks.sort(key=lambda x: x["bm25_score"], reverse=True)
        return scored_chunks[:top_k]

bm25_retriever = BM25Retriever()
