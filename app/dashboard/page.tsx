
"use client";

import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import DailySummaryCard from "../components/cards/DailySummaryCard";
import EquipmentSummaryCard from "../components/cards/EquipmentSummaryCard";
import AccessGuard from "../components/AccessGuard";

export default function Home() {
  const activePage = "Visão geral";

  return (
    <AccessGuard>
      <main className="min-h-screen bg-[#0b1120] text-white">
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
          <Sidebar activePage={activePage} />

          <section className="min-w-0 flex-1 w-full p-4">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-8">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                  Laboratório de Realidade Virtual
                </p>

                <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                  {activePage}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-300 sm:inline-flex">
                  ● Sistema em desenvolvimento
                </span>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#17243a] font-semibold text-cyan-300">
                  VR
                </div>
              </div>
            </header>

            <div className="mx-auto max-w-7xl p-5 sm:p-8">
              <div className="mb-7">
                <h3 className="text-lg font-semibold">
                  Olá! Bem-vindo ao VR Studio Lab
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Acompanhe os equipamentos e a operação do laboratório.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DailySummaryCard />
                <EquipmentSummaryCard />
              </div>

              <Footer />
            </div>
          </section>
        </div>
      </main>
    </AccessGuard>
  );
}
