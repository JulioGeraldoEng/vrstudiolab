"use client";

import { useEffect, useState } from "react";
import type { Room } from "../../types/room";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import BackToDashboard from "../components/buttons/BackToDashboard";
import RoomsSection from "../components/sections/RoomsSection";
import RoomModal from "../components/modals/RoomModal";
import Cards from "../components/Cards";

const STORAGE_KEY = "vrstudiolab-rooms-v1";

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [ready, setReady] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

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
        if (!ready) return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
        } catch (error) {
            console.error("Não foi possível salvar as salas.", error);
            window.alert("Não foi possível salvar as salas no navegador.");
        }
    }, [rooms, ready]);

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

    return (
        <main className="min-h-screen bg-[#0b1120] text-white">
            <div className="flex min-h-screen w-full flex-col lg:flex-row">
                <Sidebar activePage="Salas" />

                <section className="min-w-0 flex-1 p-4 sm:p-8">
                    <div className="mx-auto max-w-7xl space-y-8">
                        <header>
                            <BackToDashboard />

                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                                VR STUDIO LAB
                            </p>

                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Salas
                            </h1>

                            <p className="mt-2 text-sm text-slate-400">
                                Cadastre e gerencie as salas disponíveis para utilização e reserva.
                            </p>
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