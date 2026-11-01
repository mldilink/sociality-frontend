'use client';

import { useSearchParams } from 'next/navigation';
import { UserSearch } from '@/features/users/components/user-search';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  return (
    <main className='mx-auto min-h-screen w-full max-w-150 px-4 pb-24 pt-24 md:pt-28'>
      <h1 className='mb-6 text-xl font-bold text-neutral-25'>Search</h1>
      <UserSearch key={initialQuery} initialQuery={initialQuery} />
    </main>
  );
}
