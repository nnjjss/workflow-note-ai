from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass
class Document:
    id: str
    title: str
    doc_type: str
    raw_input: str
    metadata: dict = field(default_factory=dict)
    generated_output: dict = field(default_factory=dict)
    short_summary: str = ""
    created_at: str = ""
    updated_at: str = ""

    def __post_init__(self):
        now = datetime.now(timezone.utc).isoformat()
        if not self.created_at:
            self.created_at = now
        if not self.updated_at:
            self.updated_at = now
