"use client";

import CalendarSection from "../components/sections/CalendarSection";
import BackToDashboard from "../components/buttons/BackToDashboard";

export default function CalendarPage() {
  const activePage = "Calendário";

  return (
    <section className="min-w-0 w-full flex-1 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Cabeçalho */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {activePage}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Visualize e acompanhe os eventos, reservas e manutenções do laboratório.
            </p>
          </div>

          <BackToDashboard />
        </header>

        {/* Calendário */}
        <CalendarSection />

      </div>
    </section>
  );
}