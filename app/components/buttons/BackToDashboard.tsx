export default function BackToDashboard() {
  return (
    <a
      href="/vrstudiolab/"
      className="group mb-5 inline-flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-slate-800/70 px-4 py-3 text-sm font-medium text-cyan-200 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/60 hover:bg-slate-700 hover:text-white hover:shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-lg transition-colors group-hover:bg-cyan-400/20">
        ←
      </span>

      <span className="flex flex-col">
        <span className="text-xs text-slate-400">
          NAVEGAÇÃO
        </span>
        <span>Voltar ao Dashboard</span>
      </span>
    </a>
  );
}
