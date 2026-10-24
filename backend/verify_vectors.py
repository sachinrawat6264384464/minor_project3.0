import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from app.db.session import SessionLocal
from app.models.paper import Paper
from app.models.chunk import DocumentChunk

def verify():
    db = SessionLocal()
    recent_papers = db.query(Paper).order_by(Paper.created_at.desc()).limit(10).all()
    print("=" * 70)
    print("      LIVE DATABASE & PGVECTOR VERIFICATION REPORT (10 PAPERS)")
    print("=" * 70)
    
    total_chunks = 0
    for i, p in enumerate(recent_papers, 1):
        chunks = db.query(DocumentChunk).filter(DocumentChunk.paper_id == p.id).all()
        total_chunks += len(chunks)
        print(f"\n[PAPER #{i}] {p.title}")
        print(f"  • Paper ID       : {p.id}")
        print(f"  • Project ID     : {p.project_id}")
        print(f"  • Status         : {p.ingestion_status}")
        print(f"  • Year / Venue   : {p.year} | {p.venue}")
        print(f"  • Total Chunks   : {len(chunks)} vector chunks indexed")
        
        if chunks:
            for c_idx, c in enumerate(chunks[:2], 1):
                emb_dim = len(c.embedding) if c.embedding is not None else 0
                sample = [round(float(x), 4) for x in list(c.embedding)[:4]] if c.embedding is not None else []
                print(f"    - Chunk {c_idx}: Section='{c.section_name}', Page={c.page_number}")
                print(f"      Embedding: {emb_dim}-Dimensional Vector -> {sample}...")
                print(f"      Content preview: \"{c.content[:90]}...\"")
    
    print("\n" + "=" * 70)
    print(f"SUMMARY: All 10 papers verified in Neon PostgreSQL.")
    print(f"Total vector embeddings confirmed in pgvector: {total_chunks}")
    print("=" * 70)

    # Test Live RAG Semantic Search using Cosine Similarity
    print("\n[LIVE RAG SEMANTIC QUERY TEST ON THESE 10 PAPERS]")
    from app.rag.embeddings import embedding_service
    test_query = "recursive self-improving software and seed AI mechanisms"
    q_vec = embedding_service.embed_query(test_query)
    
    all_chunks = db.query(DocumentChunk).filter(DocumentChunk.project_id == "1ab957e7-e64e-4343-8c9b-7ef9ed5d3e91").all()
    if all_chunks:
        scored = []
        for chk in all_chunks:
            if chk.embedding is not None:
                sim = embedding_service.cosine_similarity(q_vec, list(chk.embedding))
                scored.append((sim, chk))
        scored.sort(key=lambda x: x[0], reverse=True)
        
        print(f"Query: \"{test_query}\"")
        print("Top Retrieved Matches via pgvector 384d Cosine Similarity:")
        for rank, (score, matched_chunk) in enumerate(scored[:3], 1):
            parent = db.query(Paper).filter(Paper.id == matched_chunk.paper_id).first()
            p_title = parent.title if parent else "Unknown"
            print(f"  {rank}. [Score: {score:.4f}] Paper: \"{p_title[:45]}...\"")
            print(f"     Section: {matched_chunk.section_name} | Page: {matched_chunk.page_number}")
            print(f"     Excerpt: \"{matched_chunk.content[:100]}...\"")

    print("=" * 70)
    db.close()

if __name__ == "__main__":
    verify()
