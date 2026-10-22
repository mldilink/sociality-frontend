import { getToken } from '@/features/auth/auth-storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ApiRequestOptions = Omit<RequestInit, 'headers'> & {
  token?: string;
  headers?: HeadersInit;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('API base URL belum dikonfigurasi.');
  }

  const { token, headers: customHeaders, ...requestOptions } = options;
  const headers = new Headers(customHeaders);

  if (!(requestOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const sessionToken =
    token ?? (typeof window !== 'undefined' ? getToken() : null);

  if (sessionToken) {
    headers.set('Authorization', `Bearer ${sessionToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    throw new ApiError(`Request gagal (${response.status})`, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
