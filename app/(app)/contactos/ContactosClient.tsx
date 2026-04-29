"use client";

import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { DEMO_CONTACTOS, type Contacto } from "@/lib/demo-data";
import NuevoContactoForm from "./NuevoContactoForm";
import SearchBar from "../_components/SearchBar";

const ORIGENES = [
  "Todos",
  "Referido",
  "Networking",
  "Evento",
  "DM IG",
  "DM TikTok",
  "Familiar",
  "Otro",
] as const;

export default function ContactosClient() {
  const [query, setQuery] = useState("");
  const [origen, setOrigen] = useState<(typeof ORIGENES)[number]>("Todos");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEMO_CONTACTOS.filter((c) => {
      if (origen !== "Todos" && c.origen !== origen) return false;
      if (!q) return true;
      const haystack = `${c.nombre} ${c.telefono} ${c.email ?? ""} ${c.origen} ${c.notas}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, origen]);

  const sinPromover = filtered.filter((c) => !c.promovido_a_prospecto);
  const promovidos = filtered.filter((c) => c.promovido_a_prospecto);

  return (
    <div className="max-w-6xl">
      <header className="mb-8">
        <p className="eyebrow">Carga orgánica</p>
        <h1 className="text-4xl mt-2">Contactos</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Leads que no entran por el bot — referidos, networking, DMs directos,
          familiares. Cárgalos aquí y promuévelos al pipeline cuando aplique.
        </p>
      </header>

      <NuevoContactoForm />

      <SearchBar
        placeholder="Buscar contacto…"
        value={query}
        onChange={setQuery}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {ORIGENES.map((o) => {
          const count =
            o === "Todos"
              ? DEMO_CONTACTOS.length
              : DEMO_CONTACTOS.filter((c) => c.origen === o).length;
          return (
            <button
              key={o}
              onClick={() => setOrigen(o)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors flex items-center gap-2 ${
                origen === o
                  ? "bg-[var(--navy-deep)] text-[var(--background)] border-[var(--navy-deep)]"
                  : "bg-white border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              {o}
              <span
                className={`text-[0.65rem] px-1.5 py-0.5 rounded-full ${
                  origen === o
                    ? "bg-[var(--lime)] text-[var(--navy-deep)]"
                    : "bg-[var(--lime-soft)] text-[var(--navy-deep)]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <div className="card bg-[var(--lime-soft)] border-[var(--lime)]">
          <p className="text-xs uppercase tracking-wider text-[var(--navy-deep)] mb-1">
            Sin promover
          </p>
          <p className="text-3xl font-bold">{sinPromover.length}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
            Ya en pipeline
          </p>
          <p className="text-3xl font-bold text-[var(--navy-deep)]">{promovidos.length}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
            En vista
          </p>
          <p className="text-3xl font-bold">{filtered.length}</p>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-[var(--muted-foreground)] text-sm">
            No hay contactos que coincidan con &ldquo;{query}&rdquo;.
          </p>
        </div>
      )}

      {sinPromover.length > 0 && (
        <>
          <h2 className="text-lg mb-3">Por promover al pipeline</h2>
          <div className="space-y-3 mb-10">
            {sinPromover.map((c) => (
              <ContactoRow key={c.id} c={c} />
            ))}
          </div>
        </>
      )}

      {promovidos.length > 0 && (
        <>
          <h2 className="text-lg mb-3">Ya en pipeline</h2>
          <div className="space-y-3">
            {promovidos.map((c) => (
              <div
                key={c.id}
                className="card flex items-center gap-4 opacity-70"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold">{c.nombre}</h3>
                    <span className="text-[0.6rem] px-2 py-0.5 rounded-full uppercase tracking-wider bg-[var(--lime-soft)] text-[var(--navy-deep)] font-semibold">
                      En pipeline
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {c.origen} · agregado {c.agregado_at}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-8 card border-dashed bg-[var(--card)]">
        <p className="eyebrow mb-2">Por qué importa</p>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          Tus mejores cierres son referidos. Si los apuntas en una libreta o
          WhatsApp, se pierden. Aquí los capturas en 30 segundos, los
          promueves al pipeline cuando estén listos para asesoría, y el bot
          puede hacer el primer contacto con tu voz.
        </p>
      </div>
    </div>
  );
}

function ContactoRow({ c }: { c: Contacto }) {
  return (
    <div className="card flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="font-semibold text-base">{c.nombre}</h3>
          <span className="text-[0.65rem] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider bg-[var(--muted)] text-[var(--muted-foreground)]">
            {c.origen}
          </span>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mb-2">
          {c.telefono}
          {c.email && ` · ${c.email}`} · agregado {c.agregado_at}
        </p>
        <p className="text-sm">{c.notas}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={`https://wa.me/${c.telefono.replace(/\D/g, "")}`}
          target="_blank"
          className="btn-ghost"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
        <a href={`tel:${c.telefono.replace(/\D/g, "")}`} className="btn-ghost" aria-label="Llamar">
          <Phone className="w-4 h-4" />
        </a>
        <button className="btn-primary">
          Promover
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
