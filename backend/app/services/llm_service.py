from typing import List, Dict, Any, Optional
import json
import httpx
from app.core.config import settings

class LLMService:
    def __init__(self):
        self.provider = settings.AI_PROVIDER
        self.openai_api_key = settings.OPENAI_API_KEY
        self.openai_model = settings.LLM_MODEL
        self.gemini_api_key = settings.GEMINI_API_KEY
        self.gemini_model = settings.GEMINI_MODEL
        self.groq_api_key = settings.GROQ_API_KEY
        self.groq_model = settings.GROQ_MODEL
        self.ollama_base_url = settings.OLLAMA_BASE_URL
        self.ollama_model = settings.OLLAMA_MODEL

    def get_available_providers(self) -> List[Dict[str, Any]]:
        """List all providers and their readiness status."""
        return [
            {
                "id": "openai",
                "name": "OpenAI (GPT-4o-mini)",
                "active": self.provider == "openai",
                "configured": bool(self.openai_api_key),
                "model": self.openai_model
            },
            {
                "id": "gemini",
                "name": "Google Gemini 2.0 / 1.5 Flash (Free Tier)",
                "active": self.provider == "gemini",
                "configured": bool(self.gemini_api_key),
                "model": self.gemini_model
            },
            {
                "id": "groq",
                "name": "Groq LLaMA-3.3-70B (Ultra-Fast Free)",
                "active": self.provider == "groq",
                "configured": bool(self.groq_api_key),
                "model": self.groq_model
            },
            {
                "id": "ollama",
                "name": "Ollama (Local Private LLM)",
                "active": self.provider == "ollama",
                "configured": True,
                "model": self.ollama_model
            }
        ]

    async def generate_grounded_answer(
        self,
        query: str,
        retrieved_passages: List[Dict[str, Any]],
        provider_override: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate answer grounded strictly in retrieved passages using the active provider
        (OpenAI, Google Gemini, Groq, or Ollama) with robust fallback.
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
        target_provider = provider_override or self.provider

        # 1. Try Google Gemini if selected or configured
        if target_provider == "gemini" and self.gemini_api_key:
            try:
                gemini_res = await self._call_gemini(system_prompt, user_prompt)
                if gemini_res:
                    return {"answer": gemini_res, "provider": "gemini"}
            except Exception as e:
                print(f"Gemini call error: {e}. Trying fallback.")

        # 2. Try Groq if selected or configured
        if target_provider == "groq" and self.groq_api_key:
            try:
                groq_res = await self._call_groq(system_prompt, user_prompt)
                if groq_res:
                    return {"answer": groq_res, "provider": "groq"}
            except Exception as e:
                print(f"Groq call error: {e}. Trying fallback.")

        # 3. Try OpenAI (default primary)
        if (target_provider == "openai" or not target_provider) and self.openai_api_key:
            try:
                from openai import AsyncOpenAI
                client = AsyncOpenAI(api_key=self.openai_api_key)
                response = await client.chat.completions.create(
                    model=self.openai_model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.2
                )
                answer_text = response.choices[0].message.content
                return {"answer": answer_text, "provider": "openai"}
            except Exception as e:
                print(f"OpenAI call error: {e}. Falling back.")

        # 4. Try Ollama if selected
        if target_provider == "ollama":
            try:
                ollama_res = await self._call_ollama(system_prompt, user_prompt)
                if ollama_res:
                    return {"answer": ollama_res, "provider": "ollama"}
            except Exception as e:
                print(f"Ollama call error: {e}.")

        # 5. Deterministic fallback synthesis
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

        return {"answer": "\n".join(synthesis_lines), "provider": "deterministic-offline"}

    async def _call_gemini(self, system_prompt: str, user_prompt: str) -> Optional[str]:
        """Call Google Gemini Generative Language REST API."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.gemini_model}:generateContent?key={self.gemini_api_key}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"{system_prompt}\n\n{user_prompt}"}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 2048
            }
        }
        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
            else:
                print(f"Gemini API returned {resp.status_code}: {resp.text}")
                return None

    async def _call_groq(self, system_prompt: str, user_prompt: str) -> Optional[str]:
        """Call Groq OpenAI-compatible fast REST API."""
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.groq_api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.groq_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.2
        }
        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                return data["choices"][0]["message"]["content"]
            else:
                print(f"Groq API returned {resp.status_code}: {resp.text}")
                return None

    async def _call_ollama(self, system_prompt: str, user_prompt: str) -> Optional[str]:
        """Call local Ollama REST API."""
        url = f"{self.ollama_base_url}/api/generate"
        payload = {
            "model": self.ollama_model,
            "prompt": f"{system_prompt}\n\n{user_prompt}",
            "stream": False
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                return data.get("response")
            return None

llm_service = LLMService()
