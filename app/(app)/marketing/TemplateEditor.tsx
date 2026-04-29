"use client";

import { useState } from "react";
import { X, Check, Mail, MessageCircle, Sparkles, Wand2 } from "lucide-react";
import type { Template } from "@/lib/demo-data";

const EMOJIS = ["📅", "💬", "📄", "✅", "📞", "🤝", "💼", "📊", "🎂", "📩", "⏰", "🏛️"];

export default function TemplateEditor({
  template,
  onClose,
  onSaved,
}: {
  template: Template | null;
  onClose: () => void;
  onSaved: (t: Template) => void;
}) {
  const [mode, setMode] = useState<"manual" | "ai">(template ? "manual" : "ai");
  const [data, setData] = useState({
    nombre: template?.nombre ?? "",
    tipo: (template?.tipo as "email" | "whatsapp") ?? "whatsapp",
    asunto: template?.asunto ?? "",
    cuerpo_texto: template?.cuerpo_texto ?? "",
    emoji: template?.emoji ?? "📅",
  });
  const [saving, setSaving] = useState(false);

  // AI mode state
  const [idea, setIdea] = useState("");
  const [audiencia, setAudiencia] = useState("prospectos en general");
  const [longitud, setLongitud] = useState<"corto" | "medio" | "largo">("medio");
  const [generando, setGenerando] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  async function generar() {
    if (!idea.trim()) return;
    setGenerando(true);
    setAiError(null);
    try {
      const res = await fetch("/api/ai/generate-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, tipo: data.tipo, audiencia, longitud }),
      });
      const j = await res.json();
      if (!res.ok) {
        setAiError(j.error || "No pude generar el mensaje");
        return;
      }
      setData({
        ...data,
        cuerpo_texto: j.cuerpo,
        asunto: j.asunto || data.asunto,
        nombre: data.nombre || idea.slice(0, 40),
      });
      setMode("manual");
    } catch (e) {
      setAiError((e as Error).message);
    } finally {
      setGenerando(false);
    }
  }

  function save() {
    setSaving(true);
    const saved: Template = {
      id: template?.id ?? `t-${Math.random().toString(36).slice(2, 8)}`,
      nombre: data.nombre,
      tipo: data.tipo,
      asunto: data.tipo === "email" ? data.asunto || null : null,
      cuerpo_texto: data.cuerpo_texto,
      emoji: data.emoji,
      veces_usado: template?.veces_usado ?? 0,
      ultimo_uso: template?.ultimo_uso ?? null,
    };
    onSaved(saved);
    setSaving(false);
  }

  const previewBody = data.cuerpo_texto
    .replace(/\{\{nombre\}\}/g, "María del Carmen")
    .replace(/\{\{apellido\}\}/g, "Vázquez")
    .replace(/\{\{regimen\}\}/g, "73")
    .replace(/\{\{semanas\}\}/g, "980")
    .replace(/\{\{edad\}\}/g, "61")
    .replace(/\{\{fecha_asesoria\}\}/g, "miércoles 6 de mayo, 11:00")
    .replace(/\{\{link_asesoria\}\}/g, "meet.google.com/abc-defg-hij")
    .replace(/\{\{honorarios\}\}/g, "$28,500")
    .replace(/\{\{link_pago\}\}/g, "pago.haydeeperez.mx/abc123");

  return (
    <div className="fixed inset-0 z-50 bg-[hsl(218_50%_8%_/_0.6)] backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--background)] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between sticky top-0 bg-[var(--background)] z-10">
          <div>
            <p className="eyebrow !text-[var(--lime-deep)] mb-0.5">
              {template ? "Editar" : "Nuevo template"}
            </p>
            <h2 className="text-xl">
              {template?.nombre || (mode === "ai" ? "Generar con IA" : "Template nuevo")}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--muted)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!template && (
          <div className="px-6 pt-4">
            <div className="inline-flex bg-[var(--muted)] rounded-full p-1">
              <button
                onClick={() => setMode("ai")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  mode === "ai"
                    ? "bg-[var(--lime)] text-[var(--navy-deep)]"
                    : "text-[var(--muted-foreground)]"
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" /> Generar con IA
              </button>
              <button
                onClick={() => setMode("manual")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  mode === "manual"
                    ? "bg-[var(--lime)] text-[var(--navy-deep)]"
                    : "text-[var(--muted-foreground)]"
                }`}
              >
                Manual
              </button>
            </div>
          </div>
        )}

        <div className="p-6 space-y-5">
          {mode === "ai" && !template && (
            <>
              <div className="bg-[var(--lime-soft)]/30 border border-[var(--lime-deep)] rounded-xl p-4 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[var(--navy-deep)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium mb-1">La IA escribe con SU voz</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Usa las frases SÍ/NO de configuración + las correcciones que ha dado al bot.
                    Solo cuéntale qué quiere comunicar.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-medium mb-2 block">
                  Su idea (en lenguaje natural)
                </label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={4}
                  placeholder="Ejemplo: Quiero recordarles a los prospectos R73 con más de 800 semanas que pueden bajar su pensión 30% si entran a Modalidad 40 antes de cumplir 60 años, con financiamiento a 12 meses."
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-medium mb-1.5 block">
                    Tipo
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setData({ ...data, tipo: "whatsapp" })}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border text-sm ${
                        data.tipo === "whatsapp"
                          ? "bg-[var(--lime-soft)] border-[var(--lime-deep)]"
                          : "border-[var(--border)] bg-white"
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WA
                    </button>
                    <button
                      onClick={() => setData({ ...data, tipo: "email" })}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border text-sm ${
                        data.tipo === "email"
                          ? "bg-[var(--lime-soft)] border-[var(--lime-deep)]"
                          : "border-[var(--border)] bg-white"
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" /> Email
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-medium mb-1.5 block">
                    Longitud
                  </label>
                  <select
                    value={longitud}
                    onChange={(e) => setLongitud(e.target.value as "corto" | "medio" | "largo")}
                  >
                    <option value="corto">Corto (1-2 líneas)</option>
                    <option value="medio">Medio (3-5 líneas)</option>
                    <option value="largo">Largo (1-2 párrafos)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-medium mb-1.5 block">
                  Audiencia (opcional)
                </label>
                <input
                  type="text"
                  value={audiencia}
                  onChange={(e) => setAudiencia(e.target.value)}
                  placeholder="Ej: prospectos R73, dormidos 60+ días, asesorías agendadas..."
                />
              </div>

              {aiError && (
                <div className="bg-[hsl(0_84%_60%_/_0.1)] border border-[var(--destructive)] rounded-xl p-3 text-sm text-[var(--destructive)]">
                  {aiError}
                </div>
              )}

              <button
                onClick={generar}
                disabled={!idea.trim() || generando}
                className="btn-primary w-full justify-center !py-3"
              >
                <Wand2 className="w-4 h-4" />
                {generando ? "Generando con IA…" : "Generar mensaje con su voz"}
              </button>
            </>
          )}

          {mode === "manual" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block font-medium">
                    Nombre interno
                  </label>
                  <input
                    type="text"
                    value={data.nombre}
                    onChange={(e) => setData({ ...data, nombre: e.target.value })}
                    placeholder="Ej: Recordatorio asesoría 24h"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block font-medium">
                    Tipo
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setData({ ...data, tipo: "whatsapp" })}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border ${
                        data.tipo === "whatsapp"
                          ? "bg-[var(--lime-soft)] border-[var(--lime-deep)]"
                          : "border-[var(--border)] bg-white"
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WA
                    </button>
                    <button
                      onClick={() => setData({ ...data, tipo: "email" })}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border ${
                        data.tipo === "email"
                          ? "bg-[var(--lime-soft)] border-[var(--lime-deep)]"
                          : "border-[var(--border)] bg-white"
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" /> Email
                    </button>
                  </div>
                </div>
              </div>

              {data.tipo === "email" && (
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block font-medium">
                    Asunto del email
                  </label>
                  <input
                    type="text"
                    value={data.asunto}
                    onChange={(e) => setData({ ...data, asunto: e.target.value })}
                    placeholder="Algo claro que se note en la bandeja"
                  />
                </div>
              )}

              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block font-medium">
                  Emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      onClick={() => setData({ ...data, emoji: e })}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-colors ${
                        data.emoji === e
                          ? "border-[var(--lime-deep)] bg-[var(--lime-soft)]/40"
                          : "border-[var(--border)] bg-white hover:border-[var(--lime-deep)]"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5 block font-medium">
                  Mensaje (use{" "}
                  <code className="bg-[var(--muted)] px-1 rounded">{`{{nombre}}`}</code>,{" "}
                  <code className="bg-[var(--muted)] px-1 rounded">{`{{regimen}}`}</code>,{" "}
                  <code className="bg-[var(--muted)] px-1 rounded">{`{{semanas}}`}</code>)
                </label>
                <textarea
                  value={data.cuerpo_texto}
                  onChange={(e) => setData({ ...data, cuerpo_texto: e.target.value })}
                  rows={8}
                  placeholder="Hola {{nombre}}, le saluda Haydeé Pérez..."
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {data.cuerpo_texto.length} caracteres
                  </p>
                  {!template && (
                    <button
                      onClick={() => setMode("ai")}
                      className="text-xs text-[var(--lime-deep)] hover:underline flex items-center gap-1"
                    >
                      <Wand2 className="w-3 h-3" /> Regenerar con IA
                    </button>
                  )}
                </div>
              </div>

              <div>
                <p className="eyebrow !text-[var(--lime-deep)] mb-2">
                  Vista previa con datos reales
                </p>
                <div
                  className={`rounded-2xl p-4 max-w-md border ${
                    data.tipo === "whatsapp"
                      ? "bg-[hsl(72_60%_94%)] rounded-tl-sm border-[var(--border)]"
                      : "bg-white border-[var(--border)]"
                  }`}
                >
                  {data.tipo === "email" && data.asunto && (
                    <p className="font-semibold mb-2 text-sm">{data.asunto}</p>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {previewBody || (
                      <em className="text-[var(--muted-foreground)]">
                        El mensaje aparecerá aquí…
                      </em>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={onClose} className="btn-ghost flex-1 justify-center">
                  Cancelar
                </button>
                <button
                  onClick={save}
                  disabled={!data.nombre.trim() || !data.cuerpo_texto.trim() || saving}
                  className="btn-primary flex-1 justify-center"
                >
                  {saving ? (
                    "Guardando…"
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Guardar template
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
