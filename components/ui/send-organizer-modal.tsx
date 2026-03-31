"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Props = {
  onClose: () => void
  onSuccess: () => void
}

type ClientOption = { id: string; name: string; entity_type: string | null }

const TEMPLATE_TYPES = [
  { value: "1040", label: "Individual (1040)" },
  { value: "1120s", label: "S-Corp (1120-S)" },
  { value: "1065", label: "Partnership (1065)" },
  { value: "1120", label: "C-Corp (1120)" },
  { value: "1041", label: "Estate/Trust (1041)" },
]

function displayEntityType(raw: string | null): string {
  const map: Record<string, string> = {
    '1040': '1040', '1120': '1120', '1120s': '1120-S', '1065': '1065', '1041': '1041',
  }
  return raw ? (map[raw.toLowerCase()] ?? raw) : '—'
}

export default function SendOrganizerModal({ onClose, onSuccess }: Props) {
  const [clients, setClients] = useState<ClientOption[]>([])
  const [clientId, setClientId] = useState("")
  const [year, setYear] = useState(String(new Date().getFullYear() - 1))
  const [templateType, setTemplateType] = useState("")
  const [sendNow, setSendNow] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("clients")
      .select("id, name, entity_type")
      .order("name", { ascending: true })
      .then(({ data }) => {
        if (data) setClients(data)
      })
  }, [])

  // Auto-set template type when client changes
  function handleClientChange(id: string) {
    setClientId(id)
    const client = clients.find(c => c.id === id)
    if (client?.entity_type) setTemplateType(client.entity_type.toLowerCase())
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientId) { setError("Select a client."); return }
    if (!year || isNaN(Number(year))) { setError("Enter a valid tax year."); return }

    setSaving(true)
    setError(null)

    const supabase = createClient()
    const { error: insertError } = await supabase.from("organizers").insert({
      client_id: clientId,
      year: Number(year),
      template_type: templateType || null,
      status: sendNow ? "pending" : "not-sent",
      sent_at: sendNow ? new Date().toISOString() : null,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111113] border border-[#1e1e22] rounded-[12px] w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1e]">
          <div className="text-[14px] font-medium text-[#ddd]">Send Organizer</div>
          <button
            onClick={onClose}
            className="text-[#444] hover:text-[#aaa] transition-all text-[18px] leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Client */}
          <div>
            <label className="block text-[11px] text-[#555] uppercase tracking-widest mb-1.5">
              Client <span className="text-[#f87171]">*</span>
            </label>
            <select
              value={clientId}
              onChange={e => handleClientChange(e.target.value)}
              className="w-full bg-[#0d0d0f] border border-[#1e1e22] rounded-[8px] px-3 py-2.5 text-[13px] text-[#ccc] focus:outline-none focus:border-[#FEED55] transition-all"
            >
              <option value="">Select a client...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {displayEntityType(c.entity_type)}
                </option>
              ))}
            </select>
          </div>

          {/* Tax year + Template */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#555] uppercase tracking-widest mb-1.5">
                Tax year <span className="text-[#f87171]">*</span>
              </label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)}
                min="2000"
                max="2099"
                className="w-full bg-[#0d0d0f] border border-[#1e1e22] rounded-[8px] px-3 py-2.5 text-[13px] text-[#ccc] focus:outline-none focus:border-[#FEED55] transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#555] uppercase tracking-widest mb-1.5">
                Template
              </label>
              <select
                value={templateType}
                onChange={e => setTemplateType(e.target.value)}
                className="w-full bg-[#0d0d0f] border border-[#1e1e22] rounded-[8px] px-3 py-2.5 text-[13px] text-[#ccc] focus:outline-none focus:border-[#FEED55] transition-all"
              >
                <option value="">Auto-detect</option>
                {TEMPLATE_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Send now toggle */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`mt-0.5 w-4 h-4 rounded-[4px] flex-shrink-0 flex items-center justify-center border transition-all ${
                sendNow ? "bg-[#0f2820] border-[#34d399]/40" : "border-[#333] group-hover:border-[#555]"
              }`}
              onClick={() => setSendNow(v => !v)}
            >
              {sendNow && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-[12px] text-[#666] leading-relaxed" onClick={() => setSendNow(v => !v)}>
              Mark as sent now — sets status to <span className="text-[#f59e0b] font-mono">awaiting docs</span>
            </span>
          </label>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 bg-[#2a1010] border border-[#f87171]/20 rounded-[8px] text-[12px] text-[#f87171]">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-[7px] text-[13px] font-medium bg-[#FEED55] text-[#0d0d0f] hover:bg-[#ffe566] transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : sendNow ? "Send organizer" : "Save as draft"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[7px] text-[13px] text-[#666] border border-[#222] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
