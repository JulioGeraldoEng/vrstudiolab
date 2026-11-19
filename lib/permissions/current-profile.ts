import type { AccessProfile } from "../../types/permissions";
import { CURRENT_USER } from "../auth/current-user";

// Perfil temporário de desenvolvimento.
// Quando houver autenticação, será utilizado o perfil do usuário conectado.
export const CURRENT_ACCESS_PROFILE: AccessProfile =
  CURRENT_USER?.profile ?? "administrator";