"use client";

import type { Room } from "../../../types/room";
import EditButton from "../buttons/EditButton";
import ToggleStatusButton from "../buttons/ToggleStatusButton";

type RoomsTableProps = {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onToggleStatus: (room: Room) => void;
};

export default function RoomsTable({
  rooms,
  onEdit,
  onToggleStatus,
}: RoomsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-slate-400">
            <th className="px-4 py-3 font-medium">Sala</th>
            <th className="px-4 py-3 font-medium">Localização</th>
            <th className="px-4 py-3 font-medium">Capacidade</th>
            <th className="px-4 py-3 font-medium">Situação</th>
            <th className="px-4 py-3 text-right font-medium">
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          {rooms.map((room) => (
            <tr
              key={room.id}
              className="border-b border-white/5 transition-colors duration-200 hover:bg-white/[0.08]"
            >
              <td className="px-4 py-4 font-medium">
                {room.name}
              </td>

              <td className="px-4 py-4 text-slate-300">
                {room.location}
              </td>

              <td className="px-4 py-4">
                {room.capacity} pessoas
              </td>

              <td className="px-4 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${room.active
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-slate-700 text-slate-300"
                    }`}
                >
                  {room.active ? "Ativa" : "Inativa"}
                </span>
              </td>

              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <EditButton onClick={() => onEdit(room)} />

                  <ToggleStatusButton
                    active={room.active}
                    onClick={() => onToggleStatus(room)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
