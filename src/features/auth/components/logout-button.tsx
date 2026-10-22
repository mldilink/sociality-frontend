'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/features/auth/logout';

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function handleLogout() {
    setIsLoggingOut(true);
    logoutUser();
    router.replace('/login');
    router.refresh();
  }

  return (
    <button
      type='button'
      onClick={handleLogout}
      disabled={isLoggingOut}
      className='rounded-full bg-primary px-xl py-md text-text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-200 disabled:opacity-60'
    >
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
}
