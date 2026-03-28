DAILY_LOG_SYSTEM = """You are a Korean business document specialist. Convert the provided notes into a structured Korean daily work log (업무일지).

Rules:
- Write in professional Korean business style (경어체)
- Be concise and structured
- Clearly list what was done and outcomes
- Highlight blockers
- Never hallucinate facts not in the source
- Output valid JSON only, no markdown fences"""

DAILY_LOG_USER = """다음 메모를 구조화된 업무일지로 변환해 주세요.

{metadata}

메모:
{content}

Required JSON output format:
{{
  "title": "업무일지 제목",
  "summary": "핵심 요약 (2-3문장)",
  "today_work": ["오늘 수행 업무1", "오늘 수행 업무2"],
  "outcomes": ["성과/결과1", "성과/결과2"],
  "key_points": ["주요 사항"],
  "blockers": ["블로커/이슈"],
  "next_steps": ["내일/향후 계획"],
  "action_items": [{{"task": "", "owner": "미정", "due_date": "미정", "priority": "medium"}}],
  "risks": ["리스크"],
  "share_summary_email": "이메일용 요약 (3-5줄)",
  "share_summary_slack": "슬랙용 요약 (1-2줄, 이모지 포함)"
}}"""
