// lib/prompts/detect-gaps.ts
// Version: 1.0 | Effective: 2026-01-01
// Used to identify missing documents before return preparation begins

export interface DetectGapsInput {
  clientName: string
  entityType: string // '1040' | '1120' | '1120s' | '1065' | '1041'
  taxYear: number
  receivedDocuments: string[] // list of documentType strings already on file
  priorYearNotes?: string
}

export interface GapItem {
  documentType: string
  reason: string
  priority: 'required' | 'likely_needed' | 'may_apply'
}

export function buildDetectGapsPrompt(input: DetectGapsInput) {
  return {
    system: `You are a tax preparation assistant for a solo CPA. Your job is to identify missing documents needed to complete a tax return. Be conservative — only flag documents that are genuinely likely to be needed based on entity type and provided context. Do not fabricate requirements. If you're uncertain whether something applies, mark it 'may_apply'. Always respond with valid JSON only.`,
    user: `Identify missing documents for this client:

Client: ${input.clientName}
Entity: ${input.entityType}
Tax Year: ${input.taxYear}
Documents already received: ${input.receivedDocuments.length > 0 ? input.receivedDocuments.join(', ') : 'None'}
Prior year notes: ${input.priorYearNotes || 'None'}

Respond with JSON:
{
  "gaps": [
    {
      "documentType": string,
      "reason": string,
      "priority": "required" | "likely_needed" | "may_apply"
    }
  ],
  "readyToPrepare": boolean,
  "summary": string
}`,
  }
}
