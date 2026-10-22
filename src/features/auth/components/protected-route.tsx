'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { hasSession } from '@/features/auth/session';
import { SESSION_EVENT } from '@/features/auth/auth-storage';

function subscribe(callback: () => void) {
  window.addEventListener(SESSION_EVENT, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(SESSION_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getSnapshot() {
  return hasSession();
}

function getServerSnapshot() {
  return false;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) {
    return (
      <div className='flex min-h-dvh items-center justify-center bg-background text-foreground'>
        Loading...
      </div>
    );
  }

  return children;
}
