import type { Reservation } from "../../../types/reservation";
import type { Person } from "../../../types/person";
import ReservationsTable from "../tables/ReservationsTable";

type ReservationsSectionProps = {
  reservations: Reservation[];
  people: Person[];
  ready: boolean;
  search: string;
  typeFilter: string;
  statusFilter: string;
  confirmerName: string;
  resetPageKey: string;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
  onNewReservation: () => void;
  onConfirmerChange: (value: string) => void;
  onReportReturn: (reservation: Reservation) => void;
  onConfirmReturn: (
    reservation: Reservation,
    confirmerName: string
  ) => void;
  onCancel: (reservation: Reservation) => void;
};

export default function ReservationsSection({
  reservations,
  people,
  ready,
  search,
  typeFilter,
  statusFilter,
  confirmerName,
  resetPageKey,
  onSearchChange,
  onTypeFilterChange,
  onStatusFilterChange,
  onClearFilters,
  onNewReservation,
  onConfirmerChange,
  onReportReturn,
  onConfirmReturn,
  onCancel,
}: ReservationsSectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#101c2e] p-5 sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-white">
            Reservas realizadas
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Consulte os horários e os recursos reservados.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewReservation}
          className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#07111f] shadow-md shadow-cyan-400/10 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/30 active:translate-y-0 active:scale-95"
        >
          + Realizar reserva
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Pesquisar pessoa ou recurso..."
          aria-label="Pesquisar reservas por pessoa ou recurso"
          className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-500"
        />

        <select
          value={typeFilter}
          onChange={(event) => onTypeFilterChange(event.target.value)}
          aria-label="Filtrar reservas por tipo de recurso"
          className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
        >
          <option value="Todos">Todos os recursos</option>
          <option value="Sala">Salas</option>
          <option value="Equipamento">Equipamentos</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          aria-label="Filtrar reservas por status"
          className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
        >
          <option value="Todos">Todos os status</option>
          <option value="Agendada">Agendada</option>
          <option value="Em utilização">Em utilização</option>
          <option value="Concluída">Concluída</option>
          <option value="Atraso na devolução">Atraso na devolução</option>
          <option value="Devolução informada">Devolução informada</option>
          <option value="Cancelada">Cancelada</option>
        </select>

        <button
          type="button"
          onClick={onClearFilters}
          className="rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          Limpar filtros
        </button>
      </div>

      <p className="mb-4 text-sm text-slate-400">
        {reservations.length}{" "}
        {reservations.length === 1
          ? "reserva encontrada"
          : "reservas encontradas"}
      </p>

      {!ready ? (
        <p className="py-6 text-center text-sm text-slate-400">
          Carregando reservas...
        </p>
      ) : reservations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
          <p className="font-medium text-white">
            Nenhuma reserva encontrada
          </p>
          <p className="mt-2 text-sm text-slate-400">
            As reservas confirmadas aparecerão aqui.
          </p>
        </div>
      ) : (
        <ReservationsTable
          reservations={reservations}
          people={people}
          confirmerName={confirmerName}
          onConfirmerChange={onConfirmerChange}
          onReportReturn={onReportReturn}
          onConfirmReturn={onConfirmReturn}
          onCancel={onCancel}
          resetPageKey={resetPageKey}
        />
      )}
    </section>
  );
}