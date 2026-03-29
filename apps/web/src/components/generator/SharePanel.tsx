"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { GenerateResponse } from "@/lib/types"
import { shareToSlack, shareToEmail } from "@/lib/api"
import { Copy, Mail, MessageSquare, CheckCircle, AlertCircle, Loader2, Download, FileText } from "lucide-react"

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

function resultToMarkdown(result: GenerateResponse, title: string): string {
  const typeLabel = { meeting_note: "회의록", weekly_report: "주간보고", daily_log: "업무일지" }
  let md = `# ${title}\n\n`
  md += `> ${typeLabel[result.doc_type as keyof typeof typeLabel] || result.doc_type}\n\n`

  if (result.summary) md += `## 핵심 요약\n${result.summary}\n\n`

  // Type-specific sections
  if (result.doc_type === "meeting_note") {
    if (result.agenda?.length) md += `## 안건\n${result.agenda.map(a => `- ${a}`).join('\n')}\n\n`
    if (result.discussion?.length) md += `## 논의사항\n${result.discussion.map(d => `- ${d}`).join('\n')}\n\n`
  }
  if (result.doc_type === "weekly_report") {
    if (result.completed_work?.length) md += `## 금주 완료\n${result.completed_work.map(w => `- ${w}`).join('\n')}\n\n`
    if (result.next_week_plan?.length) md += `## 차주 계획\n${result.next_week_plan.map(p => `- ${p}`).join('\n')}\n\n`
  }
  if (result.doc_type === "daily_log") {
    if (result.today_work?.length) md += `## 오늘 업무\n${result.today_work.map(w => `- ${w}`).join('\n')}\n\n`
    if (result.outcomes?.length) md += `## 성과\n${result.outcomes.map(o => `- ${o}`).join('\n')}\n\n`
    if (result.blockers?.length) md += `## 장애요소\n${result.blockers.map(b => `- ${b}`).join('\n')}\n\n`
  }

  // Common sections
  if (result.key_points?.length) md += `## 주요 포인트\n${result.key_points.map(k => `- ${k}`).join('\n')}\n\n`
  if (result.decisions?.length) md += `## 결정사항\n${result.decisions.map(d => `- ${d}`).join('\n')}\n\n`

  if (result.action_items?.length) {
    md += `## 액션아이템\n\n| 업무 | 담당자 | 마감일 | 우선순위 |\n|------|--------|--------|----------|\n`
    result.action_items.forEach(a => {
      md += `| ${a.task} | ${a.assignee || "-"} | ${a.due_date || "-"} | ${a.priority} |\n`
    })
    md += '\n'
  }

  if (result.risks?.length) md += `## 리스크/이슈\n${result.risks.map(r => `- ⚠️ ${r}`).join('\n')}\n\n`
  if (result.next_steps?.length) md += `## 다음 단계\n${result.next_steps.map(n => `- ${n}`).join('\n')}\n\n`

  md += `---\n*WorkFlow Note AI로 생성됨*\n`
  return md
}

function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${filename}.md`
  a.click()
  URL.revokeObjectURL(url)
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
      <TabsList className="bg-zinc-100 rounded-lg p-1">
        <TabsTrigger value="clipboard" className="gap-1.5">
          <Copy className="h-3.5 w-3.5" />
          클립보드
        </TabsTrigger>
        <TabsTrigger value="slack" className="gap-1.5">
          <MessageSquare className="h-3.5 w-3.5" />
          슬랙
        </TabsTrigger>
        <TabsTrigger value="email" className="gap-1.5">
          <Mail className="h-3.5 w-3.5" />
          이메일
        </TabsTrigger>
        <TabsTrigger value="export" className="gap-1.5">
          <Download className="h-3.5 w-3.5" />
          내보내기
        </TabsTrigger>
      </TabsList>

      {/* 클립보드 탭 */}
      <TabsContent value="clipboard">
        <div className="flex flex-wrap gap-2 pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(formatFull(result), "full")}
            className="border-zinc-200 text-zinc-600 gap-1.5"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied === "full" ? (
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle className="h-3.5 w-3.5" />
                복사됨
              </span>
            ) : (
              "전체 복사"
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(formatFull(result), "email")}
            className="border-zinc-200 text-zinc-600 gap-1.5"
          >
            <Mail className="h-3.5 w-3.5" />
            {copied === "email" ? (
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle className="h-3.5 w-3.5" />
                복사됨
              </span>
            ) : (
              "이메일용 복사"
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(formatSlack(result), "slack")}
            className="border-zinc-200 text-zinc-600 gap-1.5"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {copied === "slack" ? (
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle className="h-3.5 w-3.5" />
                복사됨
              </span>
            ) : (
              "슬랙용 복사"
            )}
          </Button>
        </div>
      </TabsContent>

      {/* 슬랙 탭 */}
      <TabsContent value="slack">
        <div className="space-y-3 pt-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">Webhook URL</label>
            <Input
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="text-sm input-focus"
            />
          </div>
          <Button
            size="sm"
            onClick={handleSlackSend}
            disabled={slackLoading || !webhookUrl.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg btn-press gap-1.5"
          >
            {slackLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                보내는 중...
              </>
            ) : (
              <>
                <MessageSquare className="h-3.5 w-3.5" />
                슬랙으로 보내기
              </>
            )}
          </Button>
          {slackStatus && (
            <div
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
                slackStatus.type === "success"
                  ? "badge-green"
                  : "badge-red"
              }`}
            >
              {slackStatus.type === "success" ? (
                <CheckCircle className="h-3.5 w-3.5" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5" />
              )}
              {slackStatus.message}
            </div>
          )}
        </div>
      </TabsContent>

      {/* 이메일 탭 */}
      <TabsContent value="email">
        <div className="space-y-3 pt-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">받는 사람</label>
            <Input
              type="email"
              placeholder="recipient@example.com"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              className="text-sm input-focus"
            />
          </div>
          <Button
            size="sm"
            onClick={handleEmailSend}
            disabled={emailLoading || !toEmail.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg btn-press gap-1.5"
          >
            {emailLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                보내는 중...
              </>
            ) : (
              <>
                <Mail className="h-3.5 w-3.5" />
                이메일로 보내기
              </>
            )}
          </Button>
          {emailStatus && (
            <div
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
                emailStatus.type === "success"
                  ? "badge-green"
                  : "badge-red"
              }`}
            >
              {emailStatus.type === "success" ? (
                <CheckCircle className="h-3.5 w-3.5" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5" />
              )}
              {emailStatus.message}
            </div>
          )}
        </div>
      </TabsContent>

      {/* 내보내기 탭 */}
      <TabsContent value="export">
        <div className="flex flex-wrap gap-2 pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const md = resultToMarkdown(result, title || result.title)
              const filename = (title || result.title || "document").replace(/[^a-zA-Z0-9가-힣_-]/g, "_")
              downloadMarkdown(md, filename)
            }}
            className="border-zinc-200 text-zinc-600 gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" />
            마크다운 다운로드
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const md = resultToMarkdown(result, title || result.title)
              copyToClipboard(md, "markdown")
            }}
            className="border-zinc-200 text-zinc-600 gap-1.5"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied === "markdown" ? (
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle className="h-3.5 w-3.5" />
                복사됨
              </span>
            ) : (
              "마크다운 복사"
            )}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
