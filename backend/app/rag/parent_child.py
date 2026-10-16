from typing import List, Dict, Any

class ParentChildContextRetriever:
    """
    Parent-Child & Hierarchical RAG (Section 8.6 of Master Prompt):
    Indexes fine-grained child chunks for precise vector matching while supplying 
    broader parent section context to the LLM during generation.
    """
    def enrich_child_with_parent_context(
        self,
        child_chunks: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        enriched = []
        for chunk in child_chunks:
            c = chunk.copy()
            section = c.get("section_name", "General Text")
            page_num = c.get("page_number", 1)
            
            # Enrich prompt snippet with parent section envelope
            c["llm_context_snippet"] = (
                f"[Document Section: {section} | Page {page_num}]\n"
                f"{c.get('content', '')}"
            )
            enriched.append(c)
        return enriched

parent_child_retriever = ParentChildContextRetriever()
