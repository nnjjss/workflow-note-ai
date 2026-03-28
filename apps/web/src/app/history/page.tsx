"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getDocuments, duplicateDocument, deleteDocument } from "@/lib/api"
import { DocumentResponse } from "@/lib/types"

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
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-900">히스토리</h1>
        <p className="mt-1 text-sm text-zinc-500">
          문서 생성 기록을 확인합니다
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {DOC_TYPE_FILTERS.map((filter) => (
            <Button
              key={filter.value}
              variant={docTypeFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setDocTypeFilter(filter.value)
                setPage(1)
              }}
              className="text-xs"
            >
              {filter.label}
            </Button>
          ))}
        </div>
        <Input
          placeholder="제목으로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 w-full text-sm sm:w-56"
        />
      </div>

      <Separator className="mb-4" />

      {/* Loading State */}
      {loadingState && (
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="flex min-h-[200px] items-center justify-center p-6">
            <div className="flex flex-col items-center gap-3">
              <svg
                className="h-6 w-6 animate-spin text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p className="text-sm text-zinc-400">불러오는 중...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loadingState && documents.length === 0 && (
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="flex min-h-[200px] items-center justify-center p-6">
            <div className="text-center">
              <p className="text-sm text-zinc-400">저장된 문서가 없습니다</p>
              <p className="mt-1 text-xs text-zinc-300">
                문서를 생성하면 자동으로 저장됩니다
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document List */}
      {!loadingState && documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => (
            <Card key={doc.id} className="border-zinc-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-zinc-800">
                        {doc.title}
                      </h3>
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        {DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
                      </Badge>
                    </div>
                    {doc.short_summary && (
                      <p className="mt-1 truncate text-xs text-zinc-400">
                        {doc.short_summary}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-zinc-300">
                    {formatDate(doc.created_at)}
                  </span>
                </div>
                <div className="mt-3 flex justify-end gap-1.5">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleOpen(doc.id)}
                    className="text-xs"
                  >
                    열기
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    disabled={actionLoading === doc.id}
                    onClick={() => handleDuplicate(doc.id)}
                    className="text-xs"
                  >
                    복제
                  </Button>
                  <Button
                    variant="destructive"
                    size="xs"
                    disabled={actionLoading === doc.id}
                    onClick={() => handleDelete(doc.id)}
                    className="text-xs"
                  >
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loadingState && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-xs"
          >
            이전
          </Button>
          <span className="text-xs text-zinc-400">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-xs"
          >
            다음
          </Button>
        </div>
      )}
    </div>
  )
}
