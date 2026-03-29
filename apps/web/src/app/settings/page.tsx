"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getOrCreateDemoUser, setUser } from "@/lib/auth"
import type { User } from "@/lib/auth"
import { useToast } from "@/components/ui/Toast"
import {
  Settings,
  User as UserIcon,
  Share2,
  Database,
  Trash2,
  Save,
  Loader2,
} from "lucide-react"

const SLACK_WEBHOOK_KEY = "workflow_note_slack_webhook"

export default function SettingsPage() {
  const [user, setUserState] = useState<User | null>(null)
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [slackWebhook, setSlackWebhook] = useState("")
  const [docCount, setDocCount] = useState(0)
  const [saving, setSaving] = useState(false)
  const [slackSaving, setSlackSaving] = useState(false)

  useEffect(() => {
    const u = getOrCreateDemoUser()
    setUserState(u)
    setName(u.name)

    const webhook = localStorage.getItem(SLACK_WEBHOOK_KEY) || ""
    setSlackWebhook(webhook)

    // Count saved documents from localStorage keys or API
    try {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith("workflow_note_")
      )
      // Exclude user and webhook keys
      setDocCount(
        keys.filter(
          (k) => k !== "workflow_note_user" && k !== SLACK_WEBHOOK_KEY
        ).length
      )
    } catch {
      setDocCount(0)
    }
  }, [])

  const handleSaveName = () => {
    if (!user) return
    setSaving(true)
    const updated = { ...user, name: name.trim() || "사용자" }
    setUser(updated)
    setUserState(updated)
    toast("이름이 저장되었습니다", "success")
    setTimeout(() => setSaving(false), 500)
  }

  const handleSaveSlack = () => {
    setSlackSaving(true)
    localStorage.setItem(SLACK_WEBHOOK_KEY, slackWebhook)
    toast("Slack Webhook URL이 저장되었습니다", "success")
    setTimeout(() => setSlackSaving(false), 500)
  }

  const handleClearAll = () => {
    if (!confirm("모든 로컬 데이터를 삭제하시겠습니까?")) return
    const keysToRemove = Object.keys(localStorage).filter((k) =>
      k.startsWith("workflow_note_")
    )
    keysToRemove.forEach((k) => localStorage.removeItem(k))
    setDocCount(0)
    // Re-create demo user
    const u = getOrCreateDemoUser()
    setUserState(u)
    setName(u.name)
    setSlackWebhook("")
    toast("모든 데이터가 삭제되었습니다", "success")
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <Settings className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">설정</h1>
            <p className="text-sm text-zinc-500">계정 및 환경 설정을 관리합니다</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* User Info */}
        <div className="card-base p-6 animate-fade-in stagger-1">
          <div className="mb-5 flex items-center gap-2">
            <UserIcon className="h-4.5 w-4.5 text-zinc-500" />
            <h2 className="text-sm font-bold text-zinc-800">사용자 정보</h2>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-sm font-semibold text-zinc-800">이름</Label>
              <div className="flex gap-2">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="사용자"
                  className="max-w-xs input-focus"
                />
                <Button
                  size="sm"
                  onClick={handleSaveName}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg btn-press gap-1.5"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      저장 중
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      저장
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-zinc-800">이메일</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="max-w-xs bg-zinc-100 text-zinc-500 cursor-not-allowed"
              />
              <p className="text-xs text-zinc-400">읽기전용</p>
            </div>
          </div>
        </div>

        {/* Share Settings */}
        <div className="card-base p-6 animate-fade-in stagger-2">
          <div className="mb-5 flex items-center gap-2">
            <Share2 className="h-4.5 w-4.5 text-zinc-500" />
            <h2 className="text-sm font-bold text-zinc-800">공유 설정</h2>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="slack-webhook" className="text-sm font-semibold text-zinc-800">Slack Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  id="slack-webhook"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="flex-1 input-focus"
                />
                <Button
                  size="sm"
                  onClick={handleSaveSlack}
                  disabled={slackSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg btn-press gap-1.5"
                >
                  {slackSaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      저장 중
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      저장
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-zinc-400">저장 위치: localStorage</p>
            </div>
            <div className="flex flex-col gap-1.5 rounded-lg bg-zinc-50 p-3">
              <p className="text-sm text-zinc-500">이메일 발송: 서버 설정 필요</p>
              <p className="text-sm text-zinc-500">카카오 알림톡: 서버 설정 필요</p>
            </div>
          </div>
        </div>

        {/* Data */}
        <div className="card-base p-6 animate-fade-in stagger-3">
          <div className="mb-5 flex items-center gap-2">
            <Database className="h-4.5 w-4.5 text-zinc-500" />
            <h2 className="text-sm font-bold text-zinc-800">데이터</h2>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-zinc-600">
              저장된 로컬 데이터: <span className="font-semibold text-zinc-800">{docCount}개</span>
            </p>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="mb-3 text-sm text-red-700">모든 로컬 데이터를 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearAll}
                className="gap-1.5 btn-press"
              >
                <Trash2 className="h-3.5 w-3.5" />
                전체 삭제
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
