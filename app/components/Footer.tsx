"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | string>("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-12 border-t border-white/10 bg-[#0b1120] py-6 text-xs text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
        
        {/* Lado esquerdo: Marca e Sistema */}
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-300">
            VR Studio Lab
          </span>
          <span className="text-slate-600">·</span>
          <span>Sistema de Gestão de Ativos</span>
        </div>

        {/* Lado direito: Status e Versão */}
        <div className="flex flex-wrap items-center gap-4 text-slate-500">
          <span className="rounded-full border border-white/5 bg-white/[0.02] px-3 py-1 text-slate-400">
            v1.0.0 (Protótipo)
          </span>
          <span>
            © {currentYear || "2026"} Todos os direitos reservados
          </span>
        </div>

      </div>
    </footer>
  );
}