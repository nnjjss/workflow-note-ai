"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { DocType } from "@/lib/types"

const DOC_TYPES: { value: DocType; label: string }[] = [
  { value: "meeting_note", label: "회의록" },
  { value: "weekly_report", label: "주간보고" },
  { value: "daily_log", label: "업무일지" },
]

const PLACEHOLDERS: Record<DocType, string> = {
  meeting_note:
    "회의 내용을 자유롭게 입력해주세요. 참석자, 논의사항, 결정사항 등을 포함하면 더 좋은 결과를 얻을 수 있습니다.",
  weekly_report: "이번 주 업무 내용을 자유롭게 입력해주세요.",
  daily_log: "오늘 업무 내용을 자유롭게 입력해주세요.",
}

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
    <Card className="border-zinc-200 shadow-sm">
      <CardContent className="space-y-5 p-6">
        {/* Doc Type Selector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-zinc-700">문서 유형</Label>
          <div className="flex gap-2">
            {DOC_TYPES.map((dt) => (
              <Button
                key={dt.value}
                variant={docType === dt.value ? "default" : "outline"}
                size="sm"
                onClick={() => setDocType(dt.value)}
                className={
                  docType === dt.value
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }
              >
                {dt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-zinc-700">
            제목
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="문서 제목을 입력해주세요"
            className="border-zinc-200"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm font-medium text-zinc-700">
            메모 · 회의록 · 업무 내용
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={PLACEHOLDERS[docType]}
            rows={8}
            className="resize-y border-zinc-200"
          />
        </div>

        {/* Additional Metadata (collapsible) */}
        <div>
          <button
            type="button"
            onClick={() => setShowMeta(!showMeta)}
            className="flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-700"
          >
            <span className={`inline-block transition-transform ${showMeta ? "rotate-90" : ""}`}>
              ▸
            </span>
            추가 정보 (선택)
          </button>

          {showMeta && (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="team" className="text-xs text-zinc-500">
                  팀명
                </Label>
                <Input
                  id="team"
                  value={metadata.team}
                  onChange={(e) => setMetadata({ ...metadata, team: e.target.value })}
                  placeholder="팀명"
                  className="border-zinc-200"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="project" className="text-xs text-zinc-500">
                  프로젝트
                </Label>
                <Input
                  id="project"
                  value={metadata.project}
                  onChange={(e) => setMetadata({ ...metadata, project: e.target.value })}
                  placeholder="프로젝트명"
                  className="border-zinc-200"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="attendees" className="text-xs text-zinc-500">
                  참석자
                </Label>
                <Input
                  id="attendees"
                  value={metadata.attendees}
                  onChange={(e) => setMetadata({ ...metadata, attendees: e.target.value })}
                  placeholder="참석자 (쉼표로 구분)"
                  className="border-zinc-200"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="date" className="text-xs text-zinc-500">
                  날짜
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={metadata.date}
                  onChange={(e) => setMetadata({ ...metadata, date: e.target.value })}
                  className="border-zinc-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <Button
          onClick={onGenerate}
          disabled={!content.trim() || loading}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
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
              생성 중...
            </span>
          ) : (
            "문서 생성하기"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
