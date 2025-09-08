'use client';

import { getTodayScheduleCount } from '@utils';
import { useErrorHandler } from '@utils';

import { ScheduleCommon } from '../scheduleCommon';
import { useEffect, useState } from 'react';
import { ScheduleCommonSkeleton } from '../skeleton';
import { usePathname } from 'next/navigation';

export function ScheduleCommonLayout() {
  const pathname = usePathname();
  const [todayCount, setTodayCount] = useState<number | null>(null);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchTodayCount = async () => {
      try {
        const todayCount = await getTodayScheduleCount();
        setTodayCount(todayCount);
      } catch (error) {
        handleError(error);
        setTodayCount(0); // 에러 시 기본값 설정
      }
    };
    fetchTodayCount();
  }, [pathname, handleError]);

  if (todayCount === null) return <ScheduleCommonSkeleton />;

  return <ScheduleCommon count={todayCount} />;
}
