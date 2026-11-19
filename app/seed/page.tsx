"use client";

import { useState } from "react";
import {
  seedEquipments,
  seedPeople,
  seedMaintenanceOrders,
  seedMaintenanceRequests,
  seedRooms,
  seedReservations,
} from "./dados";
import BackToDashboard from "../components/buttons/BackToDashboard";

export default function SeedPage() {
  const [message, setMessage] = useState("");

  function loadSeedData() {
    const confirmed = window.confirm(
      "Atenção: os registros atuais de equipamentos, pessoas, salas, manutenção, solicitações de manutenção e reservas serão substituídos por 40 equipamentos, 30 pessoas, 8 salas, 30 ordens de manutenção, 5 solicitações de manutenção e 40 reservas fictícias. Deseja continuar?"
    );

    if (!confirmed) return;

    try {
      const activeEquipmentIds = new Set(
        seedMaintenanceOrders
          .filter((order) => order.status !== "Concluída")
          .map((order) => order.equipmentId)
          .filter((id): id is number => id !== undefined)
      );

      const equipmentsToSave = seedEquipments.map((equipment) => {
        if (
          activeEquipmentIds.has(equipment.id) &&
          equipment.status !== "Baixado"
        ) {
          return { ...equipment, status: "Manutenção" as const };
        }

        return equipment;
      });

      localStorage.setItem(
        "vrstudiolab-inventory-v1",
        JSON.stringify(equipmentsToSave)
      );

      localStorage.setItem(
        "vrstudiolab-maintenance-people-v1",
        JSON.stringify(seedPeople)
      );

      localStorage.setItem(
        "vrstudiolab-maintenance-v1",
        JSON.stringify(seedMaintenanceOrders)
      );

      localStorage.setItem(
        "vrstudiolab-maintenance-requests-v1",
        JSON.stringify(seedMaintenanceRequests)
      );

      localStorage.setItem(
        "vrstudiolab-rooms-v1",
        JSON.stringify(seedRooms)
      );

      localStorage.setItem(
        "vrstudiolab-reservations-v1",
        JSON.stringify(seedReservations)
      );

      setMessage(
        "Dados de teste carregados! Atualize as páginas de equipamentos, pessoas, manutenção, solicitações de manutenção, salas e reservas para visualizar os registros."
      );
    } catch (error) {
      console.error("Erro ao carregar os dados de teste:", error);

      setMessage(
        "Não foi possível carregar os dados. Verifique o console do navegador."
      );
    }
  }

  return (
    <section className="min-w-0 flex-1 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Cabeçalho */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Carga de dados de teste
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Gerencie a carga de registros fictícios para testar o sistema.
            </p>
          </div>

          <BackToDashboard />
        </header>

        {/* Conteúdo */}
        <div className="max-w-2xl rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">
            Atualizar ambiente de testes
          </h2>

          <p className="mb-6 text-slate-300">
            Esta ferramenta substitui os registros atuais por 40 equipamentos,
            30 pessoas, 8 salas, 30 ordens de manutenção, 5 solicitações
            de manutenção e 40 reservas fictícias.
          </p>

          <button
            type="button"
            onClick={loadSeedData}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-500"
          >
            Atualizar ambiente de testes
          </button>

          {message && (
            <p className="mt-5 rounded-lg bg-slate-800 p-4 text-sm text-slate-200">
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}