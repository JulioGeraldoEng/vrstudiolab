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