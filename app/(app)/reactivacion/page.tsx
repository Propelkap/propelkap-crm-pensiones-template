import { Send, Clock } from "lucide-react";
import { DEMO_REACTIVACION } from "@/lib/demo-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);

export default function ReactivacionPage() {
  const total = DEMO_REACTIVACION.reduce((s, r) => s + r.honorarios_estimados, 0);

  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <p className="eyebrow">Cartera dormida</p>
        <h1 className="text-4xl mt-2">Reactivación</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Prospectos que dijeron &ldquo;todavía no&rdquo; y se enfriaron. Una
          campaña automática los trae de vuelta con tu voz.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <div className="card bg-[var(--lime-soft)] border-[var(--lime)]">
          <p className="text-xs uppercase tracking-wider text-[var(--navy-deep)] mb-1">
            Listos para reactivar
          </p>
          <p className="text-3xl font-bold">{DEMO_REACTIVACION.length}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
            Honorarios potenciales
          </p>
          <p className="text-2xl font-bold text-[var(--navy-deep)]">{fmt(total)}</p>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
            Recuperación esperada (15%)
          </p>
          <p className="text-2xl font-bold text-[var(--lime-deep)]">
            {fmt(total * 0.15)}
          </p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button className="btn-primary">
          <Send className="w-4 h-4" />
          Lanzar campaña reactivación
        </button>
      </div>

      <div className="space-y-3">
        {DEMO_REACTIVACION.map((r) => (
          <div key={r.id} className="card flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{r.nombre}</h3>
              <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                {r.ultimo_contacto_dias} días sin contacto
              </p>
              <p className="text-sm mt-2">{r.razon}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider">
                Honorarios
              </p>
              <p className="font-bold text-[var(--navy-deep)]">
                {fmt(r.honorarios_estimados)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card border-dashed bg-[var(--card)]">
        <p className="eyebrow mb-2">Cómo funciona</p>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          La campaña manda mensaje WhatsApp con tu voz: &ldquo;Hola Sofía, soy
          Haydeé. Hace 3 meses platicamos de tu pensión y me quedé pendiente.
          ¿Sigues interesada?&rdquo;. Quien responda regresa al pipeline en
          etapa &ldquo;calificado&rdquo;. Conservadoramente, 10-15% de los
          dormidos vuelven.
        </p>
      </div>
    </div>
  );
}
