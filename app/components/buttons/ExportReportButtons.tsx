"use client";

type ExportReportButtonsProps = {
  onExportCSV: () => void;
  onExportPDF: () => void;
  disabled?: boolean;
};

export default function ExportReportButtons({
  onExportCSV,
  onExportPDF,
  disabled = false,
}: ExportReportButtonsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onExportCSV}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-900/30 disabled:cursor-not-allowed disabled:opacity-50"
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h8" />
          <path d="M8 9h1" />
        </svg>

        Exportar CSV / Excel
      </button>

      <button
        type="button"
        onClick={onExportPDF}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-900/30 disabled:cursor-not-allowed disabled:opacity-50"
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h2a1.5 1.5 0 0 1 0 3H8v-3z" />
          <path d="M13 16v-3h1a1.5 1.5 0 0 1 0 3h-1z" />
          <path d="M18 13h-2v3" />
          <path d="M16 14.5h1.5" />
        </svg>

        Exportar PDF
      </button>
    </div>
  );
}