import { Suspense } from 'react';
import FeedContent from './feed-content';

export default function FeedPage() {
  return (
    <Suspense
      fallback={
        <main className='mx-auto min-h-screen w-full max-w-150 px-4 py-6 md:px-0'>
          <p className='text-sm text-neutral-400'>Memuat postingan...</p>
        </main>
      }
    >
      <FeedContent />
    </Suspense>
  );
}
