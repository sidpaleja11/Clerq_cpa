'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type EmailType =
  | 'tax_season_kickoff'
  | 'document_request'
  | 'status_update'
  | 'return_delivery'
  | 'fee_reminder'

export default function ComposePage() {
  const [clientId, setClientId] = useState('')
  const [emailType, setEmailType] = useState<EmailType>('tax_season_kickoff')
  const [context, setContext] = useState('')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function generateDraft() {
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

    // Log to security_log
    await supabase.from('security_log').insert({
      cpa_id: user?.id,
      event_type: 'ai_email_sent',
      resource: `client:${clientId}`,
      actor: user?.email,
    })

    setSent(true)
    setSending(false)
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Compose Email</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client ID
          </label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Paste client UUID"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Type
          </label>
          <select
            value={emailType}
            onChange={(e) => setEmailType(e.target.value as EmailType)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="tax_season_kickoff">Tax Season Kickoff</option>
            <option value="document_request">Document Request</option>
            <option value="status_update">Status Update</option>
            <option value="return_delivery">Return Delivery</option>
            <option value="fee_reminder">Fee Reminder</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Context / Notes
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={3}
            placeholder="Any specific context for this email..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={generateDraft}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating…' : 'Generate Draft'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {draft && (
        <div className="mt-6">
          {/* AI Draft label — required by SSTS 7 compliance */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
              AI Draft — Review before sending
            </span>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={12}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="mt-3 flex gap-3">
            <button
              onClick={sendEmail}
              disabled={sending || sent}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {sent ? 'Sent!' : sending ? 'Sending…' : 'Log & Send'}
            </button>
            <button
              onClick={() => { setDraft(''); setSent(false) }}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
