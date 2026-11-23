
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  AccessProfile,
  Permission,
  ProfilePermissionOverrides,
  IndividualPermissionOverrides,
} from "../../../types/permissions";

import {
  loadProfilePermissionOverrides,
  saveProfilePermissionOverrides,
} from "../../../lib/permissions/profile-permission-storage";

import {
  loadIndividualPermissionOverrides,
  saveIndividualPermissionOverrides,
  type IndividualPermissionOverridesByPerson,
} from "../../../lib/permissions/individual-permission-storage";

import type { CurrentUser } from "../../../lib/auth/current-user";

const PEOPLE_STORAGE_KEY = "vrstudiolab-maintenance-people-v1";
const CURRENT_USER_STORAGE_KEY = "vrstudiolab-test-user-v1";

type TestUserOption = CurrentUser & {
  name: string;
};

type PermissionContextType = {
  profileOverrides: ProfilePermissionOverrides;
  individualOverrides: IndividualPermissionOverridesByPerson;
  permissionsLoaded: boolean;

  currentUser: CurrentUser | null;
  availableUsers: TestUserOption[];
  setCurrentPersonId: (personId: string) => void;
  refreshAvailableUsers: () => void;

  updateProfilePermission: (
    profile: AccessProfile,
    permission: Permission,
    allowed: boolean | null
  ) => void;

  updateIndividualPermission: (
    personId: string,
    permission: Permission,
    allowed: boolean | null
  ) => void;
};

const PermissionContext =
  createContext<PermissionContextType | null>(null);

function isAccessProfile(value: unknown): value is AccessProfile {
  return (
    value === "user" ||
    value === "lab_manager" ||
    value === "administrator"
  );
}

export function PermissionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [profileOverrides, setProfileOverrides] =
    useState<ProfilePermissionOverrides>({});

  const [individualOverrides, setIndividualOverrides] =
    useState<IndividualPermissionOverridesByPerson>({});

  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);

  const [availableUsers, setAvailableUsers] =
    useState<TestUserOption[]>([]);

  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  const refreshAvailableUsers = useCallback(() => {
    try {
      const storedPeople = JSON.parse(
        localStorage.getItem(PEOPLE_STORAGE_KEY) || "[]"
      );

      if (!Array.isArray(storedPeople)) {
        setAvailableUsers([]);
        setCurrentUser(null);
        return;
      }

      const activeUsers: TestUserOption[] = storedPeople
        .filter(
          (person) =>
            person &&
            typeof person.id === "string" &&
            typeof person.name === "string" &&
            person.active === true
        )
        .map((person) => ({
          personId: person.id,
          name: person.name,
          profile: isAccessProfile(person.accessProfile)
            ? person.accessProfile
            : "user",
        }));

      setAvailableUsers(activeUsers);

      const savedPersonId = localStorage.getItem(
        CURRENT_USER_STORAGE_KEY
      );

      const selectedUser = activeUsers.find(
        (person) => person.personId === savedPersonId
      );

      if (selectedUser) {
        setCurrentUser({
          personId: selectedUser.personId,
          profile: selectedUser.profile,
        });

        return;
      }

      if (savedPersonId) {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }

      const fallbackUser =
        activeUsers.find(
          (person) => person.personId === "seed-person-005"
        ) ||
        activeUsers[0] ||
        null;

      setCurrentUser(
        fallbackUser
          ? {
            personId: fallbackUser.personId,
            profile: fallbackUser.profile,
          }
          : null
      );

      if (fallbackUser) {
        localStorage.setItem(
          CURRENT_USER_STORAGE_KEY,
          fallbackUser.personId
        );
      }
    } catch {
      setAvailableUsers([]);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        setProfileOverrides(loadProfilePermissionOverrides());
      } catch (error) {
        console.error("Erro ao carregar permissões dos perfis:", error);
        setProfileOverrides({});
      }

      try {
        setIndividualOverrides(loadIndividualPermissionOverrides());
      } catch (error) {
        console.error("Erro ao carregar permissões individuais:", error);
        setIndividualOverrides({});
      }

      try {
        refreshAvailableUsers();
      } catch (error) {
        console.error("Erro ao carregar usuários disponíveis:", error);
      } finally {
        setPermissionsLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refreshAvailableUsers]);

  function setCurrentPersonId(personId: string) {
    const selectedUser = availableUsers.find(
      (person) => person.personId === personId
    );

    if (!selectedUser) return;

    setCurrentUser({
      personId: selectedUser.personId,
      profile: selectedUser.profile,
    });

    localStorage.setItem(
      CURRENT_USER_STORAGE_KEY,
      selectedUser.personId
    );
  }

  function updateProfilePermission(
    profile: AccessProfile,
    permission: Permission,
    allowed: boolean | null
  ) {
    const updatedOverrides = { ...profileOverrides };
    const profilePermissions = { ...updatedOverrides[profile] };

    if (allowed === null) {
      delete profilePermissions[permission];
    } else {
      profilePermissions[permission] = allowed;
    }

    updatedOverrides[profile] = profilePermissions;

    setProfileOverrides(updatedOverrides);
    saveProfilePermissionOverrides(updatedOverrides);
  }

  function updateIndividualPermission(
    personId: string,
    permission: Permission,
    allowed: boolean | null
  ) {
    const updatedOverrides = { ...individualOverrides };
    const personPermissions: IndividualPermissionOverrides = {
      ...updatedOverrides[personId],
    };

    if (allowed === null) {
      delete personPermissions[permission];
    } else {
      personPermissions[permission] = allowed;
    }

    if (Object.keys(personPermissions).length === 0) {
      delete updatedOverrides[personId];
    } else {
      updatedOverrides[personId] = personPermissions;
    }

    setIndividualOverrides(updatedOverrides);
    saveIndividualPermissionOverrides(updatedOverrides);
  }

  return (
    <PermissionContext.Provider
      value={{
        profileOverrides,
        individualOverrides,
        permissionsLoaded,
        currentUser,
        availableUsers,
        setCurrentPersonId,
        refreshAvailableUsers,
        updateProfilePermission,
        updateIndividualPermission,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);

  if (!context) {
    throw new Error(
      "usePermissions deve ser utilizado dentro de PermissionProvider."
    );
  }

  return context;
}
