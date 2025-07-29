'use client';

import { getTodayScheduleCount } from '@utils';

import { ScheduleCommon } from '../scheduleCommon';
import { useEffect, useState } from 'react';
import { ScheduleCommonSkeleton } from '../skeleton';
import { usePathname } from 'next/navigation';

export function ScheduleCommonLayout() {
  const pathname = usePathname();
  const [todayCount, setTodayCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchTodayCount = async () => {
      try {
        const todayCount = await getTodayScheduleCount();
        setTodayCount(todayCount);
      } catch (error) {
        console.error('오늘 스케줄 개수 조회 실패:', error);
        setTodayCount(0);
      }
    };
    fetchTodayCount();
  }, [pathname]);

  if (todayCount === null) return <ScheduleCommonSkeleton />;

  return <ScheduleCommon count={todayCount} />;
}
