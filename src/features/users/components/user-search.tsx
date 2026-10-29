'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, X, CircleX } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '@/features/users/api';

interface UserSearchProps {
  initialQuery?: string;
  onClose?: () => void;
  compact?: boolean;
}

export function UserSearch({
  initialQuery = '',
  onClose,
  compact = false,
}: UserSearchProps) {
  const [keyword, setKeyword] = useState(initialQuery);
  const query = keyword.trim();

  const { data, isFetching, isError } = useQuery({
    queryKey: ['user-search', query],
    queryFn: () => searchUsers(query),
    enabled: query.length > 0,
  });

  const users = data?.data.users ?? [];
  const hasResults = users.length > 0;
  const showEmpty = query.length > 0 && !isFetching && !isError && !hasResults;

  return (
    <section className='w-full'>
      <div className='flex items-center gap-3'>
        <label className='flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border border-neutral-900 bg-neutral-950 px-2.5'>
          <Search size={20} className='shrink-0 text-neutral-500' />

          <input
            autoFocus
            type='text'
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder='Search'
            aria-label='Search users'
            className='min-w-0 flex-1 bg-transparent text-xs text-neutral-25 outline-none placeholder:text-neutral-500'
          />

          {keyword && (
            <button
              type='button'
              aria-label='Clear search'
              onClick={() => setKeyword('')}
              className='text-neutral-500'
            >
              <CircleX size={20} />
            </button>
          )}
        </label>

        <button
          type='button'
          aria-label='Close search'
          onClick={onClose}
          className='shrink-0 text-neutral-25'
        >
          <X size={24} />
        </button>
      </div>

      <div
        className={
          compact
            ? 'absolute left-0 right-0 top-full z-50 mt-1 max-h-[calc(100dvh-120px)] overflow-y-auto overscroll-contain bg-neutral-950'
            : 'mt-2 max-h-[calc(100dvh-120px)] overflow-y-auto overscroll-contain'
        }
      >
        {isFetching && (
          <p className='p-4 text-center text-xs text-neutral-400'>
            Searching...
          </p>
        )}

        {isError && (
          <p className='p-4 text-center text-xs text-neutral-400'>
            Search failed. Please try again.
          </p>
        )}

        {showEmpty && (
          <div className='flex h-screen flex-col items-center justify-center gap-2 text-center'>
            <p className='text-md font-bold text-neutral-25'>
              No results found
            </p>
            <p className='text-sm text-neutral-400'>Change your keyword</p>
          </div>
        )}

        {hasResults && (
          <div className='space-y-0.5 py-2'>
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/users/${encodeURIComponent(user.username)}`}
                onClick={onClose}
                className='flex items-center gap-2 px-2 py-1.5 hover:bg-neutral-900'
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

                <div className='min-w-0'>
                  <p className='truncate text-sm font-bold text-neutral-25'>
                    {user.name}
                  </p>
                  <p className='truncate text-sm text-neutral-400'>
                    {user.username}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
