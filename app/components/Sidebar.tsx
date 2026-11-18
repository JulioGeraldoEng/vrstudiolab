"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Permission } from "../../types/permissions";
import { CURRENT_ACCESS_PROFILE } from "../../lib/permissions/current-profile";
import { hasPermission } from "../../lib/permissions/has-permission";
import Image from "next/image";

const navigation: {
  name: string;
  icon: string;
  href: string;
  permissions: Permission[];
}[] = [
    {
      name: "Visão geral",
      icon: "dashboard",
      href: "/dashboard",
      permissions: ["dashboard.view"],
    },
    {
      name: "Equipamentos",
      icon: "equipment",
      href: "/equipment",
      permissions: ["equipment.view"],
    },
    {
      name: "Manutenção",
      icon: "maintenance",
      href: "/maintenance",
      permissions: ["maintenance.viewOwn", "maintenance.viewAll"],
    },
    {
      name: "Pessoas",
      icon: "people",
      href: "/people",
      permissions: ["people.viewOwn", "people.viewAll"],
    },
    {
      name: "Salas",
      icon: "rooms",
      href: "/rooms",
      permissions: ["rooms.view"],
    },
    {
      name: "Reservas",
      icon: "reservations",
      href: "/reservations",
      permissions: ["reservations.viewOwn", "reservations.viewAll"],
    },
    {
      name: "Calendário",
      icon: "calendar",
      href: "/calendar",
      permissions: ["calendar.view"],
    },
    {
      name: "Relatórios",
      icon: "reports",
      href: "/reports",
      permissions: ["reports.view"],
    },
  ];

type SidebarProps = {
  activePage?: string;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

function NavigationIcon({ name }: { name: string }) {
  const common = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );

    case "equipment":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8M8 11h8M8 15h5" />
        </svg>
      );

    case "maintenance":
      return (
        <svg {...common}>
          <path d="M14.5 6.5a5 5 0 0 0-6.7 6.7L3 18l3 3 4.8-4.8a5 5 0 0 0 6.7-6.7l-3 3-3-3z" />
          <path d="m15 5 4-2 4 4-2 4" />
        </svg>
      );

    case "people":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20v-1.5a6.5 6.5 0 0 1 13 0V20z" />
          <path d="M16 5.5a3.5 3.5 0 0 1 0 6.8M19 14a5 5 0 0 1 2.5 4.5V20" />
        </svg>
      );

    case "rooms":
      return (
        <svg {...common}>
          <path d="M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16" />
          <path d="M3 21h18" />
          <rect x="7" y="7" width="4" height="4" rx="0.5" />
          <rect x="13" y="7" width="4" height="4" rx="0.5" />
          <rect x="7" y="14" width="4" height="7" rx="0.5" />
          <rect x="13" y="14" width="4" height="4" rx="0.5" />
        </svg>
      );

    case "reservations":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
          <path d="m9 15 2 2 4-4" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
        </svg>
      );

    case "reports":
      return (
        <svg {...common}>
          <path d="M6 3h9l4 4v14H6z" />
          <path d="M14 3v5h5M9 12h7M9 16h7" />
        </svg>
      );

    default:
      return null;
  }
}

