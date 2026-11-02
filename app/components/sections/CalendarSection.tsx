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
    const [maintenanceFilter, setMaintenanceFilter] = useState<"open" | "completed" | "all">("open");
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [maintenanceOrders, setMaintenanceOrders] = useState<MaintenanceOrder[]>([]);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceOrder | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showInUse, setShowInUse] = useState(true);
    const [viewMode, setViewMode] = useState<"week" | "month" | "list">("week");
    const [expandedMonthDay, setExpandedMonthDay] = useState<string | null>(null);

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

    useEffect(() => {
        const interval = window.setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => window.clearInterval(interval);
    }, []);

    function changeWeek(amount: number) {
        setCurrentDate((current) => {
            const next = new Date(current);

            if (viewMode === "month") {
                next.setMonth(next.getMonth() + amount);
            } else {
                next.setDate(next.getDate() + amount * 7);
            }

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

    function getMonthDays(date: Date) {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

        const dayOfWeek = firstDay.getDay();
        const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        const startDate = new Date(firstDay);
        startDate.setDate(firstDay.getDate() - mondayOffset);

        return Array.from({ length: 42 }, (_, index) => {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + index);
            return day;
        }).filter((day) => day.getDay() !== 0);
    }

    const monthDays = getMonthDays(currentDate);

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
        const pixelsPerHour = 48;

        return {
            top:
                ((startMinutes - calendarStartMinutes) / 60) *
                pixelsPerHour,
            height:
                ((endMinutes - startMinutes) / 60) *
                pixelsPerHour,
        };
    }

    function getCurrentTimePosition() {
        const minutes =
            currentTime.getHours() * 60 + currentTime.getMinutes();

        const calendarStartMinutes = 8 * 60;
        const pixelsPerHour = 48;

        return ((minutes - calendarStartMinutes) / 60) * pixelsPerHour;
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

    function getMaintenanceColor(status: MaintenanceOrder["status"]) {
        switch (status) {
            case "Aberta":
                return {
                    background: "bg-red-500/20",
                    text: "text-red-300",
                    border: "border-red-300/40",
                    hover: "hover:bg-red-500/30",
                };

            case "Em andamento":
                return {
                    background: "bg-blue-500/20",
                    text: "text-blue-300",
                    border: "border-blue-300/40",
                    hover: "hover:bg-blue-500/30",
                };

            case "Aguardando peças":
                return {
                    background: "bg-amber-500/20",
                    text: "text-amber-300",
                    border: "border-amber-300/40",
                    hover: "hover:bg-amber-500/30",
                };

            case "Concluída":
                return {
                    background: "bg-emerald-500/20",
                    text: "text-emerald-300",
                    border: "border-emerald-300/40",
                    hover: "hover:bg-emerald-500/30",
                };
        }
    }

    const weekTitle = viewMode === "month" ? currentDate.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
    }) : `${formatDate(weekDays[0])} – ${formatDate(weekDays[5])}`;

    const visibleReservations = reservations.filter((reservation) => {
        if (reservation.status !== "Confirmada") return false;

        if (reservation.resourceType === "Sala" && !showRooms) return false;
        if (reservation.resourceType === "Equipamento" && !showEquipment) return false;

        if (isReservationInUse(reservation) && !showInUse) return false;

        return true;
    });

    const visibleMaintenanceOrders = maintenanceOrders.filter((order) => {
        if (maintenanceFilter === "open") {
            return order.status !== "Concluída";
        }

        if (maintenanceFilter === "completed") {
            return order.status === "Concluída";
        }

        return true;
    });

    const selectedMaintenanceColors = selectedMaintenance
        ? getMaintenanceColor(selectedMaintenance.status)
        : null;

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

                    {/* Seleção da visualização */}
                    <div className="flex rounded-lg border border-white/10 bg-[#0d1728] p-1">
                        {[
                            { value: "week", label: "Semana" },
                            { value: "month", label: "Mês" },
                            { value: "list", label: "Lista" },
                        ].map((view) => (
                            <button
                                key={view.value}
                                type="button"
                                onClick={() =>
                                    setViewMode(view.value as "week" | "month" | "list")
                                }
                                className={`rounded-md px-3 py-2 text-xs font-semibold transition ${viewMode === view.value
                                    ? "bg-cyan-700 text-white"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {view.label}
                            </button>
                        ))}
                    </div>

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
                        aria-label="Período anterior"
                        className="rounded-lg border border-white/10 px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                        ←
                    </button>

                    <button
                        type="button"
                        onClick={() => changeWeek(1)}
                        aria-label="Próximo período"
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
                <div className="flex flex-wrap items-center gap-3">
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
                            checked={showInUse}
                            onChange={(event) => setShowInUse(event.target.checked)}
                            className="accent-orange-500"
                        />
                        <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                        Em uso
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

                    {showMaintenance && (
                        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-[#0d1728] p-1">
                            {[
                                { value: "open", label: "Em aberto" },
                                { value: "completed", label: "Concluídas" },
                                { value: "all", label: "Todas" },
                            ].map((filter) => (
                                <button
                                    key={filter.value}
                                    type="button"
                                    onClick={() =>
                                        setMaintenanceFilter(
                                            filter.value as "open" | "completed" | "all"
                                        )
                                    }
                                    className={`rounded-md px-3 py-2 text-xs font-semibold transition ${maintenanceFilter === filter.value
                                        ? "bg-red-700 text-white"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {viewMode === "month" && (
                    <div className="overflow-x-auto">
                        <div className="grid min-w-[650px] grid-cols-6 gap-2">
                            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                                <div
                                    key={day}
                                    className="py-2 text-center text-xs font-semibold text-slate-400"
                                >
                                    {day}
                                </div>
                            ))}

                            {monthDays.map((day) => {
                                const isCurrentMonth =
                                    day.getMonth() === currentDate.getMonth();

                                const isToday =
                                    dateToLocalString(day) === dateToLocalString(new Date());

                                const dayString = dateToLocalString(day);

                                const dayReservations = visibleReservations.filter(
                                    (reservation) => reservation.date === dayString
                                );

                                const dayMaintenance = showMaintenance
                                    ? visibleMaintenanceOrders.filter((order) =>
                                        isMaintenanceOnDate(order, day)
                                    )
                                    : [];

                                const totalEvents =
                                    dayReservations.length + dayMaintenance.length;

                                const maxVisibleEvents =
                                    expandedMonthDay === dayString ? totalEvents : 2;

                                return (
                                    <div
                                        key={dayString}
                                        className={`min-h-28 rounded-xl border p-2 ${isToday
                                            ? "border-cyan-500 bg-cyan-500/10"
                                            : "border-white/10 bg-[#111827]"
                                            } ${isCurrentMonth
                                                ? "text-white"
                                                : "text-slate-600 opacity-50"
                                            }`}
                                    >
                                        <span className="text-sm font-semibold">
                                            {day.getDate()}
                                        </span>

                                        <div className="mt-2 space-y-1">
                                            {dayMaintenance
                                                .slice(0, maxVisibleEvents)
                                                .map((order) => {
                                                    const colors = getMaintenanceColor(order.status);

                                                    return (
                                                        <button
                                                            key={order.id}
                                                            type="button"
                                                            onClick={() => setSelectedMaintenance(order)}
                                                            className={`w-full truncate rounded border px-1.5 py-1 text-left text-[10px] font-medium transition ${colors.background} ${colors.text} ${colors.border} ${colors.hover}`}
                                                            title={`${order.orderNumber} - ${order.equipment} - ${order.status}`}
                                                        >
                                                            {order.orderNumber}
                                                        </button>
                                                    );
                                                })}

                                            {dayReservations
                                                .slice(
                                                    0,
                                                    Math.max(0, maxVisibleEvents - dayMaintenance.length)
                                                )
                                                .map((reservation) => {
                                                    const isEquipment =
                                                        reservation.resourceType === "Equipamento";

                                                    return (
                                                        <button
                                                            key={reservation.id}
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedReservation(reservation)
                                                            }
                                                            className={`w-full truncate rounded px-1.5 py-1 text-left text-[10px] font-medium transition ${isEquipment
                                                                ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                                                                : "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                                                                }`}
                                                            title={`${reservation.startTime} - ${reservation.resourceName}`}
                                                        >
                                                            {reservation.startTime} {reservation.resourceName}
                                                        </button>
                                                    );
                                                })}

                                            {totalEvents > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setExpandedMonthDay(
                                                            expandedMonthDay === dayString ? null : dayString
                                                        )
                                                    }
                                                    className="w-full px-1 text-left text-[10px] font-semibold text-cyan-300 transition hover:text-cyan-200"
                                                >
                                                    {expandedMonthDay === dayString
                                                        ? "Mostrar menos"
                                                        : `+${totalEvents - 2} mais`}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {viewMode === "list" && (
                    <div className="space-y-4">
                        {weekDays.map((day) => {
                            const dayString = dateToLocalString(day);

                            const dayReservations = visibleReservations
                                .filter(
                                    (reservation) =>
                                        reservation.date === dayString
                                )
                                .sort((a, b) =>
                                    a.startTime.localeCompare(b.startTime)
                                );

                            const dayMaintenance = showMaintenance
                                ? visibleMaintenanceOrders.filter((order) =>
                                    isMaintenanceOnDate(order, day)
                                )
                                : [];

                            const hasEvents =
                                dayReservations.length > 0 ||
                                dayMaintenance.length > 0;

                            return (
                                <div
                                    key={dayString}
                                    className={`overflow-hidden rounded-xl border ${dayString === dateToLocalString(new Date())
                                        ? "border-cyan-500/50 bg-cyan-500/[0.04]"
                                        : "border-white/10 bg-[#111827]"
                                        }`}
                                >
                                    <div
                                        className={`border-b px-4 py-3 ${dayString === dateToLocalString(new Date())
                                            ? "border-cyan-500/20 bg-cyan-500/10"
                                            : "border-white/10 bg-white/[0.03]"
                                            }`}
                                    >
                                        <p className="font-semibold capitalize text-white">
                                            {day.toLocaleDateString("pt-BR", {
                                                weekday: "long",
                                                day: "2-digit",
                                                month: "long",
                                            })}
                                            {dayString === dateToLocalString(new Date()) && (
                                                <span className="ml-2 text-xs font-bold uppercase text-cyan-300">
                                                    Hoje
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {!hasEvents ? (
                                        <p className="px-4 py-4 text-sm text-slate-500">
                                            Nenhum evento neste dia.
                                        </p>
                                    ) : (
                                        <div className="divide-y divide-white/5">
                                            {dayMaintenance.map((order) => {
                                                const colors = getMaintenanceColor(order.status);

                                                return (
                                                    <button
                                                        key={order.id}
                                                        type="button"
                                                        onClick={() => setSelectedMaintenance(order)}
                                                        className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition sm:flex-row sm:items-center sm:gap-4 ${colors.hover}`}
                                                    >
                                                        <span className={`text-xs font-semibold sm:w-24 ${colors.text}`}>
                                                            Dia inteiro
                                                        </span>

                                                        <span className={`text-sm font-medium ${colors.text}`}>
                                                            {order.orderNumber} · {order.equipment}
                                                        </span>

                                                        <span className={`text-xs ${colors.text}`}>
                                                            {order.status}
                                                        </span>
                                                    </button>
                                                );
                                            })}

                                            {dayReservations.map((reservation) => {
                                                const isEquipment =
                                                    reservation.resourceType === "Equipamento";

                                                return (
                                                    <button
                                                        key={reservation.id}
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedReservation(reservation)
                                                        }
                                                        className="flex w-full flex-col gap-1 px-4 py-3 text-left transition hover:bg-white/5 sm:flex-row sm:items-center sm:gap-4"
                                                    >
                                                        <span className="text-xs font-semibold text-cyan-300 sm:w-24">
                                                            {reservation.startTime} – {reservation.endTime}
                                                        </span>

                                                        <span
                                                            className={`text-sm font-medium ${isEquipment
                                                                ? "text-purple-300"
                                                                : "text-blue-300"
                                                                }`}
                                                        >
                                                            {reservation.resourceName}
                                                        </span>

                                                        <span className="text-xs text-slate-400">
                                                            {reservation.resourceType} · {reservation.reservedBy}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {viewMode === "week" && (
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
                )}

                {viewMode === "week" && (
                    <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#111827]">
                        <div className="min-w-[750px]">
                            <div className="grid grid-cols-[70px_repeat(6,minmax(0,1fr))] border-b border-white/10">
                                <div className="border-r border-white/10 p-3 text-center text-xs text-slate-500">
                                    Horário
                                </div>

                                {weekDays.map((day) => {
                                    const isToday =
                                        dateToLocalString(day) === dateToLocalString(currentTime);

                                    return (
                                        <div
                                            key={day.toISOString()}
                                            className={`border-r p-3 text-center text-xs font-semibold last:border-r-0 ${isToday
                                                ? "border-blue-400/40 bg-blue-500/15 text-blue-300"
                                                : "border-white/10 text-slate-300"
                                                }`}
                                        >
                                            {day.toLocaleDateString("pt-BR", {
                                                weekday: "short",
                                            })}
                                            {isToday && (
                                                <span className="ml-1 text-[9px] font-bold uppercase">
                                                    Hoje
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
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
                                            visibleMaintenanceOrders
                                                .filter((order) => isMaintenanceOnDate(order, day))
                                                .map((order) => {
                                                    const colors = getMaintenanceColor(order.status);

                                                    return (
                                                        <button
                                                            key={order.id}
                                                            type="button"
                                                            onClick={() => setSelectedMaintenance(order)}
                                                            title={`${order.orderNumber} | ${order.equipment} | ${order.status}`}
                                                            aria-label={`Ver ordem de serviço ${order.orderNumber}`}
                                                            className={`mb-1 block h-3 w-full rounded-md border transition ${colors.background} ${colors.border} ${colors.hover}`}
                                                        />
                                                    );
                                                })}
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
                                                className={`relative h-12 border-r border-b border-white/10 last:border-r-0 ${dayIndex === 5 && hour >= 12
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
                                                        {dateToLocalString(day) === dateToLocalString(currentTime) &&
                                                            currentTime.getHours() >= 8 &&
                                                            currentTime.getHours() < 22 && (
                                                                <div
                                                                    className="pointer-events-none absolute left-0 right-0 z-30 border-t-2 border-red-500"
                                                                    style={{
                                                                        top: `${getCurrentTimePosition()}px`,
                                                                    }}
                                                                >
                                                                    <span className="absolute -left-1 -top-2 h-3 w-3 rounded-full bg-red-500" />
                                                                </div>
                                                            )}
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
                )}
            </div>

            {selectedReservation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#151e30] shadow-2xl">

                        {/* Cabeçalho */}
                        <div className="flex items-center justify-between border-b border-white/10 p-5">
                            <div>
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                                    VR Studio Lab
                                </p>
                                <h3 className="text-lg font-semibold text-white">
                                    Detalhes da reserva
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedReservation(null)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                                aria-label="Fechar detalhes"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-5 p-5">

                            {/* Recurso e situação */}
                            <div>
                                <p className="mb-1 text-xs text-slate-400">
                                    Recurso reservado
                                </p>

                                <h4 className="text-xl font-semibold text-white">
                                    {selectedReservation.resourceName}
                                </h4>

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <span className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                                        {selectedReservation.resourceType}
                                    </span>

                                    <span className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${isReservationInUse(selectedReservation)
                                        ? "bg-orange-500/15 text-orange-400"
                                        : "bg-cyan-500/15 text-cyan-300"
                                        }`}>
                                        {isReservationInUse(selectedReservation)
                                            ? "Em uso"
                                            : "Confirmada"}
                                    </span>
                                </div>
                            </div>

                            {/* Data e horário */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-white/10 bg-[#0d1728] p-4">
                                    <p className="mb-2 text-xs text-slate-400">
                                        <span className="mr-1">📅</span>
                                        Data
                                    </p>
                                    <p className="text-sm font-semibold text-white">
                                        {new Date(
                                            `${selectedReservation.date}T12:00:00`
                                        ).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-[#0d1728] p-4">
                                    <p className="mb-2 text-xs text-slate-400">
                                        <span className="mr-1">🕒</span>
                                        Horário
                                    </p>
                                    <p className="text-sm font-semibold text-white">
                                        {selectedReservation.startTime} às{" "}
                                        {selectedReservation.endTime}
                                    </p>
                                </div>
                            </div>

                            {/* Solicitante */}
                            <div className="rounded-xl border border-white/10 bg-[#0d1728] p-4">
                                <p className="mb-2 text-xs text-slate-400">
                                    Reservado por
                                </p>
                                <p className="text-sm font-medium text-white">
                                    {selectedReservation.reservedBy}
                                </p>
                            </div>

                            {/* Observações */}
                            {selectedReservation.notes && (
                                <div className="rounded-xl border border-white/10 bg-[#0d1728] p-4">
                                    <p className="mb-2 text-xs text-slate-400">
                                        Observações
                                    </p>
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                                        {selectedReservation.notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Rodapé */}
                        <div className="border-t border-white/10 p-5">
                            <button
                                type="button"
                                onClick={() => setSelectedReservation(null)}
                                className="w-full rounded-xl bg-cyan-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedMaintenance && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#151e30] shadow-2xl">
                        {/* Cabeçalho */}
                        <div className="flex items-center justify-between border-b border-white/10 p-5">
                            <div>
                                <p className={`mb-1 text-xs font-semibold uppercase tracking-wider ${selectedMaintenanceColors?.text}`}>
                                    VR Studio Lab
                                </p>
                                <h3 className="text-lg font-semibold text-white">
                                    Ordem de serviço
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedMaintenance(null)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                                aria-label="Fechar detalhes"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Conteúdo em duas colunas */}
                        {/* Conteúdo organizado em linhas */}
                        <div className="space-y-4 p-5">

                            {/* Número da OS - linha inteira */}
                            <div className={`rounded-xl border p-4 ${selectedMaintenanceColors?.border} ${selectedMaintenanceColors?.background}`}>
                                <p className="mb-1 text-xs text-slate-400">
                                    Número da ordem de serviço
                                </p>

                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h4 className={`text-xl font-semibold ${selectedMaintenanceColors?.text}`}>
                                        {selectedMaintenance.orderNumber}
                                    </h4>

                                    <span
                                        className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-semibold ${selectedMaintenanceColors?.background} ${selectedMaintenanceColors?.text} ${selectedMaintenanceColors?.border}`}
                                    >
                                        {selectedMaintenance.status}
                                    </span>
                                </div>
                            </div>

                            {/* Equipamento e responsável */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-white/10 bg-[#0d1728] p-4">
                                    <p className="mb-2 text-xs text-slate-400">
                                        Equipamento
                                    </p>
                                    <p className="text-sm font-semibold text-white">
                                        {selectedMaintenance.equipment}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-[#0d1728] p-4">
                                    <p className="mb-2 text-xs text-slate-400">
                                        Responsável
                                    </p>
                                    <p className="text-sm font-medium text-white">
                                        {selectedMaintenance.responsible}
                                    </p>
                                </div>
                            </div>

                            {/* Abertura e conclusão */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-white/10 bg-[#0d1728] p-4">
                                    <p className="mb-2 text-xs text-slate-400">
                                        Abertura
                                    </p>
                                    <p className="text-sm font-semibold text-white">
                                        {new Date(
                                            `${selectedMaintenance.openingDate}T12:00:00`
                                        ).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-[#0d1728] p-4">
                                    <p className="mb-2 text-xs text-slate-400">
                                        Conclusão
                                    </p>
                                    <p className="text-sm font-semibold text-white">
                                        {selectedMaintenance.completionDate
                                            ? new Date(
                                                `${selectedMaintenance.completionDate}T12:00:00`
                                            ).toLocaleDateString("pt-BR")
                                            : "Em aberto"}
                                    </p>
                                </div>
                            </div>

                            {/* Problema - linha inteira */}
                            <div className="rounded-xl border border-white/10 bg-[#0d1728] p-4">
                                <p className="mb-2 text-xs text-slate-400">
                                    Problema identificado
                                </p>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                                    {selectedMaintenance.problem}
                                </p>
                            </div>

                            {/* Observações - linha inteira */}
                            {selectedMaintenance.serviceNotes && (
                                <div className="rounded-xl border border-white/10 bg-[#0d1728] p-4">
                                    <p className="mb-2 text-xs text-slate-400">
                                        Observações do serviço
                                    </p>
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                                        {selectedMaintenance.serviceNotes}
                                    </p>
                                </div>
                            )}
                        </div>


                        {/* Rodapé */}
                        <div className="border-t border-white/10 p-4">
                            <button
                                type="button"
                                onClick={() => setSelectedMaintenance(null)}
                                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${selectedMaintenanceColors?.background} ${selectedMaintenanceColors?.hover} ${selectedMaintenanceColors?.border} border`}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
}