"use client";

import ReservationForm from "../forms/ReservationForm";
import CloseModalButton from "../buttons/CloseModalButton";

type ReservationModalProps = {
    isOpen: boolean;
    onClose: () => void;

    rooms: any[];
    equipment: any[];

    resourceType: "Sala" | "Equipamento";
    resourceId: string;
    reservedBy: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
    reservationNotes: string;

    onResourceTypeChange: (value: "Sala" | "Equipamento") => void;
    onResourceIdChange: (value: string) => void;
    onReservedByChange: (value: string) => void;
    onReservationDateChange: (value: string) => void;
    onStartTimeChange: (value: string) => void;
    onEndTimeChange: (value: string) => void;
    onReservationNotesChange: (value: string) => void;
    onSubmit: () => void;
};

export default function ReservationModal({
    isOpen,
    onClose,
    ...formProps
}: ReservationModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="reservation-modal-title"
                className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#101c2e] p-5 shadow-2xl sm:p-6"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <h2
                            id="reservation-modal-title"
                            className="text-xl font-bold text-white"
                        >
                            Realizar reserva
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Preencha os dados para reservar uma sala ou equipamento.
                        </p>
                    </div>

                    <CloseModalButton
                        onClose={onClose}
                        ariaLabel="Fechar formulário de reserva"
                    />
                </div>

                <ReservationForm
                    {...formProps}
                    onSubmit={() => {
                        formProps.onSubmit();
                        onClose();
                    }}
                />
            </div>
        </div>
    );
}