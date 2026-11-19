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
  reservedByPersonId?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  notes: string;
  createdAt: string;

  returnStatus?: EquipmentReturnStatus;
  returnReportedAt?: string;
  returnReportedByPersonId?: string;
  returnReportedByName?: string;
  returnConfirmedAt?: string;
  returnConfirmedBy?: string;
  returnConfirmedByPersonId?: string;
};