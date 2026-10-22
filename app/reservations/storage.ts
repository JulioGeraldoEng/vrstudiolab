import type { Reservation } from "../../types/reservation";

export const RESERVATIONS_STORAGE_KEY = "vrstudiolab-reservations-v1";

export function hasReservationConflict(
  reservations: Reservation[],
  resourceType: Reservation["resourceType"],
  resourceId: Reservation["resourceId"],
  date: string,
  startTime: string,
  endTime: string,
): boolean {
  return reservations.some((reservation) => {
    if (reservation.status === "Cancelada") {
      return false;
    }

    if (
      reservation.resourceType !== resourceType ||
      String(reservation.resourceId) !== String(resourceId) ||
      reservation.date !== date
    ) {
      return false;
    }

    return (
      startTime < reservation.endTime &&
      endTime > reservation.startTime
    );
  });
}