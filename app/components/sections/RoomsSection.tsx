import type { Room } from "../../../types/room";
import RoomsTable from "../tables/RoomsTable";

type RoomsSectionProps = {
  rooms: Room[];
  ready: boolean;
  onNewRoom: () => void;
  onEditRoom: (room: Room) => void;
  onToggleStatus: (room: Room) => void;
};

export default function RoomsSection({
  rooms,
  ready,
  onNewRoom,
  onEditRoom,
  onToggleStatus,
}: RoomsSectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#101c2e] p-5 sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-white">
            Salas cadastradas
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Gerencie as salas e seus estados de funcionamento.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewRoom}
          className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#07111f] shadow-md shadow-cyan-400/10 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/30 active:translate-y-0 active:scale-95"
        >
          + Cadastrar sala
        </button>
      </div>

      {!ready ? (
        <p className="py-6 text-center text-sm text-slate-400">
          Carregando salas...
        </p>
      ) : rooms.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          Nenhuma sala cadastrada.
        </p>
      ) : (
        <RoomsTable
          rooms={rooms}
          onEdit={onEditRoom}
          onToggleStatus={onToggleStatus}
        />
      )}
    </section>
  );
}