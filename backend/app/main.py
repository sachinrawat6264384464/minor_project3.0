from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import SessionLocal
from app.db.init_db import init_db
from app.api.routes import auth, projects, papers, chat, compare, gaps, trends, graph, reports, novelty

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database on Application Startup
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()

# Health Check
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

# Register API Router Endpoints
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["Projects"])
app.include_router(papers.router, prefix=f"{settings.API_V1_STR}/papers", tags=["Papers"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["Research Chat"])
app.include_router(compare.router, prefix=f"{settings.API_V1_STR}/compare", tags=["Paper Comparison"])
app.include_router(gaps.router, prefix=f"{settings.API_V1_STR}/research-gaps", tags=["Research Gap Engine"])
app.include_router(trends.router, prefix=f"{settings.API_V1_STR}/trends", tags=["Analytics & Trends"])
app.include_router(graph.router, prefix=f"{settings.API_V1_STR}/graph", tags=["Knowledge Graph"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["Reports"])
app.include_router(novelty.router, prefix=f"{settings.API_V1_STR}/novelty", tags=["Novelty Checker"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
