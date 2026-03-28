"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ActionItem } from "@/lib/types"

interface ActionItemsProps {
  items: ActionItem[]
}

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-zinc-100 text-zinc-600 border-zinc-200",
}

const PRIORITY_LABELS: Record<string, string> = {
  high: "높음",
  medium: "중간",
  low: "낮음",
}

export default function ActionItems({ items }: ActionItemsProps) {
  if (items.length === 0) return null

  return (
    <Card className="border-zinc-200 shadow-sm">
      <CardContent className="p-5">
        <h3 className="mb-3 text-sm font-semibold text-zinc-800">액션아이템</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-left text-xs text-zinc-500">
                <th className="pb-2 pr-4 font-medium">업무</th>
                <th className="pb-2 pr-4 font-medium">담당자</th>
                <th className="pb-2 pr-4 font-medium">마감일</th>
                <th className="pb-2 font-medium">우선순위</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-zinc-50 last:border-0">
                  <td className="py-2.5 pr-4 text-zinc-700">{item.task}</td>
                  <td className="py-2.5 pr-4 text-zinc-600">{item.assignee || "-"}</td>
                  <td className="py-2.5 pr-4 text-zinc-600">{item.due_date || "-"}</td>
                  <td className="py-2.5">
                    <Badge
                      variant="outline"
                      className={`text-xs ${PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.low}`}
                    >
                      {PRIORITY_LABELS[item.priority] || item.priority}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
