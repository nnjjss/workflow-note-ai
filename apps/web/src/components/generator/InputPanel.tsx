"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DocType } from "@/lib/types"
import { FileText, BarChart3, ClipboardList, ChevronDown, Sparkles, Loader2 } from "lucide-react"

const DOC_TYPES: { value: DocType; label: string; icon: React.ReactNode }[] = [
  { value: "meeting_note", label: "회의록", icon: <FileText className="h-4 w-4" /> },
  { value: "weekly_report", label: "주간보고", icon: <BarChart3 className="h-4 w-4" /> },
  { value: "daily_log", label: "업무일지", icon: <ClipboardList className="h-4 w-4" /> },
]

const PLACEHOLDERS: Record<DocType, string> = {
  meeting_note:
    "회의 내용을 자유롭게 입력해주세요.\n참석자, 논의사항, 결정사항 등을 포함하면 더 정확한 문서가 생성됩니다.",
  weekly_report: "이번 주 업무 내용을 자유롭게 입력해주세요.\n완료한 업무, 진행 중인 업무, 차주 계획 등을 포함해보세요.",
  daily_log: "오늘의 업무 내용을 자유롭게 입력해주세요.\n진행한 업무, 성과, 이슈 등을 포함해보세요.",
}

const MAX_CONTENT_LENGTH = 5000

interface InputPanelProps {
  docType: DocType
  setDocType: (type: DocType) => void
  title: string
  setTitle: (title: string) => void
  content: string
  setContent: (content: string) => void
  metadata: { team: string; project: string; attendees: string; date: string }
  setMetadata: (metadata: { team: string; project: string; attendees: string; date: string }) => void
  onGenerate: () => void
  loading: boolean
}

export default function InputPanel({
  docType,
  setDocType,
  title,
  setTitle,
  content,
  setContent,
  metadata,
  setMetadata,
  onGenerate,
  loading,
}: InputPanelProps) {
  const [showMeta, setShowMeta] = useState(false)

  return (
    <div className="card-elevated p-6">
      <div className="space-y-6">
        {/* Doc Type Selector */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-zinc-800">문서 유형</Label>
          <div className="flex gap-2">
            {DOC_TYPES.map((dt) => (
              <button
                key={dt.value}
                type="button"
                onClick={() => setDocType(dt.value)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  docType === dt.value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {dt.icon}
                {dt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-zinc-100" />

        {/* Title */}
        <div className="space-y-2.5">
          <Label htmlFor="title" className="text-sm font-semibold text-zinc-800">
            제목
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="문서 제목을 입력해주세요"
            className="input-focus"
          />
        </div>

        {/* Separator */}
        <div className="border-t border-zinc-100" />

        {/* Content */}
        <div className="space-y-2.5">
          <Label htmlFor="content" className="text-sm font-semibold text-zinc-800">
            메모 · 회의록 · 업무 내용
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))}
            placeholder={PLACEHOLDERS[docType]}
            rows={8}
            className="resize-y input-focus"
          />
          <p className="text-xs text-zinc-400 text-right">
            {content.length.toLocaleString()} / {MAX_CONTENT_LENGTH.toLocaleString()}자
          </p>
        </div>

        {/* Separator */}
        <div className="border-t border-zinc-100" />

        {/* Additional Metadata (collapsible) */}
        <div>
          <button
            type="button"
            onClick={() => setShowMeta(!showMeta)}
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${showMeta ? "rotate-180" : ""}`}
            />
            추가 정보 (선택)
          </button>

          {showMeta && (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 animate-fade-in">
              <div className="space-y-1.5">
                <Label htmlFor="team" className="text-xs font-medium text-zinc-500">
                  팀명
                </Label>
                <Input
                  id="team"
                  value={metadata.team}
                  onChange={(e) => setMetadata({ ...metadata, team: e.target.value })}
                  placeholder="팀명"
                  className="input-focus"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="project" className="text-xs font-medium text-zinc-500">
                  프로젝트
                </Label>
                <Input
                  id="project"
                  value={metadata.project}
                  onChange={(e) => setMetadata({ ...metadata, project: e.target.value })}
                  placeholder="프로젝트명"
                  className="input-focus"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="attendees" className="text-xs font-medium text-zinc-500">
                  참석자
                </Label>
                <Input
                  id="attendees"
                  value={metadata.attendees}
                  onChange={(e) => setMetadata({ ...metadata, attendees: e.target.value })}
                  placeholder="참석자 (쉼표로 구분)"
                  className="input-focus"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-xs font-medium text-zinc-500">
                  날짜
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={metadata.date}
                  onChange={(e) => setMetadata({ ...metadata, date: e.target.value })}
                  className="input-focus"
                />
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <Button
          onClick={onGenerate}
          disabled={!content.trim() || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg text-white rounded-xl py-3 text-base font-semibold btn-press disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              생성 중...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              문서 생성하기
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
