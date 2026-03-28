"""카카오 알림톡 발송 서비스 (솔라피 API 기반)"""
import hmac
import hashlib
import time
import httpx
import logging

logger = logging.getLogger(__name__)

class KakaoAlimtalkService:
    """
    솔라피(Solapi) API를 통한 카카오 알림톡 발송.
    직접 카카오와 계약 없이 딜러사 API로 즉시 사용 가능.

    Setup:
    1. solapi.com 가입
    2. API Key + Secret 발급
    3. 카카오 채널 연동 + 템플릿 승인
    """

    BASE_URL = "https://api.solapi.com/messages/v4/send-many"

    def __init__(self, api_key: str, api_secret: str, pf_id: str, sender_number: str):
        self.api_key = api_key
        self.api_secret = api_secret
        self.pf_id = pf_id  # 카카오 플러스친구 ID
        self.sender_number = sender_number

    def _generate_auth_header(self) -> dict:
        """HMAC-SHA256 인증 헤더 생성"""
        timestamp = str(int(time.time() * 1000))
        salt = hashlib.md5(timestamp.encode()).hexdigest()[:16]
        signature = hmac.new(self.api_secret.encode(), f"{timestamp}{salt}".encode(), hashlib.sha256).hexdigest()
        return {
            "Authorization": f"HMAC-SHA256 apiKey={self.api_key}, date={timestamp}, salt={salt}, signature={signature}"
        }

    async def send_alimtalk(
        self,
        receiver_phone: str,
        template_id: str,
        variables: dict[str, str],
        fallback_sms: bool = True,
    ) -> dict:
        """
        알림톡 발송. 실패 시 SMS 자동 전환 (fallback_sms=True).

        Args:
            receiver_phone: 수신자 번호 (01012345678)
            template_id: 카카오 승인 템플릿 코드
            variables: 템플릿 변수 매핑 ({"#{name}": "홍길동"})
            fallback_sms: 알림톡 실패 시 SMS 전환 여부
        """
        headers = self._generate_auth_header()

        message = {
            "to": receiver_phone,
            "from": self.sender_number,
            "kakaoOptions": {
                "pfId": self.pf_id,
                "templateId": template_id,
                "variables": variables,
            }
        }

        if fallback_sms:
            # 알림톡 실패 시 SMS 자동 전환
            message["type"] = "ATA"  # Alimtalk
            message["kakaoOptions"]["disableSms"] = False

        payload = {"messages": [message]}

        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(self.BASE_URL, headers=headers, json=payload)
                result = resp.json()

                if resp.status_code == 200:
                    logger.info(f"알림톡 발송 성공: {receiver_phone}")
                else:
                    logger.warning(f"알림톡 발송 실패: {resp.status_code} {result}")

                return result
        except Exception as e:
            logger.error(f"알림톡 발송 에러: {e}")
            return {"error": str(e)}

    async def send_document_notification(
        self,
        receiver_phone: str,
        template_id: str,
        title: str,
        doc_type: str,
        summary: str,
    ) -> dict:
        """문서 생성 완료 알림톡 발송"""
        type_labels = {"meeting_note": "회의록", "weekly_report": "주간보고", "daily_log": "업무일지"}
        variables = {
            "#{title}": title,
            "#{type}": type_labels.get(doc_type, doc_type),
            "#{summary}": summary[:100],  # 카카오 변수 길이 제한
        }
        return await self.send_alimtalk(receiver_phone, template_id, variables)
