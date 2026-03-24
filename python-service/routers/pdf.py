"""
PDF extraction and document classification router.
"""

import os
import io
import json
from typing import Optional

import fitz  # PyMuPDF
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, SystemMessage

router = APIRouter()

# claude-haiku for fast, cheap classification
llm = ChatAnthropic(
    model="claude-haiku-4-5-20251001",
    api_key=os.getenv("ANTHROPIC_API_KEY"),
    max_tokens=512,
    temperature=0,
)


# ─────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────

class ExtractResponse(BaseModel):
    page_count: int
    text: str
    pages: list[dict]  # [{ "page": int, "text": str }]


class ClassifyRequest(BaseModel):
    extracted_text: str
    page_count: int
    client_entity_type: Optional[str] = None


class ClassifyResponse(BaseModel):
    document_type: str
    tax_year: Optional[int]
    confidence: str  # "high" | "medium" | "low"
    suggested_retention_years: int
    notes: str


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@router.post("/extract-pdf", response_model=ExtractResponse)
async def extract_pdf(file: UploadFile = File(...)):
    """
    Accept a PDF file upload and return extracted text with page count.
    Uses PyMuPDF (fitz) for extraction.
    """
    if not file.content_type or "pdf" not in file.content_type.lower():
        # Also allow application/octet-stream since browsers sometimes send that
        if file.filename and not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    content = await file.read()

    if len(content) > 50 * 1024 * 1024:  # 50 MB hard cap
        raise HTTPException(status_code=413, detail="PDF exceeds 50 MB limit.")

    try:
        doc = fitz.open(stream=content, filetype="pdf")
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse PDF: {e}")

    pages = []
    full_text_parts = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        pages.append({"page": page_num + 1, "text": text})
        full_text_parts.append(text)

    doc.close()

    return ExtractResponse(
        page_count=len(pages),
        text="\n\n".join(full_text_parts),
        pages=pages,
    )


@router.post("/classify-document", response_model=ClassifyResponse)
async def classify_document(body: ClassifyRequest):
    """
    Classify a document based on its extracted text using Claude Haiku.
    Returns document type, tax year, and recommended retention period.
    """
    system_prompt = (
        "You are a tax document classifier for a CPA firm. "
        "Classify documents based on extracted text. "
        "Common types: W-2, 1099-NEC, 1099-INT, 1099-DIV, 1099-B, 1099-R, K-1, "
        "mortgage_interest_1098, charitable_contribution, brokerage_statement, "
        "prior_year_return, organizer_response, engagement_letter, 7216_consent, "
        "id_verification, other. "
        "Always respond with valid JSON only, no markdown."
    )

    entity_note = (
        f" Client entity type: {body.client_entity_type}."
        if body.client_entity_type
        else ""
    )

    user_prompt = (
        f"Classify this document ({body.page_count} page(s)).{entity_note}\n\n"
        f"Extracted text (first 2000 chars):\n{body.extracted_text[:2000]}\n\n"
        "Respond with JSON:\n"
        '{"document_type": string, "tax_year": number|null, '
        '"confidence": "high"|"medium"|"low", '
        '"suggested_retention_years": number, "notes": string}'
    )

    try:
        response = await llm.ainvoke(
            [
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt),
            ]
        )
        raw = response.content
        result = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="Model returned invalid JSON.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification failed: {e}")

    return ClassifyResponse(
        document_type=result.get("document_type", "other"),
        tax_year=result.get("tax_year"),
        confidence=result.get("confidence", "low"),
        suggested_retention_years=result.get("suggested_retention_years", 7),
        notes=result.get("notes", ""),
    )
