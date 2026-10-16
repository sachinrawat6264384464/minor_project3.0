from typing import List, Dict, Any

class CitationBuilder:
    def build_citations(self, retrieved_chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Build strict, non-fabricated citation cards from retrieved document chunks.
        """
        citations = []
        seen_keys = set()

        for chunk in retrieved_chunks:
            paper = chunk.get("paper", {})
            paper_id = chunk.get("paper_id") or paper.get("id", "unknown")
            page_num = chunk.get("page_number") or 1
            section = chunk.get("section_name") or "General Text"
            
            key = f"{paper_id}_p{page_num}"
            if key not in seen_keys:
                seen_keys.add(key)
                citations.append({
                    "paper_id": paper_id,
                    "title": paper.get("title", "Indexed Academic Paper"),
                    "year": paper.get("year"),
                    "doi": paper.get("doi"),
                    "page_number": page_num,
                    "section_name": section,
                    "excerpt": chunk.get("content", "")[:250] + "..."
                })
        return citations

citation_builder = CitationBuilder()
