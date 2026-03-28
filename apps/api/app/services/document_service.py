import copy
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


def list_documents(
    doc_type: Optional[str] = None,
    q: Optional[str] = None,
    page: int = 1,
    per_page: int = 20,
) -> tuple[List[Document], int]:
    """List documents with optional filtering and pagination.

    Returns (items, total_count).
    """
    docs = list(_documents.values())

    # Filter by doc_type
    if doc_type:
        docs = [d for d in docs if d.doc_type == doc_type]

    # Filter by search query in title
    if q:
        q_lower = q.lower()
        docs = [d for d in docs if q_lower in d.title.lower()]

    # Sort by created_at descending
    docs.sort(key=lambda d: d.created_at, reverse=True)

    total = len(docs)

    # Paginate
    start = (page - 1) * per_page
    end = start + per_page
    items = docs[start:end]

    return items, total


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


def duplicate_document(doc_id: str) -> Optional[Document]:
    """Create a copy of an existing document with '(복사)' appended to title."""
    original = _documents.get(doc_id)
    if not original:
        return None

    new_id = str(uuid.uuid4())
    doc = Document(
        id=new_id,
        title=f"{original.title} (복사)",
        doc_type=original.doc_type,
        raw_input=original.raw_input,
        metadata=copy.deepcopy(original.metadata),
        generated_output=copy.deepcopy(original.generated_output),
        short_summary=original.short_summary,
    )
    _documents[new_id] = doc
    return doc


def delete_document(doc_id: str) -> bool:
    """Delete a document. Returns True if deleted."""
    if doc_id in _documents:
        del _documents[doc_id]
        return True
    return False
