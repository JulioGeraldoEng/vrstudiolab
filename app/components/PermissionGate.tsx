import type { ReactNode } from "react";

import type { Permission } from "../../types/permissions";
import { CURRENT_ACCESS_PROFILE } from "../../lib/permissions/current-profile";
import { hasPermission } from "../../lib/permissions/has-permission";

type PermissionGateProps = {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
};

export default function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  const allowed = hasPermission(
    CURRENT_ACCESS_PROFILE,
    permission
  );

  return allowed ? <>{children}</> : <>{fallback}</>;
}