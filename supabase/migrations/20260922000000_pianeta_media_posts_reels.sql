-- PIA-1541 Fase 4: estendi pianeta_media_usages per post-carosello e reel
-- Aggiunge: content_type posts/reels, field carousel, colonna position

-- 1. Estendi content_type check
ALTER TABLE pianeta_media_usages DROP CONSTRAINT IF EXISTS pianeta_media_usages_content_type_check;
ALTER TABLE pianeta_media_usages ADD CONSTRAINT pianeta_media_usages_content_type_check
  CHECK (content_type IN ('work','bulletin','services','lab','team','careers','posts','reels'));

-- 2. Aggiungi campo carousel e colonna position per l'ordine nel carosello
ALTER TABLE pianeta_media_usages DROP CONSTRAINT IF EXISTS pianeta_media_usages_field_check;
ALTER TABLE pianeta_media_usages ADD CONSTRAINT pianeta_media_usages_field_check
  CHECK (field IN ('cover','inline','og','thumbnail','carousel'));

ALTER TABLE pianeta_media_usages
  ADD COLUMN IF NOT EXISTS position smallint;

COMMENT ON COLUMN pianeta_media_usages.position IS
  'Ordine (0-based) della foto nel carosello quando field=carousel. NULL per tutti gli altri field.';
