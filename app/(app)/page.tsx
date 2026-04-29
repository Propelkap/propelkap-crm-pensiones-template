import {
  Users,
  UserPlus,
  PhoneCall,
  AlertTriangle,
  Send,
  TrendingUp,
  CheckCircle2,
  Inbox,
  FileSignature,
} from "lucide-react";
import Link from "next/link";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);

// Demo seed mientras Supabase no está conectado.
// Cuando JP corra la migration 001, esto se reemplaza por createClient().from("v_dashboard_kpis").
const DEMO_KPIS = {
  leads_nuevos_hoy: 4,
  pendientes_responder: 7,
  calificados_para_llamada: 9,
  asesorias_hoy: 3,
  propuestas_en_decision: 5,
  firmados_mes: 6,
  honorarios_proyectados_mes: 150000,
  tasa_conversion_mes: 0.12,
};

export default function DashboardPage() {
  const k = DEMO_KPIS;
  const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="max-w-6xl">
      <header className="mb-8">
        <p className="eyebrow capitalize">{today}</p>
        <h1 className="text-4xl mt-2">Hola, Haydeé 👋</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Esto es lo que está pasando hoy con tus prospectos de pensión.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat
          label="Leads nuevos hoy"
          value={k.leads_nuevos_hoy}
          icon={<Inbox className="w-4 h-4" />}
          accent
        />
        <Stat
          label="Honorarios proyectados mes"
          value={fmt(k.honorarios_proyectados_mes)}
          small
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <Stat
          label="Conversión del mes"
          value={`${Math.round(k.tasa_conversion_mes * 100)}%`}
          small
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <Stat
          label="Firmados este mes"
          value={k.firmados_mes}
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
      </div>

      <h2 className="text-lg mb-3 mt-10">Acciones que requieren tu atención</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <ActionCard
          href="/whatsapp"
          icon={<AlertTriangle className="w-5 h-5" />}
          title="Pendientes de responder en WhatsApp"
          count={k.pendientes_responder}
          accent="warning"
        />
        <ActionCard
          href="/asesorias"
          icon={<PhoneCall className="w-5 h-5" />}
          title="Asesorías agendadas para hoy"
          count={k.asesorias_hoy}
          accent="primary"
        />
        <ActionCard
          href="/prospectos?stage=calificado"
          icon={<Users className="w-5 h-5" />}
          title="Calificados — listos para llamada"
          count={k.calificados_para_llamada}
          accent="primary"
        />
        <ActionCard
          href="/prospectos?stage=propuesta"
          icon={<FileSignature className="w-5 h-5" />}
          title="En propuesta — más de 3 días sin contacto"
          count={k.propuestas_en_decision}
          accent="warning"
        />
        <ActionCard
          href="/contactos"
          icon={<UserPlus className="w-5 h-5" />}
          title="Contactos orgánicos sin promover"
          count={4}
          accent="primary"
        />
        <ActionCard
          href="/reactivacion"
          icon={<Send className="w-5 h-5" />}
          title="Cartera dormida lista para reactivar"
          count={42}
        />
      </div>

      <div className="mt-10 card border-dashed bg-[var(--card)]">
        <p className="eyebrow mb-2">Vista demo</p>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          Lo que ves arriba son números de muestra para que veas la estructura del
          CRM. Cuando conectemos Supabase y migremos tus prospectos reales, este
          dashboard te va a mostrar tus 50 leads/mes en vivo, con cada uno en su
          etapa del pipeline (nuevo · calificado · propuesta · firmado).
        </p>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
  accent,
  small,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`card ${accent ? "bg-[var(--lime-soft)] border-[var(--lime)]" : ""}`}
    >
      <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2">
        {icon}
        <span className="text-xs uppercase tracking-wider font-medium">{label}</span>
      </div>
      <div className={`font-semibold ${small ? "text-2xl" : "text-3xl"}`}>{value}</div>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  count,
  accent,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  count: number;
  accent?: "warning" | "primary";
}) {
  const colors =
    accent === "warning"
      ? "text-[var(--warning)] bg-[hsl(35_90%_55%_/_0.12)]"
      : accent === "primary"
        ? "text-[var(--navy-deep)] bg-[var(--lime-soft)]"
        : "text-[var(--lime-deep)] bg-[var(--lime-soft)]";

  return (
    <Link
      href={href}
      className="card hover:shadow-[0_4px_24px_-8px_hsl(218_50%_12%_/_0.18)] transition-shadow flex items-center gap-4"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight">{title}</p>
      </div>
      <div className="text-2xl font-bold text-[var(--foreground)]">{count}</div>
    </Link>
  );
}
