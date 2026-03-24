-- Migration: 001_initial_schema
-- Clerq — AI-powered CPA workflow platform
-- Run via: supabase db push

-- Enable pgvector for document embeddings
create extension if not exists vector;

-- ============================================================
-- CPA Users (one row per firm/solo practitioner)
-- ============================================================
create table cpa_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  firm_name text,
  subdomain text unique,
  stripe_customer_id text,
  tier text check (tier in ('starter', 'pro', 'firm')) default 'starter',
  created_at timestamptz default now()
);

-- ============================================================
-- Clients
-- ============================================================
create table clients (
  id uuid primary key default gen_random_uuid(),
  cpa_id uuid references cpa_users(id) on delete cascade,
  name text not null,
  email text,
  entity_type text check (entity_type in ('1040','1120','1120s','1065','1041')),
  filing_status text,
  tax_id_enc text,  -- AES-256 encrypted at application layer; never store plaintext
  key_dates jsonb,  -- { extension_deadline, return_due, etc. }
  service_level text,
  irc_7216_consent_obtained boolean default false,  -- must be true before AI processing
  created_at timestamptz default now()
);

-- ============================================================
-- Documents
-- ============================================================
create table documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  type text,
  ownership text check (ownership in ('client', 'firm')),
  file_url text,
  retention_date date,
  status text default 'pending',
  tax_year int,
  -- Vector embedding for semantic search (text-embedding-3-small = 1536 dims)
  embedding vector(1536),
  created_at timestamptz default now()
);

-- ============================================================
-- Engagement Letters
-- ============================================================
create table engagements (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  year int not null,
  service_type text,
  signed_at timestamptz,
  scope jsonb,
  exclusions jsonb,
  fee numeric,
  created_at timestamptz default now()
);

-- ============================================================
-- Client Communications  (SSTS No. 7 — communication log)
-- ============================================================
create table communications (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  direction text check (direction in ('in', 'out')),
  channel text,     -- 'email' | 'portal' | 'phone' | 'sms'
  body text,
  ai_drafted boolean default false,  -- REQUIRED: flag all AI-generated content
  sent_at timestamptz default now()
);

-- ============================================================
-- Tax Organizers
-- ============================================================
create table organizers (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  year int,
  template_type text,
  status text default 'pending',
  sent_at timestamptz,
  completed_at timestamptz,
  reminder_count int default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- Invoices
-- ============================================================
create table invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  amount numeric,
  due_date date,
  paid_at timestamptz,
  stripe_payment_intent_id text,
  reminder_count int default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- Security Log — immutable, append-only audit trail
-- Never UPDATE or DELETE rows from this table.
-- ============================================================
create table security_log (
  id uuid primary key default gen_random_uuid(),
  cpa_id uuid references cpa_users(id),
  event_type text not null,
  resource text,
  actor text,
  ip_address text,
  created_at timestamptz default now()
);

-- Prevent updates/deletes on security_log (append-only enforcement)
create rule security_log_no_update as on update to security_log do instead nothing;
create rule security_log_no_delete as on delete to security_log do instead nothing;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table clients enable row level security;
alter table documents enable row level security;
alter table engagements enable row level security;
alter table communications enable row level security;
alter table organizers enable row level security;
alter table invoices enable row level security;
alter table security_log enable row level security;

-- CPAs only see their own clients
create policy "CPA sees own clients" on clients
  for all using (cpa_id = auth.uid());

-- Documents belong to clients belonging to the CPA
create policy "CPA sees own documents" on documents
  for all using (
    client_id in (select id from clients where cpa_id = auth.uid())
  );

-- Engagements
create policy "CPA sees own engagements" on engagements
  for all using (
    client_id in (select id from clients where cpa_id = auth.uid())
  );

-- Communications
create policy "CPA sees own communications" on communications
  for all using (
    client_id in (select id from clients where cpa_id = auth.uid())
  );

-- Organizers
create policy "CPA sees own organizers" on organizers
  for all using (
    client_id in (select id from clients where cpa_id = auth.uid())
  );

-- Invoices
create policy "CPA sees own invoices" on invoices
  for all using (
    client_id in (select id from clients where cpa_id = auth.uid())
  );

-- Security log — CPA can read their own logs, insert only (no update/delete via RLS either)
create policy "CPA reads own security log" on security_log
  for select using (cpa_id = auth.uid());

create policy "CPA inserts own security log" on security_log
  for insert with check (cpa_id = auth.uid());

-- ============================================================
-- Indexes
-- ============================================================
create index idx_clients_cpa_id on clients(cpa_id);
create index idx_documents_client_id on documents(client_id);
create index idx_documents_tax_year on documents(client_id, tax_year);
create index idx_engagements_client_id on engagements(client_id);
create index idx_communications_client_id on communications(client_id);
create index idx_organizers_client_id on organizers(client_id);
create index idx_invoices_client_id on invoices(client_id);
create index idx_security_log_cpa_id on security_log(cpa_id);
create index idx_security_log_created_at on security_log(created_at desc);

-- Vector similarity index for document search
create index idx_documents_embedding on documents using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
