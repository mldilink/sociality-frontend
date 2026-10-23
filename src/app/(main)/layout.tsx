import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { BottomNavigation } from '@/components/layout/button-navigation';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-black text-neutral-25'>
      <Navbar />
      {children}
      <BottomNavigation />
    </div>
  );
}
