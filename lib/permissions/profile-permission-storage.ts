import type {
  AccessProfile,
  Permission,
  ProfilePermissionOverrides,
} from "../../types/permissions";

const STORAGE_KEY = "vrstudiolab-profile-permissions-v1";

export function loadProfilePermissionOverrides(): ProfilePermissionOverrides {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return {};
    }

    const parsed = JSON.parse(stored);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    const profiles: AccessProfile[] = [
      "user",
      "lab_manager",
      "administrator",
    ];

    const result: ProfilePermissionOverrides = {};

    for (const profile of profiles) {
      const profileOverrides = parsed[profile];

      if (
        profileOverrides &&
        typeof profileOverrides === "object" &&
        !Array.isArray(profileOverrides)
      ) {
        const profileResult: Partial<Record<Permission, boolean>> = {};

        for (const [permission, allowed] of Object.entries(profileOverrides)) {
          if (typeof allowed === "boolean") {
            profileResult[permission as Permission] = allowed;
          }
        }

        result[profile] = profileResult;
      }
    }

    return result;
  } catch {
    return {};
  }
}

export function saveProfilePermissionOverrides(
  overrides: ProfilePermissionOverrides
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}