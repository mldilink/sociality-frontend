import type { Post } from '@/features/posts/types';

export interface MyProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
}

export interface MyProfileStats {
  posts: number;
  followers: number;
  following: number;
  likes: number;
}

export interface MyProfileResponse {
  success: boolean;
  message: string;
  data: {
    profile: MyProfile;
    stats: MyProfileStats;
  };
}

export interface UpdateProfilePayload {
  username?: string;
  phone?: string;
  bio?: string;
  avatar?: File;
  avatarUrl?: string;
}

export interface MyProfilePostsResponse {
  success: boolean;
  message: string;
  data: {
    items: Post[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface FriendProfile {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  email: string;
  phone: string | null;
  counts: {
    post: number;
    followers: number;
    following: number;
    likes: number;
  };
  isFollowing: boolean;
  isMe: boolean;
}

export interface FriendProfileResponse {
  success: boolean;
  message: string;
  data: FriendProfile;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FriendPostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    pagination: Pagination;
  };
}

export interface FollowResponse {
  success: boolean;
  message: string;
}
