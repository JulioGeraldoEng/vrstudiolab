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
  sector?: string;
  contact?: string;
  phone?: string;
  email?: string;
  active: boolean;
};