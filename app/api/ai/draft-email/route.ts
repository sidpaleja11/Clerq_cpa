import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildDraftEmailPrompt, type EmailType } from '@/lib/prompts/draft-email'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const MODEL = 'claude-haiku-4-5-20251001'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, emailType, context } = body as {
      clientId: string
      emailType: EmailType
      context?: string
    }

    if (!clientId || !emailType) {
      return NextResponse.json({ error: 'clientId and emailType are required' }, { status: 400 })
    }

    const clientMap: Record<string, { name: string; entity_type: string }> = {
      '1': { name: 'Sarah Chen', entity_type: '1040' },
      '2': { name: 'Marcus Webb', entity_type: '1120-S' },
      '3': { name: 'Priya Nair', entity_type: '1065' },
      '4': { name: 'David Kim', entity_type: '1040' },
      '5': { name: 'Jordan Lee', entity_type: '1040' },
      '6': { name: 'Aisha Patel', entity_type: '1120-S' },
      '7': { name: 'Tom Rivera', entity_type: '1065' },
      '8': { name: 'Nina Zhao', entity_type: '1040' },
    }

    const client = clientMap[clientId]

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const { system, user: userPrompt } = buildDraftEmailPrompt({
      emailType,
      clientName: client.name,
      entityType: client.entity_type,
      context: context ?? '',
      recentComms: '',
      toneSamples: '',
    })

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const draft = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ draft, aiDrafted: true, model: MODEL })
  } catch (error) {
    console.error('[draft-email]', error)
    return NextResponse.json({ error: 'Failed to generate email draft' }, { status: 500 })
  }
}