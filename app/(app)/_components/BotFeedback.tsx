"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, X, Check } from "lucide-react";

type Rating = "up" | "down" | null;

export default function BotFeedback({
  conversacionId,
  mensajeId,
  initialRating = null,
}: {
  conversacionId: string;
  mensajeId: string;
  initialRating?: Rating;
}) {
  const [rating, setRating] = useState<Rating>(initialRating);
  const [showDownForm, setShowDownForm] = useState(false);
  const [queFalló, setQueFalló] = useState("");
  const [comoDebió, setComoDebió] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function sendUp() {
    setRating("up");
    console.log("[bot-feedback]", {
      conversacionId,
      mensajeId,
      rating: "up",
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  async function sendDown() {
    setSaving(true);
    setRating("down");
    console.log("[bot-feedback]", {
      conversacionId,
      mensajeId,
      rating: "down",
      que_fallo: queFalló,
      como_debio_responder: comoDebió,
    });
    await new Promise((r) => setTimeout(r, 350));
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowDownForm(false);
      setQueFalló("");
      setComoDebió("");
    }, 1400);
  }

  if (showDownForm) {
    return (
      <div className="mt-2 p-3 rounded-xl border border-[var(--border)] bg-[hsl(0_30%_98%)] space-y-2 max-w-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--destructive)] flex items-center gap-1.5">
            <ThumbsDown className="w-3 h-3" /> Mejorar esta respuesta
          </p>
          <button
            type="button"
            onClick={() => {
              setShowDownForm(false);
              setRating(null);
            }}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            aria-label="Cancelar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <label className="text-[0.65rem] uppercase tracking-wider text-[var(--muted-foreground)] block mb-1">
            ¿Qué hizo mal?
          </label>
          <textarea
            rows={2}
            value={queFalló}
            onChange={(e) => setQueFalló(e.target.value)}
            placeholder="Ej: pidió datos antes de generar confianza"
            className="!text-xs !py-2"
          />
        </div>

        <div>
          <label className="text-[0.65rem] uppercase tracking-wider text-[var(--muted-foreground)] block mb-1">
            ¿Cómo debió contestar?
          </label>
          <textarea
            rows={2}
            value={comoDebió}
            onChange={(e) => setComoDebió(e.target.value)}
            placeholder="Ej: ofrecer financiamiento desde el primer mensaje"
            className="!text-xs !py-2"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={sendDown}
            disabled={saving || (!queFalló.trim() && !comoDebió.trim())}
            className="btn-primary !py-1.5 !px-3 !text-xs"
          >
            {saved ? (
              <>
                <Check className="w-3 h-3" /> Guardado
              </>
            ) : saving ? (
              "Guardando…"
            ) : (
              "Enviar feedback"
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowDownForm(false);
              setRating(null);
            }}
            className="btn-ghost !py-1.5 !px-3 !text-xs"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 mt-1">
      <button
        onClick={sendUp}
        aria-label="Buena respuesta del bot"
        title="Buena respuesta"
        className={`p-1 rounded-md transition-colors ${
          rating === "up"
            ? "bg-[var(--lime)] text-[var(--navy-deep)]"
            : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
        }`}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setShowDownForm(true)}
        aria-label="Mala respuesta del bot — anota cómo debió responder"
        title="Mala respuesta — anota qué falló y cómo debió contestar"
        className={`p-1 rounded-md transition-colors ${
          rating === "down"
            ? "bg-[hsl(0_50%_92%)] text-[var(--destructive)]"
            : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
        }`}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </button>
      {saved && (
        <span className="text-[0.65rem] text-[var(--lime-deep)] font-medium">Guardado</span>
      )}
    </div>
  );
}
