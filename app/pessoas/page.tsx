"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Cards from "../components/Cards";
import { Pagination } from "../components/Pagination";

type PersonRole =
    | "Aluno"
    | "Técnico"
    | "Responsável autorizado"
    | "Professor"
    | "Gestor"
    | "Colaborador";

type Person = {
    id: string;
    name: string;
    role: PersonRole;
    sector?: string;
    contact?: string;
    phone?: string;
    email?: string;
    active: boolean;
};

const PEOPLE_STORAGE_KEY = "vrstudiolab-maintenance-people-v1";

const roles: PersonRole[] = [
    "Aluno",
    "Técnico",
    "Responsável autorizado",
    "Professor",
    "Gestor",
    "Colaborador",
];

const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400";

const emptyForm = {
    name: "",
    role: "Aluno" as PersonRole,
    sector: "",
    contact: "",
    phone: "",
    email: "",
};

export default function PessoasPage() {
    const [people, setPeople] = useState<Person[]>([]);
    const [ready, setReady] = useState(false);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [filter, setFilter] = useState("Todas");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        try {
            const savedPeople = localStorage.getItem(PEOPLE_STORAGE_KEY);

            if (savedPeople) {
                const parsed: unknown = JSON.parse(savedPeople);

                if (Array.isArray(parsed)) {
                    const migratedPeople: Person[] = parsed.map((item) => {
                        const legacyContact =
                            typeof item.contact === "string" ? item.contact.trim() : "";

                        return {
                            ...item,
                            sector: typeof item.sector === "string" ? item.sector : "",
                            contact: typeof item.contact === "string" ? item.contact : "",
                            phone:
                                typeof item.phone === "string"
                                    ? item.phone
                                    : legacyContact.includes("@")
                                        ? ""
                                        : legacyContact,
                            email:
                                typeof item.email === "string"
                                    ? item.email
                                    : legacyContact.includes("@")
                                        ? legacyContact
                                        : "",
                            active: item.active !== false,
                        };
                    });

                    setPeople(migratedPeople);
                }
            }
        } catch (error) {
            console.error("Erro ao carregar pessoas:", error);
            alert(
                "Não foi possível carregar os cadastros. Confira os dados salvos antes de continuar."
            );
        } finally {
            setReady(true);
        }
    }, []);

    useEffect(() => {
        if (!ready) return;

        try {
            localStorage.setItem(
                PEOPLE_STORAGE_KEY,
                JSON.stringify(people)
            );
        } catch (error) {
            console.error("Erro ao salvar pessoas:", error);
            alert("Não foi possível salvar os cadastros neste navegador.");
        }
    }, [people, ready]);

    function openNewForm() {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(true);
    }

    function openEditForm(person: Person) {
        setForm({
            name: person.name,
            role: person.role,
            sector: person.sector ?? "",
            contact: person.contact ?? "",
            phone: person.phone ?? "",
            email: person.email ?? "",
        });
        setEditingId(person.id);
        setShowForm(true);
    }

    function savePerson(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const name = form.name.trim();

        if (!name) {
            alert("Informe o nome completo.");
            return;
        }

        const duplicate = people.some(
            (person) =>
                person.id !== editingId &&
                person.name.trim().toLowerCase() === name.toLowerCase()
        );

        if (duplicate) {
            alert("Já existe uma pessoa cadastrada com esse nome.");
            return;
        }

        if (editingId) {
            setPeople((current) =>
                current.map((person) =>
                    person.id === editingId
                        ? {
                            ...person,
                            name,
                            role: form.role,
                            sector: form.sector.trim(),
                            contact: person.contact ?? "",
                            phone: form.phone.trim(),
                            email: form.email.trim(),
                        }
                        : person
                )
            );
        } else {
            const newPerson: Person = {
                id: crypto.randomUUID(),
                name,
                role: form.role,
                sector: form.sector.trim(),
                contact: "",
                phone: form.phone.trim(),
                email: form.email.trim(),
                active: true,
            };

            setPeople((current) => [...current, newPerson]);
        }

        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    }

    function togglePersonStatus(id: string) {
        setPeople((current) =>
            current.map((person) =>
                person.id === id
                    ? { ...person, active: !person.active }
                    : person
            )
        );
    }

    const filteredPeople = people.filter((person) => {
        const searchText =
            `${person.name} ${person.role} ${person.sector ?? ""} ${person.phone ?? ""} ${person.email ?? ""} ${person.contact ?? ""}`.toLowerCase();

        const matchesSearch = searchText.includes(search.toLowerCase());

        const matchesFilter =
            filter === "Todas" ||
            (filter === "Ativas" && person.active) ||
            (filter === "Inativas" && !person.active);

        return matchesSearch && matchesFilter;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filter]);

    const paginatedPeople = filteredPeople.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const activeCount = people.filter((person) => person.active).length;
    const inactiveCount = people.length - activeCount;

    if (!ready) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#0b1120] text-slate-300">
                Carregando pessoas...
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0b1120] text-white">
            <div className="flex min-h-screen w-full flex-col lg:flex-row">
                <Sidebar activePage="Pessoas" />

                <section className="min-w-0 flex-1 p-4 sm:p-8">
                    <div className="mx-auto max-w-7xl space-y-8">
                        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div>
                                <a
                                    href="/"
                                    className="mb-3 inline-flex text-sm text-cyan-300 hover:text-cyan-200"
                                >
                                    ← Voltar ao Dashboard
                                </a>

                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                                    VR STUDIO LAB / GESTÃO
                                </p>

                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    Pessoas
                                </h1>

                                <p className="mt-2 text-sm text-slate-400">
                                    Cadastro central de usuários do laboratório.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={openNewForm}
                                className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f] transition hover:bg-cyan-300"
                            >
                                + Cadastrar pessoa
                            </button>
                        </header>

                        {/* Cards padronizados unificados */}
                        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <Cards
                                title="Total de pessoas"
                                value={people.length}
                                detail="Usuários cadastrados"
                                icon="👤"
                                color="text-cyan-300"
                                bg="bg-cyan-400/10"
                            />
                            <Cards
                                title="Pessoas ativas"
                                value={activeCount}
                                detail="Com acesso liberado"
                                icon="✓"
                                color="text-emerald-300"
                                bg="bg-emerald-400/10"
                            />
                            <Cards
                                title="Pessoas inativas"
                                value={inactiveCount}
                                detail="Cadastros inativados"
                                icon="✕"
                                color="text-amber-300"
                                bg="bg-amber-400/10"
                            />
                        </section>

                        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#151e30]">
                            <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Cadastro de pessoas
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-400">
                                        {filteredPeople.length} registro(s) encontrado(s)
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <input
                                        className={inputClass}
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Buscar nome, função ou setor..."
                                        aria-label="Buscar pessoas"
                                    />

                                    <select
                                        className={inputClass}
                                        value={filter}
                                        onChange={(event) => setFilter(event.target.value)}
                                        aria-label="Filtrar pessoas por situação"
                                    >
                                        <option value="Todas">Todas as pessoas</option>
                                        <option value="Ativas">Somente ativas</option>
                                        <option value="Inativas">Somente inativas</option>
                                    </select>
                                </div>
                            </div>

                            {filteredPeople.length === 0 ? (
                                <div className="px-6 py-16 text-center">
                                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-300">
                                        ♙
                                    </div>

                                    <h3 className="font-semibold">
                                        {people.length === 0
                                            ? "Nenhuma pessoa cadastrada"
                                            : "Nenhum resultado encontrado"}
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-400">
                                        {people.length === 0
                                            ? "Cadastre a primeira pessoa para começar."
                                            : "Tente alterar a pesquisa ou o filtro."}
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[760px] text-left text-sm">
                                        <thead className="bg-white/[0.03] text-xs uppercase text-slate-400">
                                            <tr>
                                                <th className="px-5 py-4">Nome</th>
                                                <th className="px-5 py-4">Função</th>
                                                <th className="px-5 py-4">Setor</th>
                                                <th className="px-5 py-4">Telefone</th>
                                                <th className="px-5 py-4">E-mail</th>
                                                <th className="px-5 py-4">Situação</th>
                                                <th className="px-5 py-4">Ações</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-white/5">
                                            {paginatedPeople.map((person) => (
                                                <tr
                                                    key={person.id}
                                                    className="transition hover:bg-white/[0.02]"
                                                >
                                                    <td className="px-5 py-4 font-medium">
                                                        {person.name}
                                                    </td>

                                                    <td className="px-5 py-4 text-slate-300">
                                                        {person.role}
                                                    </td>

                                                    <td className="px-5 py-4 text-slate-300">
                                                        {person.sector || "—"}
                                                    </td>

                                                    <td className="px-5 py-4 text-slate-300">
                                                        {person.phone || "—"}
                                                    </td>

                                                    <td className="px-5 py-4 text-slate-300">
                                                        {person.email || "—"}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full border px-3 py-1 text-xs ${person.active
                                                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                                                : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                                                                }`}
                                                        >
                                                            {person.active ? "Ativa" : "Inativa"}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditForm(person)}
                                                                className="text-cyan-300 hover:text-cyan-200"
                                                            >
                                                                Editar
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => togglePersonStatus(person.id)}
                                                                className={
                                                                    person.active
                                                                        ? "text-amber-300 hover:text-amber-200"
                                                                        : "text-emerald-300 hover:text-emerald-200"
                                                                }
                                                            >
                                                                {person.active ? "Inativar" : "Ativar"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                            )}
                            
                        </section>

                        <p className="text-xs text-slate-500">
                            VR Studio Lab · Cadastro de pessoas · Dados salvos neste navegador
                        </p>

                        <Footer />
                    </div>
                </section>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#151e30] p-5 shadow-2xl sm:p-6">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {editingId ? "Editar pessoa" : "Cadastrar pessoa"}
                                </h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    Preencha os dados da pessoa.
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

                        <form onSubmit={savePerson} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Nome completo *
                                </label>
                                <input
                                    className={inputClass}
                                    value={form.name}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            name: event.target.value,
                                        }))
                                    }
                                    placeholder="Digite o nome completo"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm text-slate-300">
                                        Função *
                                    </label>
                                    <select
                                        className={inputClass}
                                        value={form.role}
                                        onChange={(event) =>
                                            setForm((current) => ({
                                                ...current,
                                                role: event.target.value as PersonRole,
                                            }))
                                        }
                                        required
                                    >
                                        {roles.map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-slate-300">
                                        Setor / departamento
                                    </label>
                                    <input
                                        className={inputClass}
                                        value={form.sector}
                                        onChange={(event) =>
                                            setForm((current) => ({
                                                ...current,
                                                sector: event.target.value,
                                            }))
                                        }
                                        placeholder="Ex.: Laboratório de informática"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm text-slate-300">
                                        Telefone
                                    </label>
                                    <input
                                        className={inputClass}
                                        type="tel"
                                        value={form.phone}
                                        onChange={(event) =>
                                            setForm((current) => ({
                                                ...current,
                                                phone: event.target.value,
                                            }))
                                        }
                                        placeholder="Ex.: (18) 99999-9999"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-slate-300">
                                        E-mail
                                    </label>
                                    <input
                                        className={inputClass}
                                        type="email"
                                        value={form.email}
                                        onChange={(event) =>
                                            setForm((current) => ({
                                                ...current,
                                                email: event.target.value,
                                            }))
                                        }
                                        placeholder="Ex.: nome@instituicao.com"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-5">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f] hover:bg-cyan-300"
                                >
                                    {editingId ? "Salvar alterações" : "Cadastrar pessoa"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </main>
    );
}