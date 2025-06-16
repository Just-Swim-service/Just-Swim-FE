'use client';

import { Suspense, useEffect, useState } from 'react';

import { LectureProps } from '@types';

import { WeekInfo } from '../weekInfo';
import { ClassList } from '../classList';
import { SkeletonFallback } from '@components';
import { getMyProfile } from '@apis';

export function WeekWrapper({
  weeklyInfo,
}: {
  weeklyInfo: { date: string; day: string; lectures: LectureProps[] }[];
}) {
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDay());

  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    const setUserType = async () => {
      try {
        const data = await getMyProfile();
        setType(data.data.data.userType);
      } catch (error) {
        console.error('사용자 타입 불러오기 실패:', error);
        setType('');
      }
    };

    setUserType();
  }, []);

  if (type === null) return <SkeletonFallback />;

  return (
    <>
      <WeekInfo
        weeklyInfo={weeklyInfo}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <ClassList
        weeklyInfo={weeklyInfo}
        selectedDate={selectedDate}
        userType={type}
      />
    </>
  );
}
