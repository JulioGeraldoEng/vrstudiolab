"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Sidebar from "../components/Sidebar";
import Cards from "../components/Cards";
import EquipmentModal from "../components/EquipmentModal";
import Footer from "../components/Footer";
import { Pagination } from "../components/Pagination";
import BackToDashboard from "../components/BackToDashboard";

type Status = "Disponível" | "Em uso" | "Manutenção" | "Baixado";

type Equipment = {
  id: number;
  name: string;
  category: string;
  assetNumber: string;
  serialNumber: string;
  location: string;
  status: Status;
  operatingSystem: string;
  notes: string;
};

const STORAGE_KEY = "vrstudiolab-inventory-v1";

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

const categories = [
  "Óculos VR",
  "Computadores",
  "Notebooks",
  "Televisores",
  "Monitores",
  "Acessórios",
  "Sensores",
  "Áudio e vídeo",
  "Iluminação",
  "Outros",
];


const statuses: Status[] = [
  "Disponível",
  "Em uso",
  "Manutenção",
  "Baixado",
];

const statusStyles: Record<Status, string> = {
  "Disponível": "bg-emerald-400/10 text-emerald-300",
  "Em uso": "bg-cyan-400/10 text-cyan-300",
  "Manutenção": "bg-amber-400/10 text-amber-300",
  "Baixado": "bg-rose-400/10 text-rose-300",
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, categoryFilter]);


  useEffect(() => {
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
        "Não foi possível carregar o inventário salvo.",
        error
      );
    } finally {
      setReady(true);
    }
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

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function openNewForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(item: Equipment) {
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
      console.error("Erro ao salvar o inventário:", error);
      window.alert(
        "Não foi possível salvar os dados. Verifique o armazenamento do navegador."
      );
    }
  }

  function deleteEquipment(item: Equipment) {
    const confirmed = window.confirm(
      `Deseja excluir o equipamento "${item.name}"?`
    );

    if (!confirmed) return;

    try {
      const updatedItems = items.filter(
        (entry) => entry.id !== item.id
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      setItems(updatedItems);
    } catch (error) {
      console.error("Erro ao excluir equipamento:", error);
      window.alert("Não foi possível atualizar o inventário salvo.");
    }
  }

  const available = items.filter((item) => item.status === "Disponível").length;
  const inUse = items.filter((item) => item.status === "Em uso").length;
  const maintenance = items.filter(
    (item) => item.status === "Manutenção"
  ).length;

  return (
    <main className="min-h-screen bg-[#0b1120] text-slate-100">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <Sidebar activePage="Equipamentos" />

        <section className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
            <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <BackToDashboard />
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                  VR STUDIO LAB
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                  Inventário
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  Gerencie equipamentos, patrimônio e localização.
                </p>
              </div>

              <button
                onClick={openNewForm}
                className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-[#07111f] transition hover:bg-cyan-300"
              >
                + Novo equipamento
              </button>
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
              <div className="grid gap-3 border-b border-white/10 p-4 md:grid-cols-3">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Pesquisar equipamentos..."
                  aria-label="Pesquisar equipamentos"
                  className="rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />

                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  aria-label="Filtrar por categoria"
                  className="rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm outline-none focus:border-cyan-400"
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
                  className="rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm outline-none focus:border-cyan-400"
                >
                  <option value="Todos">Todos os status</option>
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-4">Equipamento</th>
                      <th className="px-5 py-4">Patrimônio</th>
                      <th className="px-5 py-4">Localização</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {!ready ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                          Carregando inventário...
                        </td>
                      </tr>
                    ) : filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center">
                          <p className="font-medium">Nenhum equipamento encontrado</p>
                          <p className="mt-2 text-slate-400">
                            Cadastre um equipamento ou ajuste os filtros.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginatedItems.map((item) => (
                        <tr key={item.id} className="transition hover:bg-white/[0.02]">
                          <td className="px-5 py-4">
                            <p className="font-semibold">{item.name}</p>
                            <p className="mt-1 text-xs text-slate-400">
                              {item.category}
                              {item.serialNumber ? ` · Série: ${item.serialNumber}` : ""}
                              {item.operatingSystem
                                ? ` · SO: ${item.operatingSystem}`
                                : ""}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-slate-300">
                            {item.assetNumber || "Não informado"}
                          </td>
                          <td className="px-5 py-4 text-slate-300">
                            {item.location || "Não informada"}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[item.status]}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-3">
                              <button
                                onClick={() => openEditForm(item)}
                                className="text-cyan-300 hover:text-cyan-200"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => deleteEquipment(item)}
                                className="text-rose-300 hover:text-rose-200"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalItems={filteredItems.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
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
            <Footer />
          </div>
        </section>
      </div>
    </main>
  );
}