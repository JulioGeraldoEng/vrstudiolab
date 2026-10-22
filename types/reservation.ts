export type ReservationStatus =
  | "Confirmada"
  | "Cancelada"
  | "Concluída";

export type ReservationResourceType = "Sala" | "Equipamento";

export type Reservation = {
  id: string;
  resourceType: ReservationResourceType;
  resourceId: string | number;
  resourceName: string;
  reservedBy: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  notes: string;
  createdAt: string;
};