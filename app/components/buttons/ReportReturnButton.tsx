type ReportReturnButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function ReportReturnButton({
  onClick,
  disabled = false,
}: ReportReturnButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Informar devolução"
      className="mb-2 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-emerald-400 transition-colors duration-200 hover:bg-emerald-500/10 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l3 2" />
      </svg>

      <span>Informar devolução</span>
    </button>
  );
}