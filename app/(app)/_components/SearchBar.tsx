"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchBar({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => onChange(local), 150);
    return () => clearTimeout(t);
  }, [local, onChange]);

  return (
    <div className="relative mb-4">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
      <input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="!pl-10 !pr-10 !text-ellipsis"
      />
      {local && (
        <button
          type="button"
          onClick={() => setLocal("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
