REWRITE_PROMPTS = {
    "shorter": "주어진 텍스트를 핵심만 남기고 50% 이하로 줄여주세요. 원문의 의미와 톤을 유지하되, 불필요한 수식어와 반복을 제거하세요.",
    "formal": "주어진 텍스트를 공식 보고서 톤으로 다시 작성해주세요. 경어체 사용, 문장 끝 '~합니다/~되었습니다' 통일. 격식을 갖추되 읽기 쉽게 작성하세요.",
    "manager_tone": "상사에게 보고하는 톤으로 다시 작성해주세요. 핵심 결과를 첫 문장에, 근거를 뒤에 배치. 수치와 비교 기준 포함. 간결하고 명확하게 작성하세요.",
    "team_tone": "실무자 간 공유하는 톤으로 다시 작성해주세요. 구체적 작업 항목과 담당자를 명확히. 일정 언급 시 구체적 날짜 포함. 편하지만 정확한 톤을 유지하세요.",
    "regenerate": "당신은 한국 비즈니스 문서 전문가입니다. 다음 섹션의 내용을 더 정확하고 구체적으로 다시 작성해주세요. 원래 내용의 핵심은 유지하되, 표현을 개선하고 빠진 부분을 보완하세요. 한국 비즈니스 문서 작성 규범을 따르세요.",
}

REWRITE_SYSTEM = """You are a Korean business writing expert. Rewrite the given text according to the instruction.

Rules:
- Maintain the original meaning
- Write natural Korean, not translationese
- Output only the rewritten text, no explanations"""
