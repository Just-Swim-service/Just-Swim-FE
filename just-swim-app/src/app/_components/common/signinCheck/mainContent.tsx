'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@data';

export function MainContent() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.SCHEDULE.root);
  }, [router]);

  return null;
}
