import json
import logging

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.schemas.generate import GenerateRequest, GenerateResponse
from app.services.ai_service import get_ai_provider, _parse_json_response

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/api/generate", response_model=GenerateResponse)
async def generate_document(req: GenerateRequest):
    if not req.content.strip():
        raise HTTPException(status_code=400, detail="content는 필수입니다.")

    metadata = {
        "title": req.title,
        "team_name": req.team_name,
        "project_name": req.project_name,
        "attendees": req.attendees,
        "date": req.date,
    }

    try:
        provider = get_ai_provider()
        result = provider.generate_document(req.doc_type, req.content, metadata)
    except Exception as e:
        logger.exception("AI generation failed")
        raise HTTPException(status_code=500, detail=f"AI 생성 실패: {str(e)}")

    return GenerateResponse(**result)


@router.post("/api/generate/stream")
async def generate_stream(req: GenerateRequest):
    """Stream document generation via SSE."""
    if not req.content.strip():
        raise HTTPException(status_code=400, detail="content는 필수입니다.")

    metadata = {
        "title": req.title,
        "team_name": req.team_name,
        "project_name": req.project_name,
        "attendees": req.attendees,
        "date": req.date,
    }

    provider = get_ai_provider()

    async def event_generator():
        full_text = ""
        try:
            for chunk in provider.generate_document_stream(
                doc_type=req.doc_type,
                content=req.content,
                metadata=metadata,
            ):
                full_text += chunk
                yield f"data: {json.dumps({'type': 'chunk', 'text': chunk}, ensure_ascii=False)}\n\n"

            # Parse complete response and send final structured result
            try:
                parsed = _parse_json_response(full_text)
                parsed["doc_type"] = req.doc_type
                yield f"data: {json.dumps({'type': 'complete', 'result': parsed}, ensure_ascii=False)}\n\n"
            except Exception:
                yield f"data: {json.dumps({'type': 'complete', 'result': {'summary': full_text, 'title': req.title or '문서', 'doc_type': req.doc_type}}, ensure_ascii=False)}\n\n"
        except Exception as e:
            logger.exception("AI streaming generation failed")
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)}, ensure_ascii=False)}\n\n"

        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )
