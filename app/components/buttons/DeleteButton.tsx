type DeleteButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function DeleteButton({
  onClick,
  disabled = false,
}: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Excluir"
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
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="m19 6-1 14H6L5 6" />
        <path d="M10 11v5" />
        <path d="M14 11v5" />
      </svg>

      <span>Excluir</span>
    </button>
  );
}