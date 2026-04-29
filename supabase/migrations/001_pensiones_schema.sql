-- ============================================================================
-- CRM Haydeé Pérez · Pensiones y Asesoría Patrimonial
-- Migration 001 — schema inicial pensiones (Régimen 73 + Régimen 97 + M40)
-- ============================================================================

-- ENUMs
CREATE TYPE prospecto_stage AS ENUM (
  'nuevo',         -- entró por Meta/orgánico, sin filtrar
  'calificado',    -- bot validó edad/semanas/régimen, listo para llamada
  'propuesta',     -- ya tuvo asesoría, propuesta enviada
  'firmado',       -- contrato firmado
  'perdido'        -- descartado o no se cerró
);

CREATE TYPE prospecto_origen AS ENUM (
  'meta',
  'referido',
  'organico_tiktok',
  'organico_ig',
  'organico_facebook',
  'linkedin',
  'whatsapp_directo',
  'otro'
);

CREATE TYPE regimen_imss AS ENUM ('73', '97');

CREATE TYPE asesoria_modalidad AS ENUM ('presencial', 'videollamada');

CREATE TYPE asesoria_tipo AS ENUM (
  'inicial',
  'propuesta',
  'firma_contrato',
  'seguimiento'
);

CREATE TYPE asesoria_estado AS ENUM (
  'agendada',
  'confirmada',
  'completada',
  'no_show',
  'cancelada'
);

CREATE TYPE bot_estado AS ENUM (
  'esperando_input',
  'filtrando',
  'calificado',
  'objecion_precio',
  'follow_up_auto',
  'pausado_humano',
  'cerrado'
);

-- ============================================================================
-- USUARIOS (asesores con acceso al CRM)
-- ============================================================================
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefono TEXT,
  rol TEXT NOT NULL DEFAULT 'admin' CHECK (rol IN ('admin', 'asesor', 'asistente')),
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- PROSPECTOS (cliente potencial)
-- ============================================================================
CREATE TABLE prospectos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- identidad
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT,
  -- demográficos pensión
  edad INT CHECK (edad BETWEEN 30 AND 100),
  fecha_nacimiento DATE,
  semanas_cotizadas INT,
  regimen regimen_imss,
  -- pipeline
  stage prospecto_stage NOT NULL DEFAULT 'nuevo',
  origen prospecto_origen,
  meta_campaign_id TEXT,         -- atribución Meta
  meta_ad_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  -- comerciales
  honorarios_estimados NUMERIC(10, 2),
  honorarios_firmados NUMERIC(10, 2),
  necesita_financiamiento BOOLEAN DEFAULT false,
  plazo_financiamiento_meses INT,
  -- asignación
  asesor_id UUID REFERENCES usuarios(id),
  -- bot
  bot_estado bot_estado NOT NULL DEFAULT 'esperando_input',
  bot_pausado BOOLEAN NOT NULL DEFAULT false,
  bot_pausado_at TIMESTAMPTZ,
  -- notas
  notas TEXT,
  motivo_perdido TEXT,
  -- timestamps de pipeline
  primer_contacto_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ultimo_contacto_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  calificado_at TIMESTAMPTZ,
  propuesta_enviada_at TIMESTAMPTZ,
  firmado_at TIMESTAMPTZ,
  perdido_at TIMESTAMPTZ,
  -- meta
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (telefono)
);

CREATE INDEX prospectos_stage_idx ON prospectos(stage);
CREATE INDEX prospectos_origen_idx ON prospectos(origen);
CREATE INDEX prospectos_asesor_idx ON prospectos(asesor_id);
CREATE INDEX prospectos_ultimo_contacto_idx ON prospectos(ultimo_contacto_at DESC);

