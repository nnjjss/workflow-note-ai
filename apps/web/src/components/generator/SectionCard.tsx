"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { rewriteSectionContent } from "@/lib/api"
import { Loader2, Undo2, Pencil, RefreshCw, ChevronDown } from "lucide-react"

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
  const [collapsed, setCollapsed] = useState(false)
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

  const handleRegenerate = async () => {
    setRewritingMode("regenerate")
    try {
      const content = items.join("\n")
      const res = await rewriteSectionContent({ content, mode: "regenerate", doc_type: docType })
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
    <div className="border border-zinc-200 rounded-lg bg-white p-5 animate-fade-in">
      <div className={`${collapsed ? "" : "mb-3"} flex items-center justify-between`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1.5 group"
        >
          <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform duration-200 group-hover:text-zinc-600 ${collapsed ? "-rotate-90" : ""}`} />
          <h3 className="text-sm font-bold text-zinc-800 border-l-2 border-zinc-300 pl-3">{title}</h3>
        </button>
        <div className="flex items-center gap-2">
          {previousItems && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              className="h-7 text-xs text-zinc-500 hover:text-zinc-900 gap-1"
            >
              <Undo2 className="h-3.5 w-3.5" />
              되돌리기
            </Button>
          )}
          {rewritable && !editing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerate}
              disabled={rewritingMode !== null}
              className="h-7 text-xs text-zinc-600 hover:text-zinc-900 gap-1"
            >
              {rewritingMode === "regenerate" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              다시 생성
            </Button>
          )}
          {editable && !editing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-7 text-xs text-zinc-600 hover:text-zinc-900 gap-1"
            >
              <Pencil className="h-3.5 w-3.5" />
              편집
            </Button>
          )}
        </div>
      </div>

      {!collapsed && (
        <>
          {editing ? (
            <div className="space-y-3">
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={Math.max(3, items.length)}
                className="resize-y input-focus text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="h-8 text-xs rounded-lg border-zinc-200"
                >
                  취소
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="h-8 bg-zinc-900 text-xs text-white hover:bg-zinc-800 rounded-lg btn-press"
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
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                    {item}
                  </li>
                ))}
              </ul>

              {rewritable && !editing && (
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-3">
                  {REWRITE_MODES.map(({ mode, label }) => (
                    <button
                      key={mode}
                      type="button"
                      disabled={rewritingMode !== null}
                      onClick={() => handleRewrite(mode)}
                      className="rounded px-3 py-1.5 text-xs font-medium bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {rewritingMode === mode ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          {label}
                        </span>
                      ) : (
                        label
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
