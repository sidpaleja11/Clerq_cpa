// lib/prompts/draft-email.ts
// Version: 1.0 | Effective: 2026-01-01
// DO NOT modify without review — changes affect SSTS 7 compliance logging

export type EmailType =
  | 'tax_season_kickoff'
  | 'document_request'
  | 'status_update'
  | 'return_delivery'
  | 'fee_reminder'

export interface DraftEmailInput {
  emailType: EmailType
  clientName: string
  entityType: string
  context: string
  recentComms: string
  toneSamples: string
}

export function buildDraftEmailPrompt(input: DraftEmailInput) {
  return {
    system: `You are a professional CPA communication assistant. Draft emails that sound like they were written by a careful, organized solo CPA. Never fabricate numbers, dates, or regulatory requirements. If you don't know something, say so. Always use first person from the CPA's perspective. Match the established tone. Keep emails concise and professional — clients are busy.`,
    user: `Draft a ${input.emailType.replace(/_/g, ' ')} email to client ${input.clientName}, a ${input.entityType}. Context: ${input.context}. Prior communications: ${input.recentComms || 'None on record'}. CPA tone examples: ${input.toneSamples || 'None provided — use professional, warm, direct tone'}. Return only the email body, no subject line.`,
  }
}
