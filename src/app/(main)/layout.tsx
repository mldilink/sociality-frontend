'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { BottomNavigation } from '@/components/layout/button-navigation';

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAddPostPage = pathname === '/add-post';

  return (
    <div className='min-h-screen bg-black text-neutral-25'>
      {!isAddPostPage && <Navbar />}
      {children}
      {!isAddPostPage && <BottomNavigation />}
    </div>
  );
}
