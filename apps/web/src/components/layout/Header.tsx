"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Menu, X } from "lucide-react"

const NAV_ITEMS = [
  { href: "/dashboard", label: "대시보드" },
  { href: "/generator", label: "시작하기" },
  { href: "/history", label: "히스토리" },
  { href: "/settings", label: "설정" },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-zinc-900 transition-colors hover:text-zinc-700">
          <FileText className="h-5 w-5 text-zinc-700" />
          WorkFlow Note
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-sm transition-colors duration-150 ${
                  isActive
                    ? "text-zinc-900 font-semibold border-b-2 border-zinc-900"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <Link href="/generator" className="ml-2">
            <button className="bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg px-4 py-1.5 shadow-sm btn-press transition-colors duration-150">
              무료 시작
            </button>
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white animate-slide-up">
          <nav className="mx-auto max-w-5xl flex flex-col px-4 py-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "text-zinc-900 font-semibold"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/generator"
              onClick={() => setMobileOpen(false)}
              className="mt-2 mb-1"
            >
              <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg px-4 py-2.5 shadow-sm btn-press transition-colors duration-150">
                무료 시작
              </button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
