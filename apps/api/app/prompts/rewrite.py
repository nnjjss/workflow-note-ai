REWRITE_PROMPTS = {
    "shorter": "주어진 텍스트를 핵심만 남기고 50% 이하로 줄여주세요. 원문의 의미와 톤을 유지하되, 불필요한 수식어와 반복을 제거하세요.",
    "formal": "주어진 텍스트를 공식 보고서 톤으로 다시 작성해주세요. 경어체를 사용하세요. 격식을 갖추되 읽기 쉽게 작성하세요.",
    "manager_tone": "상사에게 보고하는 톤으로 다시 작성해주세요. 핵심 결과와 판단 근거를 앞에 배치하세요. 간결하고 명확하게 작성하세요.",
    "team_tone": "실무자 간 공유하는 톤으로 다시 작성해주세요. 구체적인 작업 항목과 담당자를 명확히 하세요. 편하지만 정확한 톤을 유지하세요.",
}

REWRITE_SYSTEM = """You are a Korean business writing expert. Rewrite the given text according to the instruction.

Rules:
- Maintain the original meaning
- Write natural Korean, not translationese
- Output only the rewritten text, no explanations"""
