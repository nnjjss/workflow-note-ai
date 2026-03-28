"""Slack Webhook 발송 서비스"""
import httpx
import logging

logger = logging.getLogger(__name__)

class SlackService:
    def __init__(self, webhook_url: str):
        self.webhook_url = webhook_url

    async def send_document_summary(self, title: str, doc_type: str, summary: str, action_items: list[dict], slack_text: str = "") -> bool:
        """Generate Slack-formatted message and send via webhook"""
        # Build blocks
        type_labels = {"meeting_note": "회의록", "weekly_report": "주간보고", "daily_log": "업무일지"}
        type_label = type_labels.get(doc_type, doc_type)

        # Action items text
        ai_text = ""
        if action_items:
            ai_lines = []
            for item in action_items[:5]:  # max 5
                priority_emoji = {"high": "🔴", "medium": "🟡", "low": "⚪"}.get(item.get("priority", ""), "⚪")
                ai_lines.append(f"{priority_emoji} {item.get('task', '')} ({item.get('owner', '미정')} · {item.get('due_date', '미정')})")
            ai_text = "\n".join(ai_lines)

        blocks = [
            {"type": "header", "text": {"type": "plain_text", "text": f"📋 {type_label}: {title}"}},
            {"type": "section", "text": {"type": "mrkdwn", "text": slack_text or summary}},
        ]

        if ai_text:
            blocks.append({"type": "section", "text": {"type": "mrkdwn", "text": f"*✅ 액션아이템*\n{ai_text}"}})

        blocks.append({"type": "context", "elements": [{"type": "mrkdwn", "text": "_WorkFlow Note AI에서 자동 생성됨_"}]})

        payload = {"blocks": blocks, "text": f"{type_label}: {title}"}

        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.post(self.webhook_url, json=payload)
                if resp.status_code == 200:
                    logger.info(f"Slack 발송 성공: {title}")
                    return True
                else:
                    logger.warning(f"Slack 발송 실패: {resp.status_code} {resp.text}")
                    return False
        except Exception as e:
            logger.error(f"Slack 발송 에러: {e}")
            return False