export default function Sidebar({
  activePage = "",
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {

  const router = useRouter();
  const pathname = usePathname();
  const visibleNavigation = navigation.filter((item) =>
    item.permissions.some((permission) =>
      hasPermission(CURRENT_ACCESS_PROFILE, permission)
    )
  );
  const [collapsed, setCollapsed] = useState(false);
  const [preferenceLoaded, setPreferenceLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vrstudiolab-sidebar-collapsed");

    const timeoutId = window.setTimeout(() => {
      if (saved !== null) {
        setCollapsed(saved === "true");
      }

      setPreferenceLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (preferenceLoaded) {
      localStorage.setItem(
        "vrstudiolab-sidebar-collapsed",
        String(collapsed)
      );
    }
  }, [collapsed, preferenceLoaded]);

  function navigate(href: string) {
    const destination = href === "/" ? "/" : `${href}/`;
    router.push(destination);
  }

  function navigateMobile(href: string) {
    setMobileOpen(false);
    navigate(href);
  }

  function renderLink(
    item: (typeof navigation)[number],
    mobile = false,
  ) {
    const active =
      pathname === item.href ||
      pathname === `${item.href}/` ||
      (activePage === item.name &&
        (item.name !== "Visão geral" || pathname === "/"));


    if (mobile) {
      return (
        <button
          key={item.name}
          type="button"
          onClick={() => navigateMobile(item.href)}
          title={item.name}
          aria-label={item.name}
          className={`flex w-full items-center rounded-xl py-3 text-left text-sm transition ${mobileOpen ? "gap-3 px-3" : "justify-center px-2"
            } ${active
              ? "border border-cyan-400/20 bg-cyan-400/10 font-medium text-red-300"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
        >
          <span className="flex shrink-0 items-center justify-center">
            <NavigationIcon name={item.icon} />
          </span>

          {mobileOpen && <span>{item.name}</span>}
        </button>
      );
    }


    return (
      <button
        key={item.name}
        onClick={() => navigate(item.href)}
        title={collapsed ? item.name : undefined}
        aria-label={item.name}
        className={`flex w-full items-center rounded-xl py-3 text-left text-sm transition ${collapsed ? "justify-center px-2" : "gap-3 px-3"
          } ${active
            ? "border border-cyan-400/20 bg-cyan-400/10 font-medium text-red-300"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
      >
        <span className="flex shrink-0 items-center justify-center">
          <NavigationIcon name={item.icon} />
        </span>

        {!collapsed && <span>{item.name}</span>}
      </button>
    );
  }

  return (
    <>
      <div
        className={`hidden shrink-0 lg:block ${preferenceLoaded
          ? `transition-[width] duration-200 ${collapsed ? "w-16" : "w-56 xl:w-64"
          }`
          : "w-20"
          }`}
      >

      </div>
      <aside
        className={`fixed left-0 top-0 hidden h-screen shrink-0 flex-col border-r border-white/10 bg-[#0e1729] ${collapsed ? "p-2" : "p-4"} ${preferenceLoaded ? "transition-[width] duration-200" : ""} ${preferenceLoaded ? "lg:flex" : "lg:hidden"} ${collapsed ? "w-16" : "w-56 xl:w-64 xl:p-3"}`}
      >

        <div className="mb-4">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={
              collapsed
                ? "Expandir menu lateral"
                : "Recolher menu lateral"
            }
            title={
              collapsed
                ? "Expandir menu"
                : "Recolher menu"
            }
            className={`group flex w-full items-center rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${collapsed
              ? "justify-center"
              : "justify-start"
              }`}
          >
            <span
              className={`relative block overflow-hidden rounded-xl border border-cyan-400/20 bg-[#071326] shadow-lg shadow-cyan-950/20 transition-all duration-200 group-hover:border-cyan-400/60 group-hover:shadow-cyan-500/20 ${collapsed
                ? "aspect-square w-11"
                : "aspect-[16/9] w-full"
                }`}
            >
              <Image
                src="/vrstudiolab/animations/vr-studio-lab-sidebar.gif"
                alt="VR Studio Lab - expandir ou recolher menu"
                fill
                unoptimized
                sizes={collapsed ? "44px" : "220px"}
                className="object-cover"
              />
            </span>
          </button>
        </div>

        {!collapsed && (
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Menu principal
          </p>
        )}

        <nav className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-1 pr-1">
          {visibleNavigation.map((item) => renderLink(item))}
        </nav>

      </aside >


      <div className="lg:hidden">
        {mobileOpen && (
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60"
          />
        )}

        <aside
          className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/10 bg-[#0e1729] p-2 shadow-2xl transition-all duration-300 ease-in-out ${mobileOpen ? "w-64" : "w-16"
            }`}
        >
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={
                mobileOpen ? "Recolher menu lateral" : "Expandir menu lateral"
              }
              aria-expanded={mobileOpen}
              className="group flex w-full items-center justify-center rounded-xl transition-all duration-200"
            >
              <span
                className={`relative block overflow-hidden rounded-xl border border-cyan-400/20 bg-[#071326] shadow-lg shadow-cyan-950/20 transition-all duration-200 group-hover:border-cyan-400/60 ${mobileOpen ? "aspect-[16/9] w-full" : "aspect-square w-11"
                  }`}
              >
                <Image
                  src="/vrstudiolab/animations/vr-studio-lab-sidebar.gif"
                  alt="VR Studio Lab - expandir ou recolher menu"
                  fill
                  unoptimized
                  sizes={mobileOpen ? "240px" : "44px"}
                  className="object-cover"
                />
              </span>
            </button>
          </div>

          {mobileOpen && (
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Menu principal
            </p>
          )}

          <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
            {visibleNavigation.map((item) => renderLink(item, true))}
          </nav>
        </aside>
      </div>

    </>
  );
}