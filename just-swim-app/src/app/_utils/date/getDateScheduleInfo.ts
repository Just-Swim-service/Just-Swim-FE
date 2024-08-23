'use server';

import { unstable_cache } from 'next/cache';

import { getCachedInProgressSchedule } from "@apis";
import { sortSchedule } from '@utils';
import { ScheduleSummary } from '@types';
import { WEEK_DAYS } from '@data';

import { convertKoreanTime, getMonth, getThisWeek, getToday } from "./getDateInfo";

async function getWeeklyScheduleInfo(): Promise<ScheduleSummary[] | []> {
  const result = [];
  
  const thisWeekInfo = getThisWeek();
  const scheduleInfo = await getCachedInProgressSchedule() || [];

  for (let i = 0; i < thisWeekInfo.length; i++) {
    const nowInfo: ScheduleSummary = {
      date: thisWeekInfo[i],
      day: WEEK_DAYS[i],
      lectures: [],
    };
    
    for (const schedule of scheduleInfo) {
      if (schedule.lectureEndDate && new Date(thisWeekInfo[i]) > new Date(schedule.lectureEndDate)) {
        continue;
      }
      
      if (!schedule.lectureDays.includes(WEEK_DAYS[i])) {
        continue;
      }

      nowInfo.lectures.push(schedule);
    }

    nowInfo.lectures.sort(sortSchedule);
    result.push(nowInfo);
  }

  return result;
}

export const getCachedWeeklyScheduleInfo = unstable_cache(
  getWeeklyScheduleInfo,
  ['weekly-schedule'],
  {
    tags: ['schedule'],
    revalidate: 60,
  }
);

async function getMonthlyScheduleInfo(month: string): Promise<ScheduleSummary[] | []> {
  const result = [];
  
  const thisMonthInfo = getMonth(convertKoreanTime(new Date(month)));
  const scheduleInfo = await getCachedInProgressSchedule() || [];

  for (let i = 0; i < thisMonthInfo.length; i++) {
    const nowInfo: ScheduleSummary = {
      date: thisMonthInfo[i],
      day: WEEK_DAYS[i % 7],
      lectures: [],
    };
    
    for (const schedule of scheduleInfo) {
      if (schedule.lectureEndDate && new Date(thisMonthInfo[i]) > new Date(schedule.lectureEndDate)) {
        continue;
      }      

      if (!schedule.lectureDays.includes(WEEK_DAYS[i % 7])) {
        continue;
      }

      nowInfo.lectures.push(schedule);
    }

    nowInfo.lectures.sort(sortSchedule);
    result.push(nowInfo);
  }

  return result;
}

export async function getCachedMonthlyScheduleInfo(month: string) {
  const cachedData = unstable_cache(
    getMonthlyScheduleInfo,
    ['monthly-schedule'],
    {
      tags: ['schedule', `schedule-${month}`],
      revalidate: 60,
    }
  );

  return cachedData(month);
};

export async function getTodayScheduleCount() {
  const scheduleInfo = await getWeeklyScheduleInfo();
  
  const today = getToday();

  return scheduleInfo[today.getDay()].lectures.length;
}