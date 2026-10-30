export interface PostAuthor {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

export interface Post {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: PostAuthor;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

export interface PostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CommentAuthor {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

export interface PostComment {
  id: number;
  text: string;
  createdAt: string;
  author: CommentAuthor;
}

export interface CommentsResponse {
  success: boolean;
  message: string;
  data: {
    comments: PostComment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface PostLikeUser {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
  isMe: boolean;
  followsMe: boolean;
}

export interface PostLikesResponse {
  success: boolean;
  message: string;
  data: {
    users: PostLikeUser[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface SavedPost {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
}

export interface SavedPostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: SavedPost[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
