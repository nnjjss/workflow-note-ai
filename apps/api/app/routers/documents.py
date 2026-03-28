from dataclasses import asdict
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.schemas.document import (
    DocumentCreate,
    DocumentListResponse,
    DocumentResponse,
    DocumentUpdate,
)
from app.services import document_service

router = APIRouter()


@router.post("/api/documents", response_model=DocumentResponse, status_code=201)
async def create_document(req: DocumentCreate):
    doc = document_service.create_document(
        title=req.title,
        doc_type=req.doc_type,
        raw_input=req.raw_input,
        metadata=req.metadata,
        generated_output=req.generated_output,
        short_summary=req.short_summary,
    )
    return DocumentResponse(**asdict(doc))


@router.get("/api/documents", response_model=DocumentListResponse)
async def list_documents(
    doc_type: Optional[str] = Query(None, description="문서 유형 필터"),
    q: Optional[str] = Query(None, description="제목 검색어"),
    page: int = Query(1, ge=1, description="페이지 번호"),
    per_page: int = Query(20, ge=1, le=100, description="페이지당 항목 수"),
):
    items, total = document_service.list_documents(
        doc_type=doc_type, q=q, page=page, per_page=per_page
    )
    return DocumentListResponse(
        items=[DocumentResponse(**asdict(d)) for d in items],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/api/documents/{doc_id}", response_model=DocumentResponse)
async def get_document(doc_id: str):
    doc = document_service.get_document(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다.")
    return DocumentResponse(**asdict(doc))


@router.put("/api/documents/{doc_id}", response_model=DocumentResponse)
async def update_document(doc_id: str, req: DocumentUpdate):
    doc = document_service.update_document(
        doc_id=doc_id,
        title=req.title,
        generated_output=req.generated_output,
        short_summary=req.short_summary,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다.")
    return DocumentResponse(**asdict(doc))


@router.post("/api/documents/{doc_id}/duplicate", response_model=DocumentResponse, status_code=201)
async def duplicate_document(doc_id: str):
    doc = document_service.duplicate_document(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다.")
    return DocumentResponse(**asdict(doc))


@router.delete("/api/documents/{doc_id}", status_code=204)
async def delete_document(doc_id: str):
    deleted = document_service.delete_document(doc_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다.")
    return None
