"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { FileText, BarChart3, ClipboardList, Sparkles, X, Lightbulb } from "lucide-react"

const LS_KEY = "workflow_note_onboarded"

interface OnboardingModalProps {
  open: boolean
  onClose: () => void
  onStartWithExample?: () => void
}

export default function OnboardingModal({ open, onClose, onStartWithExample }: OnboardingModalProps) {
  const router = useRouter()
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  function dismiss() {
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_KEY, "true")
    }
    onClose()
  }

  function handleStartWithExample() {
    dismiss()
    onStartWithExample?.()
  }

  function handleStartDirect() {
    dismiss()
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === backdropRef.current) {
      dismiss()
    }
  }

  if (!open) return null

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl animate-slide-up">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Welcome */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900">
              WorkFlow Note AI에 오신 것을 환영합니다
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              메모를 보고서로, 액션아이템까지
              <br />
              3단계로 바로 시작할 수 있습니다.
            </p>
          </div>

          {/* Steps */}
          <div className="mb-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800">문서 유형 선택</p>
                <div className="mt-1 flex gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">
                    <FileText className="h-3 w-3" /> 회의록
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">
                    <BarChart3 className="h-3 w-3" /> 주간보고
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">
                    <ClipboardList className="h-3 w-3" /> 업무일지
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                2
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800">메모 입력</p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  회의 내용을 자유롭게 붙여넣기
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                3
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800">AI 변환</p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  구조화된 문서 + 액션아이템 자동 추출
                </p>
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="mb-6 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-xs text-amber-700">
              <span className="font-medium">팁:</span> 예시 템플릿으로 바로 체험해보세요
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleStartWithExample}
              className="flex-1 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 btn-press transition-colors"
            >
              예시로 시작하기
            </button>
            <button
              onClick={handleStartDirect}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm btn-press transition-colors"
            >
              바로 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
