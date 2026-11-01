'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  CheckCircle2,
  Grid3X3,
  Heart,
  Send,
  UserRound,
} from 'lucide-react';

import {
  followUser,
  getUserLikedPosts,
  getUserPosts,
  getUserProfile,
  unfollowUser,
} from '@/features/users/api';

interface FriendProfileProps {
  username: string;
}

type ActiveTab = 'posts' | 'likes';

export default function FriendProfile({ username }: FriendProfileProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ActiveTab>('posts');

  const {
    data: profile,
    isPending: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ['user-profile', username],
    queryFn: async () => {
      const response = await getUserProfile(username);
      return response.data;
    },
    enabled: Boolean(username),
  });

  const {
    data: posts,
    isPending: isPostsLoading,
    isError: isPostsError,
  } = useQuery({
    queryKey: ['user-posts', username],
    queryFn: async () => {
      const response = await getUserPosts(username, 1, 20);
      return response.data.posts;
    },
    enabled: Boolean(username) && activeTab === 'posts',
  });

  const {
    data: likedPosts,
    isPending: isLikesLoading,
    isError: isLikesError,
  } = useQuery({
    queryKey: ['user-liked-posts', username],
    queryFn: async () => {
      const response = await getUserLikedPosts(username, 1, 20);
      return response.data.posts;
    },
    enabled: Boolean(username) && activeTab === 'likes',
  });

  const followMutation = useMutation({
    mutationFn: (shouldFollow: boolean) =>
      shouldFollow ? followUser(username) : unfollowUser(username),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-profile', username],
      });
    },
  });

  function handleFollow() {
    if (!profile || followMutation.isPending) return;

    followMutation.mutate(!profile.isFollowing);
  }

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: profile?.name ?? 'Profile',
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Gagal membagikan profil:', error);
      }
    }
  }

  if (isProfileLoading) {
    return (
      <main className='min-h-screen bg-black px-4 pt-20 text-center text-neutral-400'>
        Memuat profil...
      </main>
    );
  }

  if (isProfileError || !profile) {
    return (
      <main className='min-h-screen bg-black px-4 pt-20 text-center text-neutral-400'>
        Profil tidak ditemukan atau gagal dimuat.
      </main>
    );
  }

  const activePosts = activeTab === 'posts' ? posts : likedPosts;
  const isGalleryLoading =
    activeTab === 'posts' ? isPostsLoading : isLikesLoading;
  const isGalleryError = activeTab === 'posts' ? isPostsError : isLikesError;

  return (
    <main className='min-h-screen bg-black text-neutral-25'>
      {/* Mobile header */}
      <header className='flex h-16 items-center gap-4 border-b border-neutral-900 px-4 md:hidden'>
        <button
          type='button'
          onClick={() => router.back()}
          aria-label='Kembali'
        >
          <ArrowLeft size={24} />
        </button>

        <span className='truncate text-base font-semibold'>{profile.name}</span>
      </header>

      <section className='mx-auto flex w-full max-w-203 flex-col gap-6 px-4 pb-24 pt-8 md:px-0 md:pt-30'>
        {/* Profile information */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-3'>
            <div className='relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-900'>
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={`Avatar ${profile.username}`}
                  fill
                  unoptimized
                  sizes='64px'
                  className='object-cover'
                />
              ) : (
                <UserRound size={32} className='text-neutral-400' />
              )}
            </div>

            <div className='min-w-0 flex-1'>
              <h1 className='truncate text-base font-semibold'>
                {profile.name}
              </h1>
              <p className='mt-1 truncate text-sm text-neutral-400'>
                @{profile.username}
              </p>
            </div>

            {/* Desktop actions */}
            <div className='hidden items-center gap-3 md:flex'>
              {!profile.isMe && (
                <button
                  type='button'
                  onClick={handleFollow}
                  disabled={followMutation.isPending}
                  className={`flex h-12 items-center justify-center gap-2 rounded-full px-5 text-base font-semibold disabled:opacity-50 ${
                    profile.isFollowing
                      ? 'border border-neutral-900 text-neutral-25'
                      : 'bg-primary-300 text-white'
                  }`}
                >
                  {profile.isFollowing ? <CheckCircle2 size={20} /> : null}
                  {profile.isFollowing ? 'Following' : 'Follow'}
                </button>
              )}

              <button
                type='button'
                onClick={handleShare}
                aria-label='Bagikan profil'
                className='flex size-12 items-center justify-center rounded-full border border-neutral-900'
              >
                <Image
                  src='/icons/Share-Icon.svg'
                  alt='icon share'
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </div>

          {/* Mobile actions */}
          <div className='flex gap-3 md:hidden'>
            {!profile.isMe && (
              <button
                type='button'
                onClick={handleFollow}
                disabled={followMutation.isPending}
                className='flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-neutral-900 text-sm font-semibold disabled:opacity-50'
              >
                {profile.isFollowing ? <CheckCircle2 size={18} /> : null}
                {profile.isFollowing ? 'Following' : 'Follow'}
              </button>
            )}

            <button
              type='button'
              onClick={handleShare}
              aria-label='Bagikan profil'
              className='flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-900'
            >
              <Send size={20} />
            </button>
          </div>

          <p className='min-h-6 text-sm leading-7 md:text-base'>
            {profile.bio || ''}
          </p>

          {/* Profile statistics */}
          <div className='flex items-center gap-2 border-b border-neutral-900 pb-4 md:gap-6 md:border-0 md:pb-0'>
            <Stat value={profile.counts.post} label='Posts' />
            <Stat value={profile.counts.followers} label='Followers' />
            <Stat value={profile.counts.following} label='Following' />
            <Stat value={profile.counts.likes} label='Likes' />
          </div>
        </div>

        {/* Gallery tabs */}
        <div className='flex h-12 border-b border-neutral-900'>
          <button
            type='button'
            onClick={() => setActiveTab('posts')}
            className={`flex flex-1 items-center justify-center gap-2 border-b-2 text-sm font-semibold md:text-base ${
              activeTab === 'posts'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400'
            }`}
          >
            <span
              aria-hidden='true'
              className={`size-6 ${
                activeTab === 'posts' ? 'bg-white' : 'bg-neutral-600'
              }`}
              style={{
                maskImage: "url('/icons/Grid.svg')",
                WebkitMaskImage: "url('/icons/Grid.svg')",
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
              }}
            />
            Gallery
          </button>

          <button
            type='button'
            onClick={() => setActiveTab('likes')}
            className={`flex flex-1 items-center justify-center gap-2 border-b-2 text-sm font-medium md:text-base ${
              activeTab === 'likes'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400'
            }`}
          >
            <Heart
              size={20}
              className={
                activeTab === 'likes'
                  ? 'fill-white text-white'
                  : 'text-neutral-400'
              }
            />
            Likes
          </button>
        </div>

        {/* Gallery */}
        {isGalleryLoading ? (
          <p className='py-12 text-center text-sm text-neutral-400'>
            Memuat postingan...
          </p>
        ) : isGalleryError ? (
          <p className='py-12 text-center text-sm text-neutral-400'>
            Gagal memuat postingan.
          </p>
        ) : activePosts && activePosts.length > 0 ? (
          <div className='grid grid-cols-3 gap-xxs md:gap-1'>
            {activePosts.map((post) => (
              <div
                key={post.id}
                className='relative aspect-square overflow-hidden rounded-xxs bg-neutral-900 md:rounded-md'
              >
                <Image
                  src={post.imageUrl}
                  alt={post.caption || `Postingan ${post.id}`}
                  fill
                  unoptimized
                  sizes='(max-width: 767px) 33vw, 268px'
                  className='object-cover'
                />
              </div>
            ))}
          </div>
        ) : (
          <p className='py-12 text-center text-sm text-neutral-400'>
            {activeTab === 'posts'
              ? 'Belum ada postingan.'
              : 'Belum ada postingan yang disukai.'}
          </p>
        )}
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className='flex min-w-0 flex-1 flex-col items-center gap-1'>
      <span className='text-lg font-bold md:text-xl'>{value}</span>
      <span className='text-xs text-neutral-400 md:text-base'>{label}</span>
    </div>
  );
}
