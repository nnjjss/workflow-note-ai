"use client"

import { FileText, BarChart3, ClipboardList, ArrowRight } from "lucide-react"
import { DocType } from "@/lib/types"

interface OutputPreview {
  summary: string
  actionItems: Array<{ task: string; owner: string; priority: "high" | "medium" | "low" }>
  keyDecision: string
}

interface SampleScenario {
  id: string
  icon: typeof FileText
  iconColor: string
  accentColor: string
  badgeClass: string
  outputBg: string
  outputBorder: string
  type: DocType
  typeLabel: string
  title: string
  situation: string
  inputPreview: string
  outputPreview: OutputPreview
  fullInput: {
    title: string
    content: string
    metadata: { team: string; project: string; attendees: string; date: string }
  }
}

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-400",
  low: "bg-blue-400",
}

const SCENARIOS: SampleScenario[] = [
  {
    id: "marketing-meeting",
    icon: FileText,
    iconColor: "text-blue-500",
    accentColor: "border-l-blue-500",
    badgeClass: "badge-blue",
    outputBg: "from-blue-50/60 to-white",
    outputBorder: "border-blue-100",
    type: "meeting_note",
    typeLabel: "회의록",
    title: "마케팅 팀 Q2 전략 회의",
    situation: "팀원 4명이 참석한 1시간 회의. 다음 분기 캠페인과 예산 논의.",
    inputPreview:
      "참석자: 김팀장, 이대리, 박사원, 최인턴\n일시: 2026년 3월 27일 오후 2시\n\n1. Q2 마케팅 캠페인 진행 상황 공유...",
    outputPreview: {
      summary:
        "Q2 마케팅 캠페인 성과 점검 및 5월 프로모션 기획 방향을 논의하였습니다. SNS 광고 CTR 2.3%로 전주 대비 상승했으며, 인플루언서 콜라보 3건이 확정되었습니다.",
      actionItems: [
        { task: "5월 프로모션 기획안 초안 작성", owner: "김팀장", priority: "high" },
        { task: "인플루언서 콜라보 계약서 검토", owner: "이대리", priority: "medium" },
        { task: "디자인 인력 채용 면접 일정 확정", owner: "박사원", priority: "high" },
      ],
      keyDecision: "5월 프로모션 예산 500만원 승인 (김팀장 결정, 효력: 2026-03-27)",
    },
    fullInput: {
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
      metadata: {
        team: "마케팅팀",
        project: "Q2 캠페인",
        attendees: "김팀장, 이대리, 박사원",
        date: "2026-03-27",
      },
    },
  },
  {
    id: "dev-weekly",
    icon: BarChart3,
    iconColor: "text-emerald-500",
    accentColor: "border-l-emerald-500",
    badgeClass: "badge-green",
    outputBg: "from-emerald-50/60 to-white",
    outputBorder: "border-emerald-100",
    type: "weekly_report",
    typeLabel: "주간보고",
    title: "개발팀 3월 4주차 주간보고",
    situation: "백엔드 팀 5명의 이번 주 업무 성과와 다음 주 계획.",
    inputPreview:
      "금주 완료:\n- 결제 모듈 v2.1 배포 완료\n- API 응답속도 40% 개선...",
    outputPreview: {
      summary:
        "결제 모듈 v2.1 배포 완료 및 API 응답속도 40% 개선. 서버 비용 최적화 검토 중이며, 차주 보안 패치 적용 예정.",
      actionItems: [
        { task: "서버 비용 최적화 보고서 작성", owner: "박개발", priority: "high" },
        { task: "보안 패치 테스트 환경 구성", owner: "최시니어", priority: "medium" },
      ],
      keyDecision: "API v2 마이그레이션 일정: 4월 2주차 확정",
    },
    fullInput: {
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
      metadata: {
        team: "사업개발팀",
        project: "Q1 사업계획",
        attendees: "",
        date: "2026-03-27",
      },
    },
  },
  {
    id: "pm-daily",
    icon: ClipboardList,
    iconColor: "text-amber-500",
    accentColor: "border-l-amber-500",
    badgeClass: "badge-amber",
    outputBg: "from-amber-50/60 to-white",
    outputBorder: "border-amber-100",
    type: "daily_log",
    typeLabel: "업무일지",
    title: "3월 27일 PM 업무일지",
    situation: "프로덕트 매니저의 하루 업무 기록. 고객 미팅 2건과 내부 리뷰.",
    inputPreview:
      "오전: 고객사 A 요구사항 미팅\n오후: 스프린트 리뷰 + API 연동 QA\n\n완료: 고객 요구사항 문서...",
    outputPreview: {
      summary:
        "고객사 A 요구사항 정리 완료 및 스프린트 리뷰 진행. 결제 모듈 API 연동 테스트 통과. 테스트 서버 DB 간헐적 끊김 이슈 발생.",
      actionItems: [
        { task: "결제 모듈 개발 착수", owner: "나", priority: "high" },
        { task: "DB 연결 이슈 인프라팀 에스컬레이션", owner: "나", priority: "medium" },
      ],
      keyDecision: "고객사 A 2차 미팅: 4월 1일 확정",
    },
    fullInput: {
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
      metadata: {
        team: "개발팀",
        project: "고객사 프로젝트",
        attendees: "",
        date: "2026-03-27",
      },
    },
  },
]

interface SampleScenariosProps {
  onSelect: (scenario: {
    type: DocType
    title: string
    content: string
    metadata: { team: string; project: string; attendees: string; date: string }
  }) => void
}

