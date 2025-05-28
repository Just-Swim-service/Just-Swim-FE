'use client';

import { getTodayScheduleCount } from '@utils';

import { ScheduleCommon } from '../scheduleCommon';
import { useEffect, useState } from 'react';
import { ScheduleCommonSkeleton } from '../skeleton';

export function ScheduleCommonLayout() {
  const [todayCount, setTodayCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchTodayCount = async () => {
      const todayCount = await getTodayScheduleCount();
      console.log('🎯 todayCount (client):', todayCount);
      setTodayCount(todayCount);
    };
    fetchTodayCount();
  }, []);

  if (todayCount === null) return <ScheduleCommonSkeleton />;

  return <ScheduleCommon count={todayCount} />;
}
