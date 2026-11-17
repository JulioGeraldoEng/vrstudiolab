"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Permission } from "../../types/permissions";
import { CURRENT_ACCESS_PROFILE } from "../../lib/permissions/current-profile";
import { hasPermission } from "../../lib/permissions/has-permission";

const ROUTE_PERMISSIONS: {
  path: string;
  permission: Permission;
}[] = [
  { path: "/equipment", permission: "equipment.view" },
  { path: "/maintenance", permission: "maintenance.viewAll" },
  { path: "/people", permission: "people.viewAll" },
  { path: "/rooms", permission: "rooms.view" },
  { path: "/reservations", permission: "reservations.viewAll" },
  { path: "/calendar", permission: "calendar.view" },
  { path: "/reports", permission: "reports.view" },
];

export default function AccessGuard({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const normalizedPath =
    pathname.replace(/^\/vrstudiolab(?=\/|$)/, "") || "/";

  const requiredPermission =
    normalizedPath === "/"
      ? "dashboard.view"
      : normalizedPath === "/seed" ||
          normalizedPath.startsWith("/seed/")
        ? "settings.manage"
        : ROUTE_PERMISSIONS.find(
            (route) =>
              normalizedPath === route.path ||
              normalizedPath.startsWith(`${route.path}/`)
          )?.permission;

  const allowed =
    !requiredPermission ||
    hasPermission(CURRENT_ACCESS_PROFILE, requiredPermission);

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