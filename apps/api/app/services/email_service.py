"""이메일 발송 서비스 (SMTP)"""
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self, smtp_host: str, smtp_port: int, username: str, password: str, from_email: str):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.username = username
        self.password = password
        self.from_email = from_email

    def send_document(self, to_email: str, title: str, doc_type: str, email_body: str, action_items: list[dict] = []) -> bool:
        """Send formatted document via email"""
        type_labels = {"meeting_note": "회의록", "weekly_report": "주간보고", "daily_log": "업무일지"}
        type_label = type_labels.get(doc_type, doc_type)

        subject = f"[{type_label}] {title}"

        # Build HTML body
        ai_html = ""
        if action_items:
            ai_rows = ""
            for item in action_items:
                priority = {"high": "🔴 높음", "medium": "🟡 보통", "low": "⚪ 낮음"}.get(item.get("priority", ""), "")
                ai_rows += f"<tr><td style='padding:6px;border:1px solid #e5e7eb'>{item.get('task','')}</td><td style='padding:6px;border:1px solid #e5e7eb'>{item.get('owner','미정')}</td><td style='padding:6px;border:1px solid #e5e7eb'>{item.get('due_date','미정')}</td><td style='padding:6px;border:1px solid #e5e7eb'>{priority}</td></tr>"
            ai_html = f"""
            <h3 style='margin-top:20px'>✅ 액션아이템</h3>
            <table style='border-collapse:collapse;width:100%'>
            <tr style='background:#f9fafb'><th style='padding:6px;border:1px solid #e5e7eb;text-align:left'>업무</th><th style='padding:6px;border:1px solid #e5e7eb'>담당자</th><th style='padding:6px;border:1px solid #e5e7eb'>마감일</th><th style='padding:6px;border:1px solid #e5e7eb'>우선순위</th></tr>
            {ai_rows}
            </table>"""

        html = f"""
        <div style='font-family:-apple-system,sans-serif;max-width:640px;margin:0 auto;color:#1f2937'>
            <div style='padding:16px 0;border-bottom:2px solid #3b82f6'>
                <h2 style='margin:0;color:#1e40af'>{subject}</h2>
            </div>
            <div style='padding:20px 0;line-height:1.8;white-space:pre-wrap'>{email_body}</div>
            {ai_html}
            <div style='padding:16px 0;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px'>
                WorkFlow Note AI에서 자동 생성됨
            </div>
        </div>"""

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = self.from_email
        msg["To"] = to_email
        msg.attach(MIMEText(email_body, "plain"))
        msg.attach(MIMEText(html, "html"))

        try:
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.username, self.password)
                server.sendmail(self.from_email, to_email, msg.as_string())
            logger.info(f"이메일 발송 성공: {to_email}")
            return True
        except Exception as e:
            logger.error(f"이메일 발송 실패: {e}")
            return False
