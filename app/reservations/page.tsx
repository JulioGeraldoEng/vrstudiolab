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
import ReservationsTable, {
    getReservationDisplayStatus,
} from "../components/tables/ReservationsTable";
import ReservationForm from "../components/forms/ReservationForm";
import type { Equipment } from "../../types/equipment";
import type { Person } from "../../types/person";
import RoomsSection from "../components/sections/RoomsSection";
import ReservationModal from "../components/modals/ReservationModal";
import { Pagination } from "../components/Pagination";

const STORAGE_KEY = "vrstudiolab-rooms-v1";

export default function ReservasPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [ready, setReady] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [confirmerName, setConfirmerName] = useState("");
    const [resourceType, setResourceType] = useState<"Sala" | "Equipamento">("Sala");
    const [resourceId, setResourceId] = useState("");
    const [reservedBy, setReservedBy] = useState("");
    const [reservationDate, setReservationDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [reservationNotes, setReservationNotes] = useState("");
    const [reservationsReady, setReservationsReady] = useState(false);
    const [reservationSearch, setReservationSearch] = useState("");
    const [reservationTypeFilter, setReservationTypeFilter] = useState("Todos");
    const [reservationStatusFilter, setReservationStatusFilter] = useState("Todos");
    const [reservationCurrentPage, setReservationCurrentPage] = useState(1);
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

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
        try {
            const saved = localStorage.getItem("vrstudiolab-maintenance-people-v1");

            if (saved !== null) {
                const parsed: unknown = JSON.parse(saved);
                setPeople(Array.isArray(parsed) ? (parsed as Person[]) : []);
            }
        } catch (error) {
            console.error("Não foi possível carregar as pessoas cadastradas.", error);
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
            returnStatus:
                resourceType === "Equipamento"
                    ? "Aguardando devolução"
                    : "Não se aplica",
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

    function reportEquipmentReturn(reservation: Reservation) {
        if (reservation.resourceType !== "Equipamento") {
            return;
        }

        if (
            reservation.status === "Cancelada" ||
            reservation.returnStatus === "Devolvida" ||
            reservation.returnStatus === "Devolução informada"
        ) {
            window.alert("Esta devolução já foi informada ou concluída.");
            return;
        }

        const confirmed = window.confirm(
            `Deseja informar a devolução do equipamento "${reservation.resourceName}"? A devolução ainda precisará ser confirmada por um responsável.`
        );

        if (!confirmed) return;

        setReservations((current) =>
            current.map((item) =>
                item.id === reservation.id
                    ? {
                        ...item,
                        returnStatus: "Devolução informada",
                        returnReportedAt: new Date().toISOString(),
                    }
                    : item
            )
        );

        window.alert(
            "Devolução informada. Aguarde a confirmação de um responsável."
        );
    }

    function confirmEquipmentReturn(
        reservation: Reservation,
        confirmerName: string
    ) {
        if (reservation.resourceType !== "Equipamento") {
            return;
        }

        if (reservation.returnStatus !== "Devolução informada") {
            window.alert("A pessoa precisa informar a devolução antes da confirmação.");
            return;
        }

        const confirmer = people.find(
            (person) =>
                person.name.trim().toLocaleLowerCase() ===
                confirmerName.trim().toLocaleLowerCase() &&
                person.active &&
                ["Técnico", "Responsável autorizado", "Gestor"].includes(
                    person.role
                )
        );

        if (!confirmer) {
            window.alert(
                "Somente um técnico, responsável autorizado ou gestor ativo pode confirmar a devolução."
            );
            return;
        }

        setReservations((current) =>
            current.map((item) =>
                item.id === reservation.id
                    ? {
                        ...item,
                        returnStatus: "Devolvida",
                        returnConfirmedAt: new Date().toISOString(),
                        returnConfirmedBy: confirmer.name,
                    }
                    : item
            )
        );

        window.alert("Devolução confirmada com sucesso!");
    }

    const filteredReservations = reservations.filter((reservation) => {
        const searchTerm = reservationSearch.trim().toLowerCase();

        const matchesSearch =
            !searchTerm ||
            reservation.resourceName.toLowerCase().includes(searchTerm) ||
            reservation.reservedBy.toLowerCase().includes(searchTerm);

        const matchesType =
            reservationTypeFilter === "Todos" ||
            reservation.resourceType === reservationTypeFilter;

        const matchesStatus =
            reservationStatusFilter === "Todos" ||
            getReservationDisplayStatus(reservation) === reservationStatusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    const reservationsPerPage = 10;

    const totalReservationPages = Math.max(
        1,
        Math.ceil(filteredReservations.length / reservationsPerPage)
    );

    const paginatedReservations = filteredReservations.slice(
        (reservationCurrentPage - 1) * reservationsPerPage,
        reservationCurrentPage * reservationsPerPage
    );

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
                                    onClick={() => setIsReservationModalOpen(true)}
                                    className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#07111f] shadow-md shadow-cyan-400/10 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/30 active:translate-y-0 active:scale-95"
                                >
                                    <span>+ </span>
                                    Realizar reserva
                                </button>
                            </div>


                            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <input
                                    type="text"
                                    value={reservationSearch}
                                    onChange={(event) => {
                                        setReservationSearch(event.target.value);
                                        setReservationCurrentPage(1);
                                    }}
                                    placeholder="Pesquisar pessoa ou recurso..."
                                    aria-label="Pesquisar reservas por pessoa ou recurso"
                                    className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-500"
                                />

                                <select
                                    value={reservationTypeFilter}
                                    onChange={(event) => {
                                        setReservationTypeFilter(event.target.value);
                                        setReservationCurrentPage(1);
                                    }}
                                    aria-label="Filtrar reservas por tipo de recurso"
                                    className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                                >
                                    <option value="Todos">Todos os recursos</option>
                                    <option value="Sala">Salas</option>
                                    <option value="Equipamento">Equipamentos</option>
                                </select>

                                <select
                                    value={reservationStatusFilter}
                                    onChange={(event) => {
                                        setReservationStatusFilter(event.target.value);
                                        setReservationCurrentPage(1);
                                    }}
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
                                    onClick={() => {
                                        setReservationSearch("");
                                        setReservationTypeFilter("Todos");
                                        setReservationStatusFilter("Todos");
                                        setReservationCurrentPage(1);
                                    }}
                                    className="rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                                >
                                    Limpar filtros
                                </button>
                            </div>

                            <p className="mb-4 text-sm text-slate-400">
                                {filteredReservations.length}{" "}
                                {filteredReservations.length === 1
                                    ? "reserva encontrada"
                                    : "reservas encontradas"}
                            </p>

                            {!reservationsReady ? (
                                <p className="py-6 text-center text-sm text-slate-400">
                                    Carregando reservas...
                                </p>
                            ) : reservations.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
                                    <p className="font-medium text-white">
                                        Nenhuma reserva realizada
                                    </p>
                                    <p className="mt-2 text-sm text-slate-400">
                                        As reservas confirmadas aparecerão aqui.
                                    </p>
                                </div>
                            ) : filteredReservations.length === 0 ? (
                                <p className="py-6 text-center text-sm text-slate-400">
                                    Nenhuma reserva encontrada com os filtros selecionados.
                                </p>
                            ) : (
                                <>
                                    <ReservationsTable
                                        reservations={paginatedReservations}
                                        people={people}
                                        confirmerName={confirmerName}
                                        onConfirmerChange={setConfirmerName}
                                        onReportReturn={reportEquipmentReturn}
                                        onConfirmReturn={confirmEquipmentReturn}
                                        onCancel={cancelReservation}
                                    />

                                    <Pagination
                                        currentPage={reservationCurrentPage}
                                        totalItems={filteredReservations.length}
                                        itemsPerPage={reservationsPerPage}
                                        onPageChange={setReservationCurrentPage}
                                    />
                                </>
                            )}
                        </section>

                        <RoomsSection
                            rooms={rooms}
                            ready={ready}
                            onNewRoom={openNewRoom}
                            onEditRoom={openEditRoom}
                            onToggleStatus={toggleRoomStatus}
                        />

                        <p className="text-xs text-slate-500">
                            VR Studio Lab · Cadastro de salas · Dados salvos neste navegador
                        </p>


                        <Footer />

                        <ReservationModal
                            isOpen={isReservationModalOpen}
                            onClose={() => setIsReservationModalOpen(false)}
                            rooms={rooms}
                            equipment={equipment}
                            resourceType={resourceType}
                            resourceId={resourceId}
                            reservedBy={reservedBy}
                            reservationDate={reservationDate}
                            startTime={startTime}
                            endTime={endTime}
                            reservationNotes={reservationNotes}
                            onResourceTypeChange={(value) => {
                                setResourceType(value);
                                setResourceId("");
                            }}
                            onResourceIdChange={setResourceId}
                            onReservedByChange={setReservedBy}
                            onReservationDateChange={setReservationDate}
                            onStartTimeChange={setStartTime}
                            onEndTimeChange={setEndTime}
                            onReservationNotesChange={setReservationNotes}
                            onSubmit={createReservation}
                        />

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
                </section>
            </div>
        </main>

    );
}
