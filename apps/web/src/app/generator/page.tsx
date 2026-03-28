"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import InputPanel from "@/components/generator/InputPanel"
import ResultPanel from "@/components/generator/ResultPanel"
import { generateDocument, saveDocument, getDocument } from "@/lib/api"
import { DocType, GenerateResponse } from "@/lib/types"
import { getOrCreateDemoUser } from "@/lib/auth"

function GeneratorContent() {
  const searchParams = useSearchParams()
  const docId = searchParams.get("id")

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

  const loadDocument = useCallback(async (id: string) => {
    try {
      const doc = await getDocument(id)
      setTitle(doc.title)
      setDocType(doc.doc_type as DocType)
      setContent(doc.raw_input)
      if (doc.metadata) {
        setMetadata({
          team: (doc.metadata.team as string) || "",
          project: (doc.metadata.project as string) || "",
          attendees: (doc.metadata.attendees as string) || "",
          date: (doc.metadata.date as string) || "",
        })
      }
      if (doc.generated_output) {
        setResult(doc.generated_output as unknown as GenerateResponse)
      }
    } catch {
      // silent fail for loading
    }
  }, [])

  useEffect(() => {
    getOrCreateDemoUser()
  }, [])

  useEffect(() => {
    if (docId) {
      loadDocument(docId)
    }
  }, [docId, loadDocument])

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

      // Auto-save after generation
      try {
        await saveDocument({
          title: title || response.title,
          doc_type: docType,
          raw_input: content,
          metadata: {
            team: metadata.team,
            project: metadata.project,
            attendees: metadata.attendees,
            date: metadata.date,
          },
          generated_output: response as unknown as Record<string, unknown>,
          short_summary: response.summary,
        })
      } catch {
        /* silent fail for auto-save */
      }
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

export default function GeneratorPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-zinc-400">로딩 중...</p>
          </div>
        </div>
      }
    >
      <GeneratorContent />
    </Suspense>
  )
}
