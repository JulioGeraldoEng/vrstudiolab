"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Cards from "../components/Cards";
import Footer from "../components/Footer";
import BackToDashboard from "../components/BackToDashboard";
import ExportReportButtons from "../components/ExportReportButtons";
import { exportToCSV, exportToPDF } from "./reportExport";

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
  category?: string;
  serialNumber?: string;
  location?: string;
  notes?: string;
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
  assetNumber?: string;
  serviceNotes?: string;
  completionDate?: string;
  assignedPersonName?: string;
  performedByName?: string;
  releasedByName?: string;
};

const inventoryKey = "vrstudiolab-inventory-v1";
const maintenanceKey = "vrstudiolab-maintenance-v1";

const exportFields = [
  { id: "name", label: "Nome do equipamento", group: "inventory" },
  { id: "assetNumber", label: "Patrimônio", group: "inventory" },
  { id: "category", label: "Categoria", group: "inventory" },
  { id: "serialNumber", label: "Número de série", group: "inventory" },
  { id: "location", label: "Localização", group: "inventory" },
  { id: "equipmentStatus", label: "Status do equipamento", group: "inventory" },
  { id: "notes", label: "Observações do equipamento", group: "inventory" },
  { id: "orderNumber", label: "Número da OS", group: "maintenance" },
  { id: "equipment", label: "Equipamento da OS", group: "maintenance" },
  { id: "problem", label: "Problema relatado", group: "maintenance" },
  { id: "responsible", label: "Responsável", group: "maintenance" },
  { id: "openingDate", label: "Data de abertura", group: "maintenance" },
  { id: "orderStatus", label: "Status da OS", group: "maintenance" },
  { id: "serviceNotes", label: "Serviço realizado", group: "maintenance" },
  { id: "completionDate", label: "Data de conclusão", group: "maintenance" },
] as const;

type ExportFieldId = (typeof exportFields)[number]["id"];

export default function RelatoriosPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [orders, setOrders] = useState<MaintenanceOrder[]>([]);
  const [ready, setReady] = useState(false);

  const [selectedFields, setSelectedFields] = useState<ExportFieldId[]>(
    exportFields.map((field) => field.id)
  );


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

  return (
    <main className="min-h-screen bg-[#0b1120] text-white">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <Sidebar activePage="Relatórios" />

        <section className="min-w-0 flex-1 p-4 sm:p-8">
          <div className="mx-auto max-w-7xl space-y-8">

            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <BackToDashboard />

                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                  VR Studio Lab
                </p>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Relatórios
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                  Resumo do inventário e das ordens de manutenção.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <ExportReportButtons
                  onExportCSV={() => exportToCSV(equipment, orders, selectedFields)}
                  onExportPDF={() => exportToPDF(equipment, orders, selectedFields)}
                  disabled={!ready || selectedFields.length === 0}
                />
              </div>
            </header>

            {ready && (
              <section className="mb-8 rounded-2xl border border-white/10 bg-[#151e30] p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Campos do relatório
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Marque as informações que deseja incluir na exportação.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFields(exportFields.map((field) => field.id))
                    }
                    className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                  >
                    Marcar todos
                  </button>
                </div>

                {(["inventory", "maintenance"] as const).map((group) => (
                  <div key={group} className="mb-5 last:mb-0">
                    <h3 className="mb-3 font-medium text-slate-200">
                      {group === "inventory"
                        ? "Inventário de equipamentos"
                        : "Ordens de manutenção"}
                    </h3>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {exportFields
                        .filter((field) => field.group === group)
                        .map((field) => (
                          <label
                            key={field.id}
                            className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-3 text-sm text-slate-300 transition hover:bg-white/[0.07]"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFields.includes(field.id)}
                              onChange={(event) => {
                                setSelectedFields((current) =>
                                  event.target.checked
                                    ? [...current, field.id]
                                    : current.filter((id) => id !== field.id)
                                );
                              }}
                              className="h-4 w-4 accent-cyan-400"
                            />
                            {field.label}
                          </label>
                        ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {!ready ? (
              <p className="text-slate-400">Carregando relatórios...</p>
            ) : (
              <>
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Cards
                    title="Total de equipamentos"
                    value={equipment.length}
                    detail="Itens cadastrados"
                    icon="▣"
                    color="text-cyan-300"
                    bg="bg-cyan-400/10"
                  />
                  <Cards
                    title="Disponíveis"
                    value={availableEquipment}
                    detail="Prontos para uso"
                    icon="✓"
                    color="text-emerald-300"
                    bg="bg-emerald-400/10"
                  />
                  <Cards
                    title="Em uso"
                    value={inUseEquipment}
                    detail="Em utilização"
                    icon="⌁"
                    color="text-blue-300"
                    bg="bg-blue-400/10"
                  />
                  <Cards
                    title="Em manutenção"
                    value={equipmentInMaintenance}
                    detail="Precisam de atenção"
                    icon="⚙"
                    color="text-amber-300"
                    bg="bg-amber-400/10"
                  />
                  <Cards
                    title="Baixados"
                    value={writtenOffEquipment}
                    detail="Inativados"
                    icon="✕"
                    color="text-rose-300"
                    bg="bg-rose-400/10"
                  />
                  <Cards
                    title="Ordens abertas"
                    value={openOrders}
                    detail="Aguardando triagem"
                    icon="📋"
                    color="text-blue-300"
                    bg="bg-blue-400/10"
                  />
                  <Cards
                    title="Em andamento"
                    value={inProgressOrders}
                    detail="Em reparo"
                    icon="⚙"
                    color="text-amber-300"
                    bg="bg-amber-400/10"
                  />
                  <Cards
                    title="Aguardando peças"
                    value={waitingOrders}
                    detail="Pendência de componentes"
                    icon="⏳"
                    color="text-orange-300"
                    bg="bg-orange-400/10"
                  />
                  <Cards
                    title="Ordens concluídas"
                    value={completedOrders}
                    detail="Reparos finalizados"
                    icon="✓"
                    color="text-emerald-300"
                    bg="bg-emerald-400/10"
                  />
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
                                className="border-b border-white/5 transition-colors duration-200 hover:bg-white/[0.08]"
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
            <Footer />
          </div>
        </section>
      </div>
    </main>
  );
}