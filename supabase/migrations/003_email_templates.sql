-- ============================================================================
-- Migration 003 — Marketing: plantillas reutilizables de WhatsApp / email
-- Replica el patrón de gina-brows-crm (email_templates) adaptado a pensiones.
-- ============================================================================

CREATE TYPE template_tipo AS ENUM ('email', 'whatsapp');

CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  tipo template_tipo NOT NULL DEFAULT 'whatsapp',
  asunto TEXT,
  cuerpo_texto TEXT NOT NULL,
  cuerpo_html TEXT,
  variables_disponibles TEXT[] DEFAULT ARRAY[
    'nombre',
    'apellido',
    'regimen',
    'semanas',
    'edad',
    'fecha_asesoria',
    'link_asesoria',
    'honorarios',
    'link_pago'
  ],
  emoji TEXT,
  veces_usado INT NOT NULL DEFAULT 0,
  ultimo_uso TIMESTAMPTZ,
  archivado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX email_templates_tipo_idx ON email_templates(tipo, archivado);
CREATE INDEX email_templates_ultimo_uso_idx ON email_templates(ultimo_uso DESC NULLS LAST)
  WHERE archivado = false;

CREATE TRIGGER email_templates_updated BEFORE UPDATE ON email_templates
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY auth_all_email_templates ON email_templates
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- Seed inicial con la voz de Haydeé Pérez (pensiones)
-- ----------------------------------------------------------------------------
INSERT INTO email_templates (nombre, tipo, asunto, cuerpo_texto, emoji) VALUES
  ('Recordatorio asesoría 24h',
   'whatsapp', NULL,
   'Hola {{nombre}}, le recuerdo nuestra asesoría sobre su pensión Régimen {{regimen}} el {{fecha_asesoria}}. Aquí el enlace: {{link_asesoria}}. Si tiene su carta de semanas a la mano, perfecto. Cualquier cosa, me avisa.',
   '📅'),
  ('Reactivación silencio 60+ días',
   'whatsapp', NULL,
   'Hola {{nombre}}, le saluda Haydeé Pérez. Hace tiempo platicamos de su pensión y quería retomar. Con sus {{semanas}} semanas en Régimen {{regimen}} hay opciones nuevas que conviene revisar este año. ¿Le marco esta semana?',
   '💬'),
  ('Envío de propuesta personalizada',
   'email',
   'Su propuesta de pensión — Haydeé Pérez',
   E'Estimado(a) {{nombre}} {{apellido}},\n\nLe envío la propuesta personalizada para su trámite de pensión Régimen {{regimen}}. Está calculada con sus {{semanas}} semanas cotizadas y considera la modalidad que platicamos.\n\nLink de pago seguro (12 MSI disponibles): {{link_pago}}\n\nQuedo al pendiente para resolver dudas.\n\nSaludos cordiales,\nHaydeé Pérez',
   '📄'),
  ('Felicitación cumpleaños',
   'whatsapp', NULL,
   'Hola {{nombre}}, ¡muchas felicidades en su día! Le deseamos un año lleno de salud y tranquilidad. Recuerde que aquí seguimos a la orden para lo que necesite de su pensión.',
   '🎂'),
  ('Confirmación firma de propuesta',
   'whatsapp', NULL,
   '{{nombre}}, recibimos su pago y firma. Iniciamos el trámite ante el IMSS esta misma semana. Le voy notificando cada avance. Gracias por la confianza.',
   '✅');
