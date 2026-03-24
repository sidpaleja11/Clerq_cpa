import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { buildGenEngagementPrompt } from '@/lib/prompts/gen-engagement'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// claude-opus-4-6 — engagement letters are legal documents requiring deep reasoning
const MODEL = 'claude-opus-4-6'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { clientId, taxYear, serviceType, fee, additionalServices, exclusions } = body as {
      clientId: string
      taxYear: number
      serviceType: string
      fee: number
      additionalServices?: string
      exclusions?: string
    }

    if (!clientId || !taxYear || !serviceType || fee == null) {
      return NextResponse.json(
        { error: 'clientId, taxYear, serviceType, and fee are required' },
        { status: 400 }
      )
    }

    const [{ data: client }, { data: cpaUser }] = await Promise.all([
      supabase.from('clients').select('name, entity_type').eq('id', clientId).single(),
      supabase.from('cpa_users').select('firm_name').eq('id', user.id).single(),
    ])

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const { system, user: userPrompt } = buildGenEngagementPrompt({
      clientName: client.name,
      entityType: client.entity_type ?? '1040',
      taxYear,
      serviceType,
      fee,
      firmName: cpaUser?.firm_name ?? '[FIRM NAME]',
      additionalServices,
      exclusions,
    })

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const engagementText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Persist the engagement record
    const { data: engagement } = await supabase
      .from('engagements')
      .insert({
        client_id: clientId,
        year: taxYear,
        service_type: serviceType,
        fee,
        scope: { generated: true, model: MODEL },
      })
      .select('id')
      .single()

    // Log AI generation event
    await supabase.from('security_log').insert({
      cpa_id: user.id,
      event_type: 'ai_engagement_generated',
      resource: `engagement:${engagement?.id}`,
      actor: user.email,
    })

    return NextResponse.json({
      engagementId: engagement?.id,
      text: engagementText,
      aiDrafted: true,
      model: MODEL,
    })
  } catch (error) {
    console.error('[gen-engagement]', error)
    return NextResponse.json({ error: 'Failed to generate engagement letter' }, { status: 500 })
  }
}
