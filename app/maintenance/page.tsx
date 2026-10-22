"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Cards from "../components/Cards";
import Footer from "../components/Footer";
import BackToDashboard from "../components/buttons/BackToDashboard";
import MaintenanceModal from "../components/modals/MaintenanceModal";
import MaintenanceTable from "../components/tables/MaintenanceTable";
import type { Equipment, Status } from "../../types/equipment";
import type { Person } from "../../types/person";
import type {
  MaintenanceOrder,
  MaintenanceStatus,
} from "../../types/maintenance";

const PEOPLE_STORAGE_KEY = "vrstudiolab-maintenance-people-v1";

const STORAGE_KEY = "vrstudiolab-maintenance-v1";

const initialOrders: MaintenanceOrder[] = [];

const statusStyles: Record<MaintenanceStatus, string> = {
  Aberta: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  "Em andamento":
    "border-amber-400/30 bg-amber-400/10 text-amber-300",
  "Aguardando peças":
    "border-orange-400/30 bg-orange-400/10 text-orange-300",
  Concluída:
    "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
};

export default function ManutencaoPage() {
  const [orders, setOrders] =
    useState<MaintenanceOrder[]>(initialOrders);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [equipmentId, setEquipmentId] = useState("");
  const [problem, setProblem] = useState("");
  const [inventory, setInventory] =
    useState<Equipment[]>([]);

  const [historyEquipmentId, setHistoryEquipmentId] =
    useState("");

  const [people, setPeople] = useState<Person[]>([]);

  const [assignedPersonId, setAssignedPersonId] = useState("");

  const [completionOrderId, setCompletionOrderId] = useState("");
  const [completionExecutorId, setCompletionExecutorId] = useState("");
  const [completionAuthorizerId, setCompletionAuthorizerId] = useState("");
  const [completionServiceNotes, setCompletionServiceNotes] = useState("");
  const [completionIsReleased, setCompletionIsReleased] = useState(false);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem(STORAGE_KEY);

      if (savedOrders) {
        const parsedOrders: unknown = JSON.parse(savedOrders);

        if (Array.isArray(parsedOrders)) {
          const existingOrders = parsedOrders as MaintenanceOrder[];
          const currentYear = new Date().getFullYear();
          const usedNumbers = new Set<string>();

          for (const order of existingOrders) {
            if (
              typeof order.orderNumber === "string" &&
              order.orderNumber.trim() !== ""
            ) {
              usedNumbers.add(order.orderNumber.trim());
            }
          }

          let nextNumber = 1;

          for (const number of usedNumbers) {
            const match = number.match(/^OS-(\d{4})-(\d+)$/);

            if (match && Number(match[1]) === currentYear) {
              nextNumber = Math.max(
                nextNumber,
                Number(match[2]) + 1
              );
            }
          }

          const migratedOrders = existingOrders.map((order) => {
            if (
              typeof order.orderNumber === "string" &&
              order.orderNumber.trim() !== ""
            ) {
              return order;
            }

            let newNumber = "";

            do {
              newNumber = `OS-${currentYear}-${String(
                nextNumber
              ).padStart(4, "0")}`;

              nextNumber++;
            } while (usedNumbers.has(newNumber));

            usedNumbers.add(newNumber);

            return {
              ...order,
              orderNumber: newNumber,
            };
          });

          setOrders(migratedOrders);
        }
      }

      const savedInventory = localStorage.getItem(
        "vrstudiolab-inventory-v1"
      );

      if (savedInventory) {
        const parsedInventory: unknown = JSON.parse(savedInventory);

        if (Array.isArray(parsedInventory)) {
          setInventory(parsedInventory as Equipment[]);
        }
      }

      const savedPeople = localStorage.getItem(PEOPLE_STORAGE_KEY);

      if (savedPeople) {
        const parsedPeople: unknown = JSON.parse(savedPeople);

        if (Array.isArray(parsedPeople)) {
          setPeople(parsedPeople as Person[]);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Erro ao salvar manutenções:", error);
    }
  }, [orders, ready]);

  function createOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const selectedId = Number(equipmentId);
    const savedInventory = localStorage.getItem(
      "vrstudiolab-inventory-v1"
    );

    const currentInventory: Equipment[] = savedInventory
      ? JSON.parse(savedInventory)
      : [];

    const selectedEquipment = currentInventory.find(
      (item) => item.id === selectedId
    );

    if (!selectedEquipment) {
      alert("Equipamento não encontrado. Atualize a página e tente novamente.");
      return;
    }

    if (selectedEquipment.status === "Baixado") {
      alert("Este equipamento está baixado e não pode receber uma nova ordem.");
      return;
    }

    const activeOrderExists = orders.some(
      (order) =>
        order.equipmentId === selectedId &&
        order.status !== "Concluída"
    );

    if (activeOrderExists) {
      alert("Este equipamento já possui uma ordem de manutenção em aberto.");
      return;
    }

    const selectedPerson = people.find(
      (person) =>
        person.id === assignedPersonId && person.active
    );

    if (!selectedPerson) {
      alert("Selecione uma pessoa cadastrada e ativa para o atendimento.");
      return;
    }

    const currentYear = new Date().getFullYear();
    const orderPrefix = `OS-${currentYear}-`;

    const highestOrderNumber = orders.reduce((highest, order) => {
      const match = order.orderNumber?.match(/^OS-\d{4}-(\d+)$/);

      if (!match) return highest;

      const orderYear = Number(order.orderNumber.slice(3, 7));

      if (orderYear !== currentYear) return highest;

      return Math.max(highest, Number(match[1]));
    }, 0);

    const newOrderNumber = `${orderPrefix}${String(
      highestOrderNumber + 1
    ).padStart(4, "0")}`;

    const newOrder: MaintenanceOrder = {
      id: crypto.randomUUID(),
      orderNumber: newOrderNumber,
      equipmentId: selectedEquipment.id,
      equipment: selectedEquipment.name,
      assetNumber: selectedEquipment.assetNumber,
      previousEquipmentStatus: selectedEquipment.status,
      problem: problem.trim(),
      responsible: selectedPerson.name,
      assignedPersonId: selectedPerson.id,
      assignedPersonName: selectedPerson.name,
      openingDate: new Date().toISOString().slice(0, 10),
      status: "Aberta",
    };

    const updatedInventory = currentInventory.map((item) =>
      item.id === selectedEquipment.id
        ? { ...item, status: "Manutenção" as Status }
        : item
    );

    localStorage.setItem(
      "vrstudiolab-inventory-v1",
      JSON.stringify(updatedInventory)
    );

    setInventory(updatedInventory);
    setOrders((current) => [newOrder, ...current]);

    setEquipmentId("");
    setProblem("");
    setAssignedPersonId("");
    setShowForm(false);
  }

  function updateStatus(id: string, status: MaintenanceStatus) {
    const targetOrder = orders.find((order) => order.id === id);

    if (!targetOrder) return;

    if (status === "Concluída") {
      setCompletionOrderId(id);
      setCompletionExecutorId("");
      setCompletionAuthorizerId("");
      setCompletionServiceNotes("");
      setCompletionIsReleased(false);
      return;
    }

    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? { ...order, status }
          : order
      )
    );
  }

  function confirmCompletion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const targetOrder = orders.find(
      (order) => order.id === completionOrderId
    );

    if (!targetOrder) {
      alert("Ordem de serviço não encontrada.");
      return;
    }

    const executor = people.find(
      (person) =>
        person.id === completionExecutorId && person.active
    );

    const authorizer = people.find(
      (person) =>
        person.id === completionAuthorizerId &&
        person.active &&
        (person.role === "Técnico" ||
          person.role === "Responsável autorizado")
    );

    if (!executor) {
      alert("Selecione uma pessoa ativa que executou o serviço.");
      return;
    }

    if (!authorizer) {
      alert(
        "A liberação exige um técnico ou responsável autorizado ativo."
      );
      return;
    }

    const savedInventory = localStorage.getItem(
      "vrstudiolab-inventory-v1"
    );

    const currentInventory: Equipment[] = savedInventory
      ? JSON.parse(savedInventory)
      : [];

    const hasAnotherActiveOrder = orders.some(
      (order) =>
        order.id !== targetOrder.id &&
        order.equipmentId === targetOrder.equipmentId &&
        order.status !== "Concluída"
    );

    const updatedInventory = currentInventory.map((item) => {
      if (item.id !== targetOrder.equipmentId) return item;

      if (!completionIsReleased || hasAnotherActiveOrder) {
        return {
          ...item,
          status: "Manutenção" as Status,
        };
      }

      return {
        ...item,
        status: "Disponível" as Status,
      };
    });

    const updatedOrder: MaintenanceOrder = {
      ...targetOrder,
      status: "Concluída",
      serviceNotes: completionServiceNotes.trim(),
      completionDate: new Date().toISOString().slice(0, 10),
      performedByPersonId: executor.id,
      performedByName: executor.name,
      releasedByPersonId: authorizer.id,
      releasedByName: authorizer.name,
    };

    try {
      localStorage.setItem(
        "vrstudiolab-inventory-v1",
        JSON.stringify(updatedInventory)
      );

      setInventory(updatedInventory);

      setOrders((current) =>
        current.map((order) =>
          order.id === targetOrder.id ? updatedOrder : order
        )
      );

      setCompletionOrderId("");
      setCompletionExecutorId("");
      setCompletionAuthorizerId("");
      setCompletionServiceNotes("");
      setCompletionIsReleased(false);
    } catch (error) {
      console.error("Erro ao concluir a ordem:", error);
      alert("Não foi possível salvar a conclusão. Tente novamente.");
    }
  }

  function releaseEquipment(orderId: string) {
    const targetOrder = orders.find(
      (order) => order.id === orderId
    );

    if (!targetOrder) {
      alert("Ordem de serviço não encontrada.");
      return;
    }

    if (targetOrder.status !== "Concluída") {
      alert("Somente ordens concluídas podem liberar equipamentos.");
      return;
    }

    const equipmentId = targetOrder.equipmentId;

    if (equipmentId === undefined) {
      alert("Não foi possível identificar o equipamento.");
      return;
    }

    const savedInventory = localStorage.getItem(
      "vrstudiolab-inventory-v1"
    );

    const currentInventory: Equipment[] = savedInventory
      ? JSON.parse(savedInventory)
      : [];

    const equipment = currentInventory.find(
      (item) => item.id === equipmentId
    );

    if (!equipment) {
      alert("Equipamento não encontrado no inventário.");
      return;
    }

    if (equipment.status !== "Manutenção") {
      alert("O equipamento não está com status de manutenção.");
      return;
    }

    const hasActiveOrder = orders.some(
      (order) =>
        order.equipmentId === equipmentId &&
        order.status !== "Concluída"
    );

    if (hasActiveOrder) {
      alert(
        "Este equipamento possui outra ordem de serviço em aberto."
      );
      return;
    }

    const authorizedPeople = people.filter(
      (person) =>
        person.active &&
        (person.role === "Técnico" ||
          person.role === "Responsável autorizado")
    );

    if (authorizedPeople.length === 0) {
      alert(
        "Cadastre um técnico ou responsável autorizado antes de liberar o equipamento."
      );
      return;
    }

    const options = authorizedPeople
      .map(
        (person, index) =>
          `${index + 1} - ${person.name} (${person.role})`
      )
      .join("\n");

    const choice = prompt(
      `Quem autoriza a liberação?\n\n${options}\n\nDigite o número correspondente:`
    );

    if (choice === null) return;

    const selectedIndex = Number(choice) - 1;
    const authorizer = authorizedPeople[selectedIndex];

    if (
      !Number.isInteger(selectedIndex) ||
      selectedIndex < 0 ||
      !authorizer
    ) {
      alert("Selecione um número válido.");
      return;
    }

    const updatedInventory = currentInventory.map((item) =>
      item.id === equipmentId
        ? { ...item, status: "Disponível" as Status }
        : item
    );

    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? {
          ...order,
          releasedByPersonId: authorizer.id,
          releasedByName: authorizer.name,
        }
        : order
    );

    try {
      localStorage.setItem(
        "vrstudiolab-inventory-v1",
        JSON.stringify(updatedInventory)
      );

      localStorage.setItem(
        "vrstudiolab-maintenance-v1",
        JSON.stringify(updatedOrders)
      );

      setInventory(updatedInventory);
      setOrders(updatedOrders);

      alert("Equipamento liberado com sucesso!");
    } catch (error) {
      console.error("Erro ao liberar equipamento:", error);
      alert("Não foi possível salvar a liberação.");
    }
  }


  const filteredOrders = orders.filter((order) => {
    const matchesSearch = `${order.orderNumber || ""} ${order.equipment} ${order.problem} ${order.responsible} ${order.status}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "Todos" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });


  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectedHistoryEquipment = inventory.find(
    (item) => String(item.id) === historyEquipmentId
  );

  const historyOrders = orders.filter((order) => {
    if (!selectedHistoryEquipment) return false;

    return (
      order.equipmentId === selectedHistoryEquipment.id ||
      (
        !order.equipmentId &&
        order.equipment === selectedHistoryEquipment.name
      )
    );
  });

  const openCount = orders.filter(
    (order) => order.status === "Aberta"
  ).length;

  const progressCount = orders.filter(
    (order) => order.status === "Em andamento"
  ).length;

  const waitingCount = orders.filter(
    (order) => order.status === "Aguardando peças"
  ).length;

  const completedCount = orders.filter(
    (order) => order.status === "Concluída"
  ).length;

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400";


  return (
    <main className="min-h-screen bg-[#0b1120] text-white">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <Sidebar activePage="Manutenção" />

        <section className="min-w-0 flex-1 p-4 sm:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <BackToDashboard />
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                  VR STUDIO LAB
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Manutenção
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  Controle de serviços e ordens de manutenção.
                </p>
              </div>
            </header>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Cards
                title="Ordens abertas"
                value={openCount}
                detail="Aguardando triagem"
                icon="📋"
                color="text-blue-300"
                bg="bg-blue-400/10"
              />
              <Cards
                title="Em andamento"
                value={progressCount}
                detail="Sendo reparadas"
                icon="⚙"
                color="text-amber-300"
                bg="bg-amber-400/10"
              />
              <Cards
                title="Aguardando peças"
                value={waitingCount}
                detail="Pendência de componentes"
                icon="⏳"
                color="text-orange-300"
                bg="bg-orange-400/10"
              />
              <Cards
                title="Concluídas"
                value={completedCount}
                detail="Reparos finalizados"
                icon="✓"
                color="text-emerald-300"
                bg="bg-emerald-400/10"
              />
            </section>

            {completionOrderId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-emerald-400/20 bg-[#151e30] p-6 shadow-2xl">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="mb-5 text-xl font-semibold">
                      Concluir ordem de serviço
                    </h2>

                    <button
                      type="button"
                      onClick={() => setCompletionOrderId("")}
                      className="rounded-lg px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white"
                      aria-label="Fechar formulário"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    Registre o serviço executado e quem autorizou a liberação.
                  </p>

                  <form onSubmit={confirmCompletion} className="mt-6 space-y-5">
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">
                        Quem executou o serviço?
                      </label>

                      <select
                        className={inputClass}
                        value={completionExecutorId}
                        onChange={(event) =>
                          setCompletionExecutorId(event.target.value)
                        }
                        required
                      >
                        <option value="">Selecione o executor</option>

                        {people
                          .filter((person) => person.active)
                          .map((person) => (
                            <option key={person.id} value={person.id}>
                              {person.name} — {person.role}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">
                        Técnico ou responsável que autoriza a liberação
                      </label>

                      <select
                        className={inputClass}
                        value={completionAuthorizerId}
                        onChange={(event) =>
                          setCompletionAuthorizerId(event.target.value)
                        }
                        required
                      >
                        <option value="">Selecione quem autoriza</option>

                        {people
                          .filter(
                            (person) =>
                              person.active &&
                              (person.role === "Técnico" ||
                                person.role === "Responsável autorizado")
                          )
                          .map((person) => (
                            <option key={person.id} value={person.id}>
                              {person.name} — {person.role}
                            </option>
                          ))}
                      </select>

                      <p className="mt-2 text-xs text-slate-400">
                        Alunos não podem autorizar a liberação.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">
                        Serviço realizado
                      </label>

                      <textarea
                        className={inputClass}
                        value={completionServiceNotes}
                        onChange={(event) =>
                          setCompletionServiceNotes(event.target.value)
                        }
                        placeholder="Descreva os reparos, testes e procedimentos realizados"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
                      <p className="font-medium text-white">
                        O equipamento foi testado e está liberado para uso?
                      </p>

                      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                          <input
                            type="radio"
                            name="completionRelease"
                            checked={completionIsReleased}
                            onChange={() => setCompletionIsReleased(true)}
                          />
                          Sim, liberar para uso
                        </label>

                        <label className="flex items-center gap-2 text-sm text-slate-300">
                          <input
                            type="radio"
                            name="completionRelease"
                            checked={!completionIsReleased}
                            onChange={() => setCompletionIsReleased(false)}
                          />
                          Não, manter em manutenção
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setCompletionOrderId("")}
                        className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5"
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold hover:bg-emerald-500"
                      >
                        Confirmar conclusão
                      </button>
                    </div>
                  </form>
                </section>
              </div>
            )}

            <MaintenanceModal
              open={showForm}
              equipmentId={equipmentId}
              problem={problem}
              assignedPersonId={assignedPersonId}
              inventory={inventory}
              people={people}
              inputClass={inputClass}
              onEquipmentChange={setEquipmentId}
              onProblemChange={setProblem}
              onPersonChange={setAssignedPersonId}
              onSubmit={createOrder}
              onClose={() => setShowForm(false)}
            />

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#151e30]">
              <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Ordens de serviço</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {filteredOrders.length} registro(s) encontrado(s)
                  </p>
                </div>


                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">                  <input
                  className={`${inputClass} sm:w-64 sm:flex-none`} value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar equipamento ou serviço..."
                />

                  <select
                    className={`${inputClass} sm:w-64 sm:flex-none`} value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label="Filtrar ordens por status"
                  >
                    <option value="Todos">Todos os status</option>
                    <option value="Aberta">Aberta</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Aguardando peças">Aguardando peças</option>
                    <option value="Concluída">Concluída</option>
                  </select>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(true);
                      }}
                      className="whitespace-nowrap rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f] shadow-md shadow-cyan-400/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/30 active:translate-y-0 active:scale-95"                    >
                      + Nova ordem de serviço
                    </button>
                  </div>
                </div>

              </div>

              {filteredOrders.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-400/10 text-2xl text-blue-300">
                    ⚙
                  </div>
                  <h3 className="font-semibold">Nenhuma ordem de serviço</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Crie uma ordem para começar a acompanhar as manutenções.
                  </p>
                </div>
              ) : (
                <MaintenanceTable
                  orders={paginatedOrders}
                  statusStyles={statusStyles}
                  onStatusChange={updateStatus}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredOrders.length}
                  onPageChange={setCurrentPage}
                />
              )}
            </section>

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#151e30]">
              <div className="border-b border-white/10 p-5">
                <h2 className="text-lg font-semibold">
                  Histórico por equipamento
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Consulte os defeitos e serviços anteriores de cada equipamento.
                </p>

                <div className="mt-4">
                  <label className="mb-2 block text-sm text-slate-300">
                    Selecione o equipamento
                  </label>

                  <select
                    className={inputClass}
                    value={historyEquipmentId}
                    onChange={(event) =>
                      setHistoryEquipmentId(event.target.value)
                    }
                  >
                    <option value="">Escolha um equipamento</option>

                    {inventory.map((item) => (
                      <option key={item.id} value={String(item.id)}>
                        {item.name} — {item.assetNumber || "Sem patrimônio"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!historyEquipmentId ? (
                <p className="p-6 text-sm text-slate-400">
                  Selecione um equipamento para consultar seu histórico.
                </p>
              ) : historyOrders.length === 0 ? (
                <p className="p-6 text-sm text-slate-400">
                  Nenhuma ordem de serviço encontrada para este equipamento.
                </p>
              ) : (
                <div className="space-y-4 p-5">
                  {historyOrders.map((order) => (
                    <article
                      key={order.id}
                      className="rounded-xl border border-white/10 bg-[#111827] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-cyan-300">
                            {order.orderNumber || "OS antiga"}
                          </p>
                          <h3 className="mt-1 font-semibold">{order.equipment}</h3>
                        </div>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs ${statusStyles[order.status]
                            }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-slate-400">
                        Abertura: {order.openingDate.split("-").reverse().join("/")}
                      </p>

                      {order.completionDate && (
                        <p className="mt-1 text-xs text-slate-400">
                          Conclusão:{" "}
                          {order.completionDate.split("-").reverse().join("/")}
                        </p>
                      )}

                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Defeito ou solicitação
                        </p>
                        <p className="mt-1 text-sm text-slate-200">
                          {order.problem}
                        </p>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Responsável
                        </p>
                        <p className="mt-1 text-sm text-slate-200">
                          {order.responsible}
                        </p>
                      </div>

                      {order.status === "Concluída" && (
                        <div className="mt-3 space-y-3">
                          <div>
                            <p className="text-xs font-semibold uppercase text-slate-400">
                              Serviço executado por
                            </p>
                            <p className="mt-1 text-sm text-slate-200">
                              {order.performedByName || "Não informado"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase text-slate-400">
                              Liberação autorizada por
                            </p>

                            <p className="mt-1 text-sm text-slate-200">
                              {order.releasedByName || "Não informado"}
                            </p>

                            {order.status === "Concluída" &&
                              inventory.some(
                                (item) =>
                                  item.id === order.equipmentId &&
                                  item.status === "Manutenção"
                              ) && (
                                <button
                                  type="button"
                                  onClick={() => releaseEquipment(order.id)}
                                  className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
                                >
                                  Liberar equipamento
                                </button>
                              )}
                          </div>
                        </div>
                      )}

                      {order.status === "Concluída" && (
                        <div className="mt-3 rounded-lg border border-emerald-400/10 bg-emerald-400/5 p-3">
                          <p className="text-xs font-semibold uppercase text-emerald-300">
                            Serviço executado
                          </p>
                          <p className="mt-1 text-sm text-slate-200">
                            {order.serviceNotes || "Sem observações registradas."}
                          </p>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>

            <p className="text-xs text-slate-500">
              VR Studio Lab · Módulo de manutenção · Dados salvos neste navegador
            </p>
            <Footer />
          </div>
        </section>
      </div>
    </main>
  );
}