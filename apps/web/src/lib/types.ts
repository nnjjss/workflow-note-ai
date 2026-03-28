export type DocType = "meeting_note" | "weekly_report" | "daily_log"

export interface GenerateRequest {
  doc_type: DocType
  title: string
  content: string
  metadata?: {
    team?: string
    project?: string
    attendees?: string
    date?: string
  }
}

export interface ActionItem {
  task: string
  assignee: string
  due_date: string
  priority: "high" | "medium" | "low"
}

export interface GenerateResponse {
  doc_type: DocType
  title: string
  summary: string
  key_points: string[]
  decisions: string[]
  action_items: ActionItem[]
  risks: string[]
  next_steps: string[]
  // meeting_note specific
  agenda?: string[]
  discussion?: string[]
  // weekly_report specific
  completed_work?: string[]
  next_week_plan?: string[]
  // daily_log specific
  today_work?: string[]
  outcomes?: string[]
  blockers?: string[]
  // share summaries
  share_summary_email?: string
  share_summary_slack?: string
}

export interface RewriteRequest {
  doc_type: DocType
  section: string
  content: string
  instruction?: string
}

export interface RewriteResponse {
  section: string
  content: string[]
}

export interface ShareResponse {
  success: boolean
  message: string
}

export interface DocumentResponse {
  id: string
  title: string
  doc_type: string
  raw_input: string
  metadata: Record<string, unknown>
  generated_output: Record<string, unknown>
  short_summary: string
  created_at: string
  updated_at: string
}
