"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-zinc-900">
          WorkFlow Note AI
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/generator">
            <Button
              variant={pathname === "/generator" ? "default" : "ghost"}
              size="sm"
            >
              시작하기
            </Button>
          </Link>
          <Link href="/history">
            <Button
              variant={pathname === "/history" ? "default" : "ghost"}
              size="sm"
            >
              히스토리
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
