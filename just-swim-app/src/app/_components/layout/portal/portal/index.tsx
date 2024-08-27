'use client';

import React, { ReactElement, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function Portal({ children, type = 'modal' }: { children: ReactElement, type?: 'modal' | 'toast' }) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  if (typeof window === 'undefined') return <></>;

  return mounted ? createPortal(children, document.getElementById(`${type}-portal`) as HTMLElement) : <></>;
};