'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';

export function BottomNavigation() {
  const pathname = usePathname();

  const isHomeActive = pathname === '/' || pathname === '/feed';
  const isProfileActive = pathname === '/me';

  return (
    <nav
      aria-label='Navigasi utama'
      className='fixed bottom-4 left-1/2 z-49 flex h-16 w-86.25 max-w-[calc(100%-32px)] -translate-x-1/2 items-center justify-center gap-11.25 rounded-full border border-neutral-900 bg-neutral-950/95 backdrop-blur-[50px] md:bottom-8 md:h-20 md:w-90'
    >
      <Link
        href='/'
        aria-current={isHomeActive ? 'page' : undefined}
        className='flex h-11.5 w-23.5 flex-col items-center justify-center gap-0.5 md:h-14.5 md:gap-1'
      >
        <span
          aria-hidden='true'
          className={`size-5 md:size-6 ${
            isHomeActive ? 'bg-primary-200' : 'bg-neutral-25'
          }`}
          style={{
            maskImage: "url('/icons/Home.svg')",
            WebkitMaskImage: "url('/icons/Home.svg')",
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
          }}
        />

        <span
          className={`text-xs md:text-base ${
            isHomeActive ? 'font-bold text-primary-200' : 'text-neutral-25'
          }`}
        >
          Home
        </span>
      </Link>

      <Link
        href='/add-post'
        aria-label='Add post'
        className='flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-300 text-neutral-25 md:size-12'
      >
        <Plus size={22} className='md:size-6' />
      </Link>

      <Link
        href='/me'
        aria-current={isProfileActive ? 'page' : undefined}
        className='flex h-9.5 w-23.5 flex-col items-center justify-center gap-0.5 md:h-14.5 md:gap-1'
      >
        <span
          aria-hidden='true'
          className={`size-5 md:size-6 ${
            isProfileActive ? 'bg-primary-200' : 'bg-neutral-25'
          }`}
          style={{
            maskImage: "url('/icons/Profile.svg')",
            WebkitMaskImage: "url('/icons/Profile.svg')",
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
          }}
        />

        <span
          className={`text-xs md:text-base ${
            isProfileActive ? 'font-bold text-primary-200' : 'text-neutral-25'
          }`}
        >
          Profile
        </span>
      </Link>
    </nav>
  );
}
