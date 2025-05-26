'use client';

import { getTodayScheduleCount } from '@utils';

import { ScheduleCommon } from '../scheduleCommon';
import { useEffect, useState } from 'react';

export function ScheduleCommonLayout() {
  const [todayCount, setTodayCount] = useState<number | null>(0);

  useEffect(() => {
    const fetchTodayCount = async () => {
      const todayCount = await getTodayScheduleCount();
      setTodayCount(todayCount);
    };
    fetchTodayCount();
  }, []);

  return (
    <>
      <ScheduleCommon count={todayCount || 0} />
    </>
  );
}
