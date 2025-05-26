'use client';

import { getTodayScheduleCount } from '@utils';
import { ScheduleCommon } from '../scheduleCommon';
import { useEffect, useState } from 'react';

export function ScheduleCommonLayout() {
  const [todayCount, setTodayCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchTodayCount = async () => {
      const todayCount = await getTodayScheduleCount();
      setTodayCount(todayCount);
    };
    fetchTodayCount();
  }, []);

  if (todayCount === null) {
    return <div>로딩 중...</div>;
  }

  return <ScheduleCommon count={todayCount} />;
}
