import json
import logging
import re
import time
from abc import ABC, abstractmethod

import anthropic

from app.config import settings
from app.prompts.meeting_note import MEETING_NOTE_SYSTEM, MEETING_NOTE_USER
from app.prompts.weekly_report import WEEKLY_REPORT_SYSTEM, WEEKLY_REPORT_USER
from app.prompts.daily_log import DAILY_LOG_SYSTEM, DAILY_LOG_USER
from app.prompts.rewrite import REWRITE_PROMPTS, REWRITE_SYSTEM
from app.services.generation_log import generation_log_service

logger = logging.getLogger(__name__)

MODEL = "claude-sonnet-4-20250514"

PROMPT_MAP = {
    "meeting_note": (MEETING_NOTE_SYSTEM, MEETING_NOTE_USER),
    "weekly_report": (WEEKLY_REPORT_SYSTEM, WEEKLY_REPORT_USER),
    "daily_log": (DAILY_LOG_SYSTEM, DAILY_LOG_USER),
}


def _build_metadata(req_metadata: dict) -> str:
    parts = []
    if req_metadata.get("title"):
        parts.append(f"제목: {req_metadata['title']}")
    if req_metadata.get("team_name"):
        parts.append(f"팀: {req_metadata['team_name']}")
    if req_metadata.get("project_name"):
        parts.append(f"프로젝트: {req_metadata['project_name']}")
    if req_metadata.get("attendees"):
        parts.append(f"참석자: {', '.join(req_metadata['attendees'])}")
    if req_metadata.get("date"):
        parts.append(f"날짜: {req_metadata['date']}")
    return "\n".join(parts) if parts else "메타데이터 없음"


def _parse_json_response(text: str) -> dict:
    """Parse JSON from AI response with self-healing for malformed output."""
    # Try direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try extracting JSON from markdown code block
    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    # Try finding first { ... } block
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass

    # Last resort: return raw text as summary
    logger.warning("Failed to parse AI JSON response, returning raw text as summary")
    return {"title": "문서", "summary": text}


class AIProvider(ABC):
    @abstractmethod
    def generate_document(self, doc_type: str, content: str, metadata: dict) -> dict:
        ...

    @abstractmethod
    def rewrite_section(self, content: str, mode: str) -> str:
        ...


class AnthropicProvider(AIProvider):
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    def generate_document_stream(self, doc_type: str, content: str, metadata: dict):
        """Stream document generation section by section via SSE."""
        system_prompt, user_template = PROMPT_MAP.get(doc_type, PROMPT_MAP["meeting_note"])
        meta_str = _build_metadata(metadata)
        user_prompt = user_template.format(metadata=meta_str, content=content)

        with self.client.messages.stream(
            model=MODEL,
            max_tokens=4096,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        ) as stream:
            for text in stream.text_stream:
                yield text

    def generate_document(self, doc_type: str, content: str, metadata: dict) -> dict:
        system_prompt, user_template = PROMPT_MAP[doc_type]
        meta_str = _build_metadata(metadata)
        user_prompt = user_template.format(metadata=meta_str, content=content)

        start = time.time()
        response = self.client.messages.create(
            model=MODEL,
            max_tokens=4096,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        elapsed = time.time() - start
        logger.info(f"AI generation took {elapsed:.2f}s for doc_type={doc_type}")

        raw_text = response.content[0].text
        result = _parse_json_response(raw_text)
        result["doc_type"] = doc_type

        generation_log_service.log(
            model_provider="anthropic",
            model_name=MODEL,
            prompt_version="v1.0",
            doc_type=doc_type,
            mode="generate",
            status="success",
            latency_ms=int(elapsed * 1000),
        )

        return result

    def rewrite_section(self, content: str, mode: str) -> str:
        instruction = REWRITE_PROMPTS[mode]
        user_prompt = f"{instruction}\n\n원문:\n{content}"

        start = time.time()
        response = self.client.messages.create(
            model=MODEL,
            max_tokens=4096,
            system=REWRITE_SYSTEM,
            messages=[{"role": "user", "content": user_prompt}],
        )
        elapsed = time.time() - start
        logger.info(f"AI rewrite took {elapsed:.2f}s for mode={mode}")

        generation_log_service.log(
            model_provider="anthropic",
            model_name=MODEL,
            prompt_version="v1.0",
            doc_type="rewrite",
            mode=f"rewrite:{mode}",
            status="success",
            latency_ms=int(elapsed * 1000),
        )

        return response.content[0].text


def get_ai_provider() -> AIProvider:
    return AnthropicProvider()
