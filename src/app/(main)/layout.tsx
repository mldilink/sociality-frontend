import { Suspense } from 'react';
import type { ReactNode } from 'react';
import MainLayoutContent from './main-layout-content';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className='min-h-screen bg-black' />}>
      <MainLayoutContent>{children}</MainLayoutContent>
    </Suspense>
  );
}