-- ============================================================================
-- ASESORÍAS (citas presenciales o videollamadas)
-- ============================================================================
CREATE TABLE asesorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospecto_id UUID NOT NULL REFERENCES prospectos(id) ON DELETE CASCADE,
  asesor_id UUID NOT NULL REFERENCES usuarios(id),
  fecha_inicio TIMESTAMPTZ NOT NULL,
  fecha_fin TIMESTAMPTZ,
  modalidad asesoria_modalidad NOT NULL,
  tipo asesoria_tipo NOT NULL DEFAULT 'inicial',
  estado asesoria_estado NOT NULL DEFAULT 'agendada',
  ubicacion TEXT,                        -- presencial: dirección · video: URL Zoom/Meet
  recordatorio_24h_enviado BOOLEAN DEFAULT false,
  recordatorio_2h_enviado BOOLEAN DEFAULT false,
  notas_pre TEXT,
  notas_post TEXT,
  honorarios_propuestos NUMERIC(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX asesorias_prospecto_idx ON asesorias(prospecto_id);
CREATE INDEX asesorias_fecha_idx ON asesorias(fecha_inicio);
CREATE INDEX asesorias_estado_idx ON asesorias(estado);

-- ============================================================================
-- CONVERSACIONES WHATSAPP (mensajes inbound + outbound + bot)
-- ============================================================================
CREATE TABLE conversaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospecto_id UUID REFERENCES prospectos(id) ON DELETE CASCADE,
  canal TEXT NOT NULL CHECK (canal IN ('whatsapp', 'messenger')),
  direccion TEXT NOT NULL CHECK (direccion IN ('inbound', 'outbound')),
  emisor TEXT NOT NULL CHECK (emisor IN ('cliente', 'bot', 'asesor')),
  mensaje TEXT NOT NULL,
  twilio_sid TEXT,
  meta_message_id TEXT,
  template_name TEXT,
  media_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX conversaciones_prospecto_idx ON conversaciones(prospecto_id, created_at DESC);

-- ============================================================================
-- PROPUESTAS / CARPETAS DE CLIENTE
-- ============================================================================
CREATE TABLE propuestas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospecto_id UUID NOT NULL REFERENCES prospectos(id) ON DELETE CASCADE,
  -- datos de cálculo M40
  salario_base_cotizacion NUMERIC(10, 2),
  meses_modalidad_40 INT,
  pension_estimada_mensual NUMERIC(10, 2),
  retroactivo_estimado NUMERIC(12, 2),
  honorarios NUMERIC(10, 2) NOT NULL,
  -- financiamiento
  financiamiento_aplicado BOOLEAN DEFAULT false,
  plazo_meses INT,
  pago_mensual NUMERIC(10, 2),
  -- documento
  pdf_url TEXT,
  enviada_at TIMESTAMPTZ,
  aceptada_at TIMESTAMPTZ,
  rechazada_at TIMESTAMPTZ,
  motivo_rechazo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX propuestas_prospecto_idx ON propuestas(prospecto_id);

-- ============================================================================
-- TAREAS DE SEGUIMIENTO
-- ============================================================================
CREATE TABLE tareas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospecto_id UUID NOT NULL REFERENCES prospectos(id) ON DELETE CASCADE,
  asesor_id UUID NOT NULL REFERENCES usuarios(id),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha_limite TIMESTAMPTZ,
  completada BOOLEAN NOT NULL DEFAULT false,
  completada_at TIMESTAMPTZ,
  generada_por_bot BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX tareas_asesor_pendientes_idx ON tareas(asesor_id) WHERE completada = false;

-- ============================================================================
-- CAMPAÑAS DE REACTIVACIÓN
-- ============================================================================
CREATE TABLE campanias_reactivacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  template_name TEXT,                    -- plantilla Meta aprobada
  filtro_dias_inactivos INT NOT NULL DEFAULT 60,
  filtro_stage prospecto_stage,
  filtro_regimen regimen_imss,
  total_destinatarios INT,
  total_enviados INT NOT NULL DEFAULT 0,
  total_respondieron INT NOT NULL DEFAULT 0,
  total_recuperados INT NOT NULL DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'enviando', 'completada', 'cancelada')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  enviada_at TIMESTAMPTZ
);

