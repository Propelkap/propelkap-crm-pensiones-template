# CRM Pensiones — Template PropelKap

Plantilla base de CRM para asesores de pensiones (Ley 73 / Ley 97 / Modalidad 40 / Mejoravit).
Diseñada para clonarse y rebrandeear por cliente. Primer caso real: **Haydée Pensiones**.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Supabase SSR · Lucide icons.

---

## 🧬 Cómo usar esta plantilla

### 1. Clonar para un cliente nuevo

```bash
git clone git@github.com:propelkap/crm-pensiones-template.git ~/<cliente>-crm
cd ~/<cliente>-crm
rm -rf .git && git init -b main          # historia limpia por cliente
npm install
```

### 2. Rebrandear

Buscar y reemplazar referencias a "Haydée" / "haydee" por el nombre del cliente nuevo en:

- `app/layout.tsx` (título + metadata)
- `app/(app)/**/*.tsx` (copys, headers de páginas)
- `lib/demo-data.ts` (datos mock — sustituir por los del cliente)
- `package.json` (campo `name`)
- `public/` (logo, favicon)

Paleta y tipografía: editar tokens en `app/globals.css` y fonts en `app/fonts/`.

### 3. Conectar Supabase del cliente

1. Crear proyecto Supabase nuevo.
2. Correr migrations en orden: `supabase/migrations/*.sql` (Editor SQL).
3. Crear `.env.local` con:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
4. Documentar credenciales reales en `_secretos-env.md` (gitignored).

### 4. Deploy a Vercel

```bash
vercel link                 # vincular a un proyecto Vercel nuevo de la cuenta del cliente / team
vercel env pull .env.local  # opcional: traer envs ya configurados en Vercel
vercel --prod
```

---

## 📐 Estructura

```
app/
├── (app)/                  # rutas autenticadas (Hoy, Prospectos, Contactos, Asesorías, Reactivación, Marketing, WhatsApp, Reportes, Configuración)
├── login/                  # auth Supabase
├── fonts/                  # Nohemi (locales) + Geist
├── layout.tsx              # shell + metadata
└── globals.css             # tokens de diseño (paleta navy/lima por defecto)

lib/
├── demo-data.ts            # mocks del dashboard — sustituir por datos del cliente
└── supabase/               # clientes SSR + server-side

middleware.ts               # gate de auth Supabase
supabase/migrations/        # schema (contactos, bot_feedback con doble cuadro)
```

---

## 🧪 Features incluidas (obligatorios CRM PropelKap)

- ✅ Thumbs up/down al bot con doble cuadro de feedback (`que_fallo` + `como_debio_responder`).
- ✅ Sección Contactos para carga manual de leads orgánicos.
- ⏳ Twilio WhatsApp (configurar por cliente).

---

## 📚 Convenciones PropelKap

- Idioma: español mexicano.
- Cada despliegue de cliente vive en su propio repo (clon de esta plantilla) y su propio proyecto Vercel.
- Secretos en `_secretos-env.md` por proyecto + bóveda Obsidian (`~/Desktop/PropelKap OS/02-Proyectos/<Cliente>/`).

---

Owner: Jorge Pérez Briones · `jpbriones@propelkap.com`
