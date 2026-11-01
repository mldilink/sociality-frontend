'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface SuccessAlertProps {
  message: string;
  onClose: () => void;
}

export function SuccessAlert({ message, onClose }: SuccessAlertProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className='flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-accent-green px-3'>
      <span className='min-w-0 flex-1 truncate text-sm font-semibold leading-7 tracking-[-0.02em] text-white'>
        {message}
      </span>

      <button
        type='button'
        onClick={onClose}
        aria-label='Close alert'
        className='flex size-4 shrink-0 items-center justify-center text-white'
      >
        <X size={16} />
      </button>
    </div>
  );
}
