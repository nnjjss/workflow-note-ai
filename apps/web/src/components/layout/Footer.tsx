import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">WorkFlow Note AI</h3>
            <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
              메모를 보고서로, 액션아이템까지.
              <br />
              AI가 업무 문서를 자동으로 정리합니다.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900">제품</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-zinc-500">
              <li>
                <Link href="/generator" className="transition-colors hover:text-blue-600">문서 생성</Link>
              </li>
              <li>
                <Link href="/history" className="transition-colors hover:text-blue-600">히스토리</Link>
              </li>
              <li>
                <Link href="/settings" className="transition-colors hover:text-blue-600">설정</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900">소셜</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-zinc-500">
              <li>
                <span className="text-zinc-400">Twitter (준비 중)</span>
              </li>
              <li>
                <span className="text-zinc-400">LinkedIn (준비 중)</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-400">
          &copy; {new Date().getFullYear()} WorkFlow Note AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
