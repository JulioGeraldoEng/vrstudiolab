
"use client";

type ImportBackupButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function ImportBackupButton({
  onClick,
  disabled = false,
}: ImportBackupButtonProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-violet-600 hover:scale-105 hover:shadow-lg hover:shadow-violet-900/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>⇧</span>
        Importar backup
      </button>
    </div>
  );
}
