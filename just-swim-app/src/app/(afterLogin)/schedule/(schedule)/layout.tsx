'use client';

import { BottomNav, UserIconHeader } from '@components';
import { ScheduleAddButton, ScheduleCommonLayout } from './_components';
import { Suspense, useEffect, useState } from 'react';
import { getTokenInCookies, setTokenInCookies } from '@utils';
import { useSearchParams } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useSearchParams().get('token');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const fetchToken = async () => {
      if (params) {
        setTokenInCookies(params);
      }

      const token = await getTokenInCookies();
      setToken(token || '');
    };

    fetchToken();
  }, [params]);

  return (
    <>
      <UserIconHeader title="" />
      <ScheduleCommonLayout />
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <BottomNav />
      <ScheduleAddButton token={token || ''} />
    </>
  );
}
