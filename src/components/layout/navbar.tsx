'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { getToken, getUser } from '@/features/auth/auth-storage';

import { UserSearch } from '@/features/users/components/user-search';
import { DesktopUserSearch } from '@/features/users/components/dekstop-user-search';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [auth] = useState(() => {
    const token = getToken();

    return {
      isLoggedIn: Boolean(token),
      user: token ? getUser() : null,
    };
  });

  const { isLoggedIn, user } = auth;

  return (
    <header className='fixed left-0 top-0 z-50 w-full max-w-full border-b border-neutral-900 bg-black'>
      <nav className='flex w-full min-w-0 flex-col overflow-x-clip bg-black'>
        <div className='flex h-16 w-full min-w-0 items-center gap-2 px-3 md:gap-4 md:px-15 xl:h-20 xl:px-30'>
          <div
            className={
              isSearchOpen
                ? 'hidden md:flex'
                : 'flex w-full min-w-0 flex-1 items-center justify-between gap-2 md:gap-4'
            }
          >
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

              <span className='text-xl font-bold leading-9 text-neutral-25 xl:text-2xl'>
                Sociality
              </span>
            </Link>

            {/* Search desktop */}
            <DesktopUserSearch />

            {/* Search, hamburger, dan profil */}
            <div className='flex shrink-0 items-center gap-2 md:gap-4'>
              {/* Search mobile */}
              <button
                type='button'
                aria-label='Search'
                onClick={() => setIsSearchOpen(true)}
                className='text-neutral-25 md:hidden'
              >
                <Search size={20} />
              </button>

              {/* Search tablet */}
              <DesktopUserSearch variant='tablet' />

              {isLoggedIn ? (
                <Link
                  href='/me'
                  aria-label='Profil saya'
                  className='flex min-w-0 shrink items-center gap-2 md:shrink-0 md:gap-4'
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
        </div>

        {isSearchOpen && (
          <div className='fixed inset-0 z-60 bg-black md:hidden'>
            <div className='relative mx-auto w-full max-w-150 px-4 pt-4'>
              <UserSearch onClose={() => setIsSearchOpen(false)} />
            </div>
          </div>
        )}

        {/* Login/Register mobile */}
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
