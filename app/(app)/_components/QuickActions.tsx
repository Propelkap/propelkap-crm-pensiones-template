"use client";

import { useState } from "react";
import { Plus, UserPlus, PhoneCall } from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {open && (
        <>
          <Link
            href="/asesorias"
            onClick={() => setOpen(false)}
            className="bg-white border border-[var(--border)] shadow-lg rounded-full px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-[var(--card)] transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-[var(--navy-deep)]" />
            Nueva asesoría
          </Link>
          <Link
            href="/contactos"
            onClick={() => setOpen(false)}
            className="bg-white border border-[var(--border)] shadow-lg rounded-full px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-[var(--card)] transition-colors"
          >
            <UserPlus className="w-4 h-4 text-[var(--navy-deep)]" />
            Nuevo contacto orgánico
          </Link>
        </>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-[var(--lime)] hover:bg-[var(--lime-soft)] shadow-xl flex items-center justify-center transition-all text-[var(--navy-deep)]"
        style={{ transform: open ? "rotate(45deg)" : "rotate(0)" }}
        aria-label="Acciones rápidas"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
