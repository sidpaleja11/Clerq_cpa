"""
Clerq Python Microservice
Handles PDF extraction and document classification.
Deploy to Railway; set ANTHROPIC_API_KEY in environment.
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers.pdf import router as pdf_router

load_dotenv()

app = FastAPI(
    title="Clerq PDF Service",
    version="0.1.0",
    description="PDF extraction and document classification for Clerq",
)

# Only allow requests from the Next.js app
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://clerq.vercel.app",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

app.include_router(pdf_router, prefix="")


@app.get("/health")
def health():
    return {"status": "ok", "service": "clerq-pdf"}
