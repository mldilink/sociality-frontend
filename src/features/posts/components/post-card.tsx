'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  getMySavedPosts,
} from '@/features/posts/api';
import Image from 'next/image';
import { Heart, Bookmark } from 'lucide-react';
import type { Post } from '@/features/posts/types';
import { LikesModal } from './likes-modal';
import { CommentsModal } from './comments-modal';
import Link from 'next/link';
import { getUser } from '@/features/auth/auth-storage';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  const currentUser = getUser();
  const isOwnPost = currentUser?.id === post.author.id;
  const profileHref = isOwnPost
    ? '/me'
    : `/user/${encodeURIComponent(post.author.username)}`;

  const likeMutation = useMutation({
    mutationFn: (shouldLike: boolean) =>
      shouldLike ? likePost(post.id) : unlikePost(post.id),

    onSuccess: (_, shouldLike) => {
      setLiked(shouldLike);
      setLikeCount((count) => count + (shouldLike ? 1 : -1));
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const { data: savedResponse } = useQuery({
    queryKey: ['saved-posts'],
    queryFn: () => getMySavedPosts(1, 20),
  });

  const savedFromServer =
    savedResponse?.data.posts.some((item) => item.id === post.id) ?? false;

  const [savedOverride, setSavedOverride] = useState<boolean | null>(null);

  const saved = savedOverride ?? savedFromServer;

  const saveMutation = useMutation({
    mutationFn: (shouldSave: boolean) =>
      shouldSave ? savePost(post.id) : unsavePost(post.id),

    onSuccess: (_, shouldSave) => {
      setSavedOverride(shouldSave);

      queryClient.setQueryData(
        ['saved-posts'],
        (current: Awaited<ReturnType<typeof getMySavedPosts>> | undefined) => {
          if (!current) return current;

          return {
            ...current,
            data: {
              ...current.data,
              posts: shouldSave
                ? [
                    post,
                    ...current.data.posts.filter((item) => item.id !== post.id),
                  ]
                : current.data.posts.filter((item) => item.id !== post.id),
            },
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ['saved-posts'] });
    },
  });

  function handleLike() {
    if (likeMutation.isPending) return;

    likeMutation.mutate(!liked);
  }

  function handleSave() {
    if (saveMutation.isPending) return;

    saveMutation.mutate(!saved);
  }

  async function handleShare() {
    const postUrl = `${window.location.origin}/post/${post.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.author.username}`,
          text: post.caption || 'Check out this post!',
          url: postUrl,
        });
      } else {
        await navigator.clipboard.writeText(postUrl);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Gagal membagikan postingan:', error);
      }
    }
  }

  const createdAt = new Date(post.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className='flex w-full flex-col gap-2 border-b border-neutral-900 pb-4 md:gap-3 md:pb-6'>
      <header className='flex items-center gap-2 md:gap-3'>
        <Link
          href={profileHref}
          aria-label={`Lihat profil ${post.author.username}`}
          className='relative size-11 shrink-0 overflow-hidden rounded-full bg-neutral-900 md:size-16'
        >
          {post.author.avatarUrl && (
            <Image
              src={post.author.avatarUrl}
              alt={`Avatar ${post.author.username}`}
              fill
              sizes='(min-width: 768px) 64px, 44px'
              className='object-cover'
            />
          )}
        </Link>

        <div className='min-w-0'>
          <Link
            href={profileHref}
            className='truncate text-sm font-bold text-neutral-25 md:text-base'
          >
            <p>{post.author.username}</p>
          </Link>

          <time dateTime={post.createdAt} className='text-xs text-neutral-400'>
            {createdAt}
          </time>
        </div>
      </header>

      <div className='relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-900'>
        <Image
          src={post.imageUrl}
          alt={post.caption || `Postingan ${post.author.username}`}
          fill
          sizes='(min-width: 768px) 600px, calc(100vw - 32px)'
          className='object-cover'
        />
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-1 text-neutral-25'>
            <button
              type='button'
              aria-label={liked ? 'Unlike post' : 'Like post'}
              aria-pressed={liked}
              disabled={likeMutation.isPending}
              onClick={handleLike}
              className='disabled:opacity-50'
            >
              <Heart
                size={24}
                className={liked ? 'fill-red-500 text-red-500' : ''}
              />
            </button>

            <button
              type='button'
              onClick={() => setShowLikes(true)}
              className='text-sm'
              aria-label={`Lihat ${likeCount} pengguna yang menyukai postingan`}
            >
              {likeCount}
            </button>
          </div>

          <button
            type='button'
            aria-label='Komentar'
            className='flex items-center gap-1 text-neutral-25'
            onClick={() => setShowComments(true)}
          >
            <Image
              src='/icons/comment-icon.svg'
              alt='icon comment'
              width={24}
              height={24}
            />
            <span className='text-sm'>{post.commentCount}</span>
          </button>

          <button
            type='button'
            aria-label='Bagikan'
            onClick={handleShare}
            className='text-neutral-25'
          >
            <Image
              src='/icons/share-icon.svg'
              alt='icon share'
              width={24}
              height={24}
            />
          </button>
        </div>

        <button
          type='button'
          aria-label={saved ? 'Hapus dari tersimpan' : 'Simpan postingan'}
          aria-pressed={saved}
          disabled={saveMutation.isPending}
          onClick={handleSave}
          className='text-neutral-25 disabled:opacity-50'
        >
          <Bookmark
            size={24}
            className={saved ? 'fill-white text-white' : ''}
          />
        </button>
      </div>

      {post.caption && (
        <p className='min-w-0 max-w-full wrap-break-words text-sm leading-6 text-neutral-25 md:text-base'>
          <span className='mr-2 font-bold'>{post.author.username}</span>
          {post.caption}
        </p>
      )}

      {showComments && (
        <CommentsModal post={post} onClose={() => setShowComments(false)} />
      )}

      {showLikes && (
        <LikesModal postId={post.id} onClose={() => setShowLikes(false)} />
      )}
    </article>
  );
}
