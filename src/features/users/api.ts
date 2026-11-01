import { apiRequest } from '@/lib/api/client';
import type {
  MyProfileResponse,
  UpdateProfilePayload,
  MyProfilePostsResponse,
  MyProfile,
  FriendProfileResponse,
  FriendPostsResponse,
  FollowResponse,
} from './types';

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

export function getMyProfile() {
  return apiRequest<MyProfileResponse>('/api/me');
}

export function updateMyProfile(payload: UpdateProfilePayload) {
  if (payload.avatar instanceof File) {
    const formData = new FormData();

    if (payload.username !== undefined) {
      formData.append('username', payload.username);
    }

    if (payload.phone !== undefined) {
      formData.append('phone', payload.phone);
    }

    if (payload.bio !== undefined) {
      formData.append('bio', payload.bio);
    }

    formData.append('avatar', payload.avatar);

    return apiRequest<UpdateProfileResponse>('/api/me', {
      method: 'PATCH',
      body: formData,
    });
  }

  return apiRequest<UpdateProfileResponse>('/api/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function getMyPosts(page = 1, limit = 20) {
  return apiRequest<MyProfilePostsResponse>(
    `/api/me/posts?page=${page}&limit=${limit}`
  );
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const formData = new FormData();

  if (payload.username !== undefined) {
    formData.append('username', payload.username);
  }

  if (payload.phone !== undefined) {
    formData.append('phone', payload.phone);
  }

  if (payload.bio !== undefined) {
    formData.append('bio', payload.bio);
  }

  if (payload.avatar) {
    formData.append('avatar', payload.avatar);
  }

  if (payload.avatarUrl) {
    formData.append('avatarUrl', payload.avatarUrl);
  }

  return apiRequest('/api/me', {
    method: 'PATCH',
    body: formData,
  });
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: MyProfile;
}

export function followUser(username: string) {
  return apiRequest<FollowResponse>(
    `/api/follow/${encodeURIComponent(username)}`,
    { method: 'POST' }
  );
}

export function unfollowUser(username: string) {
  return apiRequest<FollowResponse>(
    `/api/follow/${encodeURIComponent(username)}`,
    { method: 'DELETE' }
  );
}

export function getUserFollowers(username: string, page = 1, limit = 20) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiRequest(
    `/api/users/${encodeURIComponent(username)}/followers?${params}`
  );
}

export function getUserFollowing(username: string, page = 1, limit = 20) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiRequest(
    `/api/users/${encodeURIComponent(username)}/following?${params}`
  );
}

export function getUserProfile(username: string) {
  return apiRequest<FriendProfileResponse>(
    `/api/users/${encodeURIComponent(username)}`
  );
}

export function getUserPosts(username: string, page = 1, limit = 20) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiRequest<FriendPostsResponse>(
    `/api/users/${encodeURIComponent(username)}/posts?${params.toString()}`
  );
}

export function getUserLikedPosts(username: string, page = 1, limit = 20) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiRequest<FriendPostsResponse>(
    `/api/users/${encodeURIComponent(username)}/likes?${params.toString()}`
  );
}
