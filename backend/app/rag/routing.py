from typing import Dict, Any

class RAGRouter:
    """
    RAG Router (Section 8.13 of Master Prompt):
    Classifies user intent and routes to the appropriate RAG strategy:
    - Simple paper question -> dense or hybrid RAG
    - Exact technical lookup -> BM25 sparse RAG
    - Multi-paper comparison -> comparative RAG
    - Research-gap analysis -> multi-query hybrid RAG + reranking
    - Relationship questions -> graph-assisted RAG
    """
    def route_query(self, query: str, user_selected_strategy: str = "hybrid") -> str:
        if user_selected_strategy and user_selected_strategy != "hybrid":
            return user_selected_strategy

        q_lower = query.lower()
        if any(term in q_lower for term in ["gap", "limitation", "future work", "underexplored"]):
            return "gap_analysis_pipeline"
        elif any(term in q_lower for term in ["compare", "vs", "difference", "benchmark"]):
            return "comparative_pipeline"
        elif any(term in q_lower for term in ["author", "cites", "relationship", "network"]):
            return "graph_pipeline"
        elif any(term in q_lower for term in ["exact", "formula", "acronym", "code"]):
            return "bm25"

        return "hybrid"

rag_router = RAGRouter()
