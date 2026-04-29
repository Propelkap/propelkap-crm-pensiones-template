-- ============================================================================
-- Migration 002 — Contactos orgánicos + Bot feedback (thumbs up/down)
-- Estándar PropelKap: todo CRM nuevo debe incluir ambas tablas desde día 1.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- CONTACTOS — leads orgánicos cargados manualmente (referidos, networking,
-- DMs, eventos, familiares). Separados del pipeline automático del bot.
-- Cuando se promueven, se crea una fila en `prospectos` y se marca
-- promovido_a_prospecto_id.
-- ----------------------------------------------------------------------------

CREATE TYPE contacto_origen AS ENUM (
  'referido',
  'networking',
  'evento',
  'dm_ig',
  'dm_tiktok',
  'familiar',
  'otro'
);

CREATE TABLE contactos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT,
  origen contacto_origen NOT NULL DEFAULT 'referido',
  notas TEXT,
  agregado_por UUID REFERENCES usuarios(id),
  promovido_a_prospecto_id UUID REFERENCES prospectos(id) ON DELETE SET NULL,
  promovido_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX contactos_origen_idx ON contactos(origen);
CREATE INDEX contactos_promovido_idx ON contactos(promovido_a_prospecto_id) WHERE promovido_a_prospecto_id IS NOT NULL;
CREATE INDEX contactos_sin_promover_idx ON contactos(created_at DESC) WHERE promovido_a_prospecto_id IS NULL;

CREATE TRIGGER contactos_updated BEFORE UPDATE ON contactos FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ----------------------------------------------------------------------------
-- BOT_FEEDBACK — thumbs up/down humano sobre cada respuesta del bot.
-- Sirve para auditar prompts y entrenar mejoras continuas.
-- ----------------------------------------------------------------------------

CREATE TYPE feedback_rating AS ENUM ('up', 'down');

CREATE TABLE bot_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversacion_id UUID REFERENCES conversaciones(id) ON DELETE CASCADE,
  prospecto_id UUID REFERENCES prospectos(id) ON DELETE SET NULL,
  bot_mensaje TEXT NOT NULL,
  rating feedback_rating NOT NULL,
  -- Solo se llenan cuando rating = 'down'
  que_fallo TEXT,
  como_debio_responder TEXT,
  -- Comentario libre (solo lectura, retrocompat)
  comentario TEXT,
  usuario_id UUID REFERENCES usuarios(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX bot_feedback_rating_idx ON bot_feedback(rating, created_at DESC);
CREATE INDEX bot_feedback_conversacion_idx ON bot_feedback(conversacion_id);

-- Vista: tasa de thumbs up últimos 30 días
CREATE VIEW v_bot_satisfaccion AS
SELECT
  COUNT(*) FILTER (WHERE rating = 'up') AS thumbs_up,
  COUNT(*) FILTER (WHERE rating = 'down') AS thumbs_down,
  COUNT(*) AS total,
  CASE WHEN COUNT(*) = 0 THEN 0
    ELSE ROUND((COUNT(*) FILTER (WHERE rating = 'up'))::numeric / COUNT(*)::numeric * 100, 1)
  END AS pct_up
FROM bot_feedback
WHERE created_at >= NOW() - INTERVAL '30 days';

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY auth_all_contactos ON contactos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY auth_all_bot_feedback ON bot_feedback FOR ALL TO authenticated USING (true) WITH CHECK (true);
