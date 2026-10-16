from typing import List, Dict, Any
import numpy as np

class HybridRRFRetriever:
    """
    Combines Dense Vector Retrieval and BM25 Lexical Retrieval using Reciprocal Rank Fusion (RRF).
    Formula: RRF_score(doc) = sum( 1.0 / (k + rank_i(doc)) ) for each retriever i.
    """
    def reciprocal_rank_fusion(
        self,
        dense_results: List[Dict[str, Any]],
        sparse_results: List[Dict[str, Any]],
        rrf_k: int = 60,
        top_k: int = 10
    ) -> List[Dict[str, Any]]:
        scores = {}
        chunks_by_id = {}

        # 1. Process Dense Ranks
        for rank, chunk in enumerate(dense_results):
            cid = chunk["id"]
            chunks_by_id[cid] = chunk
            scores[cid] = scores.get(cid, 0.0) + (1.0 / (rrf_k + rank + 1))

        # 2. Process Sparse BM25 Ranks
        for rank, chunk in enumerate(sparse_results):
            cid = chunk["id"]
            chunks_by_id[cid] = chunk
            scores[cid] = scores.get(cid, 0.0) + (1.0 / (rrf_k + rank + 1))

        # 3. Sort by RRF score
        sorted_ids = sorted(scores.keys(), key=lambda cid: scores[cid], reverse=True)

        final_chunks = []
        for cid in sorted_ids[:top_k]:
            c = chunks_by_id[cid].copy()
            c["rrf_score"] = float(scores[cid])
            final_chunks.append(c)

        return final_chunks

hybrid_retriever = HybridRRFRetriever()
