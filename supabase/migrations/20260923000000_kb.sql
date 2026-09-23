-- ══════════════════════════════════════════════════════
-- Knowledge Graph MVP — tabelle KB
-- Migration: 20260923000000_kb
-- Date: 2026-09-23
-- Ref: PIA-1609
-- ══════════════════════════════════════════════════════
-- Estende lo schema `pianeta` (già creato in 030_client_projects.sql)
-- con il Knowledge Graph: entities, relations, facts, decisions, proposals.
--
-- ⚠️  Repo pubblico: questa migration non contiene seed.
--     Il seed vive in `pianeta-kb` (repo privato).
--
-- Pattern RLS: deny all to anon/authenticated, service_role only.
-- Stesso pattern di 030/031/032.
-- ══════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────
-- 1. ENTITIES
-- ──────────────────────────────────────────────────────
create table if not exists pianeta.kb_entities (
  id          uuid        primary key default gen_random_uuid(),
  slug        text        not null unique,
  name        text        not null,
  type        text        not null
                check (type in ('cliente','progetto','persona','organizzazione','offerta','documento','contenuto','agente')),
  description text,
  metadata    jsonb       not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists kb_entities_type_idx   on pianeta.kb_entities (type);
create index if not exists kb_entities_name_fts   on pianeta.kb_entities using gin(to_tsvector('italian', name || ' ' || coalesce(description,'')));

-- ──────────────────────────────────────────────────────
-- 2. RELATIONS
-- ──────────────────────────────────────────────────────
create table if not exists pianeta.kb_relations (
  id          uuid        primary key default gen_random_uuid(),
  from_id     uuid        not null references pianeta.kb_entities(id) on delete cascade,
  to_id       uuid        not null references pianeta.kb_entities(id) on delete cascade,
  type        text        not null
                check (type in ('riguarda','cita','decide','supera','fonte','appartiene')),
  notes       text,
  created_at  timestamptz not null default now()
);

create index if not exists kb_relations_from_idx  on pianeta.kb_relations (from_id);
create index if not exists kb_relations_to_idx    on pianeta.kb_relations (to_id);

-- ──────────────────────────────────────────────────────
-- 3. FACTS
-- ──────────────────────────────────────────────────────
-- `stato`: verità | ipotesi | superato
-- `visibilita`: privato | pubblicabile
-- `fonte`: jsonb { url, label, kind: 'issue'|'pr'|'file'|'revisione' }
-- `superseded_by`: self-ref nullable → il fatto più recente
create table if not exists pianeta.kb_facts (
  id            uuid        primary key default gen_random_uuid(),
  entity_id     uuid        not null references pianeta.kb_entities(id) on delete cascade,
  testo         text        not null,
  stato         text        not null default 'verità'
                  check (stato in ('verità','ipotesi','superato')),
  valid_from    date,
  valid_to      date,
  recorded_at   timestamptz not null default now(),
  superseded_by uuid        references pianeta.kb_facts(id) on delete set null,
  fonte         jsonb       not null default '{}',  -- { url, label, kind }
  deciso_da     text,                               -- email/nome
  visibilita    text        not null default 'privato'
                  check (visibilita in ('privato','pubblicabile')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists kb_facts_entity_idx    on pianeta.kb_facts (entity_id, stato);
create index if not exists kb_facts_recorded_idx  on pianeta.kb_facts (recorded_at desc);
create index if not exists kb_facts_superseded_idx on pianeta.kb_facts (superseded_by) where superseded_by is not null;
create index if not exists kb_facts_fts           on pianeta.kb_facts using gin(to_tsvector('italian', testo));

-- ──────────────────────────────────────────────────────
-- 4. DECISIONS (ADR-style)
-- ──────────────────────────────────────────────────────
-- `stato`: proposta | approvata | superata
-- `superseded_by`: self-ref nullable — catena "superata da →"
create table if not exists pianeta.kb_decisions (
  id              uuid        primary key default gen_random_uuid(),
  titolo          text        not null,
  contesto        text,
  decisione       text        not null,
  alternative     text,
  conseguenze     text,
  stato           text        not null default 'approvata'
                    check (stato in ('proposta','approvata','superata')),
  superseded_by   uuid        references pianeta.kb_decisions(id) on delete set null,
  chi             text,                                   -- email/nome
  quando          date,
  fonte           jsonb       not null default '{}',      -- { url, label, kind }
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists kb_decisions_stato_idx  on pianeta.kb_decisions (stato);
create index if not exists kb_decisions_quando_idx on pianeta.kb_decisions (quando desc);
create index if not exists kb_decisions_superseded_idx on pianeta.kb_decisions (superseded_by) where superseded_by is not null;
create index if not exists kb_decisions_fts        on pianeta.kb_decisions using gin(to_tsvector('italian', titolo || ' ' || coalesce(decisione,'') || ' ' || coalesce(contesto,'')));

-- Relazione decisions ↔ entities (molti-a-molti tramite kb_relations)
-- oppure diretta:
create table if not exists pianeta.kb_decision_entities (
  decision_id uuid not null references pianeta.kb_decisions(id) on delete cascade,
  entity_id   uuid not null references pianeta.kb_entities(id) on delete cascade,
  primary key (decision_id, entity_id)
);

-- ──────────────────────────────────────────────────────
-- 5. PROPOSALS (coda agenti)
-- ──────────────────────────────────────────────────────
-- Gli agenti non scrivono mai fatti/decisioni direttamente:
-- postano solo proposals, che Max approva/respinge/corregge.
-- `kind`: fact | decision
-- `stato`: in_attesa | approvata | respinta | corretta
-- `payload`: il fatto o la decisione proposti (jsonb)
create table if not exists pianeta.kb_proposals (
  id              uuid        primary key default gen_random_uuid(),
  kind            text        not null check (kind in ('fact','decision')),
  payload         jsonb       not null,
  agente          text        not null,               -- agent id o nome
  stato           text        not null default 'in_attesa'
                    check (stato in ('in_attesa','approvata','respinta','corretta')),
  nota_revisore   text,
  created_fact_id  uuid       references pianeta.kb_facts(id) on delete set null,
  created_decision_id uuid    references pianeta.kb_decisions(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists kb_proposals_stato_idx  on pianeta.kb_proposals (stato, created_at desc);

-- ──────────────────────────────────────────────────────
-- RLS: deny all to anon/authenticated, service_role only
-- ──────────────────────────────────────────────────────
alter table pianeta.kb_entities          enable row level security;
alter table pianeta.kb_relations         enable row level security;
alter table pianeta.kb_facts             enable row level security;
alter table pianeta.kb_decisions         enable row level security;
alter table pianeta.kb_decision_entities enable row level security;
alter table pianeta.kb_proposals         enable row level security;

drop policy if exists "deny_all" on pianeta.kb_entities;
create policy "deny_all" on pianeta.kb_entities
  for all to anon, authenticated using (false) with check (false);

drop policy if exists "deny_all" on pianeta.kb_relations;
create policy "deny_all" on pianeta.kb_relations
  for all to anon, authenticated using (false) with check (false);

drop policy if exists "deny_all" on pianeta.kb_facts;
create policy "deny_all" on pianeta.kb_facts
  for all to anon, authenticated using (false) with check (false);

drop policy if exists "deny_all" on pianeta.kb_decisions;
create policy "deny_all" on pianeta.kb_decisions
  for all to anon, authenticated using (false) with check (false);

drop policy if exists "deny_all" on pianeta.kb_decision_entities;
create policy "deny_all" on pianeta.kb_decision_entities
  for all to anon, authenticated using (false) with check (false);

drop policy if exists "deny_all" on pianeta.kb_proposals;
create policy "deny_all" on pianeta.kb_proposals
  for all to anon, authenticated using (false) with check (false);

-- Grants per service_role (usato da Astro server-side e Nitro)
grant usage on schema pianeta to service_role;

grant select, insert, update, delete
  on pianeta.kb_entities,
     pianeta.kb_relations,
     pianeta.kb_facts,
     pianeta.kb_decisions,
     pianeta.kb_decision_entities,
     pianeta.kb_proposals
  to service_role;

-- ──────────────────────────────────────────────────────
-- Funzione FTS ibrida per la ricerca KB
-- Cerca in entities (name/description), facts (testo), decisions (titolo/decisione).
-- ──────────────────────────────────────────────────────
create or replace function pianeta.kb_search(query_text text, result_limit int default 40)
returns table (
  kind        text,
  id          uuid,
  slug        text,
  title       text,
  excerpt     text,
  entity_slug text,
  rank        real
)
language sql
security definer
stable
as $$
  -- Entities
  select
    'entity'::text as kind,
    e.id,
    e.slug,
    e.name as title,
    e.description as excerpt,
    null::text as entity_slug,
    ts_rank(to_tsvector('italian', e.name || ' ' || coalesce(e.description,'')),
            plainto_tsquery('italian', query_text)) as rank
  from pianeta.kb_entities e
  where to_tsvector('italian', e.name || ' ' || coalesce(e.description,''))
        @@ plainto_tsquery('italian', query_text)

  union all

  -- Facts
  select
    'fact'::text,
    f.id,
    f.id::text as slug,
    f.testo as title,
    f.stato as excerpt,
    e.slug as entity_slug,
    ts_rank(to_tsvector('italian', f.testo),
            plainto_tsquery('italian', query_text)) as rank
  from pianeta.kb_facts f
  join pianeta.kb_entities e on e.id = f.entity_id
  where f.stato != 'superato'
    and to_tsvector('italian', f.testo) @@ plainto_tsquery('italian', query_text)

  union all

  -- Decisions
  select
    'decision'::text,
    d.id,
    d.id::text as slug,
    d.titolo as title,
    d.decisione as excerpt,
    null::text as entity_slug,
    ts_rank(to_tsvector('italian', d.titolo || ' ' || coalesce(d.decisione,'') || ' ' || coalesce(d.contesto,'')),
            plainto_tsquery('italian', query_text)) as rank
  from pianeta.kb_decisions d
  where d.stato != 'superata'
    and to_tsvector('italian', d.titolo || ' ' || coalesce(d.decisione,'') || ' ' || coalesce(d.contesto,''))
        @@ plainto_tsquery('italian', query_text)

  order by rank desc
  limit result_limit;
$$;

grant execute on function pianeta.kb_search(text, int) to service_role;
