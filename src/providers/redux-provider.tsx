'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';
import type { ReactNode } from 'react';

export function ReduxProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
