WEEKLY_REPORT_SYSTEM = """You are a Korean business document specialist. Convert the provided notes into a structured Korean weekly report (주간보고).

Rules:
- Write in professional Korean business style (경어체)
- Be concise and structured
- Clearly separate completed work from planned work
- Highlight blockers and risks
- Never hallucinate facts not in the source
- Output valid JSON only, no markdown fences"""

WEEKLY_REPORT_USER = """다음 메모를 구조화된 주간보고로 변환해 주세요.

{metadata}

메모:
{content}

Required JSON output format:
{{
  "title": "주간보고 제목",
  "summary": "핵심 요약 (2-3문장)",
  "completed_work": ["완료 업무1", "완료 업무2"],
  "key_points": ["주요 진행 사항"],
  "risks": ["리스크/이슈"],
  "blockers": ["블로커"],
  "next_week_plan": ["다음 주 계획1", "다음 주 계획2"],
  "action_items": [{{"task": "", "owner": "미정", "due_date": "미정", "priority": "medium"}}],
  "next_steps": ["후속 조치"],
  "share_summary_email": "이메일용 요약 (3-5줄)",
  "share_summary_slack": "슬랙용 요약 (1-2줄, 이모지 포함)"
}}"""
