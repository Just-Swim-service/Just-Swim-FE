'use client';

import { BottomNav, SkeletonFallback, UserIconHeader } from '@components';
import { ScheduleAddButton, ScheduleCommonLayout } from './_components';
import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UserIconHeader title="" />
      <ScheduleCommonLayout />
      <Suspense fallback={<SkeletonFallback />}>{children}</Suspense>
      <BottomNav />
      <ScheduleAddButton />
    </>
  );
}
