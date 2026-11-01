import { getToken, getUser } from './auth-storage';

export function hasSession(): boolean {
  if (typeof window === 'undefined') return false;

  return Boolean(getToken() && getUser());
}
