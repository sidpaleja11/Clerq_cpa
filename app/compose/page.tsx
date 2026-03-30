'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { PromptInputBox } from '@/components/ui/ai-prompt-box'

type EmailType =
  | 'tax_season_kickoff'
  | 'document_request'
  | 'status_update'
  | 'return_delivery'
  | 'fee_reminder'

const EMAIL_TYPES = [
  { id: 'tax_season_kickoff', label: 'Tax Season Kickoff' },
  { id: 'document_request', label: 'Document Request' },
  { id: 'status_update', label: 'Status Update' },
  { id: 'return_delivery', label: 'Return Delivery' },
  { id: 'fee_reminder', label: 'Fee Reminder' },
]

const CLIENTS = [
  { id: '1', name: 'Sarah Chen', entityType: '1040' },
  { id: '2', name: 'Marcus Webb', entityType: '1120-S' },
  { id: '3', name: 'Priya Nair', entityType: '1065' },
  { id: '4', name: 'David Kim', entityType: '1040' },
  { id: '5', name: 'Jordan Lee', entityType: '1040' },
  { id: '6', name: 'Aisha Patel', entityType: '1120-S' },
  { id: '7', name: 'Tom Rivera', entityType: '1065' },
  { id: '8', name: 'Nina Zhao', entityType: '1040' },
]

