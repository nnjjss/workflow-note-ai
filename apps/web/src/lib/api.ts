import { GenerateRequest, GenerateResponse, RewriteRequest, RewriteResponse, ShareResponse } from "./types"

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
