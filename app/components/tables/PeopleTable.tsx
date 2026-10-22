"use client";

import { Pagination } from "../Pagination";
import EditButton from "../buttons/EditButton";
import ToggleStatusButton from "../buttons/ToggleStatusButton";
import type { Person } from "../../../types/person";

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
                                            <EditButton onClick={() => onEdit(person)} />

                                            <ToggleStatusButton
                                                active={person.active}
                                                onClick={() => onToggleStatus(person.id)}
                                            />
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