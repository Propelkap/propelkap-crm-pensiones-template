"use client";

import { useState } from "react";
import { Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Branding dinámico via ENV vars (cada cliente sobrescribe en Vercel):
//   NEXT_PUBLIC_BRAND_LABEL_BOTTOM → eyebrow ("Pensiones y Asesoría Patrimonial")
//   NEXT_PUBLIC_LOGIN_GREETING     → h1 grande ("Hola, Haydeé")
//   NEXT_PUBLIC_LOGIN_SUBTITLE     → subtítulo ("Bienvenida a tu CRM")
//   NEXT_PUBLIC_BRAND_LABEL_TOP    → footer ("PropelKap × Haydeé Pérez")
const BRAND_TOP = process.env.NEXT_PUBLIC_BRAND_LABEL_TOP ?? "PropelKap × Haydeé Pérez";
const BRAND_BOTTOM = process.env.NEXT_PUBLIC_BRAND_LABEL_BOTTOM ?? "Pensiones y Asesoría Patrimonial";
const NAME_PART = BRAND_TOP.replace(/^PropelKap\s*[×x]\s*/i, "").trim();
const LOGIN_GREETING = process.env.NEXT_PUBLIC_LOGIN_GREETING ?? `Hola, ${NAME_PART}`;
const LOGIN_SUBTITLE = process.env.NEXT_PUBLIC_LOGIN_SUBTITLE ?? "Bienvenida a tu CRM";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[var(--lime-soft)] flex items-center justify-center mx-auto mb-5 text-[var(--navy-deep)]">
            <Briefcase className="w-6 h-6" />
          </div>
          <p className="eyebrow mb-2">{BRAND_BOTTOM}</p>
          <h1 className="text-3xl">{LOGIN_GREETING}</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">
            {LOGIN_SUBTITLE}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && (
            <p className="text-sm text-[var(--destructive)] py-2">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="text-xs text-center text-[var(--muted-foreground)] mt-8">
          {BRAND_TOP}
        </p>
      </div>
    </main>
  );
}
