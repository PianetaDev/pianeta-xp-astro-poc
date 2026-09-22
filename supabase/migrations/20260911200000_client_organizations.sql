-- Client Organizations — livello "cliente" sopra client_projects.
-- Un cliente (es. Bosco Colto) può avere più progetti.
-- PIA-1384
--
-- RLS: deny_all per anon/authenticated, accesso solo via service_role (Nitro).
-- Stesso pattern di tutte le tabelle pianeta esistenti.

CREATE SCHEMA IF NOT EXISTS pianeta;

-- ─── 1. client_organizations — entità cliente ────────────────────────────────
CREATE TABLE IF NOT EXISTS pianeta.client_organizations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  slug       text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pianeta.client_organizations ENABLE ROW LEVEL SECURITY;
-- Nessuna policy pubblica — solo service_role (bypassa RLS per default in Supabase).

-- ─── 2. Estendi client_projects con client_org_id ────────────────────────────
--
-- Nullable: i progetti storici non devono necessariamente avere un'org.
ALTER TABLE pianeta.client_projects
  ADD COLUMN IF NOT EXISTS client_org_id uuid
  REFERENCES pianeta.client_organizations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_client_projects_org
  ON pianeta.client_projects(client_org_id);

-- ─── 3. Backfill — Bosco Colto ───────────────────────────────────────────────
--
-- Crea l'org solo se non esiste già (idempotente grazie a ON CONFLICT DO NOTHING).
INSERT INTO pianeta.client_organizations (name, slug)
VALUES ('Bosco Colto', 'bosco-colto')
ON CONFLICT (slug) DO NOTHING;

-- Aggiorna il progetto esistente con slug='bosco-colto' all'org appena creata.
UPDATE pianeta.client_projects
SET client_org_id = (
  SELECT id FROM pianeta.client_organizations WHERE slug = 'bosco-colto'
)
WHERE slug = 'bosco-colto'
  AND client_org_id IS NULL;

-- Spazioerre resta senza client_org_id (nessuna azione, single-project client).
