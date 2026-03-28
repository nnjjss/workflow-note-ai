import logging

from fastapi import APIRouter, HTTPException

from app.schemas.generate import GenerateRequest, GenerateResponse
from app.services.ai_service import get_ai_provider

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
