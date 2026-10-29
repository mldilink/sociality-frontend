'use client';

import Link from 'next/link';

import { Home, Plus, UserRound } from 'lucide-react';

export function BottomNavigation() {
  return (
    <nav
      aria-label='Navigasi utama'
      className='fixed bottom-4 left-1/2 z-49 flex h-16 w-86.25 max-w-[calc(100%-32px)] -translate-x-1/2 items-center justify-center gap-11.25 rounded-full border border-neutral-900 bg-neutral-950/95 backdrop-blur-[50px] md:bottom-8 md:h-20 md:w-90'
    >
      <Link
        href='/feed'
        className='flex h-11.5 w-23.5 flex-col items-center justify-center gap-0.5 md:h-14.5 md:gap-1'
      >
        <Home size={20} className='text-primary-200 md:size-6' />
        <span className='text-xs font-bold text-primary-200 md:text-base'>
          Home
        </span>
      </Link>

      <Link
        href='/posts/create'
        aria-label='Add post'
        className='flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-300 text-neutral-25 md:size-12'
      >
        <Plus size={22} className='md:size-6' />
      </Link>

      <Link
        href='/me'
        className='flex h-9.5 w-23.5 flex-col items-center justify-center gap-0.5 md:h-14.5 md:gap-1'
      >
        <UserRound size={20} className='text-neutral-25 md:size-6' />
        <span className='text-xs text-neutral-25 md:text-base'>Profile</span>
      </Link>
    </nav>
  );
}
