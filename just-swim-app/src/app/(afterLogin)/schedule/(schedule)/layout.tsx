'use client';

import { BottomNav, UserIconHeader } from '@components';
import { ScheduleAddButton, ScheduleCommonLayout } from './_components';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UserIconHeader title="" />
      <ScheduleCommonLayout />
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <BottomNav />
      <ScheduleAddButton />
    </>
  );
}
