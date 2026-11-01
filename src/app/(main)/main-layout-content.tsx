'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { Navbar } from '@/components/layout/navbar';
import { BottomNavigation } from '@/components/layout/button-navigation';

export default function MainLayoutContent({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const isStandalonePage =
    pathname === '/add-post' ||
    pathname === '/edit-profile' ||
    pathname === '/me';

  const isFriendProfile = pathname.startsWith('/user/');
  const hideMobileNavbar = isStandalonePage || isFriendProfile;

  return (
    <div className='min-h-screen bg-black text-neutral-25'>
      <div className={hideMobileNavbar ? 'hidden md:block' : ''}>
        <Navbar />
      </div>

      {children}

      {!isStandalonePage && <BottomNavigation />}
    </div>
  );
}
