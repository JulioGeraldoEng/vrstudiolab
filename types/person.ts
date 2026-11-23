
import type { AccessProfile } from "./permissions";

export type PersonRole =
  | "Aluno"
  | "Técnico"
  | "Responsável autorizado"
  | "Professor"
  | "Gestor"
  | "Colaborador";

export type Person = {
  id: string;
  name: string;
  role: PersonRole;
  accessProfile?: AccessProfile;
  sector?: string;
  contact?: string;
  phone?: string;
  email?: string;
  active: boolean;
};
