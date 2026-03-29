"use client"

import { ActionItem } from "@/lib/types"

interface ActionItemsProps {
  items: ActionItem[]
}

const PRIORITY_STYLES: Record<string, string> = {
  high: "text-red-600 bg-red-50 text-xs rounded px-2 py-0.5 font-medium",
  medium: "text-amber-600 bg-amber-50 text-xs rounded px-2 py-0.5 font-medium",
  low: "text-zinc-500 bg-zinc-100 text-xs rounded px-2 py-0.5 font-medium",
}

const PRIORITY_LABELS: Record<string, string> = {
  high: "높음",
  medium: "중간",
  low: "낮음",
}

export default function ActionItems({ items }: ActionItemsProps) {
  if (items.length === 0) return null

  return (
    <div className="border border-zinc-200 rounded-lg bg-white p-5 animate-fade-in">
      <h3 className="mb-3 text-sm font-bold text-zinc-800 border-l-2 border-zinc-300 pl-3">액션아이템</h3>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 text-left">
              <th className="py-2.5 px-4 text-zinc-600 text-xs font-semibold uppercase tracking-wider">업무</th>
              <th className="py-2.5 px-4 text-zinc-600 text-xs font-semibold uppercase tracking-wider">담당자</th>
              <th className="py-2.5 px-4 text-zinc-600 text-xs font-semibold uppercase tracking-wider">마감일</th>
              <th className="py-2.5 px-4 text-zinc-600 text-xs font-semibold uppercase tracking-wider">우선순위</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-t border-zinc-100 hover:bg-zinc-50 transition-colors">
                <td className="py-2.5 px-4 text-zinc-700">{item.task}</td>
                <td className="py-2.5 px-4 text-zinc-600">{item.assignee || "-"}</td>
                <td className="py-2.5 px-4 text-zinc-600">{item.due_date || "-"}</td>
                <td className="py-2.5 px-4">
                  <span
                    className={PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.low}
                  >
                    {PRIORITY_LABELS[item.priority] || item.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card layout */}
      <div className="md:hidden space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-zinc-200 rounded-lg bg-white p-3">
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium text-sm text-zinc-700">{item.task}</span>
              <span
                className={`shrink-0 ${PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.low}`}
              >
                {PRIORITY_LABELS[item.priority] || item.priority}
              </span>
            </div>
            <div className="mt-1.5 flex gap-3 text-xs text-zinc-500">
              <span>{item.assignee || "-"}</span>
              <span>{item.due_date || "-"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
