"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { rewriteSectionContent } from "@/lib/api"

interface SectionCardProps {
  title: string
  items: string[]
  editable?: boolean
  onUpdate?: (items: string[]) => void
  rewritable?: boolean
  docType?: string
}

const REWRITE_MODES = [
  { mode: "shorter" as const, label: "더 짧게" },
  { mode: "formal" as const, label: "더 공식적으로" },
  { mode: "manager_tone" as const, label: "상사 보고용" },
  { mode: "team_tone" as const, label: "실무자 공유용" },
]

export default function SectionCard({
  title,
  items,
  editable = false,
  onUpdate,
  rewritable = false,
  docType,
}: SectionCardProps) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState("")
  const [previousItems, setPreviousItems] = useState<string[] | null>(null)
  const [rewritingMode, setRewritingMode] = useState<string | null>(null)

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

  const handleRewrite = async (mode: "shorter" | "formal" | "manager_tone" | "team_tone") => {
    setRewritingMode(mode)
    try {
      const content = items.join("\n")
      const res = await rewriteSectionContent({ content, mode, doc_type: docType })
      const newItems = res.rewritten.split("\n").filter((line) => line.trim())
      setPreviousItems(items)
      if (onUpdate) {
        onUpdate(newItems)
      }
    } catch {
      // silent fail
    } finally {
      setRewritingMode(null)
    }
  }

  const handleUndo = () => {
    if (previousItems && onUpdate) {
      onUpdate(previousItems)
      setPreviousItems(null)
    }
  }

  return (
    <Card className="border-zinc-200 shadow-sm">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-800">{title}</h3>
          <div className="flex items-center gap-2">
            {previousItems && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                className="h-7 text-xs text-blue-500 hover:text-blue-700"
              >
                되돌리기
              </Button>
            )}
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
          <>
            <ul className="space-y-1.5">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-300" />
                  {item}
                </li>
              ))}
            </ul>

            {rewritable && !editing && (
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-3">
                {REWRITE_MODES.map(({ mode, label }) => (
                  <Button
                    key={mode}
                    variant="outline"
                    size="xs"
                    disabled={rewritingMode !== null}
                    onClick={() => handleRewrite(mode)}
                    className="text-xs text-zinc-500 hover:text-zinc-700"
                  >
                    {rewritingMode === mode ? (
                      <span className="flex items-center gap-1">
                        <svg
                          className="h-3 w-3 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        {label}
                      </span>
                    ) : (
                      label
                    )}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
