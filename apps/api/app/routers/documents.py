from dataclasses import asdict

from fastapi import APIRouter, HTTPException

from app.schemas.document import DocumentCreate, DocumentResponse, DocumentUpdate
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


@router.get("/api/documents", response_model=list[DocumentResponse])
async def list_documents():
    docs = document_service.list_documents()
    return [DocumentResponse(**asdict(d)) for d in docs]


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
