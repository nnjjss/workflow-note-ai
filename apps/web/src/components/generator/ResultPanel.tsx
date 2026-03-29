"use client"

import { GenerateResponse } from "@/lib/types"
import SectionCard from "./SectionCard"
import ActionItems from "./ActionItems"
import SharePanel from "./SharePanel"
import { FileText } from "lucide-react"

interface ResultPanelProps {
  result: GenerateResponse | null
  loading: boolean
}

export default function ResultPanel({ result, loading }: ResultPanelProps) {
  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        {/* Title skeleton */}
        <div className="border border-zinc-200 rounded-lg bg-white p-5">
          <div className="h-5 w-48 mb-2 bg-zinc-100 rounded" />
          <div className="h-4 w-32 bg-zinc-100 rounded" />
        </div>
        {/* Summary skeleton */}
        <div className="border border-zinc-200 rounded-lg bg-white p-5">
          <div className="h-4 w-24 mb-3 bg-zinc-100 rounded" />
          <div className="h-3 w-full mb-2 bg-zinc-100 rounded" />
          <div className="h-3 w-4/5 mb-2 bg-zinc-100 rounded" />
          <div className="h-3 w-3/5 bg-zinc-100 rounded" />
        </div>
        {/* Key points skeleton */}
        <div className="border border-zinc-200 rounded-lg bg-white p-5">
          <div className="h-4 w-28 mb-3 bg-zinc-100 rounded" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-zinc-100 rounded" />
            <div className="h-3 w-5/6 bg-zinc-100 rounded" />
            <div className="h-3 w-4/6 bg-zinc-100 rounded" />
          </div>
        </div>
        {/* Action items skeleton */}
        <div className="border border-zinc-200 rounded-lg bg-white p-5">
          <div className="h-4 w-28 mb-3 bg-zinc-100 rounded" />
          <div className="space-y-2">
            <div className="h-8 w-full bg-zinc-100 rounded" />
            <div className="h-8 w-full bg-zinc-100 rounded" />
            <div className="h-8 w-4/5 bg-zinc-100 rounded" />
          </div>
        </div>
        <p className="text-center text-sm text-zinc-400 pt-2">문서를 생성하고 있습니다...</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="border border-zinc-200 rounded-lg bg-white p-5">
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
          <FileText className="h-12 w-12 text-zinc-300" />
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-400">아직 생성된 문서가 없습니다</p>
            <p className="mt-1 text-xs text-zinc-300">왼쪽에서 내용을 입력하고 문서를 생성해보세요</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="animate-fade-in rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-bold text-zinc-900">{result.title}</h2>
      </div>

      {/* Summary */}
      <div className="border border-zinc-200 rounded-lg bg-white p-5 animate-fade-in">
        <h3 className="mb-2 text-sm font-bold text-zinc-800 border-l-2 border-zinc-300 pl-3">핵심 요약</h3>
        <p className="text-sm leading-relaxed text-zinc-600">{result.summary}</p>
      </div>

      {/* Key Points */}
      <SectionCard title="주요 포인트" items={result.key_points} editable rewritable docType={result.doc_type} />

      {/* Decisions */}
      {result.decisions.length > 0 && (
        <SectionCard title="결정사항" items={result.decisions} editable rewritable docType={result.doc_type} />
      )}

      {/* Type-specific: meeting_note */}
      {result.doc_type === "meeting_note" && (
        <>
          {result.agenda && result.agenda.length > 0 && (
            <SectionCard title="안건" items={result.agenda} editable rewritable docType={result.doc_type} />
          )}
          {result.discussion && result.discussion.length > 0 && (
            <SectionCard title="논의사항" items={result.discussion} editable rewritable docType={result.doc_type} />
          )}
        </>
      )}

      {/* Type-specific: weekly_report */}
      {result.doc_type === "weekly_report" && (
        <>
          {result.completed_work && result.completed_work.length > 0 && (
            <SectionCard title="금주 완료" items={result.completed_work} editable rewritable docType={result.doc_type} />
          )}
          {result.next_week_plan && result.next_week_plan.length > 0 && (
            <SectionCard title="차주 계획" items={result.next_week_plan} editable rewritable docType={result.doc_type} />
          )}
        </>
      )}

      {/* Type-specific: daily_log */}
      {result.doc_type === "daily_log" && (
        <>
          {result.today_work && result.today_work.length > 0 && (
            <SectionCard title="오늘 업무" items={result.today_work} editable rewritable docType={result.doc_type} />
          )}
          {result.outcomes && result.outcomes.length > 0 && (
            <SectionCard title="성과" items={result.outcomes} editable rewritable docType={result.doc_type} />
          )}
          {result.blockers && result.blockers.length > 0 && (
            <SectionCard title="장애요소" items={result.blockers} editable rewritable docType={result.doc_type} />
          )}
        </>
      )}

      {/* Action Items */}
      {result.action_items.length > 0 && <ActionItems items={result.action_items} />}

      {/* Risks */}
      {result.risks.length > 0 && <SectionCard title="리스크/이슈" items={result.risks} editable rewritable docType={result.doc_type} />}

      {/* Next Steps */}
      {result.next_steps.length > 0 && (
        <SectionCard title="다음 단계" items={result.next_steps} editable rewritable docType={result.doc_type} />
      )}

      {/* Share Panel */}
      <div className="border border-zinc-200 rounded-lg bg-white p-5 animate-fade-in">
        <h3 className="mb-3 text-sm font-bold text-zinc-800 border-l-2 border-zinc-300 pl-3">공유</h3>
        <SharePanel result={result} title={result.title} />
      </div>
    </div>
  )
}
