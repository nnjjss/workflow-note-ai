"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText } from "lucide-react"

const NAV_ITEMS = [
  { href: "/generator", label: "시작하기" },
  { href: "/history", label: "히스토리" },
  { href: "/settings", label: "설정" },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 backdrop-blur-sm bg-white/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-zinc-900 transition-colors hover:text-zinc-700">
          <FileText className="h-5 w-5 text-blue-600" />
          WorkFlow Note
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors duration-150 ${
                  isActive
                    ? "text-blue-600 font-semibold bg-blue-50"
                    : "text-zinc-600 hover:text-blue-600 hover:bg-zinc-100"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <Link href="/generator" className="ml-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-1.5 shadow-sm btn-press transition-colors duration-150">
              무료 시작
            </button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
