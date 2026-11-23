
import type { AccessProfile } from "../../types/permissions";
import { CURRENT_USER } from "../auth/current-user";

// Perfil inicial temporário.
// As telas passarão a utilizar o perfil reativo do PermissionProvider.
export const CURRENT_ACCESS_PROFILE: AccessProfile =
  CURRENT_USER?.profile ?? "administrator";
