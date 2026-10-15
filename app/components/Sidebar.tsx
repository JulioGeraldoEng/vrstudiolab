
"use client";


import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const navigation = [
  { name: "Visão geral", icon: "dashboard", href: "/" },
  { name: "Equipamentos", icon: "equipment", href: "/inventario" },
  { name: "Manutenção", icon: "maintenance", href: "/manutencao" },
  { name: "Pessoas", icon: "people", href: "/pessoas" },
  { name: "Relatórios", icon: "reports", href: "/relatorios" },
];

type SidebarProps = {
  activePage?: string;
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
}: SidebarProps) {

  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [preferenceLoaded, setPreferenceLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vrstudiolab-sidebar-collapsed");

    if (saved !== null) {
      setCollapsed(saved === "true");
    }

    setPreferenceLoaded(true);
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

  function renderLink(
    item: (typeof navigation)[number],
    mobile = false,
  ) {
    const active =
      activePage === item.name ||
      (item.name === "Visão geral" && activePage === "");

    if (mobile) {
      return (
        <button
          key={item.name}
          onClick={() => navigate(item.href)}
          className={`shrink-0 rounded-lg px-3 py-2 text-sm transition ${active
            ? "bg-cyan-400/10 text-cyan-300"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
        >
          {item.name}
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
            ? "border border-cyan-400/20 bg-cyan-400/10 font-medium text-cyan-300"
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
            ? `transition-[width] duration-200 ${collapsed ? "w-20" : "w-56 xl:w-64"
            }`
            : "w-20"
          }`}
      >

      </div>
      <aside
        className={`fixed left-0 top-0 hidden h-screen shrink-0 flex-col border-r border-white/10 bg-[#0e1729] p-4 ${preferenceLoaded ? "transition-[width] duration-200" : ""} ${preferenceLoaded ? "lg:flex" : "lg:hidden"} ${collapsed ? "w-20" : "w-56 xl:w-64 xl:p-5"}`}
      >
        <div
          className={`mb-8 flex items-center ${collapsed ? "flex-col gap-4" : "justify-between gap-3"
            }`}
        >
          <div
            className={`flex min-w-0 items-center ${collapsed ? "justify-center" : "gap-3"
              }`}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/20 to-blue-500/10 text-cyan-300 shadow-lg shadow-cyan-950/20"
              title="VR Studio Lab"
            >
              <svg
                width="27"
                height="27"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M16 3 28 10v12l-12 7L4 22V10L16 3Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="m16 8 7 4v8l-7 4-7-4v-8l7-4Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="m12 13 4 7 4-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <h1 className="whitespace-nowrap text-sm font-bold tracking-wide">
                  VR STUDIO LAB
                </h1>
                <p className="mt-1 text-xs text-slate-400">
                  Gestão de equipamentos
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={
              collapsed ? "Expandir menu lateral" : "Recolher menu lateral"
            }
            title={
              collapsed ? "Expandir menu" : "Recolher menu"
            }
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-cyan-300"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M9 4v16" />
              {collapsed ? (
                <path d="m13 9 3 3-3 3" />
              ) : (
                <path d="m16 9-3 3 3 3" />
              )}
            </svg>
          </button>
        </div>

        {!collapsed && (
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Menu principal
          </p>
        )}

        <nav className="flex flex-col gap-2">
          {navigation.map((item) => renderLink(item))}
        </nav>

        <div
          className={`mt-auto rounded-2xl border border-white/10 bg-[#111e33] ${collapsed ? "flex justify-center p-3" : "p-4"
            }`}
          title={collapsed ? "Ambiente de testes" : undefined}
        >
          <div
            className={`flex items-center gap-2 text-sm font-semibold ${collapsed ? "justify-center" : "mb-2"
              }`}
          >
            <span className="text-cyan-300">●</span>
            {!collapsed && "Ambiente de testes"}
          </div>

          {!collapsed && (
            <p className="text-xs leading-5 text-slate-400">
              Protótipo local. Os dados ainda são armazenados neste
              navegador durante os testes.
            </p>
          )}
        </div>
      </aside >

      <div className="w-full min-w-0 border-b border-white/10 px-4 py-3 lg:hidden">
        <nav className="flex w-full min-w-0 gap-2 overflow-x-auto">
          {navigation.map((item) => renderLink(item, true))}
        </nav>
      </div>
    </>
  );
}