-- ============================================================================
-- CONFIGURACIÓN DEL BOT (voz, frases, reglas)
-- ============================================================================
CREATE TABLE configuracion (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  -- identidad de marca
  marca_nombre TEXT NOT NULL DEFAULT 'Pensiones y Asesoría Patrimonial',
  asesor_principal_nombre TEXT NOT NULL DEFAULT 'Haydeé Pérez',
  whatsapp_numero TEXT NOT NULL DEFAULT '+525635309664',
  -- voz del bot
  bot_tono TEXT NOT NULL DEFAULT 'Cercano y cálido',
  frases_si TEXT[] DEFAULT ARRAY[
    'Hola, gracias por contactarme',
    '¿Ha tenido asesoría anteriormente sobre el tema?',
    'Nosotros podemos apoyarle de tal forma',
    'Le agendamos cita presencial o por videollamada'
  ],
  frases_no TEXT[] DEFAULT ARRAY[
    'Es muy caro',
    'No le va a alcanzar',
    'Mejor búsquele en otro lado',
    'Eso no aplica para usted'
  ],
  bot_system_prompt TEXT,
  -- reglas de filtrado
  edad_minima_r73 INT NOT NULL DEFAULT 58,
  semanas_minimas_r73 INT NOT NULL DEFAULT 420,
  edad_minima_r97 INT NOT NULL DEFAULT 50,
  semanas_minimas_r97 INT NOT NULL DEFAULT 1250,
  -- comerciales
  honorarios_default_m40 NUMERIC(10, 2) DEFAULT 25000,
  -- horario
  horario_atencion_humana_inicio TIME DEFAULT '09:00',
  horario_atencion_humana_fin TIME DEFAULT '20:00',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO configuracion (id) VALUES (1);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- updated_at automático
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER usuarios_updated BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER prospectos_updated BEFORE UPDATE ON prospectos FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER asesorias_updated BEFORE UPDATE ON asesorias FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- timestamps de pipeline (calificado_at, propuesta_enviada_at, firmado_at)
CREATE OR REPLACE FUNCTION trigger_pipeline_timestamps() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stage <> OLD.stage THEN
    IF NEW.stage = 'calificado' AND OLD.calificado_at IS NULL THEN
      NEW.calificado_at = NOW();
    ELSIF NEW.stage = 'propuesta' AND OLD.propuesta_enviada_at IS NULL THEN
      NEW.propuesta_enviada_at = NOW();
    ELSIF NEW.stage = 'firmado' THEN
      NEW.firmado_at = NOW();
    ELSIF NEW.stage = 'perdido' THEN
      NEW.perdido_at = NOW();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prospectos_pipeline_timestamps
  BEFORE UPDATE OF stage ON prospectos
  FOR EACH ROW EXECUTE FUNCTION trigger_pipeline_timestamps();

-- ============================================================================
-- VISTAS PARA DASHBOARD
-- ============================================================================

CREATE VIEW v_dashboard_kpis AS
SELECT
  (SELECT COUNT(*) FROM prospectos WHERE stage = 'nuevo' AND created_at >= CURRENT_DATE) AS leads_nuevos_hoy,
  (SELECT COUNT(*) FROM conversaciones c
    JOIN prospectos p ON p.id = c.prospecto_id
    WHERE c.direccion = 'inbound' AND p.bot_pausado = true
      AND c.created_at = (SELECT MAX(created_at) FROM conversaciones WHERE prospecto_id = p.id)
  ) AS pendientes_responder,
  (SELECT COUNT(*) FROM prospectos WHERE stage = 'calificado') AS calificados_para_llamada,
  (SELECT COUNT(*) FROM asesorias WHERE fecha_inicio::date = CURRENT_DATE AND estado IN ('agendada', 'confirmada')) AS asesorias_hoy,
  (SELECT COUNT(*) FROM prospectos WHERE stage = 'propuesta'
    AND ultimo_contacto_at < NOW() - INTERVAL '3 days') AS propuestas_en_decision,
  (SELECT COUNT(*) FROM prospectos WHERE stage = 'firmado' AND firmado_at >= date_trunc('month', CURRENT_DATE)) AS firmados_mes,
  (SELECT COALESCE(SUM(honorarios_estimados), 0) FROM prospectos
    WHERE stage IN ('calificado', 'propuesta')
  ) AS honorarios_proyectados_mes,
  CASE
    WHEN (SELECT COUNT(*) FROM prospectos WHERE created_at >= date_trunc('month', CURRENT_DATE)) = 0 THEN 0
    ELSE (SELECT COUNT(*)::float FROM prospectos WHERE stage = 'firmado' AND firmado_at >= date_trunc('month', CURRENT_DATE))
       / (SELECT COUNT(*)::float FROM prospectos WHERE created_at >= date_trunc('month', CURRENT_DATE))
  END AS tasa_conversion_mes;

CREATE VIEW v_dormidos AS
SELECT
  p.*,
  EXTRACT(DAY FROM NOW() - p.ultimo_contacto_at)::int AS dias_inactivos
FROM prospectos p
WHERE p.stage IN ('calificado', 'propuesta')
  AND p.ultimo_contacto_at < NOW() - INTERVAL '60 days'
ORDER BY p.ultimo_contacto_at ASC;

-- ============================================================================
-- RLS (abierto a authenticated por ahora — se afina cuando entren más asesores)
-- ============================================================================
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE asesorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE propuestas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE campanias_reactivacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

CREATE POLICY auth_all_usuarios ON usuarios FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY auth_all_prospectos ON prospectos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY auth_all_asesorias ON asesorias FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY auth_all_conversaciones ON conversaciones FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY auth_all_propuestas ON propuestas FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY auth_all_tareas ON tareas FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY auth_all_campanias ON campanias_reactivacion FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY auth_all_configuracion ON configuracion FOR ALL TO authenticated USING (true) WITH CHECK (true);
