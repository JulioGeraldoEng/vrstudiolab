"use client";

import type { Equipment } from "../../../types/equipment";
import type { Person } from "../../../types/person";
import CloseModalButton from "../buttons/CloseModalButton";

type MaintenanceModalProps = {
  open: boolean;
  equipmentId: string;
  problem: string;
  assignedPersonId: string;
  inventory: Pick<Equipment, "id" | "name" | "assetNumber" | "status">[];
  people: Person[];
  inputClass: string;
  onEquipmentChange: (value: string) => void;
  onProblemChange: (value: string) => void;
  onPersonChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function MaintenanceModal({
  open,
  equipmentId,
  problem,
  assignedPersonId,
  inventory,
  people,
  inputClass,
  onEquipmentChange,
  onProblemChange,
  onPersonChange,
  onSubmit,
  onClose,
}: MaintenanceModalProps) {
  if (!open) return null;

  const activePeople = people.filter((person) => person.active);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="maintenance-modal-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-blue-400/20 bg-[#151e30] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="maintenance-modal-title"
            className="text-xl font-semibold"
          >
            Nova ordem de serviço
          </h2>

          <CloseModalButton
            onClose={onClose}
            ariaLabel="Fechar formulário de reserva"
          />
        </div>

        <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Equipamento do inventário
            </label>

            <select
              className={inputClass}
              value={equipmentId}
              onChange={(event) => onEquipmentChange(event.target.value)}
              required
            >
              <option value="">Selecione um equipamento</option>

              {inventory
                .filter((item) => item.status !== "Baixado")
                .map((item) => (
                  <option key={item.id} value={String(item.id)}>
                    {item.name} — {item.assetNumber || "Sem patrimônio"}
                  </option>
                ))}
            </select>

            {inventory.length === 0 && (
              <p className="mt-2 text-xs text-amber-300">
                Nenhum equipamento carregado. Cadastre ou confira os itens
                no inventário.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Responsável pelo atendimento
            </label>

            <select
              className={inputClass}
              value={assignedPersonId}
              onChange={(event) => onPersonChange(event.target.value)}
              required
            >
              <option value="">Selecione uma pessoa cadastrada</option>

              {activePeople.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name} — {person.role}
                </option>
              ))}
            </select>

            {activePeople.length === 0 && (
              <p className="mt-2 text-sm text-amber-300">
                Cadastre uma pessoa ativa antes de abrir uma ordem.
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">
              Descrição do problema
            </label>

            <textarea
              className={inputClass}
              value={problem}
              onChange={(event) => onProblemChange(event.target.value)}
              placeholder="Descreva o defeito ou serviço necessário"
              rows={3}
              required
            />
          </div>

          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-[#07111f] hover:bg-cyan-300"
            >
              Criar ordem
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/5"
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
