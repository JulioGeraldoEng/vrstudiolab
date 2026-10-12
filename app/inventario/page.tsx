
"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

type Status = "Disponível" | "Em uso" | "Manutenção" | "Baixado";

type Equipment = {
  id: number;
  name: string;
  category: string;
  assetNumber: string;
  serialNumber: string;
  location: string;
  status: Status;
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
  notes: "",
};

const categories = [
  "Óculos VR",
  "Computadores",
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

  useEffect(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    let savedItems: Equipment[] = [];

    if (saved !== null) {
      const parsed: unknown = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        savedItems = parsed as Equipment[];
      }
    }

    const initialEquipment: Equipment[] = [
      {
        id: 1,
        name: "Meta Quest 3",
        category: "Óculos VR",
        assetNumber: "PAT-001",
        serialNumber: "",
        location: "Armário A1",
        status: "Disponível",
        notes: "",
      },
      {
        id: 2,
        name: "Meta Quest 2",
        category: "Óculos VR",
        assetNumber: "Sem patrimônio",
        serialNumber: "",
        location: "Sala VR",
        status: "Em uso",
        notes: "",
      },
      {
        id: 3,
        name: "Notebook de Alto Desempenho",
        category: "Computadores",
        assetNumber: "PAT-003",
        serialNumber: "",
        location: "Bancada 01",
        status: "Disponível",
        notes: "",
      },
      {
        id: 4,
        name: "Controle VR",
        category: "Acessórios",
        assetNumber: "PAT-004",
        serialNumber: "",
        location: "Armário A2",
        status: "Manutenção",
        notes: "",
      },
    ];

    const existingNames = new Set(
      savedItems.map((item) => item.name.toLowerCase())
    );

    const existingIds = new Set(savedItems.map((item) => item.id));

    let nextId = Math.max(
      Date.now(),
      ...savedItems.map((item) => item.id + 1),
      1
    );

    const missingEquipment = initialEquipment
      .filter(
        (item) => !existingNames.has(item.name.toLowerCase())
      )
      .map((item) => ({
        ...item,
        id: existingIds.has(item.id) ? nextId++ : item.id,
      }));

    const mergedItems = [...savedItems, ...missingEquipment];

    setItems(mergedItems);

    if (saved === null || missingEquipment.length > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(mergedItems)
      );
    }
  } catch (error) {
    console.error("Não foi possível carregar o inventário salvo.", error);
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

        // Salva os dados no navegador antes de fechar o formulário.
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
    <main className="min-h-screen bg-[#07111f] text-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <a
              href="/"
              className="mb-3 inline-flex text-sm text-cyan-300 hover:text-cyan-200"
            >
              ← Voltar ao Dashboard
            </a>
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
          {[
            { label: "Total de equipamentos", value: items.length },
            { label: "Disponíveis", value: available },
            { label: "Em uso", value: inUse },
            { label: "Em manutenção", value: maintenance },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-white/10 bg-[#101c2e] p-5"
            >
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="mt-3 text-3xl font-bold">{card.value}</p>
            </div>
          ))}
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
                  filteredItems.map((item) => (
                    <tr key={item.id} className="transition hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <p className="font-semibold">{item.name}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.category}
                          {item.serialNumber ? ` · Série: ${item.serialNumber}` : ""}
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

          <div className="border-t border-white/10 px-5 py-4 text-xs text-slate-400">
            Exibindo {filteredItems.length} de {items.length} equipamentos
          </div>
        </section>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="equipment-form-title"
              className="my-6 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#101c2e] p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 id="equipment-form-title" className="text-xl font-bold">
                    {editingId !== null ? "Editar equipamento" : "Novo equipamento"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Preencha os dados do equipamento.
                  </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-lg px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white"
                    aria-label="Fechar formulário"
                >
                    ✕
                </button>
              </div>

              <form onSubmit={saveEquipment} className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="equipment-name" className="mb-2 block text-sm text-slate-300">
                    Nome do equipamento *
                  </label>
                  <input
                    id="equipment-name"
                    required
                    autoFocus
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Ex.: Meta Quest 3"
                    className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label htmlFor="equipment-category" className="mb-2 block text-sm text-slate-300">
                    Categoria *
                  </label>
                  <select
                    id="equipment-category"
                    value={form.category}
                    onChange={(event) => setForm({ ...form, category: event.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm outline-none focus:border-cyan-400"
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="equipment-status" className="mb-2 block text-sm text-slate-300">
                    Status
                  </label>
                  <select
                    id="equipment-status"
                    value={form.status}
                    onChange={(event) => setForm({ ...form, status: event.target.value as Status })}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm outline-none focus:border-cyan-400"
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="equipment-asset" className="mb-2 block text-sm text-slate-300">
                    Número patrimonial
                  </label>
                  <input
                    id="equipment-asset"
                    value={form.assetNumber}
                    onChange={(event) => setForm({ ...form, assetNumber: event.target.value })}
                    placeholder="Ex.: PAT-001"
                    className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label htmlFor="equipment-serial" className="mb-2 block text-sm text-slate-300">
                    Número de série
                  </label>
                  <input
                    id="equipment-serial"
                    value={form.serialNumber}
                    onChange={(event) => setForm({ ...form, serialNumber: event.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="equipment-location" className="mb-2 block text-sm text-slate-300">
                    Localização
                  </label>
                  <input
                    id="equipment-location"
                    value={form.location}
                    onChange={(event) => setForm({ ...form, location: event.target.value })}
                    placeholder="Ex.: Armário A1"
                    className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="equipment-notes" className="mb-2 block text-sm text-slate-300">
                    Observações
                  </label>
                  <textarea
                    id="equipment-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(event) => setForm({ ...form, notes: event.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex gap-3 pt-2 sm:col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/5"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-[#07111f] hover:bg-cyan-300"
                  >
                    {editingId !== null ? "Salvar alterações" : "Cadastrar equipamento"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
