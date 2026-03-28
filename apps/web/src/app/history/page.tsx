import { Card, CardContent } from "@/components/ui/card"

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-900">히스토리</h1>
        <p className="mt-1 text-sm text-zinc-500">
          생성한 문서 목록을 확인할 수 있습니다
        </p>
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardContent className="flex min-h-[300px] items-center justify-center p-6">
          <div className="text-center">
            <p className="text-sm text-zinc-400">Phase 2에서 제공될 예정입니다</p>
            <p className="mt-1 text-xs text-zinc-300">
              문서 저장, 검색, 수정 기능이 추가됩니다
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
