"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface SectionCardProps {
  title: string
  items: string[]
  editable?: boolean
  onUpdate?: (items: string[]) => void
}

export default function SectionCard({ title, items, editable = false, onUpdate }: SectionCardProps) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState("")

  if (items.length === 0) return null

  const handleEdit = () => {
    setEditValue(items.join("\n"))
    setEditing(true)
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editValue.split("\n").filter((line) => line.trim()))
    }
    setEditing(false)
  }

  const handleCancel = () => {
    setEditing(false)
  }

  return (
    <Card className="border-zinc-200 shadow-sm">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-800">{title}</h3>
          {editable && !editing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-7 text-xs text-zinc-400 hover:text-zinc-600"
            >
              편집
            </Button>
          )}
        </div>

        {editing ? (
          <div className="space-y-2">
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={Math.max(3, items.length)}
              className="resize-y border-zinc-200 text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel} className="h-7 text-xs">
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="h-7 bg-blue-600 text-xs text-white hover:bg-blue-700"
              >
                저장
              </Button>
            </div>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-300" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
