"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Props = {
  onClose: () => void
  onSuccess: () => void
}

const ENTITY_TYPES = [
  { value: "1040", label: "1040 — Individual" },
  { value: "1120", label: "1120 — C-Corp" },
  { value: "1120s", label: "1120-S — S-Corp" },
  { value: "1065", label: "1065 — Partnership" },
  { value: "1041", label: "1041 — Estate/Trust" },
]

const SERVICE_LEVELS = [
  "Full Service",
  "Tax Preparation",
  "Advisory",
  "Bookkeeping",
  "Payroll",
]

export default function NewClientModal({ onClose, onSuccess }: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [entityType, setEntityType] = useState("")
  const [serviceLevel, setServiceLevel] = useState("")
  const [filingStatus, setFilingStatus] = useState("")
  const [consent, setConsent] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError("Client name is required.")
      return
    }
    setSaving(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error: insertError } = await supabase.from("clients").insert({
      cpa_id: user?.id,
      name: name.trim(),
      email: email.trim() || null,
      entity_type: entityType || null,
      service_level: serviceLevel || null,
      filing_status: filingStatus.trim() || null,
      irc_7216_consent_obtained: consent,
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
          <div className="text-[14px] font-medium text-[#ddd]">New Client</div>
          <button
            onClick={onClose}
            className="text-[#444] hover:text-[#aaa] transition-all text-[18px] leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[11px] text-[#555] uppercase tracking-widest mb-1.5">
              Full name <span className="text-[#f87171]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sarah Johnson"
              className="w-full bg-[#0d0d0f] border border-[#1e1e22] rounded-[8px] px-3 py-2.5 text-[13px] text-[#ccc] placeholder-[#333] focus:outline-none focus:border-[#FEED55] transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] text-[#555] uppercase tracking-widest mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="client@example.com"
              className="w-full bg-[#0d0d0f] border border-[#1e1e22] rounded-[8px] px-3 py-2.5 text-[13px] text-[#ccc] placeholder-[#333] focus:outline-none focus:border-[#FEED55] transition-all"
            />
          </div>

          {/* Entity type + Service level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#555] uppercase tracking-widest mb-1.5">
                Entity type
              </label>
              <select
                value={entityType}
                onChange={e => setEntityType(e.target.value)}
                className="w-full bg-[#0d0d0f] border border-[#1e1e22] rounded-[8px] px-3 py-2.5 text-[13px] text-[#ccc] focus:outline-none focus:border-[#FEED55] transition-all"
              >
                <option value="">Select...</option>
                {ENTITY_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-[#555] uppercase tracking-widest mb-1.5">
                Service level
              </label>
              <select
                value={serviceLevel}
                onChange={e => setServiceLevel(e.target.value)}
                className="w-full bg-[#0d0d0f] border border-[#1e1e22] rounded-[8px] px-3 py-2.5 text-[13px] text-[#ccc] focus:outline-none focus:border-[#FEED55] transition-all"
              >
                <option value="">Select...</option>
                {SERVICE_LEVELS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filing status */}
          <div>
            <label className="block text-[11px] text-[#555] uppercase tracking-widest mb-1.5">
              Filing status <span className="text-[#333] normal-case tracking-normal font-normal">— 1040 clients only</span>
            </label>
            <input
              type="text"
              value={filingStatus}
              onChange={e => setFilingStatus(e.target.value)}
              placeholder="e.g. Single, MFJ, MFS, HoH"
              className="w-full bg-[#0d0d0f] border border-[#1e1e22] rounded-[8px] px-3 py-2.5 text-[13px] text-[#ccc] placeholder-[#333] focus:outline-none focus:border-[#FEED55] transition-all"
            />
          </div>

          {/* IRC 7216 consent */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`mt-0.5 w-4 h-4 rounded-[4px] flex-shrink-0 flex items-center justify-center border transition-all ${
                consent ? "bg-[#0f2820] border-[#34d399]/40" : "border-[#333] group-hover:border-[#555]"
              }`}
              onClick={() => setConsent(v => !v)}
            >
              {consent && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-[12px] text-[#666] leading-relaxed" onClick={() => setConsent(v => !v)}>
              IRC 7216 consent obtained — client has authorized use of tax return data for AI-assisted services
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
              {saving ? "Saving..." : "Add client"}
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
