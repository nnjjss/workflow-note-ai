"use client"

import { useState } from "react"
import InputPanel from "@/components/generator/InputPanel"
import ResultPanel from "@/components/generator/ResultPanel"
import { generateDocument } from "@/lib/api"
import { DocType, GenerateResponse } from "@/lib/types"

export default function GeneratorPage() {
  const [docType, setDocType] = useState<DocType>("meeting_note")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [metadata, setMetadata] = useState({
    team: "",
    project: "",
    attendees: "",
    date: "",
  })
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!content.trim()) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await generateDocument({
        doc_type: docType,
        title: title || "무제",
        content,
        metadata: {
          team: metadata.team || undefined,
          project: metadata.project || undefined,
          attendees: metadata.attendees || undefined,
          date: metadata.date || undefined,
        },
      })
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : "생성에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-900">문서 생성</h1>
        <p className="mt-1 text-sm text-zinc-500">
          메모를 입력하면 AI가 구조화된 문서로 정리합니다
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Input */}
        <div>
          <InputPanel
            docType={docType}
            setDocType={setDocType}
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            metadata={metadata}
            setMetadata={setMetadata}
            onGenerate={handleGenerate}
            loading={loading}
          />
          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Right: Result */}
        <div>
          <ResultPanel result={result} loading={loading} />
        </div>
      </div>
    </div>
  )
}
