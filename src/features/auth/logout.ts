import { clearSession } from './auth-storage';

export function logoutUser(): void {
  clearSession();
}
