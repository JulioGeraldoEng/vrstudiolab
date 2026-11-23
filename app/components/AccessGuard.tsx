"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import type { Permission } from "../../types/permissions";
import { hasPermission } from "../../lib/permissions/has-permission";
import { usePermissions } from "./permissions/PermissionProvider";

const ROUTE_PERMISSIONS: {
  path: string;
  permissions: Permission[];
}[] = [
  { path: "/dashboard", permissions: ["dashboard.view"] },
  { path: "/equipment", permissions: ["equipment.view"] },
  {
    path: "/maintenance",
    permissions: [
      "maintenance.request",
      "maintenance.viewOwn",
      "maintenance.viewAll",
    ],
  },
  { path: "/people", permissions: ["people.viewAll"] },
  { path: "/rooms", permissions: ["rooms.view"] },
  {
    path: "/reservations",
    permissions: ["reservations.viewOwn", "reservations.viewAll"],
  },
  { path: "/calendar", permissions: ["calendar.view"] },
  { path: "/reports", permissions: ["reports.view"] },
  { path: "/permissions", permissions: ["permissions.view"] },
];

export default function AccessGuard({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const {
    profileOverrides,
    individualOverrides,
    permissionsLoaded,
    currentUser,
  } = usePermissions();

  const currentProfileOverrides = currentUser
    ? profileOverrides[currentUser.profile]
    : undefined;

  const currentIndividualOverrides = currentUser
    ? individualOverrides[currentUser.personId]
    : undefined;

  const normalizedPath =
    pathname.replace(/^\/vrstudiolab(?=\/|$)/, "") || "/";

  const requiredPermissions =
    normalizedPath === "/"
      ? ["dashboard.view" as Permission]
      : normalizedPath === "/seed" ||
          normalizedPath.startsWith("/seed/")
        ? ["settings.manage" as Permission]
        : ROUTE_PERMISSIONS.find(
            (route) =>
              normalizedPath === route.path ||
              normalizedPath.startsWith(`${route.path}/`)
          )?.permissions;

  if (!permissionsLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b1120] text-white">
        <p className="text-sm text-slate-400">
          Carregando permissões...
        </p>
      </main>
    );
  }

  const allowed =
    currentUser !== null &&
    (!requiredPermissions ||
      requiredPermissions.some((permission) =>
        hasPermission(
          currentUser.profile,
          permission,
          currentIndividualOverrides,
          currentProfileOverrides
        )
      ));

  if (!allowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b1120] px-6 text-white">
        <section className="max-w-md text-center">
          <h1 className="mb-3 text-2xl font-bold">
            Acesso não autorizado
          </h1>

          <p className="mb-6 text-sm text-slate-400">
            Seu perfil não possui permissão para acessar esta página.
          </p>

          <Link
            href="/"
            className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            Voltar ao início
          </Link>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}