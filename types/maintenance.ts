import type { Status } from "./equipment";

export type MaintenanceStatus =
  | "Aberta"
  | "Em andamento"
  | "Aguardando peças"
  | "Concluída";

export type MaintenanceOrder = {
  id: string;
  orderNumber: string;
  equipment: string;
  equipmentId?: number;
  assetNumber?: string;
  previousEquipmentStatus?: Status;
  problem: string;
  responsible: string;
  requestedByPersonId?: string;
  requestedByName?: string;
  openingDate: string;
  status: MaintenanceStatus;
  serviceNotes?: string;
  completionDate?: string;
  assignedPersonId?: string;
  assignedPersonName?: string;
  performedByPersonId?: string;
  performedByName?: string;
  releasedByPersonId?: string;
  releasedByName?: string;
};

export type MaintenanceRequestStatus =
  | "Pendente"
  | "Convertida em OS"
  | "Recusada";

export type MaintenanceRequest = {
  id: string;
  equipmentId: number;
  equipment: string;
  assetNumber?: string;
  problem: string;
  requestedByPersonId: string;
  requestedByName: string;
  requestDate: string;
  status: MaintenanceRequestStatus;
  maintenanceOrderId?: string;
  maintenanceOrderNumber?: string;
};