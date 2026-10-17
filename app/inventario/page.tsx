"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Sidebar from "../components/Sidebar";
import Cards from "../components/Cards";
import EquipmentModal from "../components/EquipmentModal";
import Footer from "../components/Footer";
import BackToDashboard from "../components/BackToDashboard";
import InventoryTable from "../components/InventoryTable";

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
    <main className="min-h-screen bg-[#0b1120] text-white">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <Sidebar activePage="Equipamentos" />

        <section className="min-w-0 flex-1 p-4 sm:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <BackToDashboard />
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                  VR STUDIO LAB
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Inventário
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  Gerencie equipamentos, patrimônio e localização.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={openNewForm}
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f] shadow-md shadow-cyan-400/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/30 active:translate-y-0 active:scale-95"
                >
                  + Novo equipamento
                </button>
              </div>
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

              <InventoryTable
                items={paginatedItems}
                ready={ready}
                onEdit={openEditForm}
                onDelete={deleteEquipment}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredItems.length}
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