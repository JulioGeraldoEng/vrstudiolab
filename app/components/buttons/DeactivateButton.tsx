type DeactivateButtonProps = {
  onClick: () => void;
};

export default function DeactivateButton({
  onClick,
}: DeactivateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Dar baixa no equipamento"
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-amber-400 transition-colors duration-200 hover:bg-amber-500/10 hover:text-amber-300"
    >
      <span>Dar baixa</span>
    </button>
  );
}