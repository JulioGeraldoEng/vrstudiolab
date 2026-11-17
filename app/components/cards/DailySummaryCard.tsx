"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Reservation } from "../../../types/reservation";
import type { MaintenanceOrder } from "../../../types/maintenance";
import { RESERVATIONS_STORAGE_KEY } from "../../reservations/storage";

const MAINTENANCE_STORAGE_KEY = "vrstudiolab-maintenance-v1";

type DailySummary = {
  dateLabel: string;
  reservations: number;
  maintenance: number;
};

export default function DailySummaryCard() {
  const [summary, setSummary] = useState<DailySummary>({
    dateLabel: "",
    reservations: 0,
    maintenance: 0,
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const today = new Date();

      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      const todayKey = `${year}-${month}-${day}`;

      const dateLabel = today.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      let reservations: Reservation[] = [];
      let maintenanceOrders: MaintenanceOrder[] = [];

      try {
        const savedReservations = localStorage.getItem(
          RESERVATIONS_STORAGE_KEY
        );

        if (savedReservations) {
          const parsed: unknown = JSON.parse(savedReservations);

          if (Array.isArray(parsed)) {
            reservations = parsed as Reservation[];
          }
        }
      } catch (error) {
        console.error("Erro ao carregar reservas:", error);
      }

      try {
        const savedMaintenance = localStorage.getItem(
          MAINTENANCE_STORAGE_KEY
        );

        if (savedMaintenance) {
          const parsed: unknown = JSON.parse(savedMaintenance);

          if (Array.isArray(parsed)) {
            maintenanceOrders = parsed as MaintenanceOrder[];
          }
        }
      } catch (error) {
        console.error("Erro ao carregar manutenções:", error);
      }

      const confirmedReservations = reservations.filter(
        (reservation) =>
          reservation.status === "Confirmada" &&
          reservation.date === todayKey
      );

      const activeMaintenance = maintenanceOrders.filter(
        (order) =>
          order.openingDate <= todayKey &&
          (
            order.status === "Aberta" ||
            order.status === "Em andamento" ||
            order.status === "Aguardando peças"
          )
      );

      setSummary({
        dateLabel,
        reservations: confirmedReservations.length,
        maintenance: activeMaintenance.length,
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <Link
      href="/calendar/"
      className="group block rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-[#14243a] to-[#101a2d] p-5 shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-1 hover:border-cyan-400/35 hover:shadow-cyan-950/20"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Resumo do dia
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            {summary.dateLabel || "Carregando data..."}
          </h3>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-300 transition group-hover:bg-cyan-400/20">
          📅
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
          <p className="text-sm text-slate-400">
            Reservas confirmadas hoje
          </p>

          <p className="mt-2 text-3xl font-bold text-white tabular-nums">
            {summary.reservations}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
          <p className="text-sm text-slate-400">
            Manutenções ativas
          </p>

          <p className="mt-2 text-3xl font-bold text-white tabular-nums">
            {summary.maintenance}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <span className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-300 transition group-hover:bg-cyan-400/20">
          📅 Ver calendário
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}