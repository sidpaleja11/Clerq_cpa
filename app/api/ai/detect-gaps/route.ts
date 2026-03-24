import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { buildDetectGapsPrompt } from '@/lib/prompts/detect-gaps'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// claude-opus-4-6 — gap detection requires reasoning about tax requirements
const MODEL = 'claude-opus-4-6'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { clientId, taxYear, priorYearNotes } = body as {
      clientId: string
      taxYear: number
      priorYearNotes?: string
    }

    if (!clientId || !taxYear) {
      return NextResponse.json({ error: 'clientId and taxYear are required' }, { status: 400 })
    }

    // Fetch client + existing documents for this tax year
    const [{ data: client }, { data: documents }] = await Promise.all([
      supabase.from('clients').select('name, entity_type').eq('id', clientId).single(),
      supabase
        .from('documents')
        .select('type')
        .eq('client_id', clientId)
        .eq('tax_year', taxYear)
        .not('type', 'is', null),
    ])

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const receivedDocs = documents?.map((d) => d.type).filter(Boolean) ?? []

    const { system, user: userPrompt } = buildDetectGapsPrompt({
      clientName: client.name,
      entityType: client.entity_type ?? '1040',
      taxYear,
      receivedDocuments: receivedDocs as string[],
      priorYearNotes,
    })

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '{}'

    let result
    try {
      const cleaned = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '')
      result = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: 'Model returned invalid JSON', raw: rawText }, { status: 502 })
    }

    await supabase.from('security_log').insert({
      cpa_id: user.id,
      event_type: 'ai_gap_detection',
      resource: `client:${clientId}:year:${taxYear}`,
      actor: user.email,
    })

    return NextResponse.json({ ...result, model: MODEL })
  } catch (error) {
    console.error('[detect-gaps]', error)
    return NextResponse.json({ error: 'Failed to detect document gaps' }, { status: 500 })
  }
}
