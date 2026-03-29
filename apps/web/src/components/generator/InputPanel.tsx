"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DocType } from "@/lib/types"
import { FileText, BarChart3, ClipboardList, ChevronDown, Sparkles, Loader2, Lightbulb } from "lucide-react"

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

// --- Auto-detect document type ---
function detectDocType(text: string): DocType | null {
  const lower = text.toLowerCase()
  const meetingKeywords = ["회의", "참석", "안건", "논의", "결정", "meeting", "agenda", "attendee"]
  const weeklyKeywords = ["금주", "차주", "이번 주", "다음 주", "주간", "weekly", "this week", "next week"]
  const dailyKeywords = ["오늘", "today", "업무일지", "daily", "완료", "진행중", "내일"]

  const meetingScore = meetingKeywords.filter(k => lower.includes(k)).length
  const weeklyScore = weeklyKeywords.filter(k => lower.includes(k)).length
  const dailyScore = dailyKeywords.filter(k => lower.includes(k)).length

  const max = Math.max(meetingScore, weeklyScore, dailyScore)
  if (max === 0) return null
  if (meetingScore === max) return "meeting_note"
  if (weeklyScore === max) return "weekly_report"
  return "daily_log"
}

const DOC_TYPE_LABELS: Record<DocType, string> = {
  meeting_note: "회의록",
  weekly_report: "주간보고",
  daily_log: "업무일지",
}

// --- Example templates ---
const EXAMPLE_TEMPLATES = [
  {
    docType: "meeting_note" as DocType,
    label: "회의록 예시",
    icon: <FileText className="h-5 w-5 text-blue-500" />,
    preview: "마케팅 팀 회의에서 논의한...",
    title: "마케팅 팀 주간 회의",
    content: `참석자: 김팀장, 이대리, 박사원
일시: 2026년 3월 27일 오후 2시
장소: 회의실 A

1. Q2 마케팅 캠페인 진행 상황 공유
- SNS 광고 성과: CTR 2.3%, 전주 대비 0.5%p 상승
- 인플루언서 콜라보 3건 확정 (4월 첫째주 시작)
- 랜딩페이지 A/B 테스트 결과: 변형 B가 전환율 15% 높음

2. 신규 프로모션 기획
- 5월 가정의 달 프로모션 아이디어 브레인스토밍
- 예산: 500만원 내외로 기획
- 김팀장: 다음 회의까지 프로모션 기획안 초안 작성

3. 이슈
- 광고 소재 제작 일정 지연 (디자이너 1명 퇴사)
- 대체 인력 채용 중, 4월 초 합류 예정`,
    metadata: { team: "마케팅팀", project: "Q2 캠페인", attendees: "김팀장, 이대리, 박사원", date: "2026-03-27" },
  },
  {
    docType: "weekly_report" as DocType,
    label: "주간보고 예시",
    icon: <BarChart3 className="h-5 w-5 text-green-500" />,
    preview: "금주 완료 작업: 캠페인 A...",
    title: "3월 4주차 주간보고",
    content: `금주 완료:
- 고객사 A 제안서 제출 완료
- 내부 시스템 업데이트 v2.1 배포
- 신규 파트너사 3곳 미팅 완료

진행 중:
- 고객사 B 계약 협상 (법무 검토 중)
- 4월 워크숍 장소 섭외

이슈:
- 서버 비용 전월 대비 20% 증가 → 최적화 필요
- QA 인력 부족으로 테스트 일정 지연

차주 계획:
- 고객사 B 최종 계약 체결 목표
- 상반기 실적 중간점검 보고서 작성
- 신규 채용 면접 3건`,
    metadata: { team: "사업개발팀", project: "Q1 사업계획", attendees: "", date: "2026-03-27" },
  },
  {
    docType: "daily_log" as DocType,
    label: "업무일지 예시",
    icon: <ClipboardList className="h-5 w-5 text-orange-500" />,
    preview: "오늘 진행 사항: 고객 미팅...",
    title: "3월 27일 업무일지",
    content: `오늘 진행 사항:
- 오전: 고객사 미팅 (요구사항 정리)
- 오후: API 연동 개발 (로그인 모듈 완료)
- 코드 리뷰 2건 완료

완료:
- 로그인 API 연동 및 테스트 완료
- 고객 요구사항 문서 초안 작성

장애/이슈:
- 테스트 서버 DB 연결 간헐적 끊김 → 인프라팀 문의

내일 계획:
- 결제 모듈 개발 착수
- 요구사항 문서 팀 리뷰`,
    metadata: { team: "개발팀", project: "고객사 프로젝트", attendees: "", date: "2026-03-27" },
  },
]

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
  const [detectedType, setDetectedType] = useState<DocType | null>(null)
  const detectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-detect document type with debounce
  const runDetection = useCallback((text: string) => {
    if (detectTimerRef.current) clearTimeout(detectTimerRef.current)
    detectTimerRef.current = setTimeout(() => {
      const detected = detectDocType(text)
      setDetectedType(detected && detected !== docType ? detected : null)
    }, 500)
  }, [docType])

  useEffect(() => {
    if (content.trim()) {
      runDetection(content)
    } else {
      setDetectedType(null)
    }
    return () => {
      if (detectTimerRef.current) clearTimeout(detectTimerRef.current)
    }
  }, [content, runDetection])

  // Clear detection when docType changes
  useEffect(() => {
    setDetectedType(null)
  }, [docType])

  const applyTemplate = (template: typeof EXAMPLE_TEMPLATES[number]) => {
    setDocType(template.docType)
    setTitle(template.title)
    setContent(template.content)
    setMetadata(template.metadata)
    setShowMeta(true)
  }

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
          <div className="flex items-center justify-between">
            {/* Auto-detect suggestion */}
            {detectedType && (
              <div className="flex items-center gap-1.5 animate-fade-in">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs text-amber-600">
                  {DOC_TYPE_LABELS[detectedType]}으로 감지됨
                </span>
                <button
                  type="button"
                  onClick={() => { setDocType(detectedType); setDetectedType(null) }}
                  className="ml-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  적용
                </button>
              </div>
            )}
            {!detectedType && <div />}
            <p className="text-xs text-zinc-400">
              {content.length.toLocaleString()} / {MAX_CONTENT_LENGTH.toLocaleString()}자
            </p>
          </div>

          {/* Example Templates - shown only when content is empty */}
          {!content.trim() && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mt-2">
              {EXAMPLE_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.docType}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="group flex flex-col items-start gap-1.5 rounded-xl border border-zinc-200 bg-white p-3 text-left transition-all hover:border-blue-300 hover:shadow-sm"
                >
                  <div className="flex items-center gap-1.5">
                    {tpl.icon}
                    <span className="text-sm font-semibold text-zinc-700">{tpl.label}</span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2">&ldquo;{tpl.preview}&rdquo;</p>
                  <span className="text-xs font-medium text-blue-500 group-hover:text-blue-600">
                    사용하기
                  </span>
                </button>
              ))}
            </div>
          )}
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
            <span className="flex w-full items-center justify-center gap-2">
              <Sparkles className="h-5 w-5" />
              문서 생성하기
              <kbd className="ml-auto rounded bg-blue-500/30 px-1.5 py-0.5 text-xs font-normal text-blue-100">⌘↵</kbd>
            </span>
          )}
        </Button>

        {/* Keyboard shortcut hints */}
        <p className="text-center text-xs text-zinc-400 mt-2">
          ⌘+Enter 생성 · ⌘+1/2/3 문서 유형
        </p>
      </div>
    </div>
  )
}
