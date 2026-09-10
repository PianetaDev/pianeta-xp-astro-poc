-- Pianeta Media — archivio fotografico esplorabile per i case study
-- di xp.pianeta.studio. Vive nello stesso progetto Supabase di Bosco Colto
-- (zero costo aggiuntivo), isolato con prefisso `pianeta_media_`.
--
-- NON toccare le tabelle watchers_photos / watchers_photos_nearest / etc.
-- di Bosco Colto: schema, dati e funzioni Bosco restano completamente separati.

-- Abilita pgvector se non già attivo sull'istanza (idempotente)
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Tabella principale: foto dei progetti Pianeta.Studio
CREATE TABLE IF NOT EXISTS pianeta_media_photos (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path      text NOT NULL,
  thumbnail_path    text,
  caption           text,
  embedding         vector(1536),
  color_avg_hex     text,
  color_palette     text[] DEFAULT '{}',
  pos_x             double precision,
  pos_y             double precision,
  -- Raggruppamento per progetto (slug del case study, es. "bc-rebrand")
  project_slug      text,
  -- Tag liberi per filtri UI (es. "branding", "web", "print")
  tags              text[] DEFAULT '{}',
  photographer      text,
  captured_at       timestamptz,
  gps_lat           double precision,
  gps_lng           double precision,
  source            text NOT NULL DEFAULT 'staff'
                    CHECK (source IN ('staff')),
  status            text NOT NULL DEFAULT 'published'
                    CHECK (status IN ('pending','published','removed')),
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pianeta_media_photos_status
  ON pianeta_media_photos(status);
CREATE INDEX IF NOT EXISTS idx_pianeta_media_photos_project
  ON pianeta_media_photos(project_slug);
CREATE INDEX IF NOT EXISTS idx_pianeta_media_photos_embedding
  ON pianeta_media_photos USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);
CREATE INDEX IF NOT EXISTS idx_pianeta_media_photos_caption_trgm
  ON pianeta_media_photos USING gin (caption gin_trgm_ops);

-- RLS: solo lettura pubblica dei published. Scrittura via service role.
ALTER TABLE pianeta_media_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pianeta_media_photos_public_read" ON pianeta_media_photos
  FOR SELECT USING (status = 'published');

-- Funzione per la ricerca ibrida semantica + lessicale
CREATE OR REPLACE FUNCTION pianeta_media_photos_hybrid_search(
  query_text        text,
  query_embedding   vector(1536) DEFAULT NULL,
  match_count       int DEFAULT 60
)
RETURNS TABLE (
  id uuid, storage_path text, thumbnail_path text, caption text,
  pos_x double precision, pos_y double precision, color_avg_hex text,
  project_slug text, tags text[], similarity_score float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    p.id, p.storage_path, p.thumbnail_path, p.caption,
    p.pos_x, p.pos_y, p.color_avg_hex, p.project_slug, p.tags,
    CASE
      WHEN query_embedding IS NOT NULL AND p.embedding IS NOT NULL THEN
        0.4 * similarity(coalesce(p.caption, ''), query_text)
        + 0.6 * (1 - (p.embedding <=> query_embedding))
      ELSE
        similarity(coalesce(p.caption, ''), query_text)
    END AS similarity_score
  FROM pianeta_media_photos p
  WHERE p.status = 'published'
    AND (
      query_text = ''
      OR similarity(coalesce(p.caption, ''), query_text) > 0.05
      OR (query_embedding IS NOT NULL AND p.embedding IS NOT NULL
          AND (p.embedding <=> query_embedding) < 0.8)
    )
  ORDER BY similarity_score DESC
  LIMIT match_count;
$$;

-- Funzione per i vicini più prossimi (posizionamento + "vedi simili")
CREATE OR REPLACE FUNCTION pianeta_media_photos_nearest(
  query_embedding   vector(1536),
  k                 int DEFAULT 5,
  exclude_id        uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid, pos_x double precision, pos_y double precision,
  distance float, project_slug text, tags text[]
)
LANGUAGE sql STABLE
AS $$
  SELECT id, pos_x, pos_y,
         (embedding <=> query_embedding) AS distance,
         project_slug, tags
  FROM pianeta_media_photos
  WHERE embedding IS NOT NULL
    AND pos_x IS NOT NULL
    AND status = 'published'
    AND (exclude_id IS NULL OR id != exclude_id)
  ORDER BY embedding <=> query_embedding
  LIMIT k;
$$;
