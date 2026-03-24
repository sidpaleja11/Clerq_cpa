import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { buildClassifyDocPrompt } from '@/lib/prompts/classify-doc'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// claude-haiku-4-5 — fast classification task, low latency required
const MODEL = 'claude-haiku-4-5-20251001'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { documentId, extractedText, pageCount, clientEntityType } = body as {
      documentId?: string
      extractedText: string
      pageCount: number
      clientEntityType?: string
    }

    if (!extractedText) {
      return NextResponse.json({ error: 'extractedText is required' }, { status: 400 })
    }

    const { system, user: userPrompt } = buildClassifyDocPrompt({
      extractedText,
      pageCount,
      clientEntityType,
    })

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 512,
      system,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '{}'

    let classification
    try {
      // Strip markdown code fences if present
      const cleaned = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '')
      classification = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: 'Model returned invalid JSON', raw: rawText }, { status: 502 })
    }

    // Update the document record if ID provided
    if (documentId) {
      await supabase
        .from('documents')
        .update({
          type: classification.documentType,
          tax_year: classification.taxYear,
          retention_date: classification.suggestedRetentionYears
            ? new Date(
                new Date().getFullYear() + classification.suggestedRetentionYears,
                0,
                1
              ).toISOString().split('T')[0]
            : null,
          status: 'classified',
        })
        .eq('id', documentId)

      await supabase.from('security_log').insert({
        cpa_id: user.id,
        event_type: 'ai_doc_classified',
        resource: `document:${documentId}`,
        actor: user.email,
      })
    }

    return NextResponse.json({ ...classification, model: MODEL })
  } catch (error) {
    console.error('[classify-doc]', error)
    return NextResponse.json({ error: 'Failed to classify document' }, { status: 500 })
  }
}
