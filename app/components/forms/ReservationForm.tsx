import type { Room } from "../../../types/room";
import type { Equipment } from "../../../types/equipment";

type ReservationFormProps = {
    rooms: Room[];
    equipment: Equipment[];
    resourceType: "Sala" | "Equipamento";
    resourceId: string;
    reservedBy: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
    reservationNotes: string;
    onResourceTypeChange: (value: "Sala" | "Equipamento") => void;
    onResourceIdChange: (value: string) => void;
    onReservedByChange: (value: string) => void;
    onReservationDateChange: (value: string) => void;
    onStartTimeChange: (value: string) => void;
    onEndTimeChange: (value: string) => void;
    onReservationNotesChange: (value: string) => void;
    onSubmit: () => void;
};

export default function ReservationForm({
    rooms,
    equipment,
    resourceType,
    resourceId,
    reservedBy,
    reservationDate,
    startTime,
    endTime,
    reservationNotes,
    onResourceTypeChange,
    onResourceIdChange,
    onReservedByChange,
    onReservationDateChange,
    onStartTimeChange,
    onEndTimeChange,
    onReservationNotesChange,
    onSubmit,
}: ReservationFormProps) {
    return (
        <section className="rounded-2xl border border-white/10 bg-[#101c2e] p-5 sm:p-6">
            <div className="mb-5">
                <h2 className="text-xl font-bold text-white">
                    Nova reserva
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                    Reserve uma sala ou um equipamento escolhendo a data e o horário.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm text-slate-300">
                        Tipo de recurso
                    </label>
                    <select
                        value={resourceType}
                        onChange={(event) =>
                            onResourceTypeChange(
                                event.target.value as "Sala" | "Equipamento"
                            )
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#0b1424] p-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-500"                    >
                        <option value="Sala">Sala</option>
                        <option value="Equipamento">Equipamento</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-slate-300">
                        Recurso
                    </label>
                    <select
                        value={resourceId}
                        onChange={(event) => onResourceIdChange(event.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0b1424] p-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-500"                    >
                        <option value="">Selecione um recurso</option>

                        {resourceType === "Sala"
                            ? rooms
                                .filter((room) => room.active)
                                .map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))
                            : equipment
                                .filter((item) => item.status === "Disponível")
                                .map((item) => (
                                    <option
                                        key={item.id}
                                        value={String(item.id)}
                                    >
                                        {item.name}
                                        {item.assetNumber
                                            ? ` — ${item.assetNumber}`
                                            : ""}
                                    </option>
                                ))}
                    </select>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm text-slate-300">
                        Nome de quem está reservando
                    </label>
                    <input
                        type="text"
                        value={reservedBy}
                        onChange={(event) =>
                            onReservedByChange(event.target.value)
                        }
                        placeholder="Digite seu nome"
                        className="w-full rounded-xl border border-white/10 bg-[#0b1424] p-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-500" />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-slate-300">
                        Data da reserva
                    </label>
                    <input
                        type="date"
                        value={reservationDate}
                        onChange={(event) =>
                            onReservationDateChange(event.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#0b1424] p-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-500 [&::-webkit-calendar-picker-indicator]:invert"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-slate-300">
                        Horário de início
                    </label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(event) => onStartTimeChange(event.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0b1424] p-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-500 [&::-webkit-calendar-picker-indicator]:invert" />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-slate-300">
                        Horário de término
                    </label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(event) => onEndTimeChange(event.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0b1424] p-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-500 [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
            </div>

            <div className="mt-4">
                <label className="mb-2 block text-sm text-slate-300">
                    Finalidade ou observações (opcional)
                </label>
                <textarea
                    value={reservationNotes}
                    onChange={(event) =>
                        onReservationNotesChange(event.target.value)
                    }
                    placeholder="Informe a finalidade da reserva ou alguma observação..."
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1424] p-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-500" />
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={onSubmit}
                    className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#07111f] shadow-md shadow-cyan-400/10 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/30 active:translate-y-0 active:scale-95"
                >
                    Confirmar reserva
                </button>
            </div>
        </section>
    );
}