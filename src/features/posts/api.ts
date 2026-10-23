import { apiRequest } from '@/lib/api/client';
import type {
  PostsResponse,
  CommentsResponse,
  PostLikesResponse,
} from './types';

export function getPosts(page = 1, limit = 20) {
  return apiRequest<PostsResponse>(`/api/posts?page=${page}&limit=${limit}`);
}

export function likePost(postId: number) {
  return apiRequest<unknown>(`/api/posts/${postId}/like`, {
    method: 'POST',
  });
}

export function unlikePost(postId: number) {
  return apiRequest<unknown>(`/api/posts/${postId}/like`, {
    method: 'DELETE',
  });
}

export function getComments(postId: number, page = 1, limit = 10) {
  return apiRequest<CommentsResponse>(
    `/api/posts/${postId}/comments?page=${page}&limit=${limit}`
  );
}

export function addComment(postId: number, text: string) {
  return apiRequest<unknown>(`/api/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export function deleteComment(commentId: number) {
  return apiRequest<unknown>(`/api/comments/${commentId}`, {
    method: 'DELETE',
  });
}

export function getPostLikes(postId: number, page = 1, limit = 20) {
  return apiRequest<PostLikesResponse>(
    `/api/posts/${postId}/likes?page=${page}&limit=${limit}`
  );
}

export function followUser(username: string) {
  return apiRequest<unknown>(`/api/follow/${encodeURIComponent(username)}`, {
    method: 'POST',
  });
}

export function unfollowUser(username: string) {
  return apiRequest<unknown>(`/api/follow/${encodeURIComponent(username)}`, {
    method: 'DELETE',
  });
}
