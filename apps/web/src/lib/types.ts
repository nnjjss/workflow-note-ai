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
