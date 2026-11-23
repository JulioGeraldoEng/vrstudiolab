
"use client";

import { useEffect, useState } from "react";

import type {
    AccessProfile,
    Permission,
} from "../../types/permissions";

import type { Person } from "../../types/person";

import { hasPermission } from "../../lib/permissions/has-permission";
import { usePermissions } from "../components/permissions/PermissionProvider";
import BackToDashboard from "../components/buttons/BackToDashboard";

const PEOPLE_STORAGE_KEY = "vrstudiolab-maintenance-people-v1";

const activePage = "Permissões";

const profiles: {
    id: AccessProfile;
    name: string;
}[] = [
    { id: "user", name: "Usuário" },
    { id: "lab_manager", name: "Responsável pelo laboratório" },
    { id: "administrator", name: "Administrador" },
];

const moduleNames: Record<string, string> = {
    dashboard: "Visão geral",
    calendar: "Calendário",
    equipment: "Equipamentos",
    maintenance: "Manutenção",
    reservations: "Reservas",
    loans: "Empréstimos",
    people: "Pessoas",
    rooms: "Salas",
    reports: "Relatórios",
    permissions: "Permissões",
    settings: "Configurações",
    audit: "Auditoria",
    securityNotifications: "Notificações de segurança",
    seed: "Dados de teste",
};

const actionNames: Record<string, string> = {
    view: "Visualizar",
    viewOwn: "Visualizar próprios registros",
    viewAll: "Visualizar todos os registros",
    create: "Cadastrar",
    edit: "Editar",
    updateStatus: "Atualizar situação",
    deactivate: "Desativar",
    deletePermanent: "Excluir permanentemente",
    request: "Solicitar",
    openOrder: "Abrir ordem de serviço",
    editOrder: "Editar ordem de serviço",
    completeOrder: "Concluir ordem de serviço",
    cancelOwn: "Cancelar própria reserva",
    cancelAny: "Cancelar qualquer reserva",
    approve: "Aprovar",
    editAny: "Editar qualquer registro",
    registerPickup: "Registrar retirada",
    registerReturn: "Registrar devolução",
    confirmReturn: "Confirmar devolução",
    manageProfiles: "Gerenciar perfis",
    manageIndividual: "Gerenciar permissões individuais",
    export: "Exportar",
    manage: "Gerenciar",
    viewOperational: "Visualizar auditoria operacional",
};

const protectedPermissions: Permission[] = [
    "equipment.deletePermanent",
    "maintenance.deletePermanent",
    "reservations.deletePermanent",
    "loans.deletePermanent",
    "people.create",
    "people.deactivate",
    "people.deletePermanent",
    "rooms.deletePermanent",
    "permissions.view",
    "permissions.manageProfiles",
    "permissions.manageIndividual",
    "settings.view",
    "settings.manage",
    "audit.viewAll",
    "securityNotifications.manage",
    "seed.manage",
];

const allPermissions: Permission[] = [
    "dashboard.view",
    "calendar.view",
    "equipment.view",
    "equipment.create",
    "equipment.edit",
    "equipment.updateStatus",
    "equipment.deactivate",
    "equipment.deletePermanent",
    "maintenance.request",
    "maintenance.viewOwn",
    "maintenance.viewAll",
    "maintenance.openOrder",
    "maintenance.editOrder",
    "maintenance.completeOrder",
    "maintenance.deletePermanent",
    "reservations.request",
    "reservations.viewOwn",
    "reservations.viewAll",
    "reservations.cancelOwn",
    "reservations.cancelAny",
    "reservations.approve",
    "reservations.editAny",
    "reservations.deletePermanent",
    "loans.request",
    "loans.viewOwn",
    "loans.viewAll",
    "loans.approve",
    "loans.registerPickup",
    "loans.registerReturn",
    "loans.confirmReturn",
    "loans.editAny",
    "loans.deletePermanent",
    "people.viewOwn",
    "people.viewAll",
    "people.create",
    "people.edit",
    "people.deactivate",
    "people.deletePermanent",
    "rooms.view",
    "rooms.create",
    "rooms.edit",
    "rooms.deactivate",
    "rooms.deletePermanent",
    "reports.view",
    "reports.export",
    "permissions.view",
    "permissions.manageProfiles",
    "permissions.manageIndividual",
    "settings.view",
    "settings.manage",
    "audit.viewOperational",
    "audit.viewAll",
    "securityNotifications.view",
    "securityNotifications.manage",
    "seed.manage",
];

