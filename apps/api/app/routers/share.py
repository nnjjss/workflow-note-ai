"""공유 발송 API"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.config import get_settings

router = APIRouter(prefix="/api/share", tags=["Share"])

class SlackShareRequest(BaseModel):
    webhook_url: str
    title: str
    doc_type: str
    summary: str
    slack_text: str = ""
    action_items: list[dict] = []

class EmailShareRequest(BaseModel):
    to_email: str
    title: str
    doc_type: str
    email_body: str
    action_items: list[dict] = []

class KakaoShareRequest(BaseModel):
    receiver_phone: str
    template_id: str
    title: str
    doc_type: str
    summary: str

class ShareResponse(BaseModel):
    success: bool
    message: str

@router.post("/slack", response_model=ShareResponse)
async def share_to_slack(request: SlackShareRequest):
    from app.services.slack_service import SlackService
    service = SlackService(request.webhook_url)
    success = await service.send_document_summary(
        title=request.title,
        doc_type=request.doc_type,
        summary=request.summary,
        action_items=request.action_items,
        slack_text=request.slack_text,
    )
    if success:
        return ShareResponse(success=True, message="슬랙 발송 완료")
    raise HTTPException(500, "슬랙 발송에 실패했습니다")

@router.post("/email", response_model=ShareResponse)
async def share_to_email(request: EmailShareRequest):
    settings = get_settings()
    if not settings.SMTP_HOST:
        raise HTTPException(400, "이메일 설정이 되어있지 않습니다. SMTP 환경변수를 확인해주세요.")

    from app.services.email_service import EmailService
    service = EmailService(
        smtp_host=settings.SMTP_HOST,
        smtp_port=settings.SMTP_PORT,
        username=settings.SMTP_USERNAME,
        password=settings.SMTP_PASSWORD,
        from_email=settings.SMTP_FROM_EMAIL,
    )
    success = service.send_document(
        to_email=request.to_email,
        title=request.title,
        doc_type=request.doc_type,
        email_body=request.email_body,
        action_items=request.action_items,
    )
    if success:
        return ShareResponse(success=True, message="이메일 발송 완료")
    raise HTTPException(500, "이메일 발송에 실패했습니다")

@router.post("/kakao", response_model=ShareResponse)
async def share_to_kakao(request: KakaoShareRequest):
    settings = get_settings()
    if not settings.SOLAPI_API_KEY:
        raise HTTPException(400, "카카오 알림톡 설정이 되어있지 않습니다. Solapi 환경변수를 확인해주세요.")

    from app.services.kakao_service import KakaoAlimtalkService
    service = KakaoAlimtalkService(
        api_key=settings.SOLAPI_API_KEY,
        api_secret=settings.SOLAPI_API_SECRET,
        pf_id=settings.KAKAO_PF_ID,
        sender_number=settings.KAKAO_SENDER_NUMBER,
    )
    result = await service.send_document_notification(
        receiver_phone=request.receiver_phone,
        template_id=request.template_id,
        title=request.title,
        doc_type=request.doc_type,
        summary=request.summary,
    )
    if "error" not in result:
        return ShareResponse(success=True, message="카카오 알림톡 발송 완료")
    raise HTTPException(500, f"알림톡 발송 실패: {result.get('error', '')}")
