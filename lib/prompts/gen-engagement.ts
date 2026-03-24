// lib/prompts/gen-engagement.ts
// Version: 1.0 | Effective: 2026-01-01
// DO NOT modify without review — engagement letters are legal documents

export interface GenEngagementInput {
  clientName: string
  entityType: string // '1040' | '1120' | '1120s' | '1065' | '1041'
  taxYear: number
  serviceType: string
  fee: number
  firmName: string
  additionalServices?: string
  exclusions?: string
}

export function buildGenEngagementPrompt(input: GenEngagementInput) {
  return {
    system: `You are a CPA practice management assistant that drafts engagement letters. You generate professional, legally appropriate engagement letters for tax preparation services. Always include: scope of services, fee, exclusions (what is NOT included), client responsibilities, data retention policy, and dispute resolution. Never invent regulatory citations. Use plain language where possible. Flag anything the CPA must fill in with [PLACEHOLDER].`,
    user: `Generate an engagement letter for the following:

Client: ${input.clientName}
Entity Type: ${input.entityType}
Tax Year: ${input.taxYear}
Primary Service: ${input.serviceType}
Fee: $${input.fee.toLocaleString()}
CPA Firm: ${input.firmName}
Additional Services: ${input.additionalServices || 'None'}
Explicit Exclusions: ${input.exclusions || 'None specified — use standard exclusions for entity type'}

Output a complete engagement letter body. Include a scope section, fee section, exclusions section, and signature block with [CLIENT_SIGNATURE] and [DATE] placeholders.`,
  }
}
