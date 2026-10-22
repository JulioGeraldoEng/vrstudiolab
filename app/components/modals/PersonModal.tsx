"use client";

import type { PersonRole } from "../../../types/person";

type PersonFormData = {
    name: string;
    role: PersonRole;
    sector: string;
    contact: string;
    phone: string;
    email: string;
};

type PersonModalProps = {
    open: boolean;
    editing: boolean;
    form: PersonFormData;
    roles: PersonRole[];
    inputClass: string;
    onFormChange: (field: keyof PersonFormData, value: string) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onClose: () => void;
};

function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length === 0) return "";
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function PersonModal({
    open,
    editing,
    form,
    roles,
    inputClass,
    onFormChange,
    onSubmit,
    onClose,
}: PersonModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="person-modal-title"
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#151e30] p-5 shadow-2xl sm:p-6"
            >
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h2 id="person-modal-title" className="text-xl font-semibold">
                            {editing ? "Editar pessoa" : "Cadastrar pessoa"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Preencha os dados da pessoa.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white"
                        aria-label="Fechar formulário"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Nome completo *
                        </label>
                        <input
                            className={inputClass}
                            value={form.name}
                            onChange={(event) => onFormChange("name", event.target.value)}
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
                                onChange={(event) => onFormChange("role", event.target.value)}
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
                                onChange={(event) => onFormChange("sector", event.target.value)}
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
                                    onFormChange("phone", formatPhone(event.target.value))
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
                                onChange={(event) => onFormChange("email", event.target.value)}
                                placeholder="Ex.: nome@instituicao.com"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f] hover:bg-cyan-300"
                        >
                            {editing ? "Salvar alterações" : "Cadastrar pessoa"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
