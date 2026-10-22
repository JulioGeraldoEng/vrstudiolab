
"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Room } from "../../../types/room";

type RoomFormData = Omit<Room, "id">;

type RoomModalProps = {
  room?: Room | null;
  onSave: (data: RoomFormData) => void;
  onClose: () => void;
};

export default function RoomModal({
  room,
  onSave,
  onClose,
}: RoomModalProps) {
  const [form, setForm] = useState<RoomFormData>({
    name: "",
    location: "",
    capacity: 1,
    active: true,
  });

  useEffect(() => {
    if (room) {
      setForm({
        name: room.name,
        location: room.location,
        capacity: room.capacity,
        active: room.active,
      });
    } else {
      setForm({
        name: "",
        location: "",
        capacity: 1,
        active: true,
      });
    }
  }, [room]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const location = form.location.trim();

    if (!name || !location || form.capacity < 1) {
      return;
    }

    onSave({
      name,
      location,
      capacity: form.capacity,
      active: form.active,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">
            {room ? "Editar sala" : "Cadastrar sala"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="room-name"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Nome da sala
            </label>

            <input
              id="room-name"
              type="text"
              required
              maxLength={100}
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              placeholder="Ex.: Laboratório de Realidade Virtual"
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            />
          </div>

          <div>
            <label
              htmlFor="room-location"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Localização
            </label>

            <input
              id="room-location"
              type="text"
              required
              maxLength={150}
              value={form.location}
              onChange={(event) =>
                setForm({ ...form, location: event.target.value })
              }
              placeholder="Ex.: Bloco B, sala 12"
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            />
          </div>

          <div>
            <label
              htmlFor="room-capacity"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Capacidade máxima de pessoas
            </label>

            <input
              id="room-capacity"
              type="number"
              required
              min={1}
              step={1}
              value={form.capacity}
              onChange={(event) =>
                setForm({
                  ...form,
                  capacity: Number(event.target.value),
                })
              }
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-800/60 p-4">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) =>
                setForm({ ...form, active: event.target.checked })
              }
              className="h-4 w-4 accent-cyan-500"
            />

            <span className="text-sm text-slate-200">
              Sala ativa — pode receber novas reservas
            </span>
          </label>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-xl bg-cyan-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
            >
              {room ? "Salvar alterações" : "Cadastrar sala"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
