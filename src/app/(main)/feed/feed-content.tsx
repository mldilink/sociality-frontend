'use client';

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import { PostCard } from '@/features/posts/components/post-card';
import { getPosts } from '@/features/posts/api';
import { SuccessAlert } from '@/components/ui/succes-alert';

export default function FeedContent() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['posts', 1, 20],
    queryFn: () => getPosts(1, 20),
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const isPostCreated = searchParams.get('success') === 'post-created';

  const closeAlert = useCallback(() => {
    router.replace('/feed', { scroll: false });
  }, [router]);

  if (isPending) {
    return (
      <main className='mx-auto w-full max-w-150 px-4 py-6 md:px-0'>
        <p className='text-sm text-neutral-400'>Memuat postingan...</p>
      </main>
    );
  }

  if (isError || !data.success) {
    return (
      <main className='mx-auto w-full max-w-150 px-4 py-6 md:px-0'>
        <p className='text-sm text-neutral-400'>Gagal memuat postingan.</p>
        <button
          type='button'
          onClick={() => refetch()}
          className='mt-2 text-sm text-primary-200'
        >
          Coba lagi
        </button>
      </main>
    );
  }

  return (
    <main className='min-h-screen w-full bg-black text-neutral-25'>
      {isPostCreated && (
        <div className='fixed left-1/2 top-21.5 z-50 w-[calc(100%-40px)] max-w-88.25 -translate-x-1/2 md:left-auto md:right-26.25 md:top-28 md:w-72.75 md:translate-x-0'>
          <SuccessAlert message='Success Post' onClose={closeAlert} />
        </div>
      )}

      <div className='mx-auto w-full min-w-0 max-w-150 px-4 py-8xl md:px-0 md:py-30'>
        {data.data.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
