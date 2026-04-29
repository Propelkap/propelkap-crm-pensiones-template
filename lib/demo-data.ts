// Datos de muestra para mientras Supabase no está conectado.
// Cuando entre la migration 001, esto se reemplaza por queries reales.

export type Stage = "nuevo" | "calificado" | "propuesta" | "firmado" | "perdido";

export type Prospecto = {
  id: string;
  nombre: string;
  telefono: string;
  edad: number;
  semanas_cotizadas: number;
  regimen: "73" | "97";
  origen: "Meta" | "Referido" | "Orgánico TikTok" | "Orgánico IG";
  stage: Stage;
  ultimo_contacto: string;
  honorarios_estimados: number;
  notas: string;
};

export const DEMO_PROSPECTOS: Prospecto[] = [
  {
    id: "p1",
    nombre: "María del Carmen Vázquez",
    telefono: "+52 55 1234 5678",
    edad: 61,
    semanas_cotizadas: 980,
    regimen: "73",
    origen: "Meta",
    stage: "nuevo",
    ultimo_contacto: "hace 12 min",
    honorarios_estimados: 28000,
    notas: "Bot la calificó: 980 semanas, R73, jubilación parcial. Lista para llamada.",
  },
  {
    id: "p2",
    nombre: "Roberto Hernández Luna",
    telefono: "+52 55 8745 1290",
    edad: 59,
    semanas_cotizadas: 720,
    regimen: "73",
    origen: "Meta",
    stage: "calificado",
    ultimo_contacto: "hace 2 h",
    honorarios_estimados: 32000,
    notas: "Pide modalidad 40, no tiene recurso para inicial. Candidato a financiamiento.",
  },
  {
    id: "p3",
    nombre: "Patricia Romero Cisneros",
    telefono: "+52 56 2233 8910",
    edad: 60,
    semanas_cotizadas: 540,
    regimen: "73",
    origen: "Referido",
    stage: "propuesta",
    ultimo_contacto: "ayer",
    honorarios_estimados: 25000,
    notas: "Propuesta enviada con plan 12 meses. Le tiene que comentar al esposo.",
  },
  {
    id: "p4",
    nombre: "Javier Mendoza Salinas",
    telefono: "+52 55 9911 4567",
    edad: 58,
    semanas_cotizadas: 1100,
    regimen: "73",
    origen: "Orgánico TikTok",
    stage: "calificado",
    ultimo_contacto: "hace 30 min",
    honorarios_estimados: 30000,
    notas: "Vio video de M40 en TikTok. Ya tiene SIPAREs guardados. Muy maduro.",
  },
  {
    id: "p5",
    nombre: "Laura González Pacheco",
    telefono: "+52 55 4422 9988",
    edad: 56,
    semanas_cotizadas: 460,
    regimen: "73",
    origen: "Meta",
    stage: "propuesta",
    ultimo_contacto: "hace 4 h",
    honorarios_estimados: 26000,
    notas: "Aún en activo. Quiere arrancar M40 cuando termine contrato actual (3 meses).",
  },
  {
    id: "p6",
    nombre: "Francisco Aguilar Pineda",
    telefono: "+52 55 7766 3322",
    edad: 62,
    semanas_cotizadas: 850,
    regimen: "73",
    origen: "Referido",
    stage: "firmado",
    ultimo_contacto: "hace 3 días",
    honorarios_estimados: 28000,
    notas: "Firmado el 25 abr. Ya empezó M40 en abril.",
  },
  {
    id: "p7",
    nombre: "Norma Castillo Ruiz",
    telefono: "+52 55 6543 2109",
    edad: 51,
    semanas_cotizadas: 320,
    regimen: "97",
    origen: "Meta",
    stage: "nuevo",
    ultimo_contacto: "hace 8 min",
    honorarios_estimados: 22000,
    notas: "R97. Pendiente: definir oferta para Régimen 97 antes de empujar.",
  },
  {
    id: "p8",
    nombre: "Eduardo Salgado Tellez",
    telefono: "+52 56 1112 3344",
    edad: 60,
    semanas_cotizadas: 940,
    regimen: "73",
    origen: "Orgánico IG",
    stage: "propuesta",
    ultimo_contacto: "hace 5 días",
    honorarios_estimados: 28000,
    notas: "ALERTA: 5 días sin contacto. Mandar follow-up automático.",
  },
];