function getPermissionName(permission: Permission) {
    const action = permission.split(".")[1];

    return actionNames[action] ?? action;
}

function getValidAccessProfile(value: unknown): AccessProfile {
    if (
        value === "user" ||
        value === "lab_manager" ||
        value === "administrator"
    ) {
        return value;
    }

    return "user";
}

export default function PermissionsPage() {
    const [activeTab, setActiveTab] = useState<
        "profile" | "individual"
    >("profile");

    const [selectedProfile, setSelectedProfile] =
        useState<AccessProfile>("user");

    const [people, setPeople] = useState<Person[]>([]);
    const [peopleLoaded, setPeopleLoaded] = useState(false);
    const [selectedPersonId, setSelectedPersonId] = useState("");

    const {
        profileOverrides,
        individualOverrides,
        permissionsLoaded,
        currentUser,
        updateProfilePermission,
        updateIndividualPermission,
    } = usePermissions();

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            try {
                const savedPeople = localStorage.getItem(PEOPLE_STORAGE_KEY);

                if (savedPeople) {
                    const parsed: unknown = JSON.parse(savedPeople);

                    if (Array.isArray(parsed)) {
                        const loadedPeople: Person[] = parsed
                            .filter((item: unknown) => {
                                if (!item || typeof item !== "object") {
                                    return false;
                                }

                                const person = item as Partial<Person>;

                                return (
                                    typeof person.id === "string" &&
                                    typeof person.name === "string"
                                );
                            })
                            .map((item: Person) => ({
                                ...item,
                                accessProfile: getValidAccessProfile(
                                    item.accessProfile
                                ),
                                active: item.active !== false,
                            }));

                        setPeople(loadedPeople);

                        const firstActivePerson = loadedPeople.find(
                            (person) => person.active
                        );

                        if (firstActivePerson) {
                            setSelectedPersonId(firstActivePerson.id);
                        }
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar pessoas:", error);
                alert("Não foi possível carregar a lista de pessoas.");
            } finally {
                setPeopleLoaded(true);
            }
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, []);

    if (!permissionsLoaded || !peopleLoaded) {
        return (
            <main className="min-h-screen bg-[#0b1120] p-6 text-white">
                Carregando permissões...
            </main>
        );
    }

    const groupedPermissions: Record<string, Permission[]> = {};

    for (const permission of allPermissions) {
        const moduleName = permission.split(".")[0];

        if (!groupedPermissions[moduleName]) {
            groupedPermissions[moduleName] = [];
        }

        groupedPermissions[moduleName].push(permission);
    }

    const profileName =
        profiles.find((profile) => profile.id === selectedProfile)?.name;

    const activePeople = people.filter((person) => person.active);

    const selectedPerson = activePeople.find(
        (person) => person.id === selectedPersonId
    );

    const selectedPersonProfile =
        selectedPerson?.accessProfile ?? "user";

    const selectedPersonOverrides = selectedPerson
        ? individualOverrides[selectedPerson.id] ?? {}
        : {};

    const isCurrentPerson =
        selectedPerson !== undefined &&
        selectedPerson.id === currentUser?.personId;

    return (
        <section className="min-w-0 flex-1 p-4 sm:p-8">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* CABEÇALHO */}

                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white sm:text-3xl">
                            {activePage}
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            Configure os níveis de acesso e as permissões de cada pessoa.
                        </p>
                    </div>

                    <BackToDashboard />
                </header>

                {/* SELETOR DE ÁREAS */}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <button
                        type="button"
                        onClick={() => setActiveTab("profile")}
                        className={`group rounded-xl border p-5 text-left transition-all duration-300 ${activeTab === "profile"
                            ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/5"
                            : "border-white/10 bg-[#111c30] hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-[#17243a]"
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl transition ${activeTab === "profile"
                                    ? "bg-cyan-400/20 text-cyan-300"
                                    : "bg-white/5 text-slate-400 group-hover:text-cyan-300"
                                    }`}
                            >
                                <span aria-hidden="true">♙</span>
                            </div>

                            <div>
                                <h2
                                    className={`font-semibold ${activeTab === "profile"
                                        ? "text-cyan-300"
                                        : "text-white"
                                        }`}
                                >
                                    Permissões por perfil
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Configure as permissões padrão de cada perfil.
                                </p>
                            </div>
                        </div>

                        {activeTab === "profile" && (
                            <div className="mt-4 h-1 w-full rounded-full bg-cyan-400" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("individual")}
                        className={`group rounded-xl border p-5 text-left transition-all duration-300 ${activeTab === "individual"
                            ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/5"
                            : "border-white/10 bg-[#111c30] hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-[#17243a]"
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl transition ${activeTab === "individual"
                                    ? "bg-cyan-400/20 text-cyan-300"
                                    : "bg-white/5 text-slate-400 group-hover:text-cyan-300"
                                    }`}
                            >
                                <span aria-hidden="true">👤</span>
                            </div>

                            <div>
                                <h2
                                    className={`font-semibold ${activeTab === "individual"
                                        ? "text-cyan-300"
                                        : "text-white"
                                        }`}
                                >
                                    Permissões individuais
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Personalize as permissões de cada pessoa.
                                </p>
                            </div>
                        </div>

                        {activeTab === "individual" && (
                            <div className="mt-4 h-1 w-full rounded-full bg-cyan-400" />
                        )}
                    </button>
                </div>

                {/* CONTEÚDO: PERMISSÕES POR PERFIL */}

                {activeTab === "profile" && (
                    <section className="space-y-5">
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                Configuração por perfil
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Defina as permissões padrão para cada nível de acesso.
                            </p>
                        </div>

                        <section className="rounded-2xl border border-white/10 bg-[#111c30] p-5">
                            <label
                                htmlFor="profile"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Perfil de acesso
                            </label>

                            <select
                                id="profile"
                                value={selectedProfile}
                                onChange={(event) =>
                                    setSelectedProfile(
                                        event.target.value as AccessProfile
                                    )
                                }
                                className="w-full max-w-md rounded-xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                            >
                                {profiles.map((profile) => (
                                    <option key={profile.id} value={profile.id}>
                                        {profile.name}
                                    </option>
                                ))}
                            </select>

                            <p className="mt-3 text-xs text-slate-500">
                                As alterações são salvas automaticamente para o perfil selecionado.
                            </p>
                        </section>

                        <div className="space-y-5">
                            {Object.entries(groupedPermissions).map(
                                ([moduleName, permissions]) => (
                                    <section
                                        key={moduleName}
                                        className="overflow-hidden rounded-2xl border border-white/10 bg-[#111c30]"
                                    >
                                        <div className="border-b border-white/10 px-5 py-4">
                                            <h3 className="font-semibold text-white">
                                                {moduleNames[moduleName] ?? moduleName}
                                            </h3>
                                        </div>

                                        <div className="divide-y divide-white/5">
                                            {permissions.map((permission) => {
                                                const overrides =
                                                    profileOverrides[selectedProfile] ?? {};

                                                const hasOverride =
                                                    Object.prototype.hasOwnProperty.call(
                                                        overrides,
                                                        permission
                                                    );

                                                const allowed = hasPermission(
                                                    selectedProfile,
                                                    permission,
                                                    overrides
                                                );

                                                const isProtected =
                                                    protectedPermissions.includes(permission);

                                                return (
                                                    <div
                                                        key={permission}
                                                        className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-200">
                                                                {getPermissionName(permission)}
                                                            </p>

                                                            {isProtected ? (
                                                                <p className="mt-1 text-xs text-amber-400">
                                                                    Permissão exclusiva do administrador
                                                                </p>
                                                            ) : (
                                                                <p className="mt-1 text-xs text-slate-500">
                                                                    {hasOverride
                                                                        ? "Personalizada"
                                                                        : "Padrão do perfil"}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={allowed}
                                                                    disabled={isProtected}
                                                                    onChange={(event) =>
                                                                        updateProfilePermission(
                                                                            selectedProfile,
                                                                            permission,
                                                                            event.target.checked
                                                                        )
                                                                    }
                                                                    className="h-4 w-4 accent-cyan-400 disabled:cursor-not-allowed"
                                                                />

                                                                {allowed ? "Permitido" : "Bloqueado"}
                                                            </label>

                                                            <button
                                                                type="button"
                                                                disabled={!hasOverride || isProtected}
                                                                onClick={() =>
                                                                    updateProfilePermission(
                                                                        selectedProfile,
                                                                        permission,
                                                                        null
                                                                    )
                                                                }
                                                                className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                                                            >
                                                                Restaurar padrão
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>
                                )
                            )}
                        </div>

                        <p className="text-xs text-slate-500">
                            Perfil selecionado: {profileName}
                        </p>
                    </section>
                )}

                {/* CONTEÚDO: PERMISSÕES INDIVIDUAIS */}

                {activeTab === "individual" && (
                    <section className="space-y-5">
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                Configuração individual
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Personalize permissões sem alterar as demais pessoas do mesmo perfil.
                            </p>
                        </div>

                        <section className="rounded-2xl border border-white/10 bg-[#111c30] p-5">
                            <label
                                htmlFor="person"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Selecionar pessoa
                            </label>

                            <select
                                id="person"
                                value={selectedPersonId}
                                onChange={(event) =>
                                    setSelectedPersonId(event.target.value)
                                }
                                className="w-full max-w-md rounded-xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                            >
                                <option value="">
                                    Selecione uma pessoa
                                </option>

                                {activePeople.map((person) => (
                                    <option key={person.id} value={person.id}>
                                        {person.name}
                                    </option>
                                ))}
                            </select>

                            {selectedPerson && (
                                <div className="mt-4 rounded-xl border border-white/5 bg-[#0b1120] p-4">
                                    <p className="text-sm font-medium text-white">
                                        {selectedPerson.name}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Perfil herdado:{" "}
                                        {profiles.find(
                                            (profile) =>
                                                profile.id === selectedPersonProfile
                                        )?.name}
                                    </p>
                                </div>
                            )}
                        </section>

                        {!selectedPerson ? (
                            <div className="rounded-2xl border border-white/10 bg-[#111c30] px-6 py-12 text-center">
                                <p className="font-medium text-slate-300">
                                    {activePeople.length === 0
                                        ? "Nenhuma pessoa ativa cadastrada."
                                        : "Selecione uma pessoa para configurar suas permissões."}
                                </p>
                            </div>
                        ) : (
                            <>
                                {isCurrentPerson && (
                                    <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-300">
                                        Esta é a sua própria conta. Por segurança, não é possível alterar suas permissões individuais.
                                    </div>
                                )}

                                {Object.entries(groupedPermissions).map(
                                    ([moduleName, permissions]) => (
                                        <section
                                            key={moduleName}
                                            className="overflow-hidden rounded-2xl border border-white/10 bg-[#111c30]"
                                        >
                                            <div className="border-b border-white/10 px-5 py-4">
                                                <h3 className="font-semibold text-white">
                                                    {moduleNames[moduleName] ?? moduleName}
                                                </h3>
                                            </div>

                                            <div className="divide-y divide-white/5">
                                                {permissions.map((permission) => {
                                                    const hasOverride =
                                                        Object.prototype.hasOwnProperty.call(
                                                            selectedPersonOverrides,
                                                            permission
                                                        );

                                                    const allowed = hasPermission(
                                                        selectedPersonProfile,
                                                        permission,
                                                        selectedPersonOverrides,
                                                        profileOverrides[selectedPersonProfile]
                                                    );

                                                    const isProtected =
                                                        protectedPermissions.includes(permission);

                                                    const disabled =
                                                        isProtected || isCurrentPerson;

                                                    return (
                                                        <div
                                                            key={permission}
                                                            className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                                                        >
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-200">
                                                                    {getPermissionName(permission)}
                                                                </p>

                                                                <p className="mt-1 text-xs text-slate-500">
                                                                    {isProtected
                                                                        ? "Permissão exclusiva do administrador"
                                                                        : hasOverride
                                                                            ? "Personalizada para esta pessoa"
                                                                            : "Herdada do perfil"}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                <label className="flex items-center gap-2 text-sm text-slate-300">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={allowed}
                                                                        disabled={disabled}
                                                                        onChange={(event) =>
                                                                            updateIndividualPermission(
                                                                                selectedPerson.id,
                                                                                permission,
                                                                                event.target.checked
                                                                            )
                                                                        }
                                                                        className="h-4 w-4 accent-cyan-400 disabled:cursor-not-allowed"
                                                                    />

                                                                    {allowed
                                                                        ? "Permitido"
                                                                        : "Bloqueado"}
                                                                </label>

                                                                <button
                                                                    type="button"
                                                                    disabled={!hasOverride || disabled}
                                                                    onClick={() =>
                                                                        updateIndividualPermission(
                                                                            selectedPerson.id,
                                                                            permission,
                                                                            null
                                                                        )
                                                                    }
                                                                    className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                                                                >
                                                                    Restaurar perfil
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    )
                                )}
                            </>
                        )}
                    </section>
                )}
            </div>
        </section>
    );
}
