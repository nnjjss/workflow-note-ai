import logging

from fastapi import APIRouter, HTTPException

from app.schemas.generate import RewriteRequest, RewriteResponse
from app.services.ai_service import get_ai_provider

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/api/rewrite", response_model=RewriteResponse)
async def rewrite_section(req: RewriteRequest):
    if not req.content.strip():
        raise HTTPException(status_code=400, detail="content는 필수입니다.")

    try:
        provider = get_ai_provider()
        rewritten = provider.rewrite_section(req.content, req.mode)
    except Exception as e:
        logger.exception("AI rewrite failed")
        raise HTTPException(status_code=500, detail=f"AI 리라이트 실패: {str(e)}")

    return RewriteResponse(rewritten=rewritten)
