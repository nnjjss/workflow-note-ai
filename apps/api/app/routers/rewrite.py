import logging

from fastapi import APIRouter, HTTPException

from app.prompts.rewrite import REWRITE_PROMPTS
from app.schemas.generate import RewriteRequest, RewriteResponse
from app.services.ai_service import get_ai_provider

logger = logging.getLogger(__name__)

router = APIRouter()

VALID_MODES = list(REWRITE_PROMPTS.keys())


@router.post("/api/rewrite", response_model=RewriteResponse)
async def rewrite_section(req: RewriteRequest):
    if not req.content.strip():
        raise HTTPException(status_code=400, detail="content는 필수입니다.")

    if req.mode not in VALID_MODES:
        raise HTTPException(
            status_code=400,
            detail=f"지원하지 않는 모드입니다. 사용 가능: {', '.join(VALID_MODES)}",
        )

    try:
        provider = get_ai_provider()
        rewritten = provider.rewrite_section(req.content, req.mode)
    except KeyError:
        raise HTTPException(
            status_code=400,
            detail=f"지원하지 않는 모드입니다. 사용 가능: {', '.join(VALID_MODES)}",
        )
    except Exception as e:
        logger.exception("AI rewrite failed")
        raise HTTPException(status_code=500, detail=f"AI 리라이트 실패: {str(e)}")

    return RewriteResponse(rewritten=rewritten)
