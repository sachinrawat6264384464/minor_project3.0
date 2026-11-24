import logging
from sqlalchemy import text
from app.db.session import engine
from app.core.config import settings

logger = logging.getLogger("researchgap.migration")

def run_migration() -> dict:
    """
    Applies pgvector and PostgreSQL Full-Text Search (FTS) migration:
    1. Ensures extension 'vector' is created.
    2. Adds 'embedding_vec vector(384)' column if missing.
    3. Backfills 'embedding_vec' from existing JSON 'embedding' data.
    4. Creates HNSW cosine similarity index (m=16, ef_construction=64).
    5. Adds 'tsv_content tsvector' column and populates it.
    6. Creates automatic synchronization trigger on 'document_chunks.content'.
    7. Creates GIN index for high-speed lexical search.
    """
    if settings.DATABASE_URL.startswith("sqlite"):
        return {
            "status": "skipped",
            "dialect": "sqlite",
            "message": "SQLite in use. Native pgvector & GIN indexes skipped. Using JSON + BM25 fallback."
        }

    stats = {
        "status": "success",
        "dialect": "postgresql",
        "extension": None,
        "embedding_vec_column": False,
        "backfilled_chunks": 0,
        "hnsw_index": False,
        "tsv_column": False,
        "gin_index": False,
        "trigger": False
    }

    with engine.connect() as conn:
        trans = conn.begin()
        try:
            # 1. Enable pgvector
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
            stats["extension"] = "vector enabled"

            # 2. Add embedding_vec vector(384)
            conn.execute(text("ALTER TABLE document_chunks ADD COLUMN IF NOT EXISTS embedding_vec vector(384);"))
            stats["embedding_vec_column"] = True

            # 3. Backfill embedding_vec from JSON embedding column
            # In pgvector, casting string '[v1, v2, ...]'::vector is 100% compliant and reliable
            backfill_sql = text("""
                UPDATE document_chunks
                SET embedding_vec = (
                    SELECT ('[' || string_agg(elem::text, ',') || ']')::vector
                    FROM json_array_elements_text(embedding) as elem
                )
                WHERE embedding IS NOT NULL 
                  AND (embedding_vec IS NULL);
            """)
            result = conn.execute(backfill_sql)
            stats["backfilled_chunks"] = result.rowcount

            # 4. HNSW Index for Cosine Distance
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding_hnsw
                ON document_chunks USING hnsw (embedding_vec vector_cosine_ops)
                WITH (m = 16, ef_construction = 64);
            """))
            stats["hnsw_index"] = True

            # 5. Full Text Search tsvector column
            conn.execute(text("ALTER TABLE document_chunks ADD COLUMN IF NOT EXISTS tsv_content tsvector;"))
            stats["tsv_column"] = True

            # Backfill tsv_content
            conn.execute(text("""
                UPDATE document_chunks
                SET tsv_content = to_tsvector('english', coalesce(content, ''))
                WHERE tsv_content IS NULL;
            """))

            # 6. Automatic trigger for ongoing FTS updates
            conn.execute(text("""
                CREATE OR REPLACE FUNCTION document_chunks_tsv_trigger() RETURNS trigger AS $$
                BEGIN
                    new.tsv_content := to_tsvector('english', coalesce(new.content, ''));
                    RETURN new;
                END
                $$ LANGUAGE plpgsql;
            """))

            conn.execute(text("""
                DROP TRIGGER IF EXISTS trg_document_chunks_tsv ON document_chunks;
                CREATE TRIGGER trg_document_chunks_tsv 
                BEFORE INSERT OR UPDATE OF content ON document_chunks
                FOR EACH ROW EXECUTE FUNCTION document_chunks_tsv_trigger();
            """))
            stats["trigger"] = True

            # 7. GIN Index for FTS
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_document_chunks_tsv
                ON document_chunks USING gin (tsv_content);
            """))
            stats["gin_index"] = True

            trans.commit()
            logger.info("Successfully executed Vector & FTS migration: %s", stats)
            return stats

        except Exception as e:
            trans.rollback()
            logger.error("Migration failed: %s", e)
            stats["status"] = "error"
            stats["error"] = str(e)
            raise e

def rollback_migration() -> dict:
    """Safely drops HNSW index, GIN index, triggers, and migrated columns."""
    if settings.DATABASE_URL.startswith("sqlite"):
        return {"status": "skipped", "dialect": "sqlite"}

    with engine.connect() as conn:
        trans = conn.begin()
        try:
            conn.execute(text("DROP INDEX IF EXISTS idx_document_chunks_embedding_hnsw;"))
            conn.execute(text("DROP INDEX IF EXISTS idx_document_chunks_tsv;"))
            conn.execute(text("DROP TRIGGER IF EXISTS trg_document_chunks_tsv ON document_chunks;"))
            conn.execute(text("DROP FUNCTION IF EXISTS document_chunks_tsv_trigger;"))
            conn.execute(text("ALTER TABLE document_chunks DROP COLUMN IF EXISTS embedding_vec;"))
            conn.execute(text("ALTER TABLE document_chunks DROP COLUMN IF EXISTS tsv_content;"))
            trans.commit()
            return {"status": "rolled_back"}
        except Exception as e:
            trans.rollback()
            raise e

if __name__ == "__main__":
    res = run_migration()
    print("Migration result:", res)
