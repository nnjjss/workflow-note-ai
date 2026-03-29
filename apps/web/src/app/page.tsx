import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  PenLine,
  Sparkles,
  Share2,
  FileText,
  BarChart3,
  ClipboardList,
  CheckSquare,
  RefreshCw,
  Send,
  History,
} from "lucide-react"

const STEPS = [
  {
    step: "1",
    title: "메모 입력",
    description: "회의 내용을 자유롭게 입력",
    icon: PenLine,
  },
  {
    step: "2",
    title: "AI 변환",
    description: "구조화된 문서로 변환",
    icon: Sparkles,
  },
  {
    step: "3",
    title: "공유",
    description: "슬랙/이메일로 바로 발송",
    icon: Share2,
  },
]

const DOC_TYPES = [
  {
    icon: FileText,
    title: "회의록",
    description: "회의 메모를 구조화된 회의록으로 자동 정리합니다",
  },
  {
    icon: BarChart3,
    title: "주간보고",
    description: "업무 내용을 보고서 포맷으로 깔끔하게 변환합니다",
  },
  {
    icon: ClipboardList,
    title: "업무일지",
    description: "오늘의 업무를 일지 형식으로 체계적으로 정리합니다",
  },
]

const FEATURES = [
  {
    icon: CheckSquare,
    text: "액션아이템 자동 추출",
  },
  {
    icon: RefreshCw,
    text: "톤 변환 (상사 보고용 / 실무자 공유용)",
  },
  {
    icon: Send,
    text: "슬랙 · 이메일 · 카카오 알림톡 발송",
  },
  {
    icon: History,
    text: "히스토리 저장 · 검색",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center px-4 pb-20 pt-24 text-center bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="animate-fade-in">
          <h1 className="heading-gradient text-4xl font-bold tracking-tight lg:text-5xl">
            메모를 보고서로,
            <br />
            액션아이템까지
          </h1>
          <p className="mt-5 max-w-md text-lg text-zinc-600">
            회의록 · 주간보고 · 업무일지를
            <br />
            AI가 자동으로 정리합니다
          </p>
        </div>
        <div className="mt-10 flex items-center gap-4 animate-fade-in stagger-2">
          <Link href="/generator">
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl text-white px-8 py-3 rounded-xl btn-press text-base transition-all duration-200">
              지금 시작하기
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="outline" className="border border-zinc-300 hover:border-zinc-400 text-zinc-700 text-base rounded-xl px-6 py-3 transition-colors duration-200">
              사용법 보기
            </Button>
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-alt px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-xs font-semibold uppercase tracking-widest text-zinc-400">
            How It Works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.step}
                  className={`card-base p-6 text-center animate-slide-up stagger-${index + 1}`}
                >
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white shadow-md">
                    {step.step}
                  </div>
                  <Icon className="mx-auto mb-3 h-5 w-5 text-blue-600" />
                  <h3 className="mb-1 text-sm font-semibold text-zinc-800">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-500">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Document Types */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-lg font-bold text-zinc-900">
            지원하는 문서 유형
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {DOC_TYPES.map((doc, index) => {
              const Icon = doc.icon
              return (
                <div
                  key={doc.title}
                  className={`card-interactive border-t-2 border-t-blue-500 p-6 text-center animate-slide-up stagger-${index + 1}`}
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-zinc-800">
                    {doc.title}
                  </h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">{doc.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="section-alt px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-lg font-bold text-zinc-900">
            핵심 기능
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.text}
                  className={`card-base flex items-center gap-3 px-5 py-4 animate-slide-up stagger-${index + 1}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-zinc-700">
                    {feature.text}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-900 px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-white">
          지금 바로 사용해보세요
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          회원가입 없이 바로 시작할 수 있습니다
        </p>
        <Link href="/generator" className="mt-8 inline-block">
          <Button className="bg-white text-zinc-900 hover:bg-zinc-100 shadow-lg px-8 py-3 rounded-xl btn-press text-base font-semibold transition-all duration-200">
            무료로 시작하기
          </Button>
        </Link>
      </section>
    </div>
  )
}
