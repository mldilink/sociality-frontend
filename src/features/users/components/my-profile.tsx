'use client';

import { useEffect, useState } from 'react';
import { Bookmark, ArrowLeft, UserRound } from 'lucide-react';
import Image from 'next/image';
import { getMyPosts, getMyProfile } from '@/features/users/api';
import { getMySavedPosts } from '@/features/posts/api';
import { useQuery } from '@tanstack/react-query';
import type { Post } from '@/features/posts/types';

import type {
  MyProfile as MyProfileData,
  MyProfileStats,
} from '@/features/users/types';

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState<'grid' | 'saved'>('grid');
  const [profile, setProfile] = useState<MyProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState('');
  const [stats, setStats] = useState<MyProfileStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const {
    data: savedResponse,
    isPending: isSavedLoading,
    isError: isSavedError,
  } = useQuery({
    queryKey: ['saved-posts'],
    queryFn: () => getMySavedPosts(1, 20),
    enabled: activeTab === 'saved',
  });

  const savedPosts = savedResponse?.data.posts ?? [];

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const response = await getMyProfile();

        if (isMounted) {
          setProfile(response.data.profile);
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error('Gagal memuat profil:', error);

        if (isMounted) {
          setError('Gagal memuat profil. Silakan coba lagi.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }

      try {
        const postsResponse = await getMyPosts(1, 20);

        if (isMounted) {
          setPosts(postsResponse.data?.items);
        }
      } catch (error) {
        console.error('Gagal memuat postingan:', error);

        if (isMounted) {
          setPostsError('Gagal memuat postingan.');
        }
      } finally {
        if (isMounted) {
          setIsPostsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <main className='min-h-screen bg-black px-4 pt-20 text-center text-neutral-400'>
        Memuat profil...
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className='min-h-screen bg-black px-4 pt-20 text-center text-neutral-400'>
        {error || 'Data profil tidak tersedia.'}
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-black text-neutral-25'>
      {/* Mobile header */}
      <header className='flex h-16 items-center justify-between border-b border-neutral-900 px-4 md:hidden'>
        <div className='flex items-center gap-4'>
          <button aria-label='Kembali'>
            <ArrowLeft size={24} />
          </button>
          <span className='text-base font-semibold'>My Profile</span>
        </div>

        <UserRound size={24} />
      </header>

      <section className='mx-auto flex w-full max-w-203 flex-col gap-6 px-4 pb-24 pt-8 md:px-0 md:pt-30'>
        {/* Profile information */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-3'>
            <div className='relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#27272A]'>
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
                {profile.username}
              </h1>
              <p className='mt-1 text-sm text-neutral-400'>{profile.name}</p>
            </div>

            <div className='hidden items-center gap-2 md:flex'>
              <button className='h-12 rounded-full border border-neutral-900 px-5 text-sm font-medium'>
                Edit Profile
              </button>
              <button
                aria-label='Bagikan profil'
                className='flex size-12 items-center justify-center rounded-full border border-neutral-900'
              >
                <Image
                  src='/icons/Share-icon.svg'
                  alt='send'
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </div>

          {/* Mobile actions */}
          <div className='flex gap-2 md:hidden'>
            <button className='h-10 flex-1 rounded-full border border-neutral-900 text-sm font-medium'>
              Edit Profile
            </button>
            <button
              aria-label='Bagikan profil'
              className='flex size-10 items-center justify-center rounded-full border border-neutral-900'
            >
              <Image
                src='/icons/Share-icon.svg'
                alt='send'
                width={24}
                height={24}
              />
            </button>
          </div>

          <p className='min-h-6 text-sm md:text-base'>{profile.bio || ''}</p>

          {/* Profile stats */}

          <div className='flex items-center gap-4 overflow-x-auto border-b border-neutral-900 pb-4 md:border-0 md:pb-0'>
            <Stat value={String(stats?.posts ?? 0)} label='Posts' />
            <Stat value={String(stats?.followers ?? 0)} label='Followers' />
            <Stat value={String(stats?.following ?? 0)} label='Following' />
            <Stat value={String(stats?.likes ?? 0)} label='Likes' />
          </div>
        </div>

        {/* Gallery tabs */}
        <div className='flex h-12 border-b border-neutral-900'>
          <button
            type='button'
            onClick={() => setActiveTab('grid')}
            className={`flex flex-1 items-center justify-center gap-2 border-b-2 text-sm md:text-base ${
              activeTab === 'grid'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400'
            }`}
          >
            <Image
              src='/icons/Grid.svg'
              alt='Gallery'
              width={24}
              height={24}
              className={
                activeTab === 'grid'
                  ? 'fill-white text-white'
                  : 'text-neutral-400'
              }
            />
            Gallery
          </button>

          <button
            type='button'
            onClick={() => setActiveTab('saved')}
            className={`flex flex-1 items-center justify-center gap-2 border-b-2 text-sm md:text-base ${
              activeTab === 'saved'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400'
            }`}
          >
            <Bookmark
              size={24}
              className={
                activeTab === 'saved'
                  ? 'fill-white text-white'
                  : 'text-neutral-400'
              }
            />
            Saved
          </button>
        </div>

        {/* Gallery */}
        {activeTab === 'grid' ? (
          isPostsLoading ? (
            <p className='py-12 text-center text-sm text-neutral-400'>
              Memuat postingan...
            </p>
          ) : postsError ? (
            <p className='py-12 text-center text-sm text-neutral-400'>
              {postsError}
            </p>
          ) : posts.length > 0 ? (
            <div className='grid grid-cols-3 gap-xxs md:gap-1'>
              {posts.map((post) => (
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
              Belum ada postingan.
            </p>
          )
        ) : isSavedLoading ? (
          <p className='py-12 text-center text-sm text-neutral-400'>
            Memuat Saved...
          </p>
        ) : isSavedError ? (
          <p className='py-12 text-center text-sm text-neutral-400'>
            Gagal memuat postingan tersimpan.
          </p>
        ) : savedPosts.length > 0 ? (
          <div className='grid grid-cols-3 gap-xxs md:gap-1'>
            {savedPosts.map((post) => (
              <div
                key={post.id}
                className='relative aspect-square overflow-hidden rounded-xxs bg-neutral-900 md:rounded-md'
              >
                <Image
                  src={post.imageUrl}
                  alt={post.caption || `Saved post ${post.id}`}
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
            Belum ada postingan tersimpan.
          </p>
        )}
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className='flex items-center min-w-0 flex-1 flex-col gap-1'>
      <span className='text-xl font-bold'>{value}</span>
      <span className='text-sm text-neutral-400 md:text-base'>{label}</span>
    </div>
  );
}
