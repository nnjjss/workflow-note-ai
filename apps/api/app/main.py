from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import generate, rewrite, documents, health

app = FastAPI(title="WorkFlow Note AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(generate.router)
app.include_router(rewrite.router)
app.include_router(documents.router)
