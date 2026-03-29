"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { getDocuments } from "@/lib/api"
import { ActionItem, DocumentResponse } from "@/lib/types"
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  FileText,
  ExternalLink,
  Loader2,
  Inbox,
} from "lucide-react"

const LS_KEY = "workflow_note_completed_items"

interface AggregatedItem {
  task: string
  assignee: string
  due_date: string
  priority: "high" | "medium" | "low"
  docId: string
  docTitle: string
  itemIndex: number
  compositeKey: string
}

type PriorityFilter = "all" | "high" | "medium" | "low"
type StatusFilter = "all" | "active" | "completed"

function getCompletedSet(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveCompletedSet(set: Set<string>) {
  localStorage.setItem(LS_KEY, JSON.stringify([...set]))
}

const PRIORITY_CONFIG = {
  high: { label: "높음", dot: "bg-red-500", badge: "badge-red", sort: 0 },
  medium: { label: "보통", dot: "bg-amber-500", badge: "badge-amber", sort: 1 },
  low: { label: "낮음", dot: "bg-zinc-400", badge: "bg-zinc-100 text-zinc-600 border border-zinc-200", sort: 2 },
}

const DOC_TYPE_LABELS: Record<string, string> = {
  meeting_note: "회의록",
  weekly_report: "주간보고",
  daily_log: "업무일지",
}

function isOverdue(dueDate: string): boolean {
  if (!dueDate || dueDate === "미정" || dueDate === "없음") return false
  const d = new Date(dueDate)
  if (isNaN(d.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d < today
}

export default function DashboardPage() {
  const [items, setItems] = useState<AggregatedItem[]>([])
  const [completedKeys, setCompletedKeys] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Filters
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [assigneeSearch, setAssigneeSearch] = useState("")

  useEffect(() => {
    setCompletedKeys(getCompletedSet())
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    setError("")
    try {
      const res = await getDocuments({ per_page: 200 })
      const aggregated: AggregatedItem[] = []

      for (const doc of res.items) {
        const output = doc.generated_output as Record<string, unknown> | null
        if (!output) continue
        const actionItems = output.action_items as ActionItem[] | undefined
        if (!actionItems || !Array.isArray(actionItems)) continue

        actionItems.forEach((ai, idx) => {
          aggregated.push({
            task: ai.task,
            assignee: ai.assignee || "",
            due_date: ai.due_date || "",
            priority: ai.priority || "medium",
            docId: doc.id,
            docTitle: doc.title,
            itemIndex: idx,
            compositeKey: `${doc.id}:${idx}`,
          })
        })
      }

      setItems(aggregated)
    } catch {
      setError("액션아이템을 불러오는 데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  function toggleComplete(key: string) {
    setCompletedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      saveCompletedSet(next)
      return next
    })
  }

  // Stats
  const stats = useMemo(() => {
    const total = items.length
    const completed = items.filter((i) => completedKeys.has(i.compositeKey)).length
    const high = items.filter((i) => i.priority === "high" && !completedKeys.has(i.compositeKey)).length
    const inProgress = total - completed
    return { total, high, inProgress, completed }
  }, [items, completedKeys])

  // Filtered & sorted
  const filteredItems = useMemo(() => {
    let filtered = [...items]

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((i) => i.priority === priorityFilter)
    }

    // Status filter
    if (statusFilter === "active") {
      filtered = filtered.filter((i) => !completedKeys.has(i.compositeKey))
    } else if (statusFilter === "completed") {
      filtered = filtered.filter((i) => completedKeys.has(i.compositeKey))
    }

    // Assignee search
    if (assigneeSearch.trim()) {
      const q = assigneeSearch.trim().toLowerCase()
      filtered = filtered.filter(
        (i) =>
          i.assignee.toLowerCase().includes(q) ||
          i.task.toLowerCase().includes(q)
      )
    }

    // Sort: completed items to bottom, then by priority, then by due date
    filtered.sort((a, b) => {
      const aCompleted = completedKeys.has(a.compositeKey) ? 1 : 0
      const bCompleted = completedKeys.has(b.compositeKey) ? 1 : 0
      if (aCompleted !== bCompleted) return aCompleted - bCompleted

      const aPrio = PRIORITY_CONFIG[a.priority]?.sort ?? 1
      const bPrio = PRIORITY_CONFIG[b.priority]?.sort ?? 1
      if (aPrio !== bPrio) return aPrio - bPrio

      // By due date (earlier first, empty last)
      const aDate = a.due_date && a.due_date !== "미정" ? new Date(a.due_date).getTime() : Infinity
      const bDate = b.due_date && b.due_date !== "미정" ? new Date(b.due_date).getTime() : Infinity
      return aDate - bDate
    })

    return filtered
  }, [items, completedKeys, priorityFilter, statusFilter, assigneeSearch])

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <p className="text-sm text-zinc-400">대시보드 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">대시보드</h1>
            <p className="text-sm text-zinc-500">
              모든 문서의 액션아이템을 한눈에 확인합니다
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg badge-red px-4 py-3 animate-fade-in">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 animate-fade-in stagger-1">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-medium text-blue-600">전체</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-medium text-red-600">긴급</p>
          <p className="mt-1 text-2xl font-bold text-red-700">{stats.high}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-medium text-amber-600">진행중</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">{stats.inProgress}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-medium text-emerald-600">완료</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{stats.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3 animate-fade-in stagger-2">
        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 input-focus"
        >
          <option value="all">전체 상태</option>
          <option value="active">진행중</option>
          <option value="completed">완료</option>
        </select>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 input-focus"
        >
          <option value="all">전체 우선순위</option>
          <option value="high">높음</option>
          <option value="medium">보통</option>
          <option value="low">낮음</option>
        </select>

        {/* Assignee search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={assigneeSearch}
            onChange={(e) => setAssigneeSearch(e.target.value)}
            placeholder="담당자 또는 업무 검색"
            className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-sm text-zinc-700 input-focus"
          />
        </div>
      </div>

      {/* Items List */}
      {items.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white py-16 animate-fade-in">
          <Inbox className="mb-3 h-10 w-10 text-zinc-300" />
          <p className="text-sm font-medium text-zinc-500">
            아직 액션아이템이 없습니다
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            문서를 생성하면 자동으로 추출됩니다
          </p>
          <Link
            href="/generator"
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 btn-press transition-colors"
          >
            문서 생성하기
          </Link>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white py-12 animate-fade-in">
          <Search className="mb-3 h-8 w-8 text-zinc-300" />
          <p className="text-sm font-medium text-zinc-500">
            필터 조건에 맞는 항목이 없습니다
          </p>
        </div>
      ) : (
        <div className="space-y-2 animate-fade-in stagger-3">
          {filteredItems.map((item, idx) => {
            const completed = completedKeys.has(item.compositeKey)
            const overdue = !completed && isOverdue(item.due_date)
            const config = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.medium

            return (
              <div
                key={item.compositeKey}
                className={`card-base p-4 transition-all ${
                  overdue ? "border-red-300 bg-red-50/50" : ""
                } ${completed ? "opacity-60" : ""}`}
                style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }}
              >
                <div className="flex items-start gap-3">
                  {/* Priority dot */}
                  <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${config.dot}`} />

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.badge}`}
                      >
                        {config.label}
                      </span>
                      {overdue && (
                        <span className="rounded-full badge-red px-2 py-0.5 text-xs font-medium">
                          기한 초과
                        </span>
                      )}
                    </div>
                    <p
                      className={`mt-1 text-sm font-medium text-zinc-800 ${
                        completed ? "line-through text-zinc-400" : ""
                      }`}
                    >
                      {item.task}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                      {item.assignee && (
                        <span className="flex items-center gap-1">
                          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold text-zinc-600">
                            {item.assignee.charAt(0)}
                          </span>
                          {item.assignee}
                        </span>
                      )}
                      {item.due_date && item.due_date !== "미정" && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          마감: {item.due_date}
                        </span>
                      )}
                      {!item.due_date || item.due_date === "미정" ? (
                        <span className="flex items-center gap-1 text-zinc-400">
                          <Clock className="h-3 w-3" />
                          마감: 미정
                        </span>
                      ) : null}
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {item.docTitle}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => toggleComplete(item.compositeKey)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors btn-press ${
                        completed
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {completed ? "완료됨" : "완료"}
                    </button>
                    <Link
                      href={`/generator?id=${item.docId}`}
                      className="flex items-center gap-1 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200 transition-colors btn-press"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">문서 보기</span>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
