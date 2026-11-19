"use client";

import type { FormEvent } from "react";
import type { Equipment } from "../../../types/equipment";
import type { Person } from "../../../types/person";
import CloseModalButton from "../buttons/CloseModalButton";

type MaintenanceRequestModalProps = {
  open: boolean;
  equipmentId: string;
  problem: string;
  requestedByPersonId: string;
  inventory: Pick<
    Equipment,
    "id" | "name" | "assetNumber" | "status"
  >[];
  people: Person[];
  inputClass: string;
  onEquipmentChange: (value: string) => void;
  onProblemChange: (value: string) => void;
  onRequesterChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function MaintenanceRequestModal({
  open,
  equipmentId,
  problem,
  requestedByPersonId,
  inventory,
  people,
  inputClass,
  onEquipmentChange,
  onProblemChange,
  onRequesterChange,
  onSubmit,
  onClose,
}: MaintenanceRequestModalProps) {
  if (!open) return null;

  const activePeople = people.filter((person) => person.active);

  const availableEquipment = inventory.filter(
    (item) =>
      item.status !== "Baixado" &&
      item.status !== "Manutenção"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="maintenance-request-modal-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-blue-400/20 bg-[#151e30] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="maintenance-request-modal-title"
            className="text-xl font-semibold"
          >
            Solicitar manutenção
          </h2>

          <CloseModalButton
            onClose={onClose}
            ariaLabel="Fechar solicitação de manutenção"
          />
        </div>

        <form onSubmit={onSubmit} className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Equipamento
            </label>

            <select
              className={inputClass}
              value={equipmentId}
              onChange={(event) =>
                onEquipmentChange(event.target.value)
              }
              required
            >
              <option value="">Selecione um equipamento</option>

              {availableEquipment.map((item) => (
                <option key={item.id} value={String(item.id)}>
                  {item.name} — {item.assetNumber || "Sem patrimônio"}
                </option>
              ))}
            </select>

            {availableEquipment.length === 0 && (
              <p className="mt-2 text-xs text-amber-300">
                Não há equipamentos disponíveis para solicitação.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Pessoa que está solicitando
            </label>

            <select
              className={inputClass}
              value={requestedByPersonId}
              onChange={(event) =>
                onRequesterChange(event.target.value)
              }
              required
            >
              <option value="">Selecione o solicitante</option>

              {activePeople.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name} — {person.role}
                </option>
              ))}
            </select>

            {activePeople.length === 0 && (
              <p className="mt-2 text-xs text-amber-300">
                Cadastre uma pessoa ativa antes de solicitar manutenção.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Descrição do problema
            </label>

            <textarea
              className={inputClass}
              value={problem}
              onChange={(event) =>
                onProblemChange(event.target.value)
              }
              placeholder="Descreva o defeito ou problema identificado"
              rows={4}
              required
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-[#07111f] hover:bg-cyan-300"
            >
              Enviar solicitação
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