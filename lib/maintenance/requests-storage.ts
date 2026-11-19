import type { MaintenanceRequest } from "../../types/maintenance";

const STORAGE_KEY = "vrstudiolab-maintenance-requests-v1";

export function loadMaintenanceRequests(): MaintenanceRequest[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? (JSON.parse(saved) as MaintenanceRequest[]) : [];
  } catch {
    return [];
  }
}

export function saveMaintenanceRequests(
  requests: MaintenanceRequest[]
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}