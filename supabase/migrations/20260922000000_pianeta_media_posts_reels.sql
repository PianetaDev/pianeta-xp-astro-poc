-- PIA-1541 Fase 1: estende pianeta_media_usages per supportare posts/reels
--
-- content_type: aggiunge 'posts' e 'reels' ai tipi esistenti
-- field: aggiunge 'carousel' per foto in sequenza dentro un post
-- position: ordine di swipe nel carosello (NULL per cover/inline/og/thumbnail)
--
-- VERIFICA dopo apply:
--   select conname, pg_get_constraintdef(oid)
--   from pg_constraint
--   where conrelid='pianeta_media_usages'::regclass;

-- Estendi content_type_check
ALTER TABLE pianeta_media_usages
  DROP CONSTRAINT pianeta_media_usages_content_type_check;

ALTER TABLE pianeta_media_usages
  ADD CONSTRAINT pianeta_media_usages_content_type_check
  CHECK (content_type IN ('work','bulletin','services','lab','team','careers','posts','reels'));

-- Estendi field_check
ALTER TABLE pianeta_media_usages
  DROP CONSTRAINT pianeta_media_usages_field_check;

ALTER TABLE pianeta_media_usages
  ADD CONSTRAINT pianeta_media_usages_field_check
  CHECK (field IN ('cover','inline','og','thumbnail','carousel'));

-- Aggiunge colonna position per l'ordine di swipe nel carosello.
-- NULL per tutti i field che non sono 'carousel'.
ALTER TABLE pianeta_media_usages
  ADD COLUMN IF NOT EXISTS position smallint;

-- Indice per recupero ordinato del carosello di un post/reel
CREATE INDEX IF NOT EXISTS idx_pianeta_media_usages_carousel
  ON pianeta_media_usages(content_type, content_slug, position)
  WHERE field = 'carousel';
