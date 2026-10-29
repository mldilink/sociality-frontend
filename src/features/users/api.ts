import { apiRequest } from '@/lib/api/client';

export interface SearchUser {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

export interface SearchUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: SearchUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export function searchUsers(q: string, page = 1, limit = 20) {
  const params = new URLSearchParams({
    q,
    page: String(page),
    limit: String(limit),
  });

  return apiRequest<SearchUsersResponse>(
    `/api/users/search?${params.toString()}`
  );
}
