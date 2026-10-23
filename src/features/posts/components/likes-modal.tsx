'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPostLikes, followUser, unfollowUser } from '@/features/posts/api';

interface LikesModalProps {
  postId: number;
  onClose: () => void;
}

export function LikesModal({ postId, onClose }: LikesModalProps) {
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: ['post-likes', postId],
    queryFn: () => getPostLikes(postId),
  });

  const followMutation = useMutation({
    mutationFn: ({
      username,
      shouldFollow,
    }: {
      username: string;
      shouldFollow: boolean;
    }) => (shouldFollow ? followUser(username) : unfollowUser(username)),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['post-likes', postId],
      }),
  });

  return (
    <div
      className='fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-4'
      onClick={onClose}
    >
      <div className='flex w-full flex-col items-end gap-2 sm:max-w-137'>
        {/* Close button */}
        <div className='flex h-6 w-full items-center justify-end px-4'>
          <button
            type='button'
            onClick={onClose}
            aria-label='Tutup Likes'
            className='flex size-6 items-center justify-center text-neutral-25'
          >
            <X size={24} />
          </button>
        </div>

        {/* Likes section */}
        <section
          role='dialog'
          aria-modal='true'
          aria-labelledby='likes-title'
          onClick={(event) => event.stopPropagation()}
          className='flex h-131.5 max-h-[80dvh] w-full flex-col gap-3 overflow-hidden rounded-t-2xl bg-neutral-950 px-4 pt-4 pb-8 text-neutral-25 sm:h-auto sm:max-h-[80vh] sm:gap-4 sm:rounded-2xl sm:p-6'
        >
          <h2
            id='likes-title'
            className='shrink-0 text-base font-bold tracking-[-0.02em]'
          >
            Likes
          </h2>

          <div className='min-h-0 flex-1 space-y-5 overflow-y-auto'>
            {isPending && (
              <p className='text-sm text-neutral-400'>Memuat Likes...</p>
            )}

            {isError && (
              <p className='text-sm text-red-400'>Gagal memuat daftar Likes.</p>
            )}

            {data?.data.users.map((user) => (
              <div key={user.id} className='flex min-h-14 items-center gap-2'>
                {/* Avatar */}
                <div className='relative size-12 shrink-0 overflow-hidden rounded-full bg-neutral-900'>
                  {user.avatarUrl && (
                    <Image
                      src={user.avatarUrl}
                      alt={`Avatar ${user.username}`}
                      fill
                      sizes='48px'
                      className='object-cover'
                    />
                  )}
                </div>

                {/* User details */}
                <div className='flex min-w-0 flex-1 flex-col justify-center'>
                  <p className='truncate text-sm font-bold leading-7 tracking-[-0.01em] text-neutral-25'>
                    {user.name}
                  </p>
                  <p className='truncate text-sm leading-7 tracking-[-0.02em] text-neutral-400'>
                    {user.username}
                  </p>
                </div>

                {/* Follow button */}
                {!user.isMe && (
                  <button
                    type='button'
                    disabled={followMutation.isPending}
                    onClick={() =>
                      followMutation.mutate({
                        username: user.username,
                        shouldFollow: !user.isFollowedByMe,
                      })
                    }
                    className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold leading-7 tracking-[-0.01em] disabled:opacity-50 ${
                      user.isFollowedByMe
                        ? 'w-31.75 border border-neutral-900 text-neutral-25'
                        : 'min-w-23.25 bg-primary-300 px-6 text-neutral-25'
                    }`}
                  >
                    {user.isFollowedByMe && <span aria-hidden='true'>✓</span>}
                    {user.isFollowedByMe ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            ))}

            {data?.data.users.length === 0 && (
              <p className='text-sm text-neutral-400'>
                Belum ada yang menyukai postingan ini.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
