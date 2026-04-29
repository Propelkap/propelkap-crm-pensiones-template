"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import TemplateEditor from "./TemplateEditor";
import type { Template } from "@/lib/demo-data";

const VARS_DISPONIBLES = [
  { v: "nombre", desc: "Nombre del prospecto" },
  { v: "apellido", desc: "Apellido" },
  { v: "regimen", desc: "Régimen IMSS (73 o 97)" },
  { v: "semanas", desc: "Semanas cotizadas" },
  { v: "edad", desc: "Edad actual" },
  { v: "fecha_asesoria", desc: "Fecha de su próxima asesoría" },
  { v: "link_asesoria", desc: "Link de Zoom o ubicación de la cita" },
  { v: "honorarios", desc: "Honorarios estimados de la propuesta" },
  { v: "link_pago", desc: "Link de pago seguro" },
];

export default function MarketingClient({
  initialTemplates,
}: {
  initialTemplates: Template[];
}) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [editing, setEditing] = useState<Template | null>(null);
  const [creating, setCreating] = useState(false);

  function deleteTemplate(id: string) {
    if (!confirm("¿Archivar este template?")) return;
    setTemplates(templates.filter((t) => t.id !== id));
  }

  function duplicate(t: Template) {
    const copy: Template = {
      ...t,
      id: `t-${Math.random().toString(36).slice(2, 8)}`,
      nombre: `${t.nombre} (copia)`,
      veces_usado: 0,
      ultimo_uso: null,
    };
    setTemplates([copy, ...templates]);
  }

  return (
    <div className="max-w-6xl">
      <header className="mb-8 flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow">Su voz, multiplicada</p>
          <h1 className="text-3xl mt-1">Marketing</h1>
          <p className="text-[var(--muted-foreground)] mt-2 max-w-xl">
            Cree, guarde y reutilice plantillas con su voz para WhatsApp y email.
            Cualquier idea que tenga, conviértala en mensaje listo para enviar en 30 segundos.
          </p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Crear template
        </button>
      </header>

      <div className="card mb-6 bg-[var(--lime-soft)]/30 border-[var(--lime-deep)]">
        <p className="eyebrow !text-[var(--navy-deep)] mb-2">💡 Variables que puede usar</p>
        <div className="flex flex-wrap gap-2">
          {VARS_DISPONIBLES.map((v) => (
            <code
              key={v.v}
              className="text-xs bg-white px-2 py-1 rounded-md border border-[var(--border)] font-mono"
              title={v.desc}
            >
              {`{{${v.v}}}`}
            </code>
          ))}
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-2">
          Al enviar el template, se reemplazan automáticamente con los datos reales de cada prospecto.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div
            key={t.id}
            className="card hover:shadow-[0_4px_24px_-8px_hsl(218_60%_14%_/_0.18)] transition-shadow flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[var(--lime-soft)] flex items-center justify-center text-lg">
                  {t.emoji || (t.tipo === "email" ? "📧" : "💬")}
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight">{t.nombre}</h3>
                  <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
                    {t.tipo}
                  </p>
                </div>
              </div>
            </div>
            {t.asunto && (
              <p className="text-xs font-medium mb-1 text-[var(--lime-deep)]">{t.asunto}</p>
            )}
            <p className="text-xs text-[var(--muted-foreground)] line-clamp-3 mb-4 flex-1 whitespace-pre-wrap">
              {t.cuerpo_texto}
            </p>

            <div className="flex items-center justify-between text-[10px] text-[var(--muted-foreground)] mb-3">
              <span>{t.veces_usado} usos</span>
              {t.ultimo_uso && <span>último: {t.ultimo_uso}</span>}
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => setEditing(t)}
                className="btn-ghost flex-1 justify-center !text-xs !py-1.5"
              >
                <Edit className="w-3 h-3" /> Editar
              </button>
              <button
                onClick={() => duplicate(t)}
                className="btn-ghost !px-2 !py-1.5"
                title="Duplicar"
              >
                <Copy className="w-3 h-3" />
              </button>
              <button
                onClick={() => deleteTemplate(t.id)}
                className="btn-ghost !px-2 !py-1.5 text-[var(--destructive)]"
                title="Archivar"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => setCreating(true)}
          className="card border-dashed border-2 hover:border-[var(--lime-deep)] flex flex-col items-center justify-center min-h-[180px] text-[var(--muted-foreground)] hover:text-[var(--navy-deep)] transition-colors"
        >
          <Plus className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm font-medium">Nuevo template</p>
          <p className="text-xs">Empezar desde cero</p>
        </button>
      </div>

      {(editing || creating) && (
        <TemplateEditor
          template={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={(saved) => {
            setEditing(null);
            setCreating(false);
            if (editing) {
              setTemplates(templates.map((t) => (t.id === saved.id ? saved : t)));
            } else {
              setTemplates([saved, ...templates]);
            }
          }}
        />
      )}
    </div>
  );
}
