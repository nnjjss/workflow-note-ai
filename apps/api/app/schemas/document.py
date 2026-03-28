from typing import Optional

from pydantic import BaseModel


class DocumentCreate(BaseModel):
    title: str
    doc_type: str
    raw_input: str
    metadata: dict = {}
    generated_output: dict = {}
    short_summary: str = ""


class DocumentResponse(DocumentCreate):
    id: str
    created_at: str
    updated_at: str


class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    generated_output: Optional[dict] = None
    short_summary: Optional[str] = None


class DocumentListResponse(BaseModel):
    items: list[DocumentResponse]
    total: int
    page: int
    per_page: int
