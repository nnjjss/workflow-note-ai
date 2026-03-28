"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GenerateResponse } from "@/lib/types"

interface SharePanelProps {
  result: GenerateResponse
}

function formatFull(result: GenerateResponse): string {
  const lines: string[] = []
  lines.push(`# ${result.title}`)
  lines.push("")
  lines.push(`## 핵심 요약`)
  lines.push(result.summary)
  lines.push("")

  if (result.key_points.length > 0) {
    lines.push(`## 주요 포인트`)
    result.key_points.forEach((p) => lines.push(`- ${p}`))
    lines.push("")
  }

  if (result.decisions.length > 0) {
    lines.push(`## 결정사항`)
    result.decisions.forEach((d) => lines.push(`- ${d}`))
    lines.push("")
  }

  if (result.action_items.length > 0) {
    lines.push(`## 액션아이템`)
    result.action_items.forEach((a) => {
      lines.push(`- [${a.priority}] ${a.task} (담당: ${a.assignee || "-"}, 마감: ${a.due_date || "-"})`)
    })
    lines.push("")
  }

  if (result.risks && result.risks.length > 0) {
    lines.push(`## 리스크/이슈`)
    result.risks.forEach((r) => lines.push(`- ${r}`))
    lines.push("")
  }

  if (result.next_steps && result.next_steps.length > 0) {
    lines.push(`## 다음 단계`)
    result.next_steps.forEach((s) => lines.push(`- ${s}`))
    lines.push("")
  }

  // Type-specific sections
  if (result.agenda && result.agenda.length > 0) {
    lines.push(`## 안건`)
    result.agenda.forEach((a) => lines.push(`- ${a}`))
    lines.push("")
  }
  if (result.discussion && result.discussion.length > 0) {
    lines.push(`## 논의사항`)
    result.discussion.forEach((d) => lines.push(`- ${d}`))
    lines.push("")
  }
  if (result.completed_work && result.completed_work.length > 0) {
    lines.push(`## 금주 완료`)
    result.completed_work.forEach((c) => lines.push(`- ${c}`))
    lines.push("")
  }
  if (result.next_week_plan && result.next_week_plan.length > 0) {
    lines.push(`## 차주 계획`)
    result.next_week_plan.forEach((n) => lines.push(`- ${n}`))
    lines.push("")
  }
  if (result.today_work && result.today_work.length > 0) {
    lines.push(`## 오늘 업무`)
    result.today_work.forEach((t) => lines.push(`- ${t}`))
    lines.push("")
  }
  if (result.outcomes && result.outcomes.length > 0) {
    lines.push(`## 성과`)
    result.outcomes.forEach((o) => lines.push(`- ${o}`))
    lines.push("")
  }
  if (result.blockers && result.blockers.length > 0) {
    lines.push(`## 장애요소`)
    result.blockers.forEach((b) => lines.push(`- ${b}`))
    lines.push("")
  }

  return lines.join("\n")
}

function formatSlack(result: GenerateResponse): string {
  const lines: string[] = []
  lines.push(`*${result.title}*`)
  lines.push("")
  lines.push(`> ${result.summary}`)
  lines.push("")

  if (result.key_points.length > 0) {
    lines.push(`*주요 포인트*`)
    result.key_points.forEach((p) => lines.push(`• ${p}`))
    lines.push("")
  }

  if (result.action_items.length > 0) {
    lines.push(`*액션아이템*`)
    result.action_items.forEach((a) => {
      lines.push(`• ${a.task} → ${a.assignee || "미지정"} (${a.due_date || "미정"})`)
    })
  }

  return lines.join("\n")
}

export default function SharePanel({ result }: SharePanelProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement("textarea")
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => copyToClipboard(formatFull(result), "full")}
        className="border-zinc-200 text-zinc-600"
      >
        {copied === "full" ? "복사됨!" : "전체 복사"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => copyToClipboard(formatFull(result), "email")}
        className="border-zinc-200 text-zinc-600"
      >
        {copied === "email" ? "복사됨!" : "이메일용 복사"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => copyToClipboard(formatSlack(result), "slack")}
        className="border-zinc-200 text-zinc-600"
      >
        {copied === "slack" ? "복사됨!" : "슬랙용 복사"}
      </Button>
    </div>
  )
}
