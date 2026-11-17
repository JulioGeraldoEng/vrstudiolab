"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function EquipmentSummaryCard() {
    const [total, setTotal] = useState<number | null>(null);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            try {
                const saved = localStorage.getItem("vrstudiolab-inventory-v1");

                if (saved) {
                    const parsed: unknown = JSON.parse(saved);
                    setTotal(Array.isArray(parsed) ? parsed.length : 0);
                } else {
                    setTotal(0);
                }
            } catch (error) {
                console.error("Erro ao carregar equipamentos:", error);
                setTotal(0);
            }
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, []);


    return (
        <Link
            href="/equipment"
            className="group block w-full rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-[#14243a] to-[#101a2d] p-5 text-left shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-1 hover:border-cyan-400/35 hover:shadow-cyan-950/20"
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                        Inventário
                    </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-300 transition group-hover:bg-cyan-400/20">
                    📦
                </div>
            </div>

            <div className="mt-6">
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                    <p className="text-sm text-slate-400">
                        Total de equipamentos
                    </p>

                    <p className="mt-2 text-3xl font-bold text-white tabular-nums">
                        {total === null ? "—" : total}
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <span className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-300 transition group-hover:bg-cyan-400/20">
                    📦 Ver equipamentos
                    <span aria-hidden="true">→</span>
                </span>
            </div>
        </Link>
    );
}