export const DEMO_ASESORIAS = [
  {
    id: "a1",
    prospecto: "María del Carmen Vázquez",
    fecha: "Hoy",
    hora: "11:00 AM",
    modalidad: "Videollamada",
    tipo: "Asesoría inicial",
  },
  {
    id: "a2",
    prospecto: "Roberto Hernández Luna",
    fecha: "Hoy",
    hora: "1:30 PM",
    modalidad: "Presencial · CDMX",
    tipo: "Propuesta + financiamiento",
  },
  {
    id: "a3",
    prospecto: "Javier Mendoza Salinas",
    fecha: "Hoy",
    hora: "5:00 PM",
    modalidad: "Videollamada",
    tipo: "Asesoría inicial",
  },
  {
    id: "a4",
    prospecto: "Laura González Pacheco",
    fecha: "Mañana",
    hora: "10:00 AM",
    modalidad: "Videollamada",
    tipo: "Seguimiento propuesta",
  },
  {
    id: "a5",
    prospecto: "Patricia Romero Cisneros",
    fecha: "Mañana",
    hora: "12:00 PM",
    modalidad: "Presencial · CDMX",
    tipo: "Firma de contrato",
  },
];

export const DEMO_WHATSAPP = [
  {
    id: "w1",
    nombre: "María del Carmen Vázquez",
    telefono: "+52 55 1234 5678",
    ultimo_msg: "Bot: Perfecto, tienes 980 semanas y régimen 73. ¿Te parece si Haydeé te llama hoy a las 11:00?",
    pendiente_humano: true,
    no_leidos: 1,
    actualizado: "12 min",
    bot_estado: "calificado",
  },
  {
    id: "w2",
    nombre: "Roberto Hernández Luna",
    telefono: "+52 55 8745 1290",
    ultimo_msg: "Cliente: Sí me interesa, pero no tengo el dinero completo de la modalidad 40",
    pendiente_humano: true,
    no_leidos: 3,
    actualizado: "2 h",
    bot_estado: "objeción precio",
  },
  {
    id: "w3",
    nombre: "Norma Castillo Ruiz",
    telefono: "+52 55 6543 2109",
    ultimo_msg: "Bot: Gracias por contactarme, Norma. ¿En qué año empezaste a cotizar al IMSS?",
    pendiente_humano: false,
    no_leidos: 0,
    actualizado: "8 min",
    bot_estado: "filtrando",
  },
  {
    id: "w4",
    nombre: "Javier Mendoza Salinas",
    telefono: "+52 55 9911 4567",
    ultimo_msg: "Cliente: Listo, ya descargué mi SIPARE. Te lo paso por aquí",
    pendiente_humano: true,
    no_leidos: 1,
    actualizado: "30 min",
    bot_estado: "calificado",
  },
  {
    id: "w5",
    nombre: "Eduardo Salgado Tellez",
    telefono: "+52 56 1112 3344",
    ultimo_msg: "Bot (recordatorio): Hola Eduardo, te escribo para retomar tu propuesta de M40…",
    pendiente_humano: false,
    no_leidos: 0,
    actualizado: "1 h",
    bot_estado: "follow-up auto",
  },
];

export const STAGE_LABEL: Record<Stage, string> = {
  nuevo: "Nuevo",
  calificado: "Calificado",
  propuesta: "Propuesta",
  firmado: "Firmado",
  perdido: "Perdido",
};

export const STAGE_COLOR: Record<Stage, string> = {
  nuevo: "bg-[var(--lime-soft)] text-[var(--navy-deep)]",
  calificado: "bg-[hsl(204_90%_85%)] text-[hsl(204_70%_25%)]",
  propuesta: "bg-[hsl(35_90%_85%)] text-[hsl(35_70%_28%)]",
  firmado: "bg-[hsl(149_40%_85%)] text-[hsl(149_50%_22%)]",
  perdido: "bg-[hsl(0_30%_90%)] text-[hsl(0_50%_30%)]",
};

export type Contacto = {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  origen: "Referido" | "Networking" | "Evento" | "DM IG" | "DM TikTok" | "Familiar" | "Otro";
  notas: string;
  agregado_por: string;
  agregado_at: string;
  promovido_a_prospecto: boolean;
};

