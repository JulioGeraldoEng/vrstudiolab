
"use client";

type BackupButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function BackupButton({
  onClick,
  disabled = false,
}: BackupButtonProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-2 rounded-xl bg-cyan-700 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-cyan-600 hover:scale-105 hover:shadow-lg hover:shadow-cyan-900/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>⇩</span>
        Backup
      </button>
    </div>
  );
}
