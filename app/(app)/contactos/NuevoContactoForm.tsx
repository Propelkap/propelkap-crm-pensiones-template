"use client";

import { useState } from "react";
import { Plus, X, Check } from "lucide-react";

const ORIGENES = ["Referido", "Networking", "Evento", "DM IG", "DM TikTok", "Familiar", "Otro"];

export default function NuevoContactoForm() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    origen: "Referido",
    notas: "",
  });

  function reset() {
    setForm({ nombre: "", telefono: "", email: "", origen: "Referido", notas: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Modo demo: log a consola hasta que conectemos /api/contactos con Supabase
    console.log("[contacto-nuevo]", form);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
      reset();
    }, 1200);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary mb-6">
        <Plus className="w-4 h-4" />
        Agregar contacto
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card mb-6 space-y-3 border-[var(--lime)] bg-white"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Nuevo contacto orgánico</h3>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            reset();
          }}
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">
            Nombre completo
          </label>
          <input
            type="text"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="María del Carmen Vázquez"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">
            WhatsApp
          </label>
          <input
            type="tel"
            required
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            placeholder="+52 55 1234 5678"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">
            Email (opcional)
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="opcional@correo.com"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">
            Origen
          </label>
          <select
            value={form.origen}
            onChange={(e) => setForm({ ...form, origen: e.target.value })}
          >
            {ORIGENES.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">
          Notas (¿quién lo refirió, contexto, edad aprox., R73 / R97?)
        </label>
        <textarea
          rows={3}
          value={form.notas}
          onChange={(e) => setForm({ ...form, notas: e.target.value })}
          placeholder="Lo recomendó Patricia. Tiene 60 años, ya tiene SIPAREs."
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button type="submit" disabled={saving} className="btn-primary">
          {saved ? (
            <>
              <Check className="w-4 h-4" /> Guardado
            </>
          ) : saving ? (
            "Guardando…"
          ) : (
            <>
              <Plus className="w-4 h-4" /> Guardar contacto
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            reset();
          }}
          className="btn-ghost"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
