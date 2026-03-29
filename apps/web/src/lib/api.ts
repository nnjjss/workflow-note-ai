import { GenerateRequest, GenerateResponse, RewriteRequest, RewriteResponse, ShareResponse, DocumentResponse } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function generateDocument(req: GenerateRequest): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  })
  if (!res.ok) {
    throw new Error("생성에 실패했습니다")
  }
  return res.json()
}

export async function generateDocumentStream(
  req: GenerateRequest,
  onChunk: (text: string) => void,
  onComplete: (result: GenerateResponse) => void,
  onError: (error: string) => void,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/generate/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  })
  if (!res.ok) { onError("생성에 실패했습니다"); return }

  const reader = res.body?.getReader()
  if (!reader) { onError("스트리밍을 시작할 수 없습니다"); return }

  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() || ""

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue
      const data = line.slice(6)
      if (data === "[DONE]") return

      try {
        const parsed = JSON.parse(data)
        if (parsed.type === "chunk") onChunk(parsed.text)
        if (parsed.type === "complete") onComplete(parsed.result as GenerateResponse)
        if (parsed.type === "error") onError(parsed.message)
      } catch { /* skip malformed SSE lines */ }
    }
  }
}

export async function rewriteSection(req: RewriteRequest): Promise<RewriteResponse> {
  const res = await fetch(`${API_BASE}/api/rewrite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  })
  if (!res.ok) {
    throw new Error("재작성에 실패했습니다")
  }
  return res.json()
}

export async function shareToSlack(data: {
  webhook_url: string
  title: string
  doc_type: string
  summary: string
  slack_text?: string
  action_items?: Array<{ task: string; owner: string; due_date: string; priority: string }>
}): Promise<ShareResponse> {
  const res = await fetch(`${API_BASE}/api/share/slack`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("슬랙 발송에 실패했습니다")
  return res.json()
}

export async function shareToEmail(data: {
  to_email: string
  title: string
  doc_type: string
  email_body: string
  action_items?: Array<{ task: string; owner: string; due_date: string; priority: string }>
}): Promise<ShareResponse> {
  const res = await fetch(`${API_BASE}/api/share/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("이메일 발송에 실패했습니다")
  return res.json()
}

export async function rewriteSectionContent(data: {
  content: string
  mode: "shorter" | "formal" | "manager_tone" | "team_tone" | "regenerate"
  doc_type?: string
}): Promise<{ rewritten: string }> {
  const res = await fetch(`${API_BASE}/api/rewrite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("리라이트에 실패했습니다")
  return res.json()
}

export async function saveDocument(data: {
  title: string
  doc_type: string
  raw_input: string
  metadata?: Record<string, unknown>
  generated_output?: Record<string, unknown>
  short_summary?: string
}): Promise<DocumentResponse> {
  const res = await fetch(`${API_BASE}/api/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("저장에 실패했습니다")
  return res.json()
}

export async function getDocuments(params?: {
  doc_type?: string
  q?: string
  page?: number
  per_page?: number
}): Promise<{ items: DocumentResponse[]; total: number; page: number; per_page: number }> {
  const searchParams = new URLSearchParams()
  if (params?.doc_type) searchParams.set("doc_type", params.doc_type)
  if (params?.q) searchParams.set("q", params.q)
  if (params?.page) searchParams.set("page", String(params.page))
  if (params?.per_page) searchParams.set("per_page", String(params.per_page))
  const res = await fetch(`${API_BASE}/api/documents?${searchParams}`)
  if (!res.ok) throw new Error("문서 목록 조회에 실패했습니다")
  return res.json()
}

export async function getDocument(id: string): Promise<DocumentResponse> {
  const res = await fetch(`${API_BASE}/api/documents/${id}`)
  if (!res.ok) throw new Error("문서 조회에 실패했습니다")
  return res.json()
}

export async function duplicateDocument(id: string): Promise<DocumentResponse> {
  const res = await fetch(`${API_BASE}/api/documents/${id}/duplicate`, { method: "POST" })
  if (!res.ok) throw new Error("복제에 실패했습니다")
  return res.json()
}

export async function deleteDocument(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/documents/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("삭제에 실패했습니다")
}
