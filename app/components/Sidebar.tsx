
"use client";

const navigation = [
  { name: "Visão geral", icon: "▦", href: "/" },
  { name: "Equipamentos", icon: "▣", href: "/inventario" },
  { name: "Manutenção", icon: "⚙", href: "/manutencao" },
  { name: "Pessoas", icon: "♙", href: "/pessoas" },
  { name: "Relatórios", icon: "▤", href: "/relatorios" },
];

type SidebarProps = {
  activePage?: string;
};

export default function Sidebar({
  activePage = "",
}: SidebarProps) {
  function navigate(href: string) {
    window.location.href = href;
  }

  function renderLink(item: (typeof navigation)[number], mobile = false) {
    const active =
      activePage === item.name ||
      (item.name === "Visão geral" && activePage === "");

    return (
      <button
        key={item.name}
        onClick={() => navigate(item.href)}
        className={
          mobile
            ? `shrink-0 rounded-lg px-3 py-2 text-sm ${active
              ? "bg-cyan-400/10 text-cyan-300"
              : "text-slate-400"
            }`
            : `flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${active
              ? "border border-cyan-400/20 bg-cyan-400/10 font-medium text-cyan-300"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`
        }
      >
        {!mobile && (
          <span className="w-5 text-center text-lg">{item.icon}</span>
        )}
        {mobile ? item.name : item.name}
      </button>
    );
  }

  return (
    <>
      <aside className="hidden w-56 shrink-0 flex-col border-r border-white/10 bg-[#0e1729] p-4 lg:flex xl:w-64 xl:p-5">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-xl text-cyan-300">
            ◈
          </div>
          <div>
            <h1 className="font-bold tracking-wide">VR STUDIO LAB</h1>
            <p className="text-xs text-slate-400">
              Gestão de equipamentos
            </p>
          </div>
        </div>

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Menu principal
        </p>

        <nav className="flex flex-col gap-2">
          {navigation.map((item) => renderLink(item))}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-[#111e33] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <span className="text-cyan-300">●</span>
            Ambiente de testes
          </div>
          <p className="text-xs leading-5 text-slate-400">
            Protótipo local. Os dados ainda são armazenados neste
            navegador durante os testes.
          </p>
        </div>
      </aside>

      <div className="w-full min-w-0 border-b border-white/10 px-4 py-3 lg:hidden">
        <nav className="flex w-full min-w-0 gap-2 overflow-x-auto">
          {navigation.map((item) => renderLink(item, true))}
        </nav>
      </div>
    </>
  );
}
