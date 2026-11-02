"use client";

import { useEffect, useState } from "react";
import type { Reservation } from "../../../types/reservation";
import { RESERVATIONS_STORAGE_KEY } from "../../reservations/storage";
import type { MaintenanceOrder } from "../../../types/maintenance";

export default function CalendarSection() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showRooms, setShowRooms] = useState(true);
    const [showEquipment, setShowEquipment] = useState(true);
    const [showMaintenance, setShowMaintenance] = useState(true);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [maintenanceOrders, setMaintenanceOrders] = useState<MaintenanceOrder[]>([]);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceOrder | null>(null);

    useEffect(() => {
        const savedReservations = localStorage.getItem(RESERVATIONS_STORAGE_KEY);

        if (savedReservations) {
            try {
                const parsedReservations = JSON.parse(savedReservations);

                if (Array.isArray(parsedReservations)) {
                    setReservations(parsedReservations);
                }
            } catch (error) {
                console.error("Erro ao carregar reservas:", error);
            }
        }
        const savedMaintenance = localStorage.getItem("vrstudiolab-maintenance-v1");

        if (savedMaintenance) {
            try {
                const parsedMaintenance = JSON.parse(savedMaintenance);

                if (Array.isArray(parsedMaintenance)) {
                    setMaintenanceOrders(parsedMaintenance);
                }
            } catch (error) {
                console.error("Erro ao carregar ordens de serviço:", error);
            }
        }
    }, []);

    function changeWeek(amount: number) {
        setCurrentDate((current) => {
            const next = new Date(current);
            next.setDate(next.getDate() + amount * 7);
            return next;
        });
    }

    function goToToday() {
        setCurrentDate(new Date());
    }

    function getWeekDays(date: Date) {
        const current = new Date(date);
        const day = current.getDay();

        const mondayOffset = day === 0 ? -6 : 1 - day;

        current.setDate(current.getDate() + mondayOffset);

        return Array.from({ length: 6 }, (_, index) => {
            const next = new Date(current);
            next.setDate(current.getDate() + index);
            return next;
        });
    }

    function formatDate(date: Date) {
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
        });
    }

    const weekDays = getWeekDays(currentDate);

    function dateToLocalString(date: Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function isReservationInHour(
        reservation: Reservation,
        date: Date,
        hour: number,
    ) {
        const day = dateToLocalString(date);

        const slotStart = `${String(hour).padStart(2, "0")}:00`;
        const slotEnd = `${String(hour + 1).padStart(2, "0")}:00`;

        return (
            reservation.date === day &&
            reservation.startTime < slotEnd &&
            reservation.endTime > slotStart
        );
    }

    function getReservationPosition(reservation: Reservation) {
        const startMinutes =
            Number(reservation.startTime.split(":")[0]) * 60 +
            Number(reservation.startTime.split(":")[1]);

        const endMinutes =
            Number(reservation.endTime.split(":")[0]) * 60 +
            Number(reservation.endTime.split(":")[1]);

        const calendarStartMinutes = 8 * 60;
        const pixelsPerHour = 64;

        return {
            top:
                ((startMinutes - calendarStartMinutes) / 60) *
                pixelsPerHour,
            height:
                ((endMinutes - startMinutes) / 60) *
                pixelsPerHour,
        };
    }

    function getReservationLayout(reservations: Reservation[]) {
        const sorted = [...reservations].sort((a, b) =>
            a.startTime.localeCompare(b.startTime)
        );

        const result: {
            reservation: Reservation;
            column: number;
            columns: number;
        }[] = [];

        let group: {
            reservation: Reservation;
            column: number;
        }[] = [];

        let groupEnd = "";

        function finishGroup() {
            const totalColumns = Math.max(
                ...group.map((item) => item.column + 1)
            );

            group.forEach((item) => {
                result.push({
                    ...item,
                    columns: totalColumns,
                });
            });

            group = [];
        }

        sorted.forEach((reservation) => {
            if (group.length > 0 && reservation.startTime >= groupEnd) {
                finishGroup();
            }

            const activeColumns = new Set(
                group
                    .filter(
                        (item) =>
                            item.reservation.endTime > reservation.startTime
                    )
                    .map((item) => item.column)
            );

            let column = 0;

            while (activeColumns.has(column)) {
                column++;
            }

            group.push({ reservation, column });

            if (reservation.endTime > groupEnd) {
                groupEnd = reservation.endTime;
            }
        });

        if (group.length > 0) {
            finishGroup();
        }

        return result;
    }

    function isReservationInUse(reservation: Reservation) {
        if (reservation.status !== "Confirmada") {
            return false;
        }

        if (
            reservation.resourceType === "Equipamento" &&
            (
                reservation.returnStatus === "Devolvida" ||
                reservation.returnStatus === "Devolução informada"
            )
        ) {
            return false;
        }

        const [year, month, day] = reservation.date.split("-").map(Number);

        const [startHour, startMinute] = reservation.startTime
            .split(":")
            .map(Number);

        const [endHour, endMinute] = reservation.endTime
            .split(":")
            .map(Number);

        const start = new Date(
            year, month - 1, day, startHour, startMinute
        );

        const end = new Date(
            year, month - 1, day, endHour, endMinute
        );

        const now = new Date();

        return now >= start && now < end;
    }

    function isMaintenanceOnDate(
        order: MaintenanceOrder,
        date: Date,
    ) {
        if (order.status === "Concluída" && !order.completionDate) {
            return false;
        }

        const currentDay = dateToLocalString(date);
        const endDate =
            order.completionDate || dateToLocalString(new Date());

        return (
            order.openingDate <= currentDay &&
            endDate >= currentDay
        );
    }

    const weekTitle = `${formatDate(weekDays[0])} – ${formatDate(
        weekDays[5]
    )}`;

    const visibleReservations = reservations.filter((reservation) => {
        if (reservation.status !== "Confirmada") {
            return false;
        }

        if (reservation.resourceType === "Sala" && !showRooms) {
            return false;
        }

        if (reservation.resourceType === "Equipamento" && !showEquipment) {
            return false;
        }

        return true;
    });

    return (
        <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#151e30]">
            <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold">
                        Calendário de utilização
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Reservas de salas, equipamentos e ordens de serviço.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={goToToday}
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                        Hoje
                    </button>

                    <button
                        type="button"
                        onClick={() => changeWeek(-1)}
                        aria-label="Semana anterior"
                        className="rounded-lg border border-white/10 px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                        ←
                    </button>

                    <button
                        type="button"
                        onClick={() => changeWeek(1)}
                        aria-label="Próxima semana"
                        className="rounded-lg border border-white/10 px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 p-5">
                <p className="text-sm font-semibold capitalize text-cyan-300">
                    {weekTitle}
                </p>
                <div className="flex flex-wrap gap-3">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                        <input
                            type="checkbox"
                            checked={showRooms}
                            onChange={(event) => setShowRooms(event.target.checked)}
                            className="accent-blue-500"
                        />
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                        Salas
                    </label>

                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                        <input
                            type="checkbox"
                            checked={showEquipment}
                            onChange={(event) => setShowEquipment(event.target.checked)}
                            className="accent-purple-500"
                        />
                        <span className="h-2.5 w-2.5 rounded-full bg-purple-400" />
                        Equipamentos
                    </label>

                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                        <input
                            type="checkbox"
                            checked={showMaintenance}
                            onChange={(event) => setShowMaintenance(event.target.checked)}
                            className="accent-red-500"
                        />
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        Manutenção
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
                    {weekDays.map((day) => {
                        const isToday =
                            day.toDateString() === new Date().toDateString();

                        return (
                            <div
                                key={day.toISOString()}
                                className={`rounded-xl border p-3 text-center ${isToday
                                    ? "border-cyan-400/40 bg-cyan-400/10"
                                    : "border-white/10 bg-[#111827]"
                                    }`}
                            >
                                <p className="text-xs capitalize text-slate-400">
                                    {day.toLocaleDateString("pt-BR", {
                                        weekday: "short",
                                    })}
                                </p>

                                <p
                                    className={`mt-1 text-lg font-semibold ${isToday ? "text-cyan-300" : "text-white"
                                        }`}
                                >
                                    {day.getDate()}
                                </p>

                                <p className="text-xs capitalize text-slate-500">
                                    {day.toLocaleDateString("pt-BR", {
                                        month: "short",
                                    })}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#111827]">
                    <div className="min-w-[750px]">
                        <div className="grid grid-cols-[70px_repeat(6,minmax(0,1fr))] border-b border-white/10">
                            <div className="border-r border-white/10 p-3 text-center text-xs text-slate-500">
                                Horário
                            </div>

                            {weekDays.map((day) => (
                                <div
                                    key={day.toISOString()}
                                    className="border-r border-white/10 p-3 text-center text-xs font-semibold text-slate-300 last:border-r-0"
                                >
                                    {day.toLocaleDateString("pt-BR", {
                                        weekday: "short",
                                    })}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-[70px_repeat(6,minmax(0,1fr))] border-b border-white/10">
                            <div className="border-r border-white/10 p-2 text-center text-[10px] text-slate-500">
                                OS
                            </div>

                            {weekDays.map((day) => (
                                <div
                                    key={day.toISOString()}
                                    className="min-h-8 border-r border-white/10 p-1 last:border-r-0"
                                >
                                    {showMaintenance &&
                                        maintenanceOrders
                                            .filter((order) => isMaintenanceOnDate(order, day))
                                            .map((order) => (
                                                <button
                                                    key={order.id}
                                                    type="button"
                                                    onClick={() => setSelectedMaintenance(order)}
                                                    title={`${order.orderNumber} | ${order.equipment}`}
                                                    aria-label={`Ver ordem de serviço ${order.orderNumber}`}
                                                    className="mb-1 block h-3 w-full rounded-md border border-red-300/40 bg-red-500/50 transition hover:bg-red-500"
                                                />
                                            ))}
                                </div>
                            ))}
                        </div>

                        {Array.from({ length: 14 }, (_, index) => {
                            const hour = index + 8;

                            return (
                                <div
                                    key={hour}
                                    className="grid grid-cols-[70px_repeat(6,minmax(0,1fr))]"
                                >
                                    <div className="border-r border-b border-white/10 p-3 text-center text-xs text-slate-400">
                                        {String(hour).padStart(2, "0")}:00
                                    </div>

                                    {weekDays.map((day, dayIndex) => (
                                        <div
                                            key={`${day.toISOString()}-${dayIndex}`}
                                            className={`relative h-16 border-r border-b border-white/10 last:border-r-0 ${dayIndex === 5 && hour >= 12
                                                ? "bg-white/[0.02]"
                                                : "transition hover:bg-white/[0.03]"
                                                }`}
                                        >
                                            {hour === 8 && (
                                                <div className="absolute inset-0 z-10">
                                                    {getReservationLayout(
                                                        visibleReservations.filter(
                                                            (reservation) =>
                                                                reservation.date === dateToLocalString(day)
                                                        )
                                                    ).map(({ reservation, column, columns }) => {
                                                        const position = getReservationPosition(reservation);

                                                        return (
                                                            <button
                                                                key={reservation.id}
                                                                type="button"
                                                                onClick={() => setSelectedReservation(reservation)}
                                                                title={`${reservation.resourceName} | ${reservation.startTime} - ${reservation.endTime}`}
                                                                aria-label={`Ver reserva de ${reservation.resourceName}`}
                                                                className={`absolute z-20 rounded-md border border-white/20 transition hover:brightness-125 ${isReservationInUse(reservation)
                                                                        ? "border-orange-300/50 bg-orange-500/80"
                                                                        : reservation.resourceType === "Sala"
                                                                            ? "bg-blue-500/70"
                                                                            : "bg-purple-500/70"
                                                                    }`}
                                                                style={{
                                                                    top: `${position.top}px`,
                                                                    height: `${position.height}px`,
                                                                    left: `calc(${(column / columns) * 100}% + 2px)`,
                                                                    width: `calc(${100 / columns}% - 4px)`,
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}

                        <div className="grid grid-cols-[70px_repeat(6,minmax(0,1fr))]">
                            <div className="p-3 text-center text-xs text-slate-400">
                                22:00
                            </div>

                            {weekDays.map((day) => (
                                <div
                                    key={day.toISOString()}
                                    className="h-8 border-r border-white/10 last:border-r-0"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {selectedReservation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151e30] p-6 shadow-2xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">
                                Detalhes da reserva
                            </h3>

                            <button
                                type="button"
                                onClick={() => setSelectedReservation(null)}
                                className="rounded-lg px-3 py-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                                aria-label="Fechar detalhes"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-slate-400">Recurso reservado</p>
                                <p className="font-medium text-white">
                                    {selectedReservation.resourceName}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">Tipo</p>
                                <p className="text-white">
                                    {selectedReservation.resourceType}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">Situação</p>
                                <p className={`font-semibold ${isReservationInUse(selectedReservation)
                                    ? "text-orange-400"
                                    : "text-cyan-300"
                                    }`}>
                                    {isReservationInUse(selectedReservation)
                                        ? "Em uso"
                                        : "Confirmada"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">Data</p>
                                <p className="text-white">
                                    {new Date(
                                        `${selectedReservation.date}T12:00:00`
                                    ).toLocaleDateString("pt-BR")}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">Horário</p>
                                <p className="text-white">
                                    {selectedReservation.startTime} às{" "}
                                    {selectedReservation.endTime}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">Reservado por</p>
                                <p className="text-white">
                                    {selectedReservation.reservedBy}
                                </p>
                            </div>

                            {selectedReservation.notes && (
                                <div>
                                    <p className="text-xs text-slate-400">Observações</p>
                                    <p className="text-white">
                                        {selectedReservation.notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setSelectedReservation(null)}
                            className="mt-6 w-full rounded-xl bg-cyan-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
            {selectedMaintenance && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151e30] p-6 shadow-2xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">
                                Ordem de serviço
                            </h3>

                            <button
                                type="button"
                                onClick={() => setSelectedMaintenance(null)}
                                className="rounded-lg px-3 py-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                                aria-label="Fechar detalhes"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-slate-400">Número da OS</p>
                                <p className="font-semibold text-red-300">
                                    {selectedMaintenance.orderNumber}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">Equipamento</p>
                                <p className="text-white">
                                    {selectedMaintenance.equipment}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">Problema</p>
                                <p className="text-white">
                                    {selectedMaintenance.problem}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">Responsável</p>
                                <p className="text-white">
                                    {selectedMaintenance.responsible}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">Situação</p>
                                <p className="font-semibold text-red-300">
                                    {selectedMaintenance.status}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">Abertura</p>
                                <p className="text-white">
                                    {new Date(
                                        `${selectedMaintenance.openingDate}T12:00:00`
                                    ).toLocaleDateString("pt-BR")}
                                </p>
                            </div>

                            {selectedMaintenance.completionDate && (
                                <div>
                                    <p className="text-xs text-slate-400">Conclusão</p>
                                    <p className="text-white">
                                        {new Date(
                                            `${selectedMaintenance.completionDate}T12:00:00`
                                        ).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                            )}

                            {selectedMaintenance.serviceNotes && (
                                <div>
                                    <p className="text-xs text-slate-400">
                                        Observações do serviço
                                    </p>
                                    <p className="text-white">
                                        {selectedMaintenance.serviceNotes}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setSelectedMaintenance(null)}
                            className="mt-6 w-full rounded-xl bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}