export default function ComposePage() {
  const [clientId, setClientId] = useState('')
  const [emailType, setEmailType] = useState<EmailType>('tax_season_kickoff')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const clientName = CLIENTS.find(c => c.id === clientId)?.name ?? ''

  async function generateDraft(context: string) {
    if (!clientId) {
      setError('Select a client first.')
      return
    }
    setLoading(true)
    setError(null)
    setDraft('')

    const res = await fetch('/api/ai/draft-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, emailType, context }),
    })

    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? 'Failed to generate draft.')
    } else {
      setDraft(json.draft)
    }
    setLoading(false)
  }

  async function sendEmail() {
    setSending(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('communications').insert({
      client_id: clientId,
      direction: 'out',
      channel: 'email',
      body: draft,
      ai_drafted: true,
    })

    await supabase.from('security_log').insert({
      cpa_id: user?.id,
      event_type: 'ai_email_sent',
      resource: `client:${clientId}`,
      actor: user?.email,
    })

    setSent(true)
    setSending(false)
  }

  function handleCopy() {
    navigator.clipboard.writeText(draft)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-screen bg-[#0d0d0f] text-[#e8e8ea] font-sans overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-[220px] flex-shrink-0 bg-[#111113] border-r border-[#1e1e22] flex flex-col py-5">
        <div className="px-5 pb-6 border-b border-[#1e1e22] mb-4">
          <div className="text-[18px] font-semibold tracking-tight text-white">
            cler<span className="text-[#4f8ef7]">q</span>
          </div>
          <div className="text-[11px] text-[#555] mt-0.5 tracking-widest font-mono">CPA WORKFLOW</div>
        </div>
        <div className="px-3 mb-2">
          <div className="text-[10px] font-medium text-[#444] tracking-widest uppercase px-2 mb-1">Workspace</div>
          <Link href="/dashboard" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Dashboard</Link>
          <Link href="/clients" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Clients</Link>
          <Link href="/organizers" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Organizers</Link>
          <Link href="/invoices" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Invoices</Link>
        </div>
        <div className="px-3 mt-2 mb-2">
          <div className="text-[10px] font-medium text-[#444] tracking-widest uppercase px-2 mb-1">AI Tools</div>
          <Link href="/compose" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] bg-[#1c2538] text-[#6a9fff]">Compose Email</Link>
          <Link href="/engagements" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Engagements</Link>
        </div>
        <div className="px-3 mt-2">
          <div className="text-[10px] font-medium text-[#444] tracking-widest uppercase px-2 mb-1">Settings</div>
          <Link href="/settings/compliance" className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13.5px] text-[#666] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all">Compliance</Link>
        </div>
        <div className="mt-auto px-5 pt-4 border-t border-[#1e1e22]">
          <div className="flex items-center gap-2.5">
            <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#4f8ef7] flex items-center justify-center text-[11px] font-semibold text-[#aac8ff]">TR</div>
            <div>
              <div className="text-[13px] font-medium text-[#bbb]">Taran R.</div>
              <div className="text-[11px] text-[#555]">Pro plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-7 py-[18px] border-b border-[#1a1a1e] bg-[#0d0d0f]">
          <div className="text-[15px] font-medium text-[#ddd]">Compose Email</div>
          <div className="text-[12px] text-[#444] font-mono">AI Draft · SSTS 7 logged</div>
        </div>

        <div className="flex-1 overflow-y-auto p-7">
          <div className="max-w-3xl mx-auto">

            {/* Client + Email Type */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[11px] text-[#555] uppercase tracking-widest mb-2">Client</label>
                <select
                  value={clientId}
                  onChange={e => { setClientId(e.target.value); setSent(false) }}
                  className="w-full bg-[#111113] border border-[#1e1e22] rounded-[8px] px-3 py-2.5 text-[13px] text-[#ccc] focus:outline-none focus:border-[#4f8ef7] transition-all"
                >
                  <option value="">Select a client...</option>
                  {CLIENTS.map(c => (
                    <option key={c.id} value={c.id}>{c.name} — {c.entityType}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-[#555] uppercase tracking-widest mb-2">Email Type</label>
                <select
                  value={emailType}
                  onChange={e => setEmailType(e.target.value as EmailType)}
                  className="w-full bg-[#111113] border border-[#1e1e22] rounded-[8px] px-3 py-2.5 text-[13px] text-[#ccc] focus:outline-none focus:border-[#4f8ef7] transition-all"
                >
                  {EMAIL_TYPES.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 px-4 py-3 bg-[#2a1010] border border-[#f87171]/20 rounded-[8px] text-[13px] text-[#f87171]">
                {error}
              </div>
            )}

            {/* AI Prompt Box */}
            <div className="mb-6">
              <label className="block text-[11px] text-[#555] uppercase tracking-widest mb-2">
                Context <span className="text-[#333] normal-case tracking-normal">— describe what you need, then hit send</span>
              </label>
              <PromptInputBox
                isLoading={loading}
                placeholder="e.g. Client is missing W-2 and one 1099. Second reminder. They've been slow to respond..."
                onSend={(message) => generateDraft(message)}
                className="border-[#1e1e22] bg-[#111113]"
              />
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] p-5">
                <div className="space-y-3">
                  <div className="h-3 bg-[#1a1a1e] rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-[#1a1a1e] rounded animate-pulse w-full" />
                  <div className="h-3 bg-[#1a1a1e] rounded animate-pulse w-5/6" />
                  <div className="h-3 bg-[#1a1a1e] rounded animate-pulse w-2/3" />
                  <div className="h-3 bg-[#1a1a1e] rounded animate-pulse w-full" />
                </div>
              </div>
            )}

            {/* Draft output */}
            {draft && (
              <div className="bg-[#111113] border border-[#1e1e22] rounded-[10px] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1a1a1e]">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-[4px] bg-[#2a1f0e] text-[#f59e0b]">
                      AI Draft — Review before sending
                    </span>
                    {clientName && <span className="text-[12px] text-[#555]">for {clientName}</span>}
                  </div>
                  <button onClick={handleCopy} className="text-[12px] text-[#4f8ef7] hover:text-[#5d99ff] transition-all">
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  rows={12}
                  className="w-full bg-transparent px-5 py-4 text-[13px] text-[#ccc] leading-relaxed focus:outline-none resize-none"
                />
                <div className="flex items-center gap-3 px-5 py-3.5 border-t border-[#1a1a1e]">
                  <button
                    onClick={sendEmail}
                    disabled={sending || sent}
                    className="px-4 py-2 rounded-[7px] text-[13px] font-medium bg-[#0f2820] text-[#34d399] hover:bg-[#1a3d2e] transition-all disabled:opacity-50"
                  >
                    {sent ? '✓ Logged & Sent' : sending ? 'Sending...' : 'Log & Send'}
                  </button>
                  <button
                    onClick={() => { setDraft(''); setSent(false) }}
                    className="px-4 py-2 rounded-[7px] text-[13px] text-[#666] border border-[#222] hover:bg-[#1a1a1e] hover:text-[#aaa] transition-all"
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}