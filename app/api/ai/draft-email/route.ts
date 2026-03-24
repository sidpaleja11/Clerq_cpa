import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { buildDraftEmailPrompt, type EmailType } from '@/lib/prompts/draft-email'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// claude-opus-4-6 for high-quality client communications
const MODEL = 'claude-opus-4-6'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { clientId, emailType, context } = body as {
      clientId: string
      emailType: EmailType
      context?: string
    }

    if (!clientId || !emailType) {
      return NextResponse.json({ error: 'clientId and emailType are required' }, { status: 400 })
    }

    // Fetch client details + recent communications
    const [{ data: client }, { data: recentComms }] = await Promise.all([
      supabase.from('clients').select('name, entity_type').eq('id', clientId).single(),
      supabase
        .from('communications')
        .select('body, direction, sent_at')
        .eq('client_id', clientId)
        .order('sent_at', { ascending: false })
        .limit(5),
    ])

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const recentCommsText =
      recentComms
        ?.map((c) => `[${c.direction === 'out' ? 'CPA' : 'Client'} - ${new Date(c.sent_at).toLocaleDateString()}]: ${c.body}`)
        .join('\n\n') ?? ''

    const { system, user: userPrompt } = buildDraftEmailPrompt({
      emailType,
      clientName: client.name,
      entityType: client.entity_type ?? 'individual',
      context: context ?? '',
      recentComms: recentCommsText,
      toneSamples: '',
    })

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const draft = message.content[0].type === 'text' ? message.content[0].text : ''

    // Log AI generation event
    await supabase.from('security_log').insert({
      cpa_id: user.id,
      event_type: 'ai_draft_generated',
      resource: `client:${clientId}:email:${emailType}`,
      actor: user.email,
    })

    return NextResponse.json({ draft, aiDrafted: true, model: MODEL })
  } catch (error) {
    console.error('[draft-email]', error)
    return NextResponse.json({ error: 'Failed to generate email draft' }, { status: 500 })
  }
}
