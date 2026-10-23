'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getToken, getUser } from '@/features/auth/auth-storage';
import type { AuthUser } from '@/features/auth/types';

export function Navbar() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = getToken();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(Boolean(token));
    setUser(token ? getUser() : null);
  }, []);

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-neutral-900 bg-black'>
      <nav className='mx-auto flex w-full flex-col bg-black'>
        {/* Baris atas */}
        <div className='flex h-16 w-full items-center justify-between gap-4 px-4 md:px-15 xl:h-20 xl:gap-6 xl:px-30'>
          {/* Logo */}
          <Link
            href='/feed'
            aria-label='Sociality Home'
            className='flex shrink-0 items-center gap-2.75'
          >
            <Image
              src='/icons/logo.svg'
              alt='Sociality'
              width={30}
              height={30}
            />

            <span className='text-2xl font-bold leading-9 text-neutral-25'>
              Sociality
            </span>
          </Link>

          {/* Search desktop */}
          <label className='hidden h-12 w-full min-w-0 items-center gap-1.5 rounded-full border border-neutral-900 bg-neutral-950 px-4 xl:flex xl:w-122.75'>
            <Search size={20} className='shrink-0 text-neutral-500' />
            <input
              type='search'
              placeholder='Search'
              aria-label='Search'
              className='min-w-0 flex-1 bg-transparent text-sm text-neutral-25 outline-none placeholder:text-neutral-600'
            />
          </label>

          {/* Search, hamburger, dan profil */}
          <div className='flex shrink-0 items-center gap-4'>
            {/* Search mobile */}
            <button
              type='button'
              aria-label='Search'
              className='text-neutral-25 md:hidden'
            >
              <Search size={20} />
            </button>

            {/* Search tablet */}
            <label className='hidden h-12 w-50 min-w-0 items-center gap-1.5 rounded-full border border-neutral-900 bg-neutral-950 px-4 md:flex xl:hidden'>
              <Search size={20} className='shrink-0 text-neutral-500' />
              <input
                type='search'
                placeholder='Search'
                aria-label='Search'
                className='min-w-0 flex-1 bg-transparent text-sm text-neutral-25 outline-none placeholder:text-neutral-600'
              />
            </label>

            {isLoggedIn ? (
              <Link
                href='/me'
                aria-label='Profil saya'
                className='flex shrink-0 items-center gap-3.25'
              >
                <div className='relative size-10 overflow-hidden rounded-full bg-neutral-900 xl:size-12'>
                  {user?.avatarUrl && (
                    <Image
                      src={user.avatarUrl}
                      alt=''
                      fill
                      sizes='(min-width: 1280px) 48px, 40px'
                      className='object-cover'
                    />
                  )}
                </div>

                <span className='hidden max-w-18.25 truncate text-base font-bold text-neutral-25 xl:block'>
                  {user?.name ?? 'Profile'}
                </span>
              </Link>
            ) : (
              <>
                {/* Hamburger mobile */}
                <button
                  type='button'
                  aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
                  aria-expanded={isMenuOpen}
                  onClick={() => setIsMenuOpen((open) => !open)}
                  className='text-neutral-25 md:hidden'
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Login/Register desktop */}
                <div className='hidden items-center gap-3 md:flex'>
                  <Link
                    href='/login'
                    className='rounded-full border border-neutral-900 px-4 py-2 text-sm font-bold text-neutral-25'
                  >
                    Login
                  </Link>

                  <Link
                    href='/register'
                    className='rounded-full bg-primary-300 px-4 py-2 text-sm font-bold text-neutral-25'
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Baris kedua: Login/Register mobile */}
        {!isLoggedIn && isMenuOpen && (
          <div className='flex h-14 w-full items-center gap-3 px-4 pb-4 md:hidden'>
            <Link
              href='/login'
              onClick={() => setIsMenuOpen(false)}
              className='flex h-10 flex-1 items-center justify-center rounded-full border border-neutral-900 text-sm font-bold text-neutral-25'
            >
              Login
            </Link>

            <Link
              href='/register'
              onClick={() => setIsMenuOpen(false)}
              className='flex h-10 flex-1 items-center justify-center rounded-full bg-primary-300 text-sm font-bold text-neutral-25'
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
