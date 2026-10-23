import { apiRequest } from '@/lib/api/client';
import type { LoginInput, RegisterInput } from './schemas';
import type { LoginResponse } from './types';

export async function registerUser(data: RegisterInput) {
  const payload = {
    name: data.name,
    username: data.username,
    email: data.email,
    phone: data.phone,
    password: data.password,
  };

  return apiRequest<unknown>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(data: LoginInput): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
