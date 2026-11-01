'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CircleX, Search } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '@/features/users/api';

type DesktopUserSearchProps = {
  variant?: 'desktop' | 'tablet';
};

export function DesktopUserSearch({
  variant = 'desktop',
}: DesktopUserSearchProps) {
  const [keyword, setKeyword] = useState('');
  const query = keyword.trim();

  const { data, isFetching, isError } = useQuery({
    queryKey: ['user-search', query],
    queryFn: () => searchUsers(query),
    enabled: query.length > 0,
  });

  const users = data?.data.users ?? [];
  const showEmpty =
    query.length > 0 && !isFetching && !isError && users.length === 0;

  return (
    <div
      className={`relative min-w-0 ${
        variant === 'tablet'
          ? 'hidden w-50 md:block xl:hidden'
          : 'hidden w-full xl:block xl:w-122.75'
      }`}
    >
      <form
        onSubmit={(event) => event.preventDefault()}
        className='flex h-12 w-full items-center gap-2 rounded-full border border-neutral-900 bg-neutral-950 px-4'
      >
        <Search size={20} className='shrink-0 text-neutral-500' />

        <input
          type='text'
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder='Search'
          aria-label='Search users'
          className='min-w-0 flex-1 bg-transparent text-sm text-neutral-25 outline-none placeholder:text-neutral-600'
        />

        {keyword && (
          <button
            type='button'
            aria-label='Clear search'
            onClick={() => setKeyword('')}
            className='shrink-0 text-neutral-500 hover:text-neutral-25'
          >
            <CircleX size={16} />
          </button>
        )}
      </form>

      {query && (
        <div
          className={`absolute left-1/2 top-19 z-60 flex max-h-96 min-w-0 -translate-x-1/2 flex-col gap-4 overflow-y-auto rounded-3xl border border-neutral-900 bg-neutral-950 p-5 shadow-xl ${
            variant === 'tablet' ? 'w-80' : 'w-122.75'
          }`}
        >
          {isFetching && (
            <p className='p-4 text-center text-sm text-neutral-400'>
              Searching...
            </p>
          )}

          {isError && (
            <p className='p-4 text-center text-sm text-neutral-400'>
              Search failed. Please try again.
            </p>
          )}

          {showEmpty && (
            <div className='flex min-h-36 flex-col items-center justify-center gap-2'>
              <p className='text-sm font-bold text-neutral-25'>
                No results found
              </p>
              <p className='text-xs text-neutral-400'>Change your keyword</p>
            </div>
          )}

          {users.map((user) => (
            <Link
              key={user.id}
              href={`/user/${encodeURIComponent(user.username)}`}
              onClick={() => setKeyword('')}
              className='flex min-h-14 w-full shrink-0 items-center gap-2'
            >
              <div className='relative size-12 shrink-0 overflow-hidden rounded-full bg-neutral-900'>
                {user.avatarUrl && (
                  <Image
                    src={user.avatarUrl}
                    alt=''
                    fill
                    sizes='40px'
                    className='object-cover'
                  />
                )}
              </div>

              <div className='flex h-14 min-w-0 flex-1 flex-col justify-center'>
                <p className='h-7 truncate text-sm font-bold leading-7 tracking-[-0.01em] text-neutral-25'>
                  {user.name}
                </p>
                <p className='h-7 truncate text-sm leading-7 tracking-[-0.02em] text-neutral-400'>
                  {user.username}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
