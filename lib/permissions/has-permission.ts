import type {
  AccessProfile,
  IndividualPermissionOverrides,
  Permission,
} from "../../types/permissions";

import { DEFAULT_PERMISSIONS } from "./default-permissions";

const ADMIN_ONLY_PERMISSIONS: Permission[] = [
  "equipment.deletePermanent",
  "maintenance.deletePermanent",
  "reservations.deletePermanent",
  "loans.deletePermanent",
  "people.create",
  "people.deactivate",
  "people.deletePermanent",
  "rooms.deletePermanent",
  "permissions.view",
  "permissions.manageProfiles",
  "permissions.manageIndividual",
  "settings.view",
  "settings.manage",
  "audit.viewAll",
  "securityNotifications.manage",
  "seed.manage",
];

export function hasPermission(
  profile: AccessProfile,
  permission: Permission,
  individualOverrides?: IndividualPermissionOverrides
): boolean {
  const hasIndividualOverride =
    individualOverrides !== undefined &&
    Object.prototype.hasOwnProperty.call(
      individualOverrides,
      permission
    );

  const allowed = hasIndividualOverride
    ? individualOverrides[permission] === true
    : DEFAULT_PERMISSIONS[profile].includes(permission);

  if (!allowed) {
    return false;
  }

  if (
    profile !== "administrator" &&
    ADMIN_ONLY_PERMISSIONS.includes(permission)
  ) {
    return false;
  }

  return true;
}