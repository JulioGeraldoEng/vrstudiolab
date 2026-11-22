"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Cards from "../components/cards/Cards";
import EquipmentModal from "../components/modals/EquipmentModal";
import BackToDashboard from "../components/buttons/BackToDashboard";
import EquipmentTable from "../components/tables/EquipmentTable";
import { categories, statuses } from "../../types/equipment";
import type { Equipment, Status } from "../../types/equipment";
import PermissionGate from "../components/PermissionGate";
import { CURRENT_ACCESS_PROFILE } from "../../lib/permissions/current-profile";
import { hasPermission } from "../../lib/permissions/has-permission";

const STORAGE_KEY = "vrstudiolab-inventory-v1";
const activePage = "Equipamentos";

const emptyForm = {
  name: "",
  category: "Óculos VR",
  assetNumber: "",
  serialNumber: "",
  location: "",
  status: "Disponível" as Status,
  operatingSystem: "",
  notes: "",
};

export default function InventoryPage() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pageState, setPageState] = useState({
    page: 1,
    filterKey: "",
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
          const parsed: unknown = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            setItems(parsed as Equipment[]);
          } else {
            setItems([]);
          }
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error(
          "Não foi possível carregar o equipamento salvo.",
          error
        );
      } finally {
        setReady(true);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, ready]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch = [
        item.name,
        item.category,
        item.assetNumber,
        item.serialNumber,
        item.location,
      ].some((value) => value.toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "Todos" || item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "Todas" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [items, search, statusFilter, categoryFilter]);

  const filterKey = JSON.stringify([
    search,
    statusFilter,
    categoryFilter,
  ]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const currentPage =
    pageState.filterKey === filterKey
      ? Math.min(pageState.page, Math.max(totalPages, 1))
      : 1;

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function openNewForm() {
    if (!hasPermission(CURRENT_ACCESS_PROFILE, "equipment.create")) {
      alert("Você não possui permissão para cadastrar equipamentos.");
      return;
    }

    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(item: Equipment) {
    if (!hasPermission(CURRENT_ACCESS_PROFILE, "equipment.edit")) {
      alert("Você não possui permissão para editar equipamentos.");
      return;
    }

    setForm({
      name: item.name,
      category: item.category,
      assetNumber: item.assetNumber,
      serialNumber: item.serialNumber,
      location: item.location,
      status: item.status,
      operatingSystem: item.operatingSystem || "",
      notes: item.notes,
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  function saveEquipment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const requiredPermission =
      editingId !== null ? "equipment.edit" : "equipment.create";

    if (!hasPermission(CURRENT_ACCESS_PROFILE, requiredPermission)) {
      alert("Você não possui permissão para realizar esta operação.");
      return;
    }

    const name = form.name.trim();
    if (!name) return;

    try {
      let updatedItems: Equipment[];

      if (editingId !== null) {
        updatedItems = items.map((item) =>
          item.id === editingId ? { ...item, ...form, name } : item
        );
      } else {
        const newItem: Equipment = {
          ...form,
          name,
          id: Date.now(),
        };

        updatedItems = [newItem, ...items];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));

      setItems(updatedItems);
      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });
    } catch (error) {
      console.error("Erro ao salvar o equipamento:", error);
      window.alert(
        "Não foi possível salvar os dados. Verifique o armazenamento do navegador."
      );
    }
  }

  function deactivateEquipment(item: Equipment) {
    if (!hasPermission(CURRENT_ACCESS_PROFILE, "equipment.deactivate")) {
      alert("Você não possui permissão para dar baixa em equipamentos.");
      return;
    }
    const confirmed = window.confirm(
      `Deseja dar baixa no equipamento "${item.name}"? Ele continuará registrado no histórico.`
    );

    if (!confirmed) return;

    try {
      const updatedItems = items.map((entry) =>
        entry.id === item.id
          ? { ...entry, status: "Baixado" as Status }
          : entry
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      setItems(updatedItems);
    } catch (error) {
      console.error("Erro ao dar baixa no equipamento:", error);
      window.alert("Não foi possível atualizar o equipamento.");
    }
  }

  const available = items.filter((item) => item.status === "Disponível").length;
  const inUse = items.filter((item) => item.status === "Em uso").length;
  const maintenance = items.filter(
    (item) => item.status === "Manutenção"
  ).length;

  return (
    <section className="min-w-0 flex-1 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {activePage}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Gerencie equipamentos, patrimônio e localização.
            </p>
          </div>

          <BackToDashboard />
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Cards
            title="Total de equipamentos"
            value={items.length}
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
            title="Em uso"
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
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#101c2e]">

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-semibold">
                  Cadastro de equipamentos
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {filteredItems.length} registro(s) encontrado(s)
                </p>
              </div>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Pesquisar equipamentos..."
                aria-label="Pesquisar equipamentos"
                className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm outline-none transition focus:border-cyan-400 sm:max-w-64"
              />

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                aria-label="Filtrar por categoria"
                className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm outline-none transition focus:border-cyan-400 sm:max-w-56"
              >
                <option value="Todas">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filtrar por status"
                className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm outline-none transition focus:border-cyan-400 sm:max-w-48"
              >
                <option value="Todos">Todos os status</option>
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>

            <PermissionGate permission="equipment.create">
              <button
                type="button"
                onClick={openNewForm}
                className="whitespace-nowrap rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f] shadow-md shadow-cyan-400/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/30 active:translate-y-0 active:scale-95"
              >
                + Novo equipamento
              </button>
            </PermissionGate>
          </div>

          <EquipmentTable
            items={paginatedItems}
            ready={ready}
            onEdit={
              hasPermission(CURRENT_ACCESS_PROFILE, "equipment.edit")
                ? openEditForm
                : undefined
            }
            onDeactivate={
              hasPermission(CURRENT_ACCESS_PROFILE, "equipment.deactivate")
                ? deactivateEquipment
                : undefined
            }
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredItems.length}
            onPageChange={(page) =>
              setPageState({
                page,
                filterKey,
              })
            }
            showActions={
              hasPermission(CURRENT_ACCESS_PROFILE, "equipment.edit") ||
              hasPermission(CURRENT_ACCESS_PROFILE, "equipment.deactivate")
            }
          />

        </section>

        <EquipmentModal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={saveEquipment}
          form={form}
          setForm={setForm}
          isEditing={editingId !== null}
        />
      </div>
    </section>
  );
}