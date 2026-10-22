type EditButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function EditButton({
  onClick,
  disabled = false,
}: EditButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Editar"
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-cyan-400 transition-colors duration-200 hover:bg-cyan-500/10 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
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
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </svg>

      <span>Editar</span>
    </button>
  );
}