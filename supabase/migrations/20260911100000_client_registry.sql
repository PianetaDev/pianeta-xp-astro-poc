-- Client Registry — registro strutturato Decisioni/Azioni/Documenti/Persone
-- per-cliente dentro lo schema `pianeta`.
--
-- Estende le tabelle esistenti (client_projects, client_project_access,
-- client_objectives, client_updates) senza toccarle né i dati seed.
--
-- RLS: deny_all per anon/authenticated, accesso solo via service_role (Nitro).
-- Stesso pattern delle tabelle pianeta esistenti e di leads.

-- Assicura che lo schema pianeta esista (idempotente)
CREATE SCHEMA IF NOT EXISTS pianeta;

-- ─── 1. Estendi client_project_access con colonna role ───────────────────────
--
-- editor: può creare/modificare Decisioni e Documenti
-- viewer: solo lettura
--
ALTER TABLE pianeta.client_project_access
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'viewer'
  CHECK (role IN ('editor', 'viewer'));

-- Promuovi le email @pianeta.studio già presenti a editor
UPDATE pianeta.client_project_access
SET role = 'editor'
WHERE email LIKE '%@pianeta.studio'
  AND role = 'viewer';

-- ─── 2. client_people — Persone/Organizzazioni per progetto ──────────────────
CREATE TABLE IF NOT EXISTS pianeta.client_people (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES pianeta.client_projects(id) ON DELETE CASCADE,
  name        text NOT NULL,
  email       text,
  org         text,
  -- Ruolo funzionale/umano (es. "Referente comunicazione") — diverso da editor/viewer
  role_label  text,
  -- true = team Pianeta, false = referente cliente/esterno
  is_internal boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_people_project
  ON pianeta.client_people(project_id);

ALTER TABLE pianeta.client_people ENABLE ROW LEVEL SECURITY;

-- ─── 3. client_decisions — Decisioni con catena "superata da" ────────────────
--
-- superseded_by è il campo critico: permette di tracciare quale versione
-- di una decisione è quella corrente vs. quelle storiche superate.
-- confidence='verificato' = confermato dal cliente, 'da_confermare' = da validare.
CREATE TABLE IF NOT EXISTS pianeta.client_decisions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       uuid NOT NULL REFERENCES pianeta.client_projects(id) ON DELETE CASCADE,
  text             text NOT NULL,
  decided_at       date,
  -- La call/fonte da cui viene questa decisione
  source_update_id uuid REFERENCES pianeta.client_updates(id) ON DELETE SET NULL,
  status           text NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active', 'superseded')),
  -- Self-reference: punta alla decisione che sostituisce questa (nullable)
  superseded_by    uuid REFERENCES pianeta.client_decisions(id) ON DELETE SET NULL,
  confidence       text NOT NULL DEFAULT 'da_confermare'
                   CHECK (confidence IN ('verificato', 'da_confermare')),
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_decisions_project
  ON pianeta.client_decisions(project_id);
CREATE INDEX IF NOT EXISTS idx_client_decisions_status
  ON pianeta.client_decisions(project_id, status);

ALTER TABLE pianeta.client_decisions ENABLE ROW LEVEL SECURITY;

-- ─── 4. client_actions — Azioni/Task/Scadenze/Eventi ─────────────────────────
--
-- Copre anche "eventi" e "scadenze" via colonna type (no tabella separata).
-- owner_type='agent': lo stato non diventa 'done' automaticamente —
--   l'agente propone via proposed_done_at, un umano conferma esplicitamente.
CREATE TABLE IF NOT EXISTS pianeta.client_actions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       uuid NOT NULL REFERENCES pianeta.client_projects(id) ON DELETE CASCADE,
  title            text NOT NULL,
  owner_type       text NOT NULL DEFAULT 'person'
                   CHECK (owner_type IN ('person', 'agent')),
  -- email se person, nome/id agente Paperclip se agent
  owner_id         text,
  due_date         date,
  status           text NOT NULL DEFAULT 'open'
                   CHECK (status IN ('open', 'done', 'blocked')),
  -- L'azione/decisione da cui deriva (nullable)
  decision_id      uuid REFERENCES pianeta.client_decisions(id) ON DELETE SET NULL,
  -- task = azione generica, evento = appuntamento/workshop, scadenza = deadline
  type             text NOT NULL DEFAULT 'task'
                   CHECK (type IN ('task', 'evento', 'scadenza')),
  -- Proposta di completamento da un agente — un umano deve confermare
  -- prima che status diventi 'done' quando owner_type = 'agent'
  proposed_done_at timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_actions_project
  ON pianeta.client_actions(project_id);
CREATE INDEX IF NOT EXISTS idx_client_actions_status
  ON pianeta.client_actions(project_id, status);

ALTER TABLE pianeta.client_actions ENABLE ROW LEVEL SECURITY;

-- ─── 5. client_documents — Documenti/Link Drive per progetto ─────────────────
CREATE TABLE IF NOT EXISTS pianeta.client_documents (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES pianeta.client_projects(id) ON DELETE CASCADE,
  title      text NOT NULL,
  -- Link Google Drive o altro sistema documentale
  url        text,
  doc_type   text,
  version    text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_documents_project
  ON pianeta.client_documents(project_id);

ALTER TABLE pianeta.client_documents ENABLE ROW LEVEL SECURITY;

-- Nota: service_role bypassa RLS per default in Supabase (BYPASSRLS privilege).
-- Nessuna policy pubblica aggiunta intenzionalmente — solo Nitro via service_role accede.
