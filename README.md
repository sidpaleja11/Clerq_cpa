# Clerq — AI-Powered CPA Workflow Platform

Clerq is a workflow platform for solo CPAs that combines client management, AI-assisted communications, document handling, engagement letters, organizers, and invoicing in one place.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Database | Supabase (Postgres + pgvector + Auth + Storage) |
| AI | Anthropic Claude API (Opus 4.6 for reasoning, Haiku 4.5 for fast tasks) |
| PDF Processing | Python FastAPI + PyMuPDF + LangChain (Railway) |
| E-Signature | Custom (PDF.js + canvas + Supabase Storage) |
| Email | Resend (transactional) |
| Payments | Stripe (subscriptions + Connect) |
| Deployment | Vercel (frontend) + Railway (Python service) |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
# Fill in all values in .env.local
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration:

```bash
npx supabase db push
# or paste supabase/migrations/001_initial_schema.sql into the Supabase SQL editor
```

3. Enable MFA in Supabase Dashboard → Authentication → Multi-factor Authentication

### 4. Start development server

```bash
npm run dev
```

### 5. Start Python microservice (separate terminal)

```bash
cd python-service
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Project Structure

```
app/                    Next.js App Router pages + API routes
├── api/ai/             AI API routes (draft-email, gen-engagement, classify-doc, detect-gaps)
├── dashboard/          CPA dashboard
├── clients/[id]/       Client detail view
├── compose/            AI email composer
├── organizers/         Tax organizer management
├── engagements/        Engagement letter management
├── invoices/           Invoice tracking
└── settings/           Settings (compliance, MFA, firm profile)
lib/
├── prompts/            Versioned AI prompt templates
└── supabase/           Supabase client helpers
portal/                 Client-facing portal (separate Next.js app)
python-service/         FastAPI PDF extraction service
supabase/migrations/    Database schema
```

## Compliance Requirements

| Requirement | Status |
|---|---|
| MFA enforced on all CPA accounts | ✅ Middleware enforces AAL2 |
| 30-minute session timeout | ✅ Middleware checks last-activity cookie |
| Immutable security audit log | ✅ `security_log` table with no-update/delete rules |
| AI Draft label before sending | ✅ `ai_drafted` flag + visible "AI Draft" label in UI |
| IRC 7216 consent at onboarding | ⚠️ Schema ready; onboarding flow in Phase 1 |

## AI Models

| Route | Model | Reason |
|---|---|---|
| `/api/ai/draft-email` | `claude-opus-4-6` | Client-facing communications require high quality |
| `/api/ai/gen-engagement` | `claude-opus-4-6` | Legal documents require deep reasoning |
| `/api/ai/classify-doc` | `claude-haiku-4-5-20251001` | Fast classification; low latency required |
| `/api/ai/detect-gaps` | `claude-opus-4-6` | Reasoning about tax requirements |
| Python PDF classifier | `claude-haiku-4-5-20251001` | Fast, cheap batch classification |

## Development Phases

- **Phase 0 (current):** Foundation — schema, auth, MFA, AI routes ✅
- **Phase 1:** Client onboarding with IRC 7216 consent flow
- **Phase 2:** Document upload + AI classification pipeline
- **Phase 3:** Engagement letter generation + e-signature
- **Phase 4:** Tax organizer workflow + automated reminders
- **Phase 5:** Invoicing + Stripe Connect
- **Phase 6:** Client portal (token-gated)
