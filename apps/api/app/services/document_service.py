import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional

from app.models.document import Document

# In-memory storage for Phase 1
_documents: Dict[str, Document] = {}


def create_document(
    title: str,
    doc_type: str,
    raw_input: str,
    metadata: Optional[dict] = None,
    generated_output: Optional[dict] = None,
    short_summary: str = "",
) -> Document:
    doc_id = str(uuid.uuid4())
    doc = Document(
        id=doc_id,
        title=title,
        doc_type=doc_type,
        raw_input=raw_input,
        metadata=metadata or {},
        generated_output=generated_output or {},
        short_summary=short_summary,
    )
    _documents[doc_id] = doc
    return doc


def get_document(doc_id: str) -> Optional[Document]:
    return _documents.get(doc_id)


def list_documents() -> List[Document]:
    return sorted(_documents.values(), key=lambda d: d.created_at, reverse=True)


def update_document(
    doc_id: str,
    title: Optional[str] = None,
    generated_output: Optional[dict] = None,
    short_summary: Optional[str] = None,
) -> Optional[Document]:
    doc = _documents.get(doc_id)
    if not doc:
        return None
    if title is not None:
        doc.title = title
    if generated_output is not None:
        doc.generated_output = generated_output
    if short_summary is not None:
        doc.short_summary = short_summary
    doc.updated_at = datetime.now(timezone.utc).isoformat()
    return doc
