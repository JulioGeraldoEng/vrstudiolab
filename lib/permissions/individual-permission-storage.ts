import type {
  IndividualPermissionOverrides,
} from "../../types/permissions";

export type IndividualPermissionOverridesByPerson = Partial<
  Record<string, IndividualPermissionOverrides>
>;

const STORAGE_KEY = "vrstudiolab-individual-permissions-v1";

export function loadIndividualPermissionOverrides(): IndividualPermissionOverridesByPerson {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return {};

    const parsed: unknown = JSON.parse(stored);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    const result: IndividualPermissionOverridesByPerson = {};

    for (const [personId, permissions] of Object.entries(parsed)) {
      if (
        !permissions ||
        typeof permissions !== "object" ||
        Array.isArray(permissions)
      ) {
        continue;
      }

      const personOverrides: IndividualPermissionOverrides = {};

      for (const [permission, allowed] of Object.entries(permissions)) {
        if (typeof allowed === "boolean") {
          personOverrides[permission as keyof IndividualPermissionOverrides] =
            allowed;
        }
      }

      result[personId] = personOverrides;
    }

    return result;
  } catch {
    return {};
  }
}

export function saveIndividualPermissionOverrides(
  overrides: IndividualPermissionOverridesByPerson
): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}