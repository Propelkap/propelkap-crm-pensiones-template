/**
 * Generador de templates con IA usando Claude.
 * Toma una idea suelta + tipo (email/whatsapp) + audiencia, y devuelve un mensaje
 * en la voz de Haydeé Pérez (asesora de pensiones IMSS).
 *
 * Si Supabase está conectado: lee frases_si/frases_no/bot_system_prompt de `configuracion`
 * y los últimos thumbs-down corregidos de `bot_feedback` para no repetir errores.
 *
 * Si está en modo demo (sin envs): usa la voz default de Haydeé hardcodeada.
 */
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const VOZ_DEFAULT = `Eres asesora especialista en pensiones IMSS para clientes Régimen 73 y 97.
Tono cercano y cálido, hablas de "usted" siempre. Empatía primero, datos después.
Profesional sin ser frío. Nunca prometas montos exactos sin haber visto la carta de semanas.`;

const FRASES_SI_DEFAULT = [
  "Hola, gracias por contactarme",
  "¿Ha tenido asesoría anteriormente sobre el tema?",
  "Nosotros podemos apoyarle de tal forma",
  "Le agendamos cita presencial o por videollamada",
  "Con sus semanas cotizadas",
  "Régimen 73",
  "Régimen 97",
];

const FRASES_NO_DEFAULT = [
  "Es muy caro",
  "No le va a alcanzar",
  "Mejor búsquele en otro lado",
  "Eso no aplica para usted",
  "Tutear al cliente",
];

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY no configurada en este entorno" },
      { status: 503 }
    );
  }

  let idea: string;
  let tipo: "email" | "whatsapp";
  let audiencia: string | undefined;
  let longitud: "corto" | "medio" | "largo" | undefined;
  try {
    const body = (await req.json()) as {
      idea: string;
      tipo: "email" | "whatsapp";
      audiencia?: string;
      longitud?: "corto" | "medio" | "largo";
    };
    idea = body.idea;
    tipo = body.tipo;
    audiencia = body.audiencia;
    longitud = body.longitud;
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  if (!idea?.trim()) {
    return NextResponse.json({ error: "Falta la idea" }, { status: 400 });
  }

  // Cargar voz desde configuracion si Supabase está conectado.
  let vozHaydee = VOZ_DEFAULT;
  let frasesSi = FRASES_SI_DEFAULT.join(" / ");
  let frasesNo = FRASES_NO_DEFAULT.join(" / ");
  let feedbackEjemplos = "";

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const sb = await createClient();
      const { data: config } = await sb
        .from("configuracion")
        .select("frases_si, frases_no, bot_system_prompt")
        .eq("id", 1)
        .single();
      if (config?.bot_system_prompt) vozHaydee = config.bot_system_prompt;
      if (config?.frases_si?.length) frasesSi = config.frases_si.join(" / ");
      if (config?.frases_no?.length) frasesNo = config.frases_no.join(" / ");

      const { data: feedbacks } = await sb
        .from("bot_feedback")
        .select("bot_mensaje, como_debio_responder")
        .eq("rating", "down")
        .not("como_debio_responder", "is", null)
        .order("created_at", { ascending: false })
        .limit(5);
      feedbackEjemplos = (feedbacks ?? [])
        .map(
          (f, i) =>
            `Ejemplo ${i + 1}:\n  ❌ Mal: "${f.bot_mensaje}"\n  ✅ Mejor: "${f.como_debio_responder}"`
        )
        .join("\n\n");
    } catch {
      // Modo demo o falla de Supabase: seguimos con defaults.
    }
  }

  const lenLabel = {
    corto: "1-2 oraciones (máx 250 caracteres)",
    medio: "3-5 oraciones (300-500 caracteres)",
    largo: "1-2 párrafos completos",
  }[longitud ?? "medio"];

  const formatoTipo =
    tipo === "email"
      ? `Devuelve JSON: {"asunto": "...", "cuerpo": "..."}. El asunto < 60 chars, claro y profesional. El cuerpo puede tener saltos de línea con \\n. Cierra con "Saludos cordiales, Haydeé Pérez".`
      : `Devuelve JSON: {"cuerpo": "..."}. UN solo bloque de texto listo para WhatsApp. Saludo natural ("Hola {{nombre}}").`;

  const systemPrompt = `Eres copywriter de marca para Haydeé Pérez, asesora especialista en pensiones IMSS (Régimen 73 y 97) en Ciudad de México.

Voz de Haydeé:
${vozHaydee}

Frases que SÍ usa: ${frasesSi}
Frases que NUNCA usa: ${frasesNo}

${feedbackEjemplos ? `Correcciones que la asesora te ha enseñado (NO repetir estos errores):\n${feedbackEjemplos}\n` : ""}

Reglas estrictas:
- Hablar siempre de "usted", nunca "tú"
- Tono cercano, cálido, profesional. Empatía antes que datos
- Nunca afirmar montos exactos de pensión sin haber visto la carta de semanas
- Si vas a personalizar con el nombre, usa exactamente: {{nombre}}
- Otras variables disponibles si aplican: {{apellido}}, {{regimen}}, {{semanas}}, {{edad}}, {{fecha_asesoria}}, {{link_asesoria}}, {{honorarios}}, {{link_pago}}
- ${formatoTipo}
- Solo regresa el JSON, sin explicación adicional.`;

  const userPrompt = `Tipo: ${tipo}
Audiencia: ${audiencia || "prospecto interesado en pensión IMSS"}
Longitud: ${lenLabel}

Idea de Haydeé:
"${idea}"

Genera el mensaje listo para enviar.`;

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Respuesta sin JSON válido", raw: text },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]) as { asunto?: string; cuerpo?: string };
    return NextResponse.json({
      ok: true,
      asunto: parsed.asunto ?? null,
      cuerpo: parsed.cuerpo ?? "",
      tokens_in: response.usage.input_tokens,
      tokens_out: response.usage.output_tokens,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
