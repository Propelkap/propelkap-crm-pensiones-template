import { PhoneCall, MapPin, Video } from "lucide-react";
import { DEMO_ASESORIAS } from "@/lib/demo-data";

export default function AsesoriasPage() {
  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <p className="eyebrow">Agenda</p>
        <h1 className="text-4xl mt-2">Asesorías</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Tus citas presenciales y videollamadas. Recordatorio automático 24h y
          2h antes por WhatsApp.
        </p>
      </header>

      <div className="space-y-3">
        {DEMO_ASESORIAS.map((a) => (
          <div key={a.id} className="card flex flex-col md:flex-row md:items-center gap-4">
            <div className="md:w-32 shrink-0">
              <p className="text-xs uppercase tracking-wider text-[var(--lime-deep)] font-semibold">
                {a.fecha}
              </p>
              <p className="text-2xl font-bold text-[var(--navy-deep)]">{a.hora}</p>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold mb-1">{a.prospecto}</h3>
              <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  {a.modalidad.includes("Video") ? (
                    <Video className="w-3.5 h-3.5" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5" />
                  )}
                  {a.modalidad}
                </span>
                <span className="text-[var(--border)]">·</span>
                <span>{a.tipo}</span>
              </p>
            </div>
            <button className="btn-primary self-start md:self-center">
              <PhoneCall className="w-4 h-4" />
              Abrir cita
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 card border-dashed bg-[var(--card)]">
        <p className="eyebrow mb-2">Próximo en este módulo</p>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          Carpeta del cliente pre-llenada al abrir cada cita: SIPAREs, semanas
          cotizadas, escenario M40 calculado, propuesta de financiamiento por
          plazo. Tú entras con todo en la mano.
        </p>
      </div>
    </div>
  );
}
