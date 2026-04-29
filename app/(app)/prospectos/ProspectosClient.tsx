"use client";

import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import {
  DEMO_PROSPECTOS,
  STAGE_LABEL,
  STAGE_COLOR,
  type Stage,
  type Prospecto,
} from "@/lib/demo-data";
import SearchBar from "../_components/SearchBar";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);

const STAGES: Stage[] = ["nuevo", "calificado", "propuesta", "firmado"];

export default function ProspectosClient({
  initialStage,
}: {
  initialStage?: Stage;
}) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<Stage | undefined>(initialStage);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEMO_PROSPECTOS.filter((p) => {
      if (stage && p.stage !== stage) return false;
      if (!q) return true;
      const haystack =
        `${p.nombre} ${p.telefono} ${p.regimen} ${p.origen} ${p.notas}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, stage]);

  const counts = useMemo(() => {
    return STAGES.reduce(
      (acc, s) => {
        acc[s] = DEMO_PROSPECTOS.filter((p) => p.stage === s).length;
        return acc;
      },
      {} as Record<Stage, number>,
    );
  }, []);

  return (
    <div className="max-w-6xl">
      <header className="mb-8">
        <p className="eyebrow">Pipeline</p>
        <h1 className="text-4xl mt-2">Prospectos</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          {filtered.length} de {DEMO_PROSPECTOS.length} en el pipeline. Cada
          tarjeta es un lead real (datos demo).
        </p>
      </header>

      <SearchBar
        placeholder="Buscar prospecto…"
        value={query}
        onChange={setQuery}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <FilterPill
          onClick={() => setStage(undefined)}
          label="Todos"
          count={DEMO_PROSPECTOS.length}
          active={!stage}
        />
        {STAGES.map((s) => (
          <FilterPill
            key={s}
            onClick={() => setStage(s)}
            label={STAGE_LABEL[s]}
            count={counts[s]}
            active={stage === s}
          />
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-[var(--muted-foreground)] text-sm">
              No hay prospectos que coincidan con &ldquo;{query}&rdquo;.
            </p>
          </div>
        )}
        {filtered.map((p) => (
          <ProspectoCard key={p.id} p={p} />
        ))}
      </div>

      <div className="mt-8 card border-dashed bg-[var(--card)]">
        <p className="eyebrow mb-2">Pipeline en producción</p>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          Cuando conectemos Supabase, este pipeline se llena automáticamente:
          cada lead que entra por Meta o referido pasa por el bot, queda
          calificado o descartado, y aparece aquí con su honorario estimado.
          Tú solo entras a las llamadas con prospectos ya filtrados.
        </p>
      </div>
    </div>
  );
}

function ProspectoCard({ p }: { p: Prospecto }) {
  return (
    <div className="card flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="font-semibold text-base">{p.nombre}</h3>
          <span
            className={`text-[0.65rem] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${STAGE_COLOR[p.stage]}`}
          >
            {STAGE_LABEL[p.stage]}
          </span>
          <span className="text-[0.65rem] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider bg-[var(--muted)] text-[var(--muted-foreground)]">
            R{p.regimen}
          </span>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          {p.edad} años · {p.semanas_cotizadas} semanas · {p.origen} · último contacto {p.ultimo_contacto}
        </p>
        <p className="text-sm mt-2 line-clamp-3">{p.notas}</p>
      </div>
      <div className="flex items-center gap-3 md:flex-col md:items-end">
        <div className="text-right">
          <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider">Honorarios</p>
          <p className="font-bold text-[var(--navy-deep)]">{fmt(p.honorarios_estimados)}</p>
        </div>
        <div className="flex gap-2">
          <a
            href={`https://wa.me/${p.telefono.replace(/\D/g, "")}`}
            target="_blank"
            className="btn-ghost"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <a href={`tel:${p.telefono.replace(/\D/g, "")}`} className="btn-ghost" aria-label="Llamar">
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  onClick,
  label,
  count,
  active,
}: {
  onClick: () => void;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors flex items-center gap-2 ${
        active
          ? "bg-[var(--navy-deep)] text-[var(--background)] border-[var(--navy-deep)]"
          : "bg-white border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
      }`}
    >
      {label}
      <span
        className={`text-[0.65rem] px-1.5 py-0.5 rounded-full ${
          active
            ? "bg-[var(--lime)] text-[var(--navy-deep)]"
            : "bg-[var(--lime-soft)] text-[var(--navy-deep)]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
