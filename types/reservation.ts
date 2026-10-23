export type ReservationStatus =
  | "Confirmada"
  | "Cancelada"
  | "Concluída";

export type ReservationResourceType = "Sala" | "Equipamento";

export type EquipmentReturnStatus =
  | "Não se aplica"
  | "Aguardando devolução"
  | "Devolução informada"
  | "Devolvida";

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

  returnStatus?: EquipmentReturnStatus;
  returnReportedAt?: string;
  returnConfirmedAt?: string;
  returnConfirmedBy?: string;
};