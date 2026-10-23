'use client';

import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { likePost, unlikePost } from '@/features/posts/api';
import Image from 'next/image';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import type { Post } from '@/features/posts/types';
import { getComments } from '@/features/posts/api';
import { LikesModal } from './likes-modal';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  const { data: commentsData } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => getComments(post.id, 1, 1),
  });

  const likeMutation = useMutation({
    mutationFn: (shouldLike: boolean) =>
      shouldLike ? likePost(post.id) : unlikePost(post.id),

    onSuccess: (_, shouldLike) => {
      setLiked(shouldLike);
      setLikeCount((count) => count + (shouldLike ? 1 : -1));
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  function handleLike() {
    if (likeMutation.isPending) return;

    likeMutation.mutate(!liked);
  }

  const createdAt = new Date(post.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className='flex w-full flex-col gap-2 border-b border-neutral-900 pb-4 md:gap-3 md:pb-6'>
      <header className='flex items-center gap-2 md:gap-3'>
        <div className='relative size-11 shrink-0 overflow-hidden rounded-full bg-neutral-900 md:size-16'>
          {post.author.avatarUrl && (
            <Image
              src={post.author.avatarUrl}
              alt={`Avatar ${post.author.username}`}
              fill
              sizes='(min-width: 768px) 64px, 44px'
              className='object-cover'
            />
          )}
        </div>

        <div className='min-w-0'>
          <p className='truncate text-sm font-bold text-neutral-25 md:text-base'>
            {post.author.username}
          </p>
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
            onClick={() => setShowComments((visible) => !visible)}
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
          aria-label='Simpan postingan'
          className='text-neutral-25'
        >
          <Bookmark size={24} />
        </button>
      </div>

      {post.caption && (
        <p className='text-sm leading-6 text-neutral-25 md:text-base'>
          <span className='mr-2 font-bold'>{post.author.username}</span>
          {post.caption}
        </p>
      )}

      {commentsData?.data.comments.map((comment) => (
        <div key={comment.id} className='text-sm text-neutral-25'>
          <span className='mr-2 font-bold'>{comment.author.username}</span>
          {comment.text}
        </div>
      ))}

      {post.commentCount > 1 && (
        <button
          type='button'
          onClick={() => setShowComments(true)}
          className='self-start text-sm text-primary-200'
        >
          Show More
        </button>
      )}
      {showLikes && (
        <LikesModal postId={post.id} onClose={() => setShowLikes(false)} />
      )}
    </article>
  );
}
