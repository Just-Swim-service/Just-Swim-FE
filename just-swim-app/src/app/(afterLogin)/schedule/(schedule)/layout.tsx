'use client';

import { BottomNav, UserIconHeader } from '@components';
import { ScheduleAddButton, ScheduleCommonLayout } from './_components';
import { Suspense, useEffect, useState } from 'react';
import { setTokenInCookies } from '@utils';
import { useSearchParams } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useSearchParams().get('token');

  useEffect(() => {
    if (params) {
      setTokenInCookies(params);
    }
  }, [params]);

  return (
    <>
      <UserIconHeader title="" />
      <ScheduleCommonLayout />
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <BottomNav />
      <ScheduleAddButton token={params || ''} />
    </>
  );
}
