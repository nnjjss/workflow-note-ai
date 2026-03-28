import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const FEATURES = [
  {
    icon: "\uD83D\uDCDD",
    title: "회의록 자동 생성",
    description: "회의 메모를 구조화된 회의록으로",
  },
  {
    icon: "\uD83D\uDCCA",
    title: "주간보고 · 업무일지",
    description: "업무 메모를 보고서 포맷으로",
  },
  {
    icon: "\u2705",
    title: "액션아이템 추출",
    description: "담당자 · 마감일 자동 정리",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center px-4 pb-16 pt-20 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          메모를 보고서로, 액션아이템까지
        </h1>
        <p className="mt-4 max-w-lg text-base text-zinc-500">
          회의록 · 주간보고 · 업무일지를 AI가 자동으로 정리합니다
        </p>
        <Link href="/generator" className="mt-8">
          <Button className="bg-blue-600 px-8 py-2.5 text-base text-white hover:bg-blue-700">
            지금 시작하기
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="mx-auto grid w-full max-w-3xl gap-4 px-4 pb-20 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="border-zinc-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="mb-3 text-3xl">{feature.icon}</div>
              <h3 className="mb-1 text-sm font-semibold text-zinc-800">{feature.title}</h3>
              <p className="text-sm text-zinc-500">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
