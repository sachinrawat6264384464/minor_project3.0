import pytest
import time
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.models.project import Project
from app.models.chunk import DocumentChunk
from app.rag.orchestrator import rag_orchestrator
from app.rag.citation_builder import citation_builder

def test_database_connection():
    db = SessionLocal()
    try:
        project = db.query(Project).first()
        assert project is not None, "At least one project should exist in database"
        chunk_count = db.query(DocumentChunk).filter(DocumentChunk.project_id == project.id).count()
        print(f"\n[Test] Project ID: {project.id}, Chunks: {chunk_count}")
        assert chunk_count > 0, "Project should contain indexed document chunks"
    finally:
        db.close()

def test_dense_retrieval_execution():
    db = SessionLocal()
    try:
        project = db.query(Project).first()
        t0 = time.time()
        results = rag_orchestrator.retrieve_context(
            db=db,
            project_id=project.id,
            query="machine learning algorithm and self-improving systems",
            strategy="dense",
            top_k=5
        )
        latency = (time.time() - t0) * 1000
        print(f"\n[Test] Dense Retrieval Latency: {latency:.2f}ms, Results: {len(results)}")
        assert len(results) > 0
        assert "dense_score" in results[0]
        assert results[0]["dense_score"] > 0.0
        assert "paper" in results[0]
        assert "id" in results[0]
    finally:
        db.close()

def test_sparse_retrieval_execution():
    db = SessionLocal()
    try:
        project = db.query(Project).first()
        t0 = time.time()
        results = rag_orchestrator.retrieve_context(
            db=db,
            project_id=project.id,
            query="machine learning literature",
            strategy="sparse",
            top_k=5
        )
        latency = (time.time() - t0) * 1000
        print(f"\n[Test] Sparse Retrieval Latency: {latency:.2f}ms, Results: {len(results)}")
        assert len(results) > 0
        assert "paper" in results[0]
    finally:
        db.close()

def test_hybrid_rrf_fusion():
    db = SessionLocal()
    try:
        project = db.query(Project).first()
        t0 = time.time()
        results = rag_orchestrator.retrieve_context(
            db=db,
            project_id=project.id,
            query="self modifying algorithms and machine intelligence metric",
            strategy="hybrid",
            top_k=5
        )
        latency = (time.time() - t0) * 1000
        print(f"\n[Test] Hybrid RRF Latency: {latency:.2f}ms, Results: {len(results)}")
        assert len(results) > 0
        assert "rrf_score" in results[0]
        assert results[0]["rrf_score"] > 0.0

        # Verify citation builder integration
        citations = citation_builder.build_citations(results)
        print(f"[Test] Generated Citations: {len(citations)}")
        assert len(citations) > 0
        for cite in citations:
            assert "title" in cite
            assert "page_number" in cite
            assert "excerpt" in cite
    finally:
        db.close()

def test_project_isolation():
    db = SessionLocal()
    try:
        fake_project_id = "00000000-0000-0000-0000-000000000000"
        results = rag_orchestrator.retrieve_context(
            db=db,
            project_id=fake_project_id,
            query="machine learning",
            strategy="hybrid",
            top_k=5
        )
        print(f"\n[Test] Fake project isolation check: {len(results)} matches (expected 0)")
        assert len(results) == 0, "Querying non-existent project should return zero chunks"
    finally:
        db.close()

if __name__ == "__main__":
    test_database_connection()
    test_dense_retrieval_execution()
    test_sparse_retrieval_execution()
    test_hybrid_rrf_fusion()
    test_project_isolation()
    print("\n[SUCCESS] All Phase 1 & Phase 2 retrieval verification tests PASSED!")
