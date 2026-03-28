import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const STEPS = [
  {
    step: "1",
    title: "메모 입력",
    description: "회의 내용을 자유롭게 입력",
  },
  {
    step: "2",
    title: "AI 변환",
    description: "구조화된 문서로 변환",
  },
  {
    step: "3",
    title: "공유",
    description: "슬랙/이메일로 바로 발송",
  },
]

const DOC_TYPES = [
  {
    icon: "\uD83D\uDCDD",
    title: "회의록",
    description: "회의 메모를 구조화된 회의록으로",
  },
  {
    icon: "\uD83D\uDCCA",
    title: "주간보고",
    description: "업무 내용을 보고서 포맷으로",
  },
  {
    icon: "\uD83D\uDCCB",
    title: "업무일지",
    description: "오늘의 업무를 일지 형식으로 정리",
  },
]

const FEATURES = [
  {
    icon: "\u2705",
    text: "액션아이템 자동 추출",
  },
  {
    icon: "\uD83D\uDD04",
    text: "톤 변환 (상사 보고용 / 실무자 공유용)",
  },
  {
    icon: "\uD83D\uDCE8",
    text: "슬랙 \u00B7 이메일 \u00B7 카카오 알림톡 발송",
  },
  {
    icon: "\uD83D\uDCDA",
    text: "히스토리 저장 \u00B7 검색",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center px-4 pb-20 pt-24 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
          메모를 보고서로,
          <br />
          액션아이템까지
        </h1>
        <p className="mt-5 max-w-md text-base text-zinc-500 sm:text-lg">
          회의록 · 주간보고 · 업무일지를
          <br />
          AI가 자동으로 정리합니다
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Link href="/generator">
            <Button className="bg-blue-600 px-8 py-2.5 text-base text-white hover:bg-blue-700">
              지금 시작하기
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="ghost" className="text-base text-zinc-600">
              사용법 보기 ↓
            </Button>
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-xs font-semibold uppercase tracking-widest text-zinc-400">
            How It Works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.step} className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {step.step}
                </div>
                <h3 className="mb-1 text-sm font-semibold text-zinc-800">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-500">{step.description}</p>
              </div>
            ))}
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
            {DOC_TYPES.map((doc) => (
              <Card key={doc.title} className="border-zinc-200 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="mb-3 text-3xl">{doc.icon}</div>
                  <h3 className="mb-1 text-sm font-semibold text-zinc-800">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-zinc-500">{doc.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-zinc-50 px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-lg font-bold text-zinc-900">
            핵심 기능
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-3 rounded-lg bg-white px-5 py-4 ring-1 ring-zinc-200"
              >
                <span className="text-xl">{feature.icon}</span>
                <span className="text-sm font-medium text-zinc-700">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-zinc-900">
          지금 바로 사용해보세요
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          회원가입 없이 바로 시작할 수 있습니다
        </p>
        <Link href="/generator" className="mt-8 inline-block">
          <Button className="bg-blue-600 px-8 py-2.5 text-base text-white hover:bg-blue-700">
            무료로 시작하기
          </Button>
        </Link>
      </section>
    </div>
  )
}
