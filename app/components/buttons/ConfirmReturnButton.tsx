type ConfirmReturnButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function ConfirmReturnButton({
  onClick,
  disabled = false,
}: ConfirmReturnButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Confirmar devolução"
      className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-cyan-400 transition-colors duration-200 hover:bg-cyan-500/10 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"    >
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
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
      </svg>

      <span>Confirmar devolução</span>
    </button>
  );
}