"use client";

import { useEffect, useState } from "react";
import type { Room } from "../../types/room";
import type { Reservation } from "../../types/reservation";
import { RESERVATIONS_STORAGE_KEY, hasReservationConflict } from "./storage";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import BackToDashboard from "../components/buttons/BackToDashboard";
import Cards from "../components/Cards";
import { getReservationDisplayStatus } from "../components/tables/ReservationsTable";
import type { Equipment } from "../../types/equipment";
import type { Person } from "../../types/person";
import ReservationModal from "../components/modals/ReservationModal";
import ReservationsSection from "../components/sections/ReservationsSection";

const STORAGE_KEY = "vrstudiolab-rooms-v1";

export default function ReservasPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [ready, setReady] = useState(false);
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

                        <ReservationsSection
                            reservations={filteredReservations}
                            people={people}
                            ready={reservationsReady}
                            search={reservationSearch}
                            typeFilter={reservationTypeFilter}
                            statusFilter={reservationStatusFilter}
                            confirmerName={confirmerName}
                            resetPageKey={`${reservationSearch}|${reservationTypeFilter}|${reservationStatusFilter}`}
                            onSearchChange={setReservationSearch}
                            onTypeFilterChange={setReservationTypeFilter}
                            onStatusFilterChange={setReservationStatusFilter}
                            onClearFilters={() => {
                                setReservationSearch("");
                                setReservationTypeFilter("Todos");
                                setReservationStatusFilter("Todos");
                            }}
                            onNewReservation={() => setIsReservationModalOpen(true)}
                            onConfirmerChange={setConfirmerName}
                            onReportReturn={reportEquipmentReturn}
                            onConfirmReturn={confirmEquipmentReturn}
                            onCancel={cancelReservation}
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
                    </div>
                </section>
            </div>
        </main>

    );
}