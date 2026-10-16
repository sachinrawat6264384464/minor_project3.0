from typing import List, Dict, Any, Optional
import json
import httpx
from app.core.config import settings

class LLMService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.LLM_MODEL

    async def generate_grounded_answer(
        self,
        query: str,
        retrieved_passages: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Generate answer grounded strictly in retrieved passages.
        """
        if not retrieved_passages:
            return {
                "answer": "Insufficient evidence found in the indexed paper collection to answer this question accurately.",
                "citations": []
            }

        context_str = "\n\n".join([
            f"[Source {i+1} | Paper: {p.get('paper', {}).get('title', 'Paper')} | Page {p.get('page_number', 1)} | Section: {p.get('section_name', 'Text')}]\n{p.get('content', '')}"
            for i, p in enumerate(retrieved_passages)
        ])

        system_prompt = (
            "You are a principal academic research scientist and peer-reviewer. "
            "Answer the user query strictly using the provided context passages. "
            "Do not hallucinate facts or citations. Every claim must reference the passage numbers [Source X]. "
            "If the provided context does not contain sufficient evidence, explicitly state that evidence is insufficient."
        )

        user_prompt = f"User Query: {query}\n\nRetrieved Academic Context:\n{context_str}"

        # If OpenAI key available, call API
        if self.api_key:
            try:
                from openai import AsyncOpenAI
                client = AsyncOpenAI(api_key=self.api_key)
                response = await client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.2
                )
                answer_text = response.choices[0].message.content
                return {"answer": answer_text}
            except Exception as e:
                print(f"OpenAI call error: {e}. Falling back to deterministic grounded synthesis.")

        # Fallback synthesis if no OpenAI key configured
        synthesis_lines = [
            f"Based on the analysis of {len(retrieved_passages)} retrieved passages from your indexed collection:\n",
        ]
        for idx, passage in enumerate(retrieved_passages[:3]):
            paper_title = passage.get("paper", {}).get("title", "Indexed Paper")
            page_num = passage.get("page_number", 1)
            sec = passage.get("section_name", "Content")
            excerpt = passage.get("content", "")[:200]
            synthesis_lines.append(f"• **[Source {idx+1}] ({paper_title}, Page {page_num} - {sec})**: \"{excerpt}...\"")
        
        synthesis_lines.append(
            f"\n\n*Synthesis regarding '{query}'*: The literature highlights key empirical findings in the sections above. "
            "Refer to the source citations below for full section context."
        )

        return {"answer": "\n".join(synthesis_lines)}

llm_service = LLMService()
