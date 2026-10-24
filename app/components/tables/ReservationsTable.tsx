"use client";

import { useEffect, useState } from "react";
import type { Reservation } from "../../../types/reservation";
import type { Person } from "../../../types/person";
import ReportReturnButton from "../buttons/ReportReturnButton";
import ConfirmReturnButton from "../buttons/ConfirmReturnButton";
import CancelReservationButton from "../buttons/CancelReservationButton";
import { Pagination } from "../Pagination";

export type DisplayReservationStatus =
  | "Agendada"
  | "Em utilização"
  | "Concluída"
  | "Atraso na devolução"
  | "Devolução informada"
  | "Cancelada";

export function getReservationDisplayStatus(
  reservation: Reservation
): DisplayReservationStatus {
  if (reservation.status === "Cancelada") {
    return "Cancelada";
  }

  if (reservation.status === "Concluída") {
    return "Concluída";
  }

  if (reservation.resourceType === "Equipamento") {
    if (reservation.returnStatus === "Devolvida") {
      return "Concluída";
    }

    if (reservation.returnStatus === "Devolução informada") {
      return "Devolução informada";
    }
  }

  const now = new Date();
  const [year, month, day] = reservation.date.split("-").map(Number);
  const [startHour, startMinute] = reservation.startTime.split(":").map(Number);
  const [endHour, endMinute] = reservation.endTime.split(":").map(Number);

  const start = new Date(year, month - 1, day, startHour, startMinute);
  const end = new Date(year, month - 1, day, endHour, endMinute);

  if (now < start) {
    return "Agendada";
  }

  if (now < end) {
    return "Em utilização";
  }

  if (reservation.resourceType === "Sala") {
    return "Concluída";
  }

  return "Atraso na devolução";
}

type ReservationsTableProps = {
  reservations: Reservation[];
  people: Person[];
  confirmerName: string;
  onConfirmerChange: (name: string) => void;
  onReportReturn: (reservation: Reservation) => void;
  onConfirmReturn: (reservation: Reservation, confirmerName: string) => void;
  onCancel: (reservation: Reservation) => void;
  resetPageKey: string;
};

const ITEMS_PER_PAGE = 10;

export default function ReservationsTable({
  reservations,
  people,
  confirmerName,
  onConfirmerChange,
  onReportReturn,
  onConfirmReturn,
  onCancel,
  resetPageKey,
}: ReservationsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reservations.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [resetPageKey]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedReservations = reservations.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="px-4 py-3">Recurso</th>
              <th className="px-4 py-3">Responsável</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Horário</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>

          <tbody>
            {paginatedReservations.map((reservation) => (
              <tr
                key={reservation.id}
                className="border-b border-white/5 transition-colors duration-200 hover:bg-white/[0.08]"
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{reservation.resourceName}</p>
                  <p className="text-xs text-slate-400">
                    {reservation.resourceType}
                  </p>
                </td>

                <td className="px-4 py-3">{reservation.reservedBy}</td>

                <td className="px-4 py-3">
                  {reservation.date.split("-").reverse().join("/")}
                </td>

                <td className="px-4 py-3">
                  {reservation.startTime}–{reservation.endTime}
                </td>

                <td className="px-4 py-3">
                  {(() => {
                    const displayStatus =
                      getReservationDisplayStatus(reservation);

                    const statusColor =
                      displayStatus === "Cancelada" ||
                      displayStatus === "Atraso na devolução"
                        ? "bg-red-400/10 text-red-300"
                        : displayStatus === "Concluída"
                          ? "bg-blue-400/10 text-blue-300"
                          : displayStatus === "Em utilização"
                            ? "bg-cyan-400/10 text-cyan-300"
                            : displayStatus === "Devolução informada"
                              ? "bg-amber-400/10 text-amber-300"
                              : "bg-emerald-400/10 text-emerald-300";

                    return (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}
                      >
                        {displayStatus}
                      </span>
                    );
                  })()}

                  {reservation.resourceType === "Equipamento" && (
                    <p className="mt-2 text-xs text-slate-400">
                      Devolução:{" "}
                      {reservation.returnStatus ?? "Não informada"}
                    </p>
                  )}
                </td>

                <td className="px-4 py-3">
                  {reservation.resourceType === "Equipamento" &&
                    reservation.status !== "Cancelada" &&
                    reservation.returnStatus !== "Devolvida" &&
                    reservation.returnStatus !== "Devolução informada" && (
                      <ReportReturnButton
                        onClick={() => onReportReturn(reservation)}
                      />
                    )}

                  {reservation.resourceType === "Equipamento" &&
                    reservation.returnStatus === "Devolução informada" && (
                      <div className="mb-2 flex min-w-48 flex-col gap-2">
                        <select
                          value={confirmerName}
                          onChange={(event) =>
                            onConfirmerChange(event.target.value)
                          }
                          className="w-full rounded-lg border border-white/10 bg-[#0b1424] px-3 py-2 text-xs text-white"
                          aria-label="Responsável pela confirmação da devolução"
                        >
                          <option value="">Selecione o responsável</option>

                          {people
                            .filter(
                              (person) =>
                                person.active &&
                                [
                                  "Técnico",
                                  "Responsável autorizado",
                                  "Gestor",
                                ].includes(person.role)
                            )
                            .map((person) => (
                              <option key={person.id} value={person.name}>
                                {person.name} — {person.role}
                              </option>
                            ))}
                        </select>

                        <ConfirmReturnButton
                          disabled={!confirmerName}
                          onClick={() =>
                            onConfirmReturn(reservation, confirmerName)
                          }
                        />
                      </div>
                    )}

                  {reservation.status === "Confirmada" &&
                    getReservationDisplayStatus(reservation) !== "Concluída" &&
                    reservation.returnStatus !== "Devolvida" && (
                      <CancelReservationButton
                        onClick={() => onCancel(reservation)}
                      />
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={reservations.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </>
  );
}