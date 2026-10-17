"use client";

import { Pagination } from "./Pagination";

export type PersonRole =
    | "Aluno"
    | "Técnico"
    | "Responsável autorizado"
    | "Professor"
    | "Gestor"
    | "Colaborador";

export type Person = {
    id: string;
    name: string;
    role: PersonRole;
    sector?: string;
    contact?: string;
    phone?: string;
    email?: string;
    active: boolean;
};

type PeopleTableProps = {
    people: Person[];
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    onEdit: (person: Person) => void;
    onToggleStatus: (id: string) => void;
    onPageChange: (page: number) => void;
    showActions?: boolean;
};

export default function PeopleTable({
    people,
    currentPage,
    itemsPerPage,
    totalItems,
    onEdit,
    onToggleStatus,
    onPageChange,
    showActions = true,
}: PeopleTableProps) {
    return (
        <>
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
                            {showActions && (
                                <th className="...">Ações</th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-white/5">
                        {people.map((person) => (
                            <tr
                                key={person.id}
                                className="transition-colors duration-200 hover:bg-white/[0.08]"
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

                                {showActions && (
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(person)}
                                                className="text-cyan-300 transition-colors hover:text-cyan-200"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onToggleStatus(person.id)
                                                }
                                                className={
                                                    person.active
                                                        ? "text-amber-300 transition-colors hover:text-amber-200"
                                                        : "text-emerald-300 transition-colors hover:text-emerald-200"
                                                }
                                            >
                                                {person.active ? "Inativar" : "Ativar"}
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
            />
        </>
    );
}