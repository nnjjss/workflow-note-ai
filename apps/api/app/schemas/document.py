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
    title: str | None = None
    generated_output: dict | None = None
    short_summary: str | None = None
