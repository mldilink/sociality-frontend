'use client';

import { useQuery } from '@tanstack/react-query';
import { PostCard } from '@/features/posts/components/post-card';
import { getPosts } from '@/features/posts/api';

export default function FeedPage() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['posts', 1, 20],
    queryFn: () => getPosts(1, 20),
  });

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
    <main className='min-h-screen bg-black text-neutral-25'>
      <div className='mx-auto w-full max-w-150 px-4 py-8xl md:px-0 md:py-30'>
        {data.data.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
