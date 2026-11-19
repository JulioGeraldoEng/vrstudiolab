import type { ReactNode } from "react";

import type {
  IndividualPermissionOverrides,
  Permission,
} from "../../types/permissions";
import { CURRENT_ACCESS_PROFILE } from "../../lib/permissions/current-profile";
import { hasPermission } from "../../lib/permissions/has-permission";

type PermissionGateProps = {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
  individualOverrides?: IndividualPermissionOverrides;
};

export default function PermissionGate({
  permission,
  children,
  fallback = null,
  individualOverrides,
}: PermissionGateProps) {
  const allowed = hasPermission(
    CURRENT_ACCESS_PROFILE,
    permission,
    individualOverrides
  );

  return allowed ? <>{children}</> : <>{fallback}</>;
}