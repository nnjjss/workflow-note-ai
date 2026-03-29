"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getDocuments, duplicateDocument, deleteDocument } from "@/lib/api"
import { DocumentResponse } from "@/lib/types"
import {
  History,
  Search,
  ExternalLink,
  Copy,
  Trash2,
  FileText,
  BarChart3,
  ClipboardList,
  Loader2,
  FilePlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const DOC_TYPE_FILTERS = [
  { value: "", label: "전체" },
  { value: "meeting_note", label: "회의록" },
  { value: "weekly_report", label: "주간보고" },
  { value: "daily_log", label: "업무일지" },
]

const DOC_TYPE_LABELS: Record<string, string> = {
  meeting_note: "회의록",
  weekly_report: "주간보고",
  daily_log: "업무일지",
}

const DOC_TYPE_BADGE_STYLES: Record<string, string> = {
  meeting_note: "badge-blue",
  weekly_report: "badge-green",
  daily_log: "badge-amber",
}

const DOC_TYPE_ICONS: Record<string, React.ReactNode> = {
  meeting_note: <FileText className="h-3 w-3" />,
  weekly_report: <BarChart3 className="h-3 w-3" />,
  daily_log: <ClipboardList className="h-3 w-3" />,
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${month}/${day} ${hours}:${minutes}`
}

export default function HistoryPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<DocumentResponse[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [perPage] = useState(10)
  const [docTypeFilter, setDocTypeFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [loadingState, setLoadingState] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchDocuments = useCallback(async () => {
    setLoadingState(true)
    try {
      const res = await getDocuments({
        doc_type: docTypeFilter || undefined,
        q: debouncedQuery || undefined,
        page,
        per_page: perPage,
      })
      setDocuments(res.items)
      setTotal(res.total)
    } catch {
      // silent fail
    } finally {
      setLoadingState(false)
    }
  }, [docTypeFilter, debouncedQuery, page, perPage])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleOpen = (id: string) => {
    router.push(`/generator?id=${id}`)
  }

  const handleDuplicate = async (id: string) => {
    setActionLoading(id)
    try {
      await duplicateDocument(id)
      await fetchDocuments()
    } catch {
      // silent fail
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("이 문서를 삭제하시겠습니까?")) return
    setActionLoading(id)
    try {
      await deleteDocument(id)
      await fetchDocuments()
    } catch {
      // silent fail
    } finally {
      setActionLoading(null)
    }
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <History className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">히스토리</h1>
            <p className="text-sm text-zinc-500">문서 생성 기록을 확인합니다</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in stagger-1">
        <div className="flex flex-wrap gap-1.5">
          {DOC_TYPE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => {
                setDocTypeFilter(filter.value)
                setPage(1)
              }}
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all ${
                docTypeFilter === filter.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="제목으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full pl-9 text-sm sm:w-60 input-focus"
          />
        </div>
      </div>

      <div className="border-t border-zinc-100 mb-5" />

      {/* Loading State */}
      {loadingState && (
        <div className="card-base p-6 animate-fade-in">
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p className="text-sm text-zinc-400">불러오는 중...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loadingState && documents.length === 0 && (
        <div className="card-base p-6 animate-fade-in">
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-4">
            <FileText className="h-12 w-12 text-zinc-200" />
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-400">저장된 문서가 없습니다</p>
              <p className="mt-1 text-xs text-zinc-300">문서를 생성하면 자동으로 저장됩니다</p>
            </div>
            <Button
              size="sm"
              onClick={() => router.push("/generator")}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg btn-press gap-1.5"
            >
              <FilePlus className="h-4 w-4" />
              새 문서 만들기
            </Button>
          </div>
        </div>
      )}

      {/* Document List */}
      {!loadingState && documents.length > 0 && (
        <div className="space-y-2.5">
          {documents.map((doc, index) => (
            <div
              key={doc.id}
              className="card-interactive p-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold text-zinc-800">
                      {doc.title}
                    </h3>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        DOC_TYPE_BADGE_STYLES[doc.doc_type] || "badge-blue"
                      }`}
                    >
                      {DOC_TYPE_ICONS[doc.doc_type]}
                      {DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
                    </span>
                  </div>
                  {doc.short_summary && (
                    <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                      {doc.short_summary}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-zinc-400">
                  {formatDate(doc.created_at)}
                </span>
              </div>
              <div className="mt-3 flex justify-end gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpen(doc.id)}
                  className="h-8 text-xs border-zinc-200 hover:border-blue-300 hover:text-blue-600 gap-1 transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  열기
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={actionLoading === doc.id}
                  onClick={() => handleDuplicate(doc.id)}
                  className="h-8 text-xs border-zinc-200 hover:border-blue-300 hover:text-blue-600 gap-1 transition-all"
                >
                  <Copy className="h-3.5 w-3.5" />
                  복제
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={actionLoading === doc.id}
                  onClick={() => handleDelete(doc.id)}
                  className="h-8 text-xs border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 hover:text-red-700 gap-1 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  삭제
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loadingState && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3 animate-fade-in">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="h-9 border-zinc-200 text-sm gap-1 transition-all hover:border-blue-300"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>
          <span className="text-sm font-medium text-zinc-500">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="h-9 border-zinc-200 text-sm gap-1 transition-all hover:border-blue-300"
          >
            다음
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
