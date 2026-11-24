from typing import List, Dict, Any

class HybridRRFRetriever:
    """
    Combines Dense Vector Retrieval and Lexical Retrieval using Reciprocal Rank Fusion (RRF).
    Formula: RRF_score(doc) = sum( 1.0 / (k + rank_i(doc)) ) for each retriever i.
    """
    def reciprocal_rank_fusion(
        self,
        dense_results: List[Dict[str, Any]],
        sparse_results: List[Dict[str, Any]],
        rrf_k: int = 60,
        top_k: int = 10
    ) -> List[Dict[str, Any]]:
        scores: Dict[str, float] = {}
        chunks_by_id: Dict[str, Dict[str, Any]] = {}

        # 1. Process Dense Ranks
        for rank, chunk in enumerate(dense_results):
            cid = chunk["id"]
            if cid not in chunks_by_id:
                chunks_by_id[cid] = chunk.copy()
            else:
                chunks_by_id[cid].update(chunk)
            chunks_by_id[cid]["dense_rank"] = rank + 1
            scores[cid] = scores.get(cid, 0.0) + (1.0 / (rrf_k + rank + 1))

        # 2. Process Sparse (FTS / BM25) Ranks
        for rank, chunk in enumerate(sparse_results):
            cid = chunk["id"]
            if cid not in chunks_by_id:
                chunks_by_id[cid] = chunk.copy()
            else:
                # Merge sparse metadata without overwriting existing dense score
                c_copy = chunk.copy()
                if "dense_score" in chunks_by_id[cid]:
                    c_copy["dense_score"] = chunks_by_id[cid]["dense_score"]
                chunks_by_id[cid].update(c_copy)
            chunks_by_id[cid]["sparse_rank"] = rank + 1
            scores[cid] = scores.get(cid, 0.0) + (1.0 / (rrf_k + rank + 1))

        # 3. Sort by RRF score descending
        sorted_ids = sorted(scores.keys(), key=lambda cid: scores[cid], reverse=True)

        final_chunks = []
        for cid in sorted_ids[:top_k]:
            c = chunks_by_id[cid].copy()
            c["rrf_score"] = float(scores[cid])
            final_chunks.append(c)

        return final_chunks

hybrid_retriever = HybridRRFRetriever()
