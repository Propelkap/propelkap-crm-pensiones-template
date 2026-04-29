import { MessageCircle, Bot, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { DEMO_WHATSAPP, DEMO_BOT_FEEDBACK_RECIENTE } from "@/lib/demo-data";
import BotFeedback from "../_components/BotFeedback";

export default function WhatsAppPage() {
  // Mensajes simulados de la conversación seleccionada (María del Carmen Vázquez)
  const conversacionSeleccionada = DEMO_WHATSAPP[0];
  const mensajes = [
    {
      id: "m1",
      emisor: "cliente" as const,
      texto: "Hola, vi su anuncio de modalidad 40 en Facebook. Tengo 61 años.",
      hora: "10:48 AM",
    },
    {
      id: "m2",
      emisor: "bot" as const,
      texto:
        "Hola, gracias por contactarme 👋 Soy Haydeé. Para poder apoyarle, ¿me puede decir aproximadamente cuántas semanas tiene cotizadas en el IMSS?",
      hora: "10:48 AM",
    },
    {
      id: "m3",
      emisor: "cliente" as const,
      texto: "Tengo como 980 semanas, ya revisé mi reporte",
      hora: "10:50 AM",
    },
    {
      id: "m4",
      emisor: "bot" as const,
      texto:
        "Perfecto, tienes 980 semanas y régimen 73. ¿Te parece si Haydeé te llama hoy a las 11:00?",
      hora: "10:51 AM",
    },
  ];

  return (
    <div className="max-w-6xl">
      <header className="mb-8">
        <p className="eyebrow">Bandeja unificada</p>
        <h1 className="text-4xl mt-2">WhatsApp</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Tu número 56 3530 9664 + Messenger en una sola bandeja. Califica las
          respuestas del bot con 👍 / 👎 para que mejore.
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-4">
        <div className="space-y-2">
          {DEMO_WHATSAPP.map((c) => (
            <div
              key={c.id}
              className={`card cursor-pointer hover:shadow-[0_4px_24px_-8px_hsl(218_50%_12%_/_0.18)] transition-shadow ${
                c.id === conversacionSeleccionada.id
                  ? "border-[var(--lime)] ring-2 ring-[var(--lime-soft)]"
                  : c.pendiente_humano
                    ? "border-[var(--lime)]"
                    : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate">{c.nombre}</h3>
                <span className="text-[0.65rem] text-[var(--muted-foreground)] shrink-0">{c.actualizado}</span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-2">{c.ultimo_msg}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[0.6rem] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider flex items-center gap-1 ${
                    c.pendiente_humano
                      ? "bg-[var(--lime)] text-[var(--navy-deep)]"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                  }`}
                >
                  {c.pendiente_humano ? <AlertCircle className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  {c.pendiente_humano ? "Tú" : "Bot"}
                </span>
                <span className="text-[0.6rem] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] uppercase tracking-wider">
                  {c.bot_estado}
                </span>
                {c.no_leidos > 0 && (
                  <span className="ml-auto text-[0.65rem] w-5 h-5 rounded-full bg-[var(--navy-deep)] text-[var(--background)] flex items-center justify-center font-bold">
                    {c.no_leidos}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="card flex flex-col gap-4 min-h-[500px]">
          <div className="border-b border-[var(--border)] pb-3">
            <h3 className="font-semibold">{conversacionSeleccionada.nombre}</h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              {conversacionSeleccionada.telefono} · estado bot:{" "}
              <strong>{conversacionSeleccionada.bot_estado}</strong>
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {mensajes.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.emisor === "cliente" ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[80%] ${m.emisor === "bot" ? "items-end" : "items-start"} flex flex-col`}>
                  <div
                    className={`rounded-2xl px-4 py-2.5 ${
                      m.emisor === "cliente"
                        ? "bg-[var(--muted)] text-[var(--foreground)] rounded-bl-sm"
                        : "bg-[var(--lime-soft)] text-[var(--navy-deep)] rounded-br-sm"
                    }`}
                  >
                    {m.emisor === "bot" && (
                      <p className="text-[0.65rem] uppercase tracking-wider font-semibold mb-1 text-[var(--lime-deep)] flex items-center gap-1">
                        <Bot className="w-3 h-3" /> Bot
                      </p>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-line">{m.texto}</p>
                  </div>
                  <div className="text-[0.65rem] text-[var(--muted-foreground)] mt-0.5 px-1">{m.hora}</div>
                  {m.emisor === "bot" && (
                    <BotFeedback
                      conversacionId={conversacionSeleccionada.id}
                      mensajeId={m.id}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--border)] pt-3">
            <input
              type="text"
              placeholder="Escribe a María del Carmen…"
              className="!rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="card">
          <p className="eyebrow mb-3 flex items-center gap-2">
            <ThumbsUp className="w-3 h-3" /> Feedback reciente del bot
          </p>
          <div className="space-y-3">
            {DEMO_BOT_FEEDBACK_RECIENTE.map((f) => (
              <div key={f.id} className="border-l-2 pl-3 py-1" style={{
                borderColor: f.rating === "up" ? "var(--lime)" : "var(--destructive)"
              }}>
                <div className="flex items-center gap-2 mb-1">
                  {f.rating === "up" ? (
                    <ThumbsUp className="w-3.5 h-3.5 text-[var(--lime-deep)]" />
                  ) : (
                    <ThumbsDown className="w-3.5 h-3.5 text-[var(--destructive)]" />
                  )}
                  <span className="text-xs font-semibold">{f.prospecto_nombre}</span>
                  <span className="text-[0.65rem] text-[var(--muted-foreground)] ml-auto">{f.created_at}</span>
                </div>
                <p className="text-xs italic text-[var(--muted-foreground)] line-clamp-2 mb-1">
                  &ldquo;{f.bot_mensaje}&rdquo;
                </p>
                {f.comentario && (
                  <p className="text-xs text-[var(--foreground)]"><strong>Nota:</strong> {f.comentario}</p>
                )}
                {f.que_fallo && (
                  <p className="text-xs text-[var(--foreground)] mt-1">
                    <strong>Qué hizo mal:</strong> {f.que_fallo}
                  </p>
                )}
                {f.como_debio_responder && (
                  <p className="text-xs text-[var(--foreground)] mt-1">
                    <strong>Cómo debió contestar:</strong> {f.como_debio_responder}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="card border-dashed bg-[var(--card)]">
          <p className="eyebrow mb-2">Bot con tu voz cercana y cálida</p>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            Cada mensaje del bot tiene 👍 / 👎. Si das pulgar abajo, anota qué
            falló — esos comentarios alimentan el system prompt para que el
            bot mejore con cada conversación. Las malas respuestas se revisan
            semanalmente.
          </p>
        </div>
      </div>
    </div>
  );
}
