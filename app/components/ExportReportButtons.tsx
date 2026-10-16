
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
        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-emerald-500 hover:scale-105 hover:shadow-lg hover:shadow-emerald-900/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>⇩</span>
        Exportar CSV / Excel
      </button>

      <button
        type="button"
        onClick={onExportPDF}
        disabled={disabled}
        className="flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-rose-600 hover:scale-105 hover:shadow-lg hover:shadow-rose-900/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>⇩</span>
        Exportar PDF
      </button>
    </div>
  );
}
