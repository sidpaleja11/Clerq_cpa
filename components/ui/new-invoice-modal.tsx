"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Props = {
  onClose: () => void
  onSuccess: () => void
}

type ClientOption = { id: string; name: string; entity_type: string | null }

function displayEntityType(raw: string | null): string {
  const map: Record<string, string> = {
    '1040': '1040', '1120': '1120', '1120s': '1120-S', '1065': '1065', '1041': '1041',
  }
  return raw ? (map[raw.toLowerCase()] ?? raw) : '—'
}

export default function NewInvoiceModal({ onClose, onSuccess }: Props) {
  const [clients, setClients] = useState<ClientOption[]>([])
  const [clientId, setClientId] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("clients")
      .select("id, name, entity_type")
      .order("name", { ascending: true })
      .then(({ data }) => { if (data) setClients(data) })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientId) { setError("Select a client."); return }
    const parsedAmount = parseFloat(amount)
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount.")
      return
    }

    setSaving(true)
    setError(null)

    const supabase = createClient()
    const { error: insertError } = await supabase.from("invoices").insert({
      client_id: clientId,
      amount: parsedAmount,
      due_date: dueDate || null,
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
          <div className="text-[14px] font-medium text-[#ddd]">New Invoice</div>
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
              onChange={e => setClientId(e.target.value)}
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

          {/* Amount + Due date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[#555] uppercase tracking-widest mb-1.5">
                Amount <span className="text-[#f87171]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#444]">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#0d0d0f] border border-[#1e1e22] rounded-[8px] pl-7 pr-3 py-2.5 text-[13px] text-[#ccc] placeholder-[#333] focus:outline-none focus:border-[#FEED55] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-[#555] uppercase tracking-widest mb-1.5">
                Due date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-[#0d0d0f] border border-[#1e1e22] rounded-[8px] px-3 py-2.5 text-[13px] text-[#ccc] focus:outline-none focus:border-[#FEED55] transition-all [color-scheme:dark]"
              />
            </div>
          </div>

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
              {saving ? "Saving..." : "Create invoice"}
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
