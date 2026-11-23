
import type {
  AccessProfile,
  IndividualPermissionOverrides,
  Permission,
} from "../../types/permissions";

import { hasPermission } from "./has-permission";

type CanViewRecordParams = {
  profile: AccessProfile;
  currentPersonId: string | null;
  recordPersonId?: string;
  viewOwnPermission: Permission;
  viewAllPermission: Permission;
  individualOverrides?: IndividualPermissionOverrides;
  profileOverrides?: IndividualPermissionOverrides;
};

export function canViewRecord({
  profile,
  currentPersonId,
  recordPersonId,
  viewOwnPermission,
  viewAllPermission,
  individualOverrides,
  profileOverrides,
}: CanViewRecordParams): boolean {
  if (
    hasPermission(
      profile,
      viewAllPermission,
      individualOverrides,
      profileOverrides
    )
  ) {
    return true;
  }

  if (!currentPersonId || !recordPersonId) {
    return false;
  }

  return (
    currentPersonId === recordPersonId &&
    hasPermission(
      profile,
      viewOwnPermission,
      individualOverrides,
      profileOverrides
    )
  );
}
