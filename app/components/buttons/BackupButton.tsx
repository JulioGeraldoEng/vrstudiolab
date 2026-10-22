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
        className="inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-900/30 disabled:cursor-not-allowed disabled:opacity-50"
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
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m7 10 5 5 5-5" />
          <path d="M12 15V3" />
        </svg>

        Backup
      </button>
    </div>
  );
}