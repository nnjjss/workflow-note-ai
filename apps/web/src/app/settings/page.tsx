"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrCreateDemoUser, setUser } from "@/lib/auth"
import type { User } from "@/lib/auth"

const SLACK_WEBHOOK_KEY = "workflow_note_slack_webhook"

export default function SettingsPage() {
  const [user, setUserState] = useState<User | null>(null)
  const [name, setName] = useState("")
  const [slackWebhook, setSlackWebhook] = useState("")
  const [docCount, setDocCount] = useState(0)
  const [saved, setSaved] = useState(false)
  const [slackSaved, setSlackSaved] = useState(false)

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
    const updated = { ...user, name: name.trim() || "사용자" }
    setUser(updated)
    setUserState(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSaveSlack = () => {
    localStorage.setItem(SLACK_WEBHOOK_KEY, slackWebhook)
    setSlackSaved(true)
    setTimeout(() => setSlackSaved(false), 2000)
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
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-xl font-bold text-zinc-900">설정</h1>

      <div className="flex flex-col gap-6">
        {/* User Info */}
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-800">
              사용자 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">이름</Label>
              <div className="flex gap-2">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="사용자"
                  className="max-w-xs"
                />
                <Button size="sm" onClick={handleSaveName}>
                  저장
                </Button>
                {saved && (
                  <span className="self-center text-xs text-green-600">
                    저장됨
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="max-w-xs"
              />
              <p className="text-xs text-zinc-400">읽기전용</p>
            </div>
          </CardContent>
        </Card>

        {/* Share Settings */}
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-800">
              공유 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  id="slack-webhook"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSaveSlack}>
                  저장
                </Button>
                {slackSaved && (
                  <span className="self-center text-xs text-green-600">
                    저장됨
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                저장 위치: localStorage
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-zinc-500">
                이메일 발송: 서버 설정 필요
              </p>
              <p className="text-sm text-zinc-500">
                카카오 알림톡: 서버 설정 필요
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data */}
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-zinc-800">
              데이터
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-zinc-600">
              저장된 로컬 데이터: {docCount}개
            </p>
            <div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearAll}
              >
                전체 삭제
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
