

"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";


type InventoryStatus =
  | "Disponível"
  | "Em uso"
  | "Manutenção"
  | "Baixado";

type Equipment = {
  id: number;
  name: string;
  assetNumber?: string;
  status: InventoryStatus;
};

type MaintenanceStatus =
  | "Aberta"
  | "Em andamento"
  | "Aguardando peças"
  | "Concluída";

type MaintenanceOrder = {
  id: string;
  orderNumber?: string;
  equipment: string;
  equipmentId?: number;
  problem: string;
  responsible: string;
  openingDate: string;
  status: MaintenanceStatus;
};

const inventoryKey = "vrstudiolab-inventory-v1";
const maintenanceKey = "vrstudiolab-maintenance-v1";

export default function RelatoriosPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [orders, setOrders] = useState<MaintenanceOrder[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedEquipment = localStorage.getItem(inventoryKey);
      const savedOrders = localStorage.getItem(maintenanceKey);

      if (savedEquipment) {
        const parsed = JSON.parse(savedEquipment);

        if (Array.isArray(parsed)) {
          setEquipment(parsed);
        }
      }

      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);

        if (Array.isArray(parsed)) {
          setOrders(parsed);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error);
    } finally {
      setReady(true);
    }
  }, []);

  const equipmentInMaintenance = equipment.filter(
    (item) => item.status === "Manutenção"
  ).length;

  const availableEquipment = equipment.filter(
    (item) => item.status === "Disponível"
  ).length;

  const inUseEquipment = equipment.filter(
    (item) => item.status === "Em uso"
  ).length;

  const writtenOffEquipment = equipment.filter(
    (item) => item.status === "Baixado"
  ).length;

  const openOrders = orders.filter(
    (order) => order.status === "Aberta"
  ).length;

  const inProgressOrders = orders.filter(
    (order) => order.status === "Em andamento"
  ).length;

  const waitingOrders = orders.filter(
    (order) => order.status === "Aguardando peças"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "Concluída"
  ).length;

  const cards = [
    { label: "Total de equipamentos", value: equipment.length },
    { label: "Disponíveis", value: availableEquipment },
    { label: "Em uso", value: inUseEquipment },
    { label: "Em manutenção", value: equipmentInMaintenance },
    { label: "Baixados", value: writtenOffEquipment },
    { label: "Ordens abertas", value: openOrders },
    { label: "Em andamento", value: inProgressOrders },
    { label: "Aguardando peças", value: waitingOrders },
    { label: "Ordens concluídas", value: completedOrders },
  ];

  
return (
  <main className="min-h-screen bg-[#0b1120] text-white">
    
    <div className="flex min-h-screen w-full flex-col lg:flex-row">

      <Sidebar activePage="Relatórios" />

      <section className="min-w-0 flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">

        <a
          href="/"
          className="mb-6 inline-flex text-sm text-cyan-300 hover:text-cyan-200"
        >
          ← Voltar ao Dashboard
        </a>

        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
            VR Studio Lab
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Relatórios
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Resumo do inventário e das ordens de manutenção.
          </p>
        </header>

        {!ready ? (
          <p className="text-slate-400">Carregando relatórios...</p>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <article
                  key={card.label}
                  className="rounded-2xl border border-white/10 bg-[#151e30] p-5"
                >
                  <p className="text-sm text-slate-400">
                    {card.label}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-cyan-300">
                    {card.value}
                  </p>
                </article>
              ))}
            </section>

            <section className="mt-8 rounded-2xl border border-white/10 bg-[#151e30] p-5">
              <h2 className="text-lg font-semibold">
                Ordens de serviço recentes
              </h2>

              {orders.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">
                  Nenhuma ordem de serviço cadastrada.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead className="text-slate-400">
                      <tr className="border-b border-white/10">
                        <th className="px-3 py-3">Número da OS</th>
                        <th className="px-3 py-3">Equipamento</th>
                        <th className="px-3 py-3">Abertura</th>
                        <th className="px-3 py-3">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {[...orders]
                        .sort((a, b) =>
                          b.openingDate.localeCompare(a.openingDate)
                        )
                        .slice(0, 10)
                        .map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-white/5"
                          >
                            <td className="px-3 py-4 text-cyan-300">
                              {order.orderNumber || "OS antiga"}
                            </td>

                            <td className="px-3 py-4">
                              {order.equipment}
                            </td>

                            <td className="px-3 py-4 text-slate-300">
                              {order.openingDate
                                ? order.openingDate.split("-").reverse().join("/")
                                : "—"}
                            </td>

                            <td className="px-3 py-4 text-slate-300">
                              {order.status}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        
        )}
        </div>
      </section>
    </div>
  </main>
  );
}

