"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Cards from "../components/Cards";
import BackToDashboard from "../components/buttons/BackToDashboard";
import PersonModal from "../components/modals/PersonModal";
import PeopleTable from "../components/tables/PeopleTable";
import type { Person, PersonRole } from "../../types/person";

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
                        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <BackToDashboard />

                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                                    VR STUDIO LAB
                                </p>

                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    Pessoas
                                </h1>

                                <p className="mt-2 text-sm text-slate-400">
                                    Cadastro central de usuários do laboratório.
                                </p>
                            </div>


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


                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <input
                                        className={`${inputClass} sm:w-64 sm:flex-none`}
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Buscar nome, função ou setor..."
                                        aria-label="Buscar pessoas"
                                    />

                                    <select
                                        className={`${inputClass} sm:w-64 sm:flex-none`}
                                        value={filter}
                                        onChange={(event) => setFilter(event.target.value)}
                                        aria-label="Filtrar pessoas por situação"
                                    >
                                        <option value="Todas">Todas as pessoas</option>
                                        <option value="Ativas">Somente ativas</option>
                                        <option value="Inativas">Somente inativas</option>
                                    </select>

                                    <button
                                        type="button"
                                        onClick={openNewForm}
                                        className="whitespace-nowrap rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f] shadow-md shadow-cyan-400/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/30 active:translate-y-0 active:scale-95"
                                    >
                                        + Cadastrar pessoa
                                    </button>
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
                                <div className="p-5">
                                    <PeopleTable
                                        people={paginatedPeople}
                                        currentPage={currentPage}
                                        itemsPerPage={itemsPerPage}
                                        totalItems={filteredPeople.length}
                                        onEdit={openEditForm}
                                        onToggleStatus={togglePersonStatus}
                                        onPageChange={setCurrentPage}
                                    />
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

            <PersonModal
                open={showForm}
                editing={editingId !== null}
                form={form}
                roles={roles}
                inputClass={inputClass}
                onFormChange={(field, value) =>
                    setForm((current) => ({
                        ...current,
                        [field]: value,
                    }))
                }
                onSubmit={savePerson}
                onClose={() => setShowForm(false)}
            />

        </main>
    );
}