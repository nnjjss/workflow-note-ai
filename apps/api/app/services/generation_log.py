"""Generation log service — tracks AI calls for prompt versioning"""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
import uuid


@dataclass
class GenerationLog:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    document_id: str = ""
    model_provider: str = "anthropic"
    model_name: str = "claude-sonnet-4-20250514"
    prompt_version: str = "v1.0"
    doc_type: str = ""
    mode: str = "generate"  # "generate" | "rewrite"
    status: str = "success"
    latency_ms: int = 0
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())


class GenerationLogService:
    def __init__(self):
        self._logs: list[GenerationLog] = []

    def log(self, **kwargs) -> GenerationLog:
        entry = GenerationLog(**kwargs)
        self._logs.append(entry)
        return entry

    def get_logs(
        self, document_id: Optional[str] = None, limit: int = 50
    ) -> list[GenerationLog]:
        logs = self._logs
        if document_id:
            logs = [l for l in logs if l.document_id == document_id]
        return sorted(logs, key=lambda l: l.created_at, reverse=True)[:limit]


generation_log_service = GenerationLogService()
