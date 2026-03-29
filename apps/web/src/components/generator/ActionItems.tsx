"use client"

import { ActionItem } from "@/lib/types"

interface ActionItemsProps {
  items: ActionItem[]
}

const PRIORITY_STYLES: Record<string, string> = {
  high: "badge-red rounded-full px-2.5 py-0.5 text-xs font-semibold",
  medium: "badge-amber rounded-full px-2.5 py-0.5 text-xs font-semibold",
  low: "badge-blue rounded-full px-2.5 py-0.5 text-xs font-semibold",
}

const PRIORITY_LABELS: Record<string, string> = {
  high: "높음",
  medium: "중간",
  low: "낮음",
}

export default function ActionItems({ items }: ActionItemsProps) {
  if (items.length === 0) return null

  return (
    <div className="card-base p-5 animate-fade-in">
      <h3 className="mb-3 text-sm font-bold text-zinc-800 border-l-3 border-blue-500 pl-3">액션아이템</h3>
      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 text-left">
              <th className="py-3 px-4 text-zinc-600 text-xs font-semibold uppercase tracking-wider">업무</th>
              <th className="py-3 px-4 text-zinc-600 text-xs font-semibold uppercase tracking-wider">담당자</th>
              <th className="py-3 px-4 text-zinc-600 text-xs font-semibold uppercase tracking-wider">마감일</th>
              <th className="py-3 px-4 text-zinc-600 text-xs font-semibold uppercase tracking-wider">우선순위</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-t border-zinc-100 hover:bg-zinc-50 even:bg-zinc-50/50 transition-colors">
                <td className="py-3 px-4 text-zinc-700">{item.task}</td>
                <td className="py-3 px-4 text-zinc-600">{item.assignee || "-"}</td>
                <td className="py-3 px-4 text-zinc-600">{item.due_date || "-"}</td>
                <td className="py-3 px-4">
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
    </div>
  )
}
