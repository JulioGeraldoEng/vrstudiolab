"use client";

import { useState } from "react";
import {
  seedEquipments,
  seedPeople,
  seedMaintenanceOrders,
} from "./dados";

export default function SeedPage() {
  const [message, setMessage] = useState("");

  function loadSeedData() {
    const confirmed = window.confirm(
      "Atenção: os registros atuais de equipamentos, pessoas e manutenção serão substituídos pelos dados de teste. Deseja continuar?"
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

      setMessage(
        "Dados de teste carregados! Atualize as páginas de inventário, pessoas e manutenção para visualizar os registros."
      );
    } catch (error) {
      console.error("Erro ao carregar os dados de teste:", error);

      setMessage(
        "Não foi possível carregar os dados. Verifique o console do navegador."
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-2xl rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h1 className="mb-3 text-2xl font-bold">
          Carga de dados de teste
        </h1>

        <p className="mb-6 text-slate-300">
          Esta ferramenta substitui os registros atuais por 20 equipamentos,
          20 pessoas e 20 ordens de manutenção fictícias.
        </p>

        <button
          type="button"
          onClick={loadSeedData}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
        >
          Carregar dados de teste
        </button>

        {message && (
          <p className="mt-5 rounded-lg bg-slate-800 p-4 text-sm text-slate-200">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
