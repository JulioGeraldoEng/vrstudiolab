"use client";

import { useEffect, useState } from "react";
import type { Room } from "../../types/room";
import type { Reservation } from "../../types/reservation";
import { RESERVATIONS_STORAGE_KEY, hasReservationConflict } from "./storage";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import BackToDashboard from "../components/buttons/BackToDashboard";
import RoomModal from "../components/modals/RoomModal";
import Cards from "../components/Cards";
import RoomsTable from "../components/tables/RoomsTable";
import type { Equipment } from "../../types/equipment";

const STORAGE_KEY = "vrstudiolab-rooms-v1";

export default function ReservasPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [ready, setReady] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [resourceType, setResourceType] = useState<"Sala" | "Equipamento">("Sala");
    const [resourceId, setResourceId] = useState("");
    const [reservedBy, setReservedBy] = useState("");
    const [reservationDate, setReservationDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [reservationNotes, setReservationNotes] = useState("");
    const [reservationsReady, setReservationsReady] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved !== null) {
                const parsed: unknown = JSON.parse(saved);
                setRooms(Array.isArray(parsed) ? (parsed as Room[]) : []);
            }
        } catch (error) {
            console.error("Não foi possível carregar as salas.", error);
        } finally {
            setReady(true);
        }
    }, []);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(RESERVATIONS_STORAGE_KEY);

            if (saved !== null) {
                const parsed: unknown = JSON.parse(saved);
                setReservations(
                    Array.isArray(parsed) ? (parsed as Reservation[]) : []
                );
            }
        } catch (error) {
            console.error("Não foi possível carregar as reservas.", error);
        } finally {
            setReservationsReady(true);
        }
    }, []);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("vrstudiolab-inventory-v1");

            if (saved !== null) {
                const parsed: unknown = JSON.parse(saved);
                setEquipment(
                    Array.isArray(parsed) ? (parsed as Equipment[]) : []
                );
            }
        } catch (error) {
            console.error("Não foi possível carregar os equipamentos.", error);
        }
    }, []);

    useEffect(() => {
        if (!ready) return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
        } catch (error) {
            console.error("Não foi possível salvar as salas.", error);
            window.alert("Não foi possível salvar as salas no navegador.");
        }
    }, [rooms, ready]);

    useEffect(() => {
        if (!reservationsReady) return;

        try {
            localStorage.setItem(
                RESERVATIONS_STORAGE_KEY,
                JSON.stringify(reservations)
            );
        } catch (error) {
            console.error("Não foi possível salvar as reservas.", error);
            window.alert("Não foi possível salvar as reservas no navegador.");
        }
    }, [reservations, reservationsReady]);

    function openNewRoom() {
        setEditingRoom(null);
        setShowModal(true);
    }

    function openEditRoom(room: Room) {
        setEditingRoom(room);
        setShowModal(true);
    }

    function saveRoom(data: Omit<Room, "id">) {
        const nameExists = rooms.some(
            (room) =>
                room.name.trim().toLocaleLowerCase() ===
                data.name.trim().toLocaleLowerCase() &&
                room.id !== editingRoom?.id
        );

        if (nameExists) {
            window.alert("Já existe uma sala cadastrada com esse nome.");
            return;
        }

        if (editingRoom) {
            setRooms((current) =>
                current.map((room) =>
                    room.id === editingRoom.id ? { ...room, ...data } : room
                )
            );
        } else {
            const newRoom: Room = {
                ...data,
                id: crypto.randomUUID(),
            };

            setRooms((current) => [newRoom, ...current]);
        }

        setShowModal(false);
        setEditingRoom(null);
    }

    function toggleRoomStatus(room: Room) {
        const action = room.active ? "desativar" : "ativar";

        const confirmed = window.confirm(
            `Deseja ${action} a sala "${room.name}"?`
        );

        if (!confirmed) return;

        setRooms((current) =>
            current.map((item) =>
                item.id === room.id ? { ...item, active: !item.active } : item
            )
        );
    }

    function createReservation() {
        if (
            !resourceId ||
            !reservedBy.trim() ||
            !reservationDate ||
            !startTime ||
            !endTime
        ) {
            window.alert("Preencha o recurso, seu nome, a data e os horários.");
            return;
        }

        if (startTime >= endTime) {
            window.alert("O horário de término deve ser posterior ao horário de início.");
            return;
        }

        const today = new Date();
        const todayString = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0"),
        ].join("-");

        if (reservationDate < todayString) {
            window.alert("Não é possível reservar em uma data passada.");
            return;
        }

        const selectedDate = new Date(`${reservationDate}T12:00:00`);
        const dayOfWeek = selectedDate.getDay();

        if (dayOfWeek === 0) {
            window.alert("Não são permitidas reservas aos domingos.");
            return;
        }

        const openingTime = "08:00";
        const closingTime = dayOfWeek === 6 ? "12:00" : "22:00";

        if (startTime < openingTime || endTime > closingTime) {
            window.alert(
                dayOfWeek === 6
                    ? "Aos sábados, as reservas devem ocorrer entre 08:00 e 12:00."
                    : "As reservas de segunda a sexta devem ocorrer entre 08:00 e 22:00."
            );
            return;
        }

        if (resourceType === "Sala") {
            const selectedRoom = rooms.find(
                (room) => room.id === resourceId && room.active
            );

            if (!selectedRoom) {
                window.alert("A sala selecionada não está ativa.");
                return;
            }
        } else {
            const selectedEquipment = equipment.find(
                (item) =>
                    String(item.id) === resourceId &&
                    item.status === "Disponível"
            );

            if (!selectedEquipment) {
                window.alert("O equipamento selecionado não está disponível.");
                return;
            }
        }

        if (
            hasReservationConflict(
                reservations,
                resourceType,
                resourceId,
                reservationDate,
                startTime,
                endTime
            )
        ) {
            window.alert("Esse recurso já possui uma reserva nesse período.");
            return;
        }

        const resourceName =
            resourceType === "Sala"
                ? rooms.find((room) => room.id === resourceId)!.name
                : equipment.find((item) => String(item.id) === resourceId)!.name;

        const newReservation: Reservation = {
            id: crypto.randomUUID(),
            resourceType,
            resourceId,
            resourceName,
            reservedBy: reservedBy.trim(),
            date: reservationDate,
            startTime,
            endTime,
            status: "Confirmada",
            notes: reservationNotes.trim(),
            createdAt: new Date().toISOString(),
        };

        setReservations((current) => [...current, newReservation]);

        setResourceId("");
        setReservedBy("");
        setReservationDate("");
        setStartTime("");
        setEndTime("");
        setReservationNotes("");

        window.alert("Reserva confirmada com sucesso!");
    }

    function cancelReservation(reservation: Reservation) {
        const confirmed = window.confirm(
            `Deseja cancelar a reserva de "${reservation.resourceName}" para ${reservation.date.split("-").reverse().join("/")} das ${reservation.startTime} às ${reservation.endTime}?`
        );

        if (!confirmed) return;

        setReservations((current) =>
            current.map((item) =>
                item.id === reservation.id
                    ? { ...item, status: "Cancelada" }
                    : item
            )
        );
    }

    return (
        <main className="min-h-screen bg-[#0b1120] text-white">
            <div className="flex min-h-screen w-full flex-col lg:flex-row">
                <Sidebar activePage="Reservas" />

                <section className="min-w-0 flex-1 p-4 sm:p-8">
                    <div className="mx-auto max-w-7xl space-y-8">
                        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <BackToDashboard />

                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                                    VR STUDIO LAB
                                </p>

                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    Reservas
                                </h1>

                                <p className="mt-2 text-sm text-slate-400">
                                    Gerencie as salas e prepare os ambientes para futuras reservas.
                                </p>
                            </div>
                        </header>

                        <section className="rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold">Nova reserva</h2>
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
                                        onChange={(event) => {
                                            setResourceType(event.target.value as "Sala" | "Equipamento");
                                            setResourceId("");
                                        }}
                                        className="w-full rounded-xl border border-white/10 bg-[#0b1424] p-3 text-white"
                                    >
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
                                        onChange={(event) => setResourceId(event.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-[#0b1424] p-3 text-white"
                                    >
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
                                                    <option key={item.id} value={String(item.id)}>
                                                        {item.name}
                                                        {item.assetNumber ? ` — ${item.assetNumber}` : ""}
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
                                        onChange={(event) => setReservedBy(event.target.value)}
                                        placeholder="Digite seu nome"
                                        className="w-full rounded-xl border border-white/10 bg-[#0b1424] p-3 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-slate-300">
                                        Data da reserva
                                    </label>
                                    <input
                                        type="date"
                                        value={reservationDate}
                                        onChange={(event) => setReservationDate(event.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-[#0b1424] p-3 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-slate-300">
                                        Horário de início
                                    </label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(event) => setStartTime(event.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-[#0b1424] p-3 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-slate-300">
                                        Horário de término
                                    </label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(event) => setEndTime(event.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-[#0b1424] p-3 text-white"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="mb-2 block text-sm text-slate-300">
                                    Finalidade ou observações (opcional)
                                </label>
                                <textarea
                                    value={reservationNotes}
                                    onChange={(event) => setReservationNotes(event.target.value)}
                                    placeholder="Informe a finalidade da reserva ou alguma observação..."
                                    rows={3}
                                    className="w-full rounded-xl border border-white/10 bg-[#0b1424] p-3 text-white"
                                />
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={createReservation}
                                    className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#07111f] shadow-md shadow-cyan-400/10 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/30 active:translate-y-0 active:scale-95"
                                >
                                    Confirmar reserva
                                </button>
                            </div>

                        </section>

                        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            <Cards
                                title="Total de salas"
                                value={rooms.length}
                                detail="Salas cadastradas"
                                icon="🏢"
                                color="text-blue-300"
                                bg="bg-blue-400/10"
                            />

                            <Cards
                                title="Salas ativas"
                                value={rooms.filter((room) => room.active).length}
                                detail="Disponíveis para novas reservas"
                                icon="✓"
                                color="text-emerald-300"
                                bg="bg-emerald-400/10"
                            />

                            <Cards
                                title="Salas inativas"
                                value={rooms.filter((room) => !room.active).length}
                                detail="Não recebem novas reservas"
                                icon="⏸"
                                color="text-red-300"
                                bg="bg-red-400/10"
                            />
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold">Reservas realizadas</h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    Consulte os horários e os recursos reservados.
                                </p>
                            </div>

                            {!reservationsReady ? (
                                <p className="py-6 text-center text-slate-400">
                                    Carregando reservas...
                                </p>
                            ) : reservations.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
                                    <p className="font-medium">Nenhuma reserva realizada</p>
                                    <p className="mt-2 text-sm text-slate-400">
                                        As reservas confirmadas aparecerão aqui.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-white/10 text-slate-400">
                                            <tr>
                                                <th className="px-4 py-3">Recurso</th>
                                                <th className="px-4 py-3">Responsável</th>
                                                <th className="px-4 py-3">Data</th>
                                                <th className="px-4 py-3">Horário</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reservations.map((reservation) => (
                                                <tr
                                                    key={reservation.id}
                                                    className="border-b border-white/5 transition-colors duration-200 hover:bg-white/[0.08]"
                                                >
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium">{reservation.resourceName}</p>
                                                        <p className="text-xs text-slate-400">
                                                            {reservation.resourceType}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-3">{reservation.reservedBy}</td>
                                                    <td className="px-4 py-3">
                                                        {reservation.date.split("-").reverse().join("/")}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {reservation.startTime}–{reservation.endTime}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                                                            {reservation.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {reservation.status === "Confirmada" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => cancelReservation(reservation)}
                                                                className="rounded-lg border border-red-400/20 px-3 py-2 text-xs font-semibold text-red-300 transition-colors hover:bg-red-400/10"
                                                            >
                                                                Cancelar
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-6">
                            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <h2 className="text-xl font-semibold">Salas cadastradas</h2>
                                    <p className="mt-1 text-sm text-slate-400">
                                        Salas inativas continuam registradas para preservar o histórico.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={openNewRoom}
                                        className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f] shadow-md shadow-cyan-400/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/30 active:translate-y-0 active:scale-95"                                >
                                        + Cadastrar sala
                                    </button>
                                </div>
                            </div>

                            {!ready ? (
                                <p className="py-10 text-center text-slate-400">
                                    Carregando salas...
                                </p>
                            ) : rooms.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-white/10 px-4 py-12 text-center">
                                    <p className="font-medium">Nenhuma sala cadastrada</p>
                                    <p className="mt-2 text-sm text-slate-400">
                                        Cadastre a primeira sala para começar.
                                    </p>
                                </div>
                            ) : (
                                <RoomsTable
                                    rooms={rooms}
                                    onEdit={openEditRoom}
                                    onToggleStatus={toggleRoomStatus}
                                />
                            )}
                        </section>

                        <p className="text-xs text-slate-500">
                            VR Studio Lab · Cadastro de salas · Dados salvos neste navegador
                        </p>

                        <Footer />
                    </div>
                </section>

                {showModal && (
                    <RoomModal
                        room={editingRoom}
                        onSave={saveRoom}
                        onClose={() => {
                            setShowModal(false);
                            setEditingRoom(null);
                        }}
                    />
                )}
            </div>
        </main>
    );
}
