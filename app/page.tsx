"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Cards from "./components/Cards";
import Footer from "./components/Footer";

const STORAGE_KEY = "vrstudiolab-inventory-v1";
const MAINTENANCE_STORAGE_KEY = "vrstudiolab-maintenance-v1";

type Equipment = {
  id: number;
  name: string;
  category: string;
  assetNumber: string;
  location: string;
  status: "Disponível" | "Em uso" | "Manutenção" | "Baixado";
};


type MaintenanceOrder = {
  id: string;
  orderNumber: string;
  equipment: string;
  openingDate: string;
  status: "Aberta" | "Em andamento" | "Aguardando peças" | "Concluída";
};

export default function Home() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [maintenanceOrders, setMaintenanceOrders] =
    useState<MaintenanceOrder[]>([]);
  const [search, setSearch] = useState("");
  const activePage = "Visão geral";
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved !== null) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setEquipment(parsed as Equipment[]);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar os equipamentos:", error);
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem(
        MAINTENANCE_STORAGE_KEY
      );

      if (savedOrders) {
        const parsedOrders: unknown = JSON.parse(savedOrders);

        if (Array.isArray(parsedOrders)) {
          setMaintenanceOrders(parsedOrders as MaintenanceOrder[]);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar as ordens de manutenção:", error);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(equipment));
    } catch (error) {
      console.error("Erro ao salvar os equipamentos:", error);
    }
  }, [equipment, storageReady]);

  const filteredEquipment = useMemo(() => {
    const term = search.toLowerCase().trim();

    return equipment.filter((item) =>
      [
        item.name,
        item.category,
        item.assetNumber,
        item.location,
        item.status,
      ].some((value) => value.toLowerCase().includes(term))
    );
  }, [equipment, search]);

  const available = equipment.filter(
    (item) => item.status === "Disponível"
  ).length;
  const inUse = equipment.filter(
    (item) => item.status === "Em uso"
  ).length;
  const maintenance = equipment.filter(
    (item) => item.status === "Manutenção"
  ).length;
  const openOrders = maintenanceOrders.filter(
    (order) => order.status === "Aberta"
  ).length;

  const inProgressOrders = maintenanceOrders.filter(
    (order) => order.status === "Em andamento"
  ).length;

  const waitingOrders = maintenanceOrders.filter(
    (order) => order.status === "Aguardando peças"
  ).length;

  const completedOrders = maintenanceOrders.filter(
    (order) => order.status === "Concluída"
  ).length;

  const recentOrders = maintenanceOrders.slice(0, 5);
  const pageDescription =
    "Acompanhe os equipamentos e a operação do laboratório.";

  return (
    <main className="min-h-screen bg-[#0b1120] text-slate-100">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <Sidebar activePage={activePage} />

        <section className="min-w-0 flex-1 w-full">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
                Laboratório de Realidade Virtual
              </p>
              <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
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
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h3 className="text-lg font-semibold">
                  Olá! Bem-vindo ao VR Studio Lab
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {pageDescription}
                </p>
              </div>
            </div>


            <>
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                  value={available}
                  detail="Prontos para utilização"
                  icon="✓"
                  color="text-emerald-300"
                  bg="bg-emerald-400/10"
                />
                <Cards
                  title="Em utilização"
                  value={inUse}
                  detail="Em uso no laboratório"
                  icon="⌁"
                  color="text-blue-300"
                  bg="bg-blue-400/10"
                />
                <Cards
                  title="Em manutenção"
                  value={maintenance}
                  detail="Precisam de atenção"
                  icon="⚙"
                  color="text-amber-300"
                  bg="bg-amber-400/10"
                />
              </div>


              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Cards
                  title="Ordens abertas"
                  value={openOrders}
                  detail="Aguardando atendimento"
                  icon="⚙"
                  color="text-cyan-300"
                  bg="bg-cyan-400/10"
                />

                <Cards
                  title="Em andamento"
                  value={inProgressOrders}
                  detail="Serviços em execução"
                  icon="⌁"
                  color="text-blue-300"
                  bg="bg-blue-400/10"
                />

                <Cards
                  title="Aguardando peças"
                  value={waitingOrders}
                  detail="Aguardando materiais"
                  icon="◷"
                  color="text-amber-300"
                  bg="bg-amber-400/10"
                />

                <Cards
                  title="Ordens concluídas"
                  value={completedOrders}
                  detail="Serviços finalizados"
                  icon="✓"
                  color="text-emerald-300"
                  bg="bg-emerald-400/10"
                />
              </div>


              <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#111b2d] p-5 lg:col-span-2">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">
                        Inventário de equipamentos
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        Consulte os itens registrados no sistema
                      </p>
                    </div>
                    <span className="rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300">
                      {filteredEquipment.length} itens
                    </span>
                  </div>

                  <div className="mb-5">
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Pesquisar nome, patrimônio, categoria..."
                      className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                          <th className="pb-3 pr-4 font-medium">Equipamento</th>
                          <th className="pb-3 pr-4 font-medium">Patrimônio</th>
                          <th className="pb-3 pr-4 font-medium">Localização</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>

                        {filteredEquipment.slice(0, 5).map((item) => (

                          <tr
                            key={item.id}
                            className="border-b border-white/5 last:border-0"
                          >
                            <td className="py-4 pr-4">
                              <p className="font-medium text-slate-200">
                                {item.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {item.category}
                              </p>
                            </td>
                            <td className="py-4 pr-4 text-slate-400">
                              {item.assetNumber}
                            </td>
                            <td className="py-4 pr-4 text-slate-400">
                              {item.location}
                            </td>
                            <td className="py-4">
                              <span
                                className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs ${item.status === "Disponível"
                                  ? "bg-emerald-400/10 text-emerald-300"
                                  : item.status === "Em uso"
                                    ? "bg-blue-400/10 text-blue-300"
                                    : "bg-amber-400/10 text-amber-300"
                                  }`}
                              >
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredEquipment.length === 0 && (
                      <p className="py-10 text-center text-sm text-slate-500">
                        Nenhum equipamento encontrado.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#111b2d] p-5">
                  <h3 className="font-semibold">Resumo operacional</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Situação atual dos itens
                  </p>

                  <div className="mt-7 flex items-center justify-center">
                    <div
                      className="flex h-40 w-40 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(#34d399 0% ${equipment.length
                          ? (available / equipment.length) * 100
                          : 0
                          }%, #60a5fa ${equipment.length
                            ? (available / equipment.length) * 100
                            : 0
                          }% ${equipment.length
                            ? ((available + inUse) / equipment.length) * 100
                            : 0
                          }%, #fbbf24 ${equipment.length
                            ? ((available + inUse) / equipment.length) * 100
                            : 0
                          }% 100%)`,
                      }}
                    >
                      <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[#111b2d]">
                        <span className="text-3xl font-bold">
                          {equipment.length}
                        </span>
                        <span className="text-xs text-slate-500">
                          equipamentos
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 space-y-4">
                    {[
                      {
                        label: "Disponíveis",
                        value: available,
                        color: "bg-emerald-400",
                      },
                      {
                        label: "Em uso",
                        value: inUse,
                        color: "bg-blue-400",
                      },
                      {
                        label: "Manutenção",
                        value: maintenance,
                        color: "bg-amber-400",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="flex items-center gap-2 text-slate-400">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                          />
                          {item.label}
                        </span>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Últimas ordens de serviço */}
              <div className="mb-6 rounded-2xl border border-white/10 bg-[#111b2d] p-5">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      Últimas ordens de serviço
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      As 5 ordens mais recentes registradas
                    </p>
                  </div>

                  <span className="rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300">
                    {maintenanceOrders.length} ordens
                  </span>
                </div>

                {recentOrders.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    Nenhuma ordem de serviço cadastrada.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-500">
                          <th className="pb-3 pr-4 font-medium">Ordem</th>
                          <th className="pb-3 pr-4 font-medium">Equipamento</th>
                          <th className="pb-3 pr-4 font-medium">Abertura</th>
                          <th className="pb-3 font-medium">Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {recentOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-white/5 last:border-0"
                          >
                            <td className="py-4 pr-4 font-medium text-cyan-300">
                              {order.orderNumber || "OS antiga"}
                            </td>

                            <td className="py-4 pr-4 text-slate-200">
                              {order.equipment}
                            </td>

                            <td className="py-4 pr-4 text-slate-400">
                              {order.openingDate
                                ? order.openingDate.split("-").reverse().join("/")
                                : "—"}
                            </td>

                            <td className="py-4">
                              <span
                                className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs ${order.status === "Concluída"
                                  ? "bg-emerald-400/10 text-emerald-300"
                                  : order.status === "Em andamento"
                                    ? "bg-blue-400/10 text-blue-300"
                                    : order.status === "Aguardando peças"
                                      ? "bg-amber-400/10 text-amber-300"
                                      : "bg-cyan-400/10 text-cyan-300"
                                  }`}
                              >
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>

            <Footer />
          </div>
        </section>
      </div>
    </main>
  );
}