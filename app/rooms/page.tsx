
"use client";

import { useEffect, useState } from "react";
import type { Room } from "../../types/room";
import type { Permission } from "../../types/permissions";
import BackToDashboard from "../components/buttons/BackToDashboard";
import RoomsSection from "../components/sections/RoomsSection";
import RoomModal from "../components/modals/RoomModal";
import Cards from "../components/cards/Cards";
import { hasPermission } from "../../lib/permissions/has-permission";
import { usePermissions } from "../components/permissions/PermissionProvider";

const STORAGE_KEY = "vrstudiolab-rooms-v1";

const activePage = "Salas";

export default function RoomsPage() {
    const {
        profileOverrides,
        individualOverrides,
        permissionsLoaded,
        currentUser,
    } = usePermissions();

    function can(permission: Permission): boolean {
        if (!permissionsLoaded || !currentUser) return false;

        return hasPermission(
            currentUser.profile,
            permission,
            individualOverrides[currentUser.personId],
            profileOverrides[currentUser.profile]
        );
    }

    const [rooms, setRooms] = useState<Room[]>([]);
    const [ready, setReady] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
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
        }, 0);

        return () => window.clearTimeout(timeout);
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
        if (!can("rooms.create")) {
            alert("Você não possui permissão para cadastrar salas.");
            return;
        }

        setEditingRoom(null);
        setShowModal(true);
    }

    function openEditRoom(room: Room) {
        if (!can("rooms.edit")) {
            alert("Você não possui permissão para editar salas.");
            return;
        }

        setEditingRoom(room);
        setShowModal(true);
    }

    function saveRoom(data: Omit<Room, "id">) {
        if (
            editingRoom
                ? !can("rooms.edit")
                : !can("rooms.create")
        ) {
            alert("Você não possui permissão para realizar esta operação.");
            return;
        }

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
        if (!can("rooms.deactivate")) {
            alert("Você não possui permissão para alterar a situação das salas.");
            return;
        }

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
        <section className="min-w-0 flex-1 p-4 sm:p-8">
            <div className="mx-auto max-w-7xl space-y-8">

                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white sm:text-3xl">
                            {activePage}
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            Gerencie os ambientes e espaços disponíveis no laboratório.
                        </p>
                    </div>

                    <BackToDashboard />
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
    );
}
