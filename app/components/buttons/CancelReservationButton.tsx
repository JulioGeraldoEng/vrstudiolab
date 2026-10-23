type CancelReservationButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function CancelReservationButton({
  onClick,
  disabled = false,
}: CancelReservationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Cancelar reserva"
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-red-400 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
    >

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
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>

      <span>Cancelar</span>
    </button>
  );
}