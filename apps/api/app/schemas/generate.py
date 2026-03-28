from typing import Literal

from pydantic import BaseModel


class GenerateRequest(BaseModel):
    doc_type: Literal["meeting_note", "weekly_report", "daily_log"]
    title: str = ""
    content: str
    team_name: str = ""
    project_name: str = ""
    attendees: list[str] = []
    date: str = ""


class ActionItem(BaseModel):
    task: str
    owner: str = "미정"
    due_date: str = "미정"
    priority: Literal["low", "medium", "high"] = "medium"


class GenerateResponse(BaseModel):
    title: str
    doc_type: str
    summary: str
    key_points: list[str] = []
    decisions: list[str] = []
    action_items: list[ActionItem] = []
    risks: list[str] = []
    next_steps: list[str] = []
    share_summary_email: str = ""
    share_summary_slack: str = ""
    # weekly_report fields
    completed_work: list[str] = []
    blockers: list[str] = []
    next_week_plan: list[str] = []
    # daily_log fields
    today_work: list[str] = []
    outcomes: list[str] = []
    # meeting_note fields
    agenda: list[str] = []
    discussion: list[str] = []


class RewriteRequest(BaseModel):
    content: str
    mode: Literal["shorter", "formal", "manager_tone", "team_tone"]
    doc_type: str = "meeting_note"


class RewriteResponse(BaseModel):
    rewritten: str
