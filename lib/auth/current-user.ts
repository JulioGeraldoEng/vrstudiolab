
import type { AccessProfile } from "../../types/permissions";

export type CurrentUser = {
  personId: string;
  profile: AccessProfile;
};

// Identidade inicial de desenvolvimento.
// A identidade ativa é controlada pelo PermissionProvider.
export const CURRENT_USER: CurrentUser | null = {
  personId: "seed-person-005",
  profile: "administrator",
};

export const CURRENT_PERSON_ID = CURRENT_USER?.personId ?? null;
