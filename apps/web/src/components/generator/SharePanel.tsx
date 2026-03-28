"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { GenerateResponse } from "@/lib/types"
import { shareToSlack, shareToEmail } from "@/lib/api"

interface SharePanelProps {
  result: GenerateResponse
  title: string
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

const SLACK_WEBHOOK_KEY = "workflow-note-ai-slack-webhook"

export default function SharePanel({ result, title }: SharePanelProps) {
  const [copied, setCopied] = useState<string | null>(null)

  // Slack state
  const [webhookUrl, setWebhookUrl] = useState("")
  const [slackLoading, setSlackLoading] = useState(false)
  const [slackStatus, setSlackStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Email state
  const [toEmail, setToEmail] = useState("")
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailStatus, setEmailStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(SLACK_WEBHOOK_KEY)
    if (saved) setWebhookUrl(saved)
  }, [])

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch {
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

  const handleSlackSend = async () => {
    if (!webhookUrl.trim()) return
    setSlackLoading(true)
    setSlackStatus(null)

    localStorage.setItem(SLACK_WEBHOOK_KEY, webhookUrl.trim())

    try {
      const actionItems = result.action_items.map((a) => ({
        task: a.task,
        owner: a.assignee || "",
        due_date: a.due_date || "",
        priority: a.priority,
      }))
      const res = await shareToSlack({
        webhook_url: webhookUrl.trim(),
        title: title || result.title,
        doc_type: result.doc_type,
        summary: result.summary,
        slack_text: result.share_summary_slack || formatSlack(result),
        action_items: actionItems,
      })
      setSlackStatus({ type: "success", message: res.message || "슬랙으로 전송되었습니다" })
    } catch (err) {
      setSlackStatus({
        type: "error",
        message: err instanceof Error ? err.message : "슬랙 발송에 실패했습니다",
      })
    } finally {
      setSlackLoading(false)
    }
  }

  const handleEmailSend = async () => {
    if (!toEmail.trim()) return
    setEmailLoading(true)
    setEmailStatus(null)

    try {
      const actionItems = result.action_items.map((a) => ({
        task: a.task,
        owner: a.assignee || "",
        due_date: a.due_date || "",
        priority: a.priority,
      }))
      const res = await shareToEmail({
        to_email: toEmail.trim(),
        title: title || result.title,
        doc_type: result.doc_type,
        email_body: result.share_summary_email || formatFull(result),
        action_items: actionItems,
      })
      setEmailStatus({ type: "success", message: res.message || "이메일이 전송되었습니다" })
    } catch (err) {
      setEmailStatus({
        type: "error",
        message: err instanceof Error ? err.message : "이메일 발송에 실패했습니다",
      })
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <Tabs defaultValue="clipboard">
      <TabsList>
        <TabsTrigger value="clipboard">클립보드</TabsTrigger>
        <TabsTrigger value="slack">슬랙</TabsTrigger>
        <TabsTrigger value="email">이메일</TabsTrigger>
      </TabsList>

      {/* 클립보드 탭 */}
      <TabsContent value="clipboard">
        <div className="flex flex-wrap gap-2 pt-3">
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
      </TabsContent>

      {/* 슬랙 탭 */}
      <TabsContent value="slack">
        <div className="space-y-3 pt-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Webhook URL</label>
            <Input
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="text-sm"
            />
          </div>
          <Button
            size="sm"
            onClick={handleSlackSend}
            disabled={slackLoading || !webhookUrl.trim()}
          >
            {slackLoading ? "보내는 중..." : "슬랙으로 보내기"}
          </Button>
          {slackStatus && (
            <p
              className={`text-xs ${
                slackStatus.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {slackStatus.message}
            </p>
          )}
        </div>
      </TabsContent>

      {/* 이메일 탭 */}
      <TabsContent value="email">
        <div className="space-y-3 pt-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">받는 사람</label>
            <Input
              type="email"
              placeholder="recipient@example.com"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              className="text-sm"
            />
          </div>
          <Button
            size="sm"
            onClick={handleEmailSend}
            disabled={emailLoading || !toEmail.trim()}
          >
            {emailLoading ? "보내는 중..." : "이메일로 보내기"}
          </Button>
          {emailStatus && (
            <p
              className={`text-xs ${
                emailStatus.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {emailStatus.message}
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
