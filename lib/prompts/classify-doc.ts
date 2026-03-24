// lib/prompts/classify-doc.ts
// Version: 1.0 | Effective: 2026-01-01

export interface ClassifyDocInput {
  extractedText: string
  pageCount: number
  clientEntityType?: string
}

export interface ClassifyDocOutput {
  documentType: string
  taxYear: number | null
  confidence: 'high' | 'medium' | 'low'
  suggestedRetentionYears: number
  notes: string
}

export function buildClassifyDocPrompt(input: ClassifyDocInput) {
  return {
    system: `You are a tax document classifier for a CPA firm. Classify documents based on their extracted text. Common document types: W-2, 1099-NEC, 1099-INT, 1099-DIV, 1099-B, 1099-R, K-1, mortgage_interest_1098, charitable_contribution, brokerage_statement, prior_year_return, organizer_response, engagement_letter, 7216_consent, id_verification, other. Always respond with valid JSON only.`,
    user: `Classify this document (${input.pageCount} page(s)${input.clientEntityType ? `, client entity: ${input.clientEntityType}` : ''}).

Extracted text (first 2000 chars):
${input.extractedText.slice(0, 2000)}

Respond with JSON matching this schema:
{
  "documentType": string,
  "taxYear": number | null,
  "confidence": "high" | "medium" | "low",
  "suggestedRetentionYears": number,
  "notes": string
}`,
  }
}
