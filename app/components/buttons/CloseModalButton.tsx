type CloseModalButtonProps = {
    onClose: () => void;
    ariaLabel?: string;
};

export default function CloseModalButton({
    onClose,
    ariaLabel = "Close modal",
}: CloseModalButtonProps) {
    return (
        <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label={ariaLabel}
        >
            ✕
        </button>
    );
}