"use client";

import type { ReactNode } from "react";

import type { Permission } from "../../types/permissions";
import { hasPermission } from "../../lib/permissions/has-permission";
import { usePermissions } from "./permissions/PermissionProvider";

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
  const {
    profileOverrides,
    individualOverrides,
    permissionsLoaded,
    currentUser,
  } = usePermissions();

  if (!permissionsLoaded) {
    return null;
  }

  if (!currentUser) {
    return <>{fallback}</>;
  }

  const allowed = hasPermission(
    currentUser.profile,
    permission,
    individualOverrides[currentUser.personId],
    profileOverrides[currentUser.profile]
  );

  return allowed ? <>{children}</> : <>{fallback}</>;
}