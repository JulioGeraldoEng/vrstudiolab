import type { AccessProfile } from "../../types/permissions";

export type CurrentUser = {
  personId: string;
  profile: AccessProfile;
};

export const CURRENT_USER: CurrentUser | null = {
  personId: "seed-person-005",
  profile: "user",
};

export const CURRENT_PERSON_ID = (
  CURRENT_USER as CurrentUser | null
)?.personId ?? null;