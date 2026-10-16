from typing import List

class AcademicQueryRewriter:
    def rewrite_and_expand(self, query: str) -> List[str]:
        """
        Expand a user question into complementary academic queries containing methodological terminology.
        """
        queries = [query]
        query_lower = query.lower()

        # Rule-based academic expansion heuristics
        if "limitation" in query_lower or "weakness" in query_lower:
            queries.append(f"{query} empirical evaluation threats to validity bottleneck")
            queries.append(f"{query} computational overhead trade-offs")
        elif "method" in query_lower or "model" in query_lower:
            queries.append(f"{query} neural architecture algorithm baseline")
            queries.append(f"{query} experimental setup performance comparison")
        elif "dataset" in query_lower or "benchmark" in query_lower:
            queries.append(f"{query} evaluation corpus sample distribution size")
        else:
            queries.append(f"{query} methodology results evaluation metrics")
            queries.append(f"{query} state of the art performance ablation study")

        return queries

query_rewriter = AcademicQueryRewriter()