export const DEMO_CONTACTOS: Contacto[] = [
  {
    id: "c1",
    nombre: "Lucía Mendoza Beltrán",
    telefono: "+52 55 3344 5566",
    email: "lucia.mendoza@gmail.com",
    origen: "Referido",
    notas: "La recomendó Patricia Romero. Tiene 60 años, ya empezó a juntar SIPAREs. Llamarle el lunes.",
    agregado_por: "Haydeé",
    agregado_at: "hoy 10:15 AM",
    promovido_a_prospecto: false,
  },
  {
    id: "c2",
    nombre: "Carlos Bermúdez Salas",
    telefono: "+52 55 7788 1199",
    origen: "DM IG",
    notas: "Comentó en post de modalidad 40 que su mamá quiere asesoría. Pendiente pasar el contacto.",
    agregado_por: "Haydeé",
    agregado_at: "ayer 6:40 PM",
    promovido_a_prospecto: false,
  },
  {
    id: "c3",
    nombre: "Doña Esperanza Vela",
    telefono: "+52 55 9090 1010",
    origen: "Evento",
    notas: "Conocida del Lions Club CDMX. R73, cumple 60 en agosto.",
    agregado_por: "Haydeé",
    agregado_at: "hace 3 días",
    promovido_a_prospecto: true,
  },
  {
    id: "c4",
    nombre: "Tía Marta Briones",
    telefono: "+52 56 4422 8833",
    origen: "Familiar",
    notas: "Cuñada de la prima. Le interesa para su esposo (62, R73).",
    agregado_por: "Haydeé",
    agregado_at: "hace 5 días",
    promovido_a_prospecto: false,
  },
  {
    id: "c5",
    nombre: "Ramón Téllez Aguirre",
    telefono: "+52 55 5511 2266",
    origen: "DM TikTok",
    notas: "Vio video en TikTok de la sesión de Régimen 97, dejó número en comentario.",
    agregado_por: "Haydeé",
    agregado_at: "hace 1 semana",
    promovido_a_prospecto: false,
  },
];

export type BotFeedback = {
  id: string;
  conversacion_id: string;
  prospecto_nombre: string;
  bot_mensaje: string;
  rating: "up" | "down";
  que_fallo?: string;
  como_debio_responder?: string;
  comentario?: string;
  created_at: string;
};

export const DEMO_BOT_FEEDBACK_RECIENTE: BotFeedback[] = [
  {
    id: "f1",
    conversacion_id: "w1",
    prospecto_nombre: "María del Carmen Vázquez",
    bot_mensaje:
      "Perfecto, tienes 980 semanas y régimen 73. ¿Te parece si Haydeé te llama hoy a las 11:00?",
    rating: "up",
    comentario: "Bien filtrado, agendó solo",
    created_at: "hace 5 min",
  },
  {
    id: "f2",
    conversacion_id: "w2",
    prospecto_nombre: "Roberto Hernández Luna",
    bot_mensaje:
      "El costo de la modalidad 40 depende de tu salario base. ¿Cuál es tu último salario cotizado?",
    rating: "down",
    que_fallo: "Pidió datos económicos antes de generar confianza con el cliente",
    como_debio_responder:
      "Reconocer la objeción de costo, ofrecer el modelo de financiamiento (12 meses sin intereses) y solo después pedir el salario base para personalizar la propuesta",
    created_at: "hace 1 h",
  },
];

export const DEMO_REACTIVACION = [
  {
    id: "r1",
    nombre: "Sofía Ortega Marín",
    telefono: "+52 55 2233 6677",
    ultimo_contacto_dias: 92,
    razon: "Dijo 'lo pienso' en febrero. R73, 760 semanas.",
    honorarios_estimados: 28000,
  },
  {
    id: "r2",
    nombre: "Manuel Ríos Cervantes",
    telefono: "+52 56 8899 1144",
    ultimo_contacto_dias: 145,
    razon: "Pidió tiempo por tema familiar. R73, 850 semanas.",
    honorarios_estimados: 30000,
  },
  {
    id: "r3",
    nombre: "Adriana Fuentes Lopez",
    telefono: "+52 55 4488 7711",
    ultimo_contacto_dias: 67,
    razon: "Iba a comparar con otro asesor. Nunca volvió.",
    honorarios_estimados: 26000,
  },
];