function ScenarioCard({
  scenario,
  index,
  onSelect,
}: {
  scenario: SampleScenario
  index: number
  onSelect: SampleScenariosProps["onSelect"]
}) {
  const Icon = scenario.icon

  return (
    <div
      className={`card-interactive border-l-4 ${scenario.accentColor} p-5 sm:p-6 animate-slide-up stagger-${index + 1}`}
    >
      {/* Badge */}
      <span
        className={`${scenario.badgeClass} inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold`}
      >
        <Icon className="h-3 w-3" />
        {scenario.typeLabel}
      </span>

      {/* Title & Situation */}
      <h3 className="mt-3 text-base font-bold text-zinc-900 sm:text-lg">
        {scenario.title}
      </h3>
      <p className="mt-1 text-sm text-zinc-500">{scenario.situation}</p>

      {/* Input Preview */}
      <div className="mt-4 rounded-lg bg-zinc-50 p-3">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          입력 예시
        </p>
        <p className="whitespace-pre-line font-mono text-xs leading-relaxed text-zinc-600 line-clamp-3">
          {scenario.inputPreview}
        </p>
      </div>

      {/* Output Preview */}
      <div
        className={`mt-3 rounded-lg border ${scenario.outputBorder} bg-gradient-to-br ${scenario.outputBg} p-4`}
      >
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          AI 결과 미리보기
        </p>

        {/* Summary */}
        <div className="mb-3">
          <p className="mb-1 text-xs font-bold text-zinc-700 flex items-center gap-1">
            <span className="inline-block h-3.5 w-0.5 rounded-full bg-blue-500" />
            핵심 요약
          </p>
          <p className="text-sm leading-relaxed text-zinc-600 line-clamp-2">
            {scenario.outputPreview.summary}
          </p>
        </div>

        {/* Action Items */}
        <div className="mb-3">
          <p className="mb-1.5 text-xs font-bold text-zinc-700 flex items-center gap-1">
            <span className="inline-block h-3.5 w-0.5 rounded-full bg-blue-500" />
            액션아이템 ({scenario.outputPreview.actionItems.length}건)
          </p>
          <div className="space-y-1">
            {scenario.outputPreview.actionItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[item.priority]}`}
                />
                <span className="text-zinc-700 truncate">{item.task}</span>
                <span className="ml-auto shrink-0 text-xs text-zinc-400">
                  {item.owner}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Decision */}
        <div className="rounded-md bg-white/70 px-3 py-2 border border-zinc-100">
          <p className="text-xs font-bold text-zinc-700 flex items-center gap-1 mb-0.5">
            <span className="inline-block h-3.5 w-0.5 rounded-full bg-blue-500" />
            주요 결정
          </p>
          <p className="text-sm font-medium text-blue-800">
            {scenario.outputPreview.keyDecision}
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() =>
          onSelect({
            type: scenario.type,
            title: scenario.fullInput.title,
            content: scenario.fullInput.content,
            metadata: scenario.fullInput.metadata,
          })
        }
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700 btn-press"
      >
        이 예시로 시작하기
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

/** Condensed card for landing page -- shows only the output preview */
export function SampleScenarioCondensed({
  scenario,
}: {
  scenario: (typeof SCENARIOS)[number]
}) {
  const Icon = scenario.icon

  return (
    <div className={`rounded-xl border border-zinc-200 bg-white shadow-sm border-l-4 ${scenario.accentColor} p-5`}>
      {/* Badge + Title */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`${scenario.badgeClass} inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold`}
        >
          <Icon className="h-3 w-3" />
          {scenario.typeLabel}
        </span>
        <span className="text-sm font-bold text-zinc-800">{scenario.title}</span>
      </div>

      {/* Output Preview */}
      <div
        className={`rounded-lg border ${scenario.outputBorder} bg-gradient-to-br ${scenario.outputBg} p-4`}
      >
        {/* Summary */}
        <div className="mb-3">
          <p className="mb-1 text-xs font-bold text-zinc-700 flex items-center gap-1">
            <span className="inline-block h-3.5 w-0.5 rounded-full bg-blue-500" />
            핵심 요약
          </p>
          <p className="text-sm leading-relaxed text-zinc-600 line-clamp-2">
            {scenario.outputPreview.summary}
          </p>
        </div>

        {/* Action Items */}
        <div className="mb-3">
          <p className="mb-1.5 text-xs font-bold text-zinc-700 flex items-center gap-1">
            <span className="inline-block h-3.5 w-0.5 rounded-full bg-blue-500" />
            액션아이템 ({scenario.outputPreview.actionItems.length}건)
          </p>
          <div className="space-y-1">
            {scenario.outputPreview.actionItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[item.priority]}`}
                />
                <span className="text-zinc-700 truncate">{item.task}</span>
                <span className="ml-auto shrink-0 text-xs text-zinc-400">
                  {item.owner}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Decision */}
        <div className="rounded-md bg-white/70 px-3 py-2 border border-zinc-100">
          <p className="text-xs font-bold text-zinc-700 flex items-center gap-1 mb-0.5">
            <span className="inline-block h-3.5 w-0.5 rounded-full bg-blue-500" />
            주요 결정
          </p>
          <p className="text-sm font-medium text-blue-800">
            {scenario.outputPreview.keyDecision}
          </p>
        </div>
      </div>
    </div>
  )
}

export { SCENARIOS }

export default function SampleScenarios({ onSelect }: SampleScenariosProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
          Sample Scenarios
        </p>
        <h2 className="text-lg font-bold text-zinc-900">
          예시를 클릭해서 바로 체험해보세요
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          실제 업무 시나리오로 AI 문서 생성 결과를 미리 확인할 수 있습니다
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {SCENARIOS.map((scenario, index) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            index={index}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
