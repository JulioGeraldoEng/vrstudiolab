import type {
  AccessProfile,
  Permission,
} from "../../types/permissions";

import { hasPermission } from "./has-permission";

type CanViewRecordParams = {
  profile: AccessProfile;
  currentPersonId: string | null;
  recordPersonId?: string;
  viewOwnPermission: Permission;
  viewAllPermission: Permission;
};

export function canViewRecord({
  profile,
  currentPersonId,
  recordPersonId,
  viewOwnPermission,
  viewAllPermission,
}: CanViewRecordParams): boolean {
  if (hasPermission(profile, viewAllPermission)) {
    return true;
  }

  if (!currentPersonId || !recordPersonId) {
    return false;
  }

  return (
    currentPersonId === recordPersonId &&
    hasPermission(profile, viewOwnPermission)
  );
}