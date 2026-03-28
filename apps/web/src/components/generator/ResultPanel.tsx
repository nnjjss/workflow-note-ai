"use client"

import { Card, CardContent } from "@/components/ui/card"
import { GenerateResponse } from "@/lib/types"
import SectionCard from "./SectionCard"
import ActionItems from "./ActionItems"
import SharePanel from "./SharePanel"

interface ResultPanelProps {
  result: GenerateResponse | null
  loading: boolean
}

export default function ResultPanel({ result, loading }: ResultPanelProps) {
  if (loading) {
    return (
      <Card className="border-zinc-200 shadow-sm">
        <CardContent className="flex min-h-[300px] items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="h-8 w-8 animate-spin text-blue-600"
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
            <p className="text-sm text-zinc-500">문서를 생성하고 있습니다...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return (
      <Card className="border-zinc-200 shadow-sm">
        <CardContent className="flex min-h-[300px] items-center justify-center p-6">
          <p className="text-sm text-zinc-400">문서를 생성하면 여기에 결과가 표시됩니다</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <Card className="border-zinc-200 shadow-sm">
        <CardContent className="p-5">
          <h2 className="text-lg font-bold text-zinc-900">{result.title}</h2>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-zinc-200 shadow-sm">
        <CardContent className="p-5">
          <h3 className="mb-2 text-sm font-semibold text-zinc-800">핵심 요약</h3>
          <p className="text-sm leading-relaxed text-zinc-600">{result.summary}</p>
        </CardContent>
      </Card>

      {/* Key Points */}
      <SectionCard title="주요 포인트" items={result.key_points} editable />

      {/* Decisions */}
      {result.decisions.length > 0 && (
        <SectionCard title="결정사항" items={result.decisions} editable />
      )}

      {/* Type-specific: meeting_note */}
      {result.doc_type === "meeting_note" && (
        <>
          {result.agenda && result.agenda.length > 0 && (
            <SectionCard title="안건" items={result.agenda} editable />
          )}
          {result.discussion && result.discussion.length > 0 && (
            <SectionCard title="논의사항" items={result.discussion} editable />
          )}
        </>
      )}

      {/* Type-specific: weekly_report */}
      {result.doc_type === "weekly_report" && (
        <>
          {result.completed_work && result.completed_work.length > 0 && (
            <SectionCard title="금주 완료" items={result.completed_work} editable />
          )}
          {result.next_week_plan && result.next_week_plan.length > 0 && (
            <SectionCard title="차주 계획" items={result.next_week_plan} editable />
          )}
        </>
      )}

      {/* Type-specific: daily_log */}
      {result.doc_type === "daily_log" && (
        <>
          {result.today_work && result.today_work.length > 0 && (
            <SectionCard title="오늘 업무" items={result.today_work} editable />
          )}
          {result.outcomes && result.outcomes.length > 0 && (
            <SectionCard title="성과" items={result.outcomes} editable />
          )}
          {result.blockers && result.blockers.length > 0 && (
            <SectionCard title="장애요소" items={result.blockers} editable />
          )}
        </>
      )}

      {/* Action Items */}
      {result.action_items.length > 0 && <ActionItems items={result.action_items} />}

      {/* Risks */}
      {result.risks.length > 0 && <SectionCard title="리스크/이슈" items={result.risks} editable />}

      {/* Next Steps */}
      {result.next_steps.length > 0 && (
        <SectionCard title="다음 단계" items={result.next_steps} editable />
      )}

      {/* Share Panel */}
      <Card className="border-zinc-200 shadow-sm">
        <CardContent className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-zinc-800">공유</h3>
          <SharePanel result={result} />
        </CardContent>
      </Card>
    </div>
  )
}
