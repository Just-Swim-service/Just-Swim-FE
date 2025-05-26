'use server';

import { getInProgressSchedule } from '@apis';
import { sortSchedule } from '@utils';
import { ScheduleSummary } from '@types';
import { WEEK_DAYS } from '@data';

import {
  convertKoreanTime,
  getMonth,
  getThisWeek,
  getToday,
} from './getDateInfo';

export async function getWeeklyScheduleInfo(): Promise<ScheduleSummary[] | []> {
  const result: ScheduleSummary[] = [];
  const thisWeekInfo = getThisWeek();
  const scheduleInfo = (await getInProgressSchedule()) || [];

  for (let i = 0; i < thisWeekInfo.length; i++) {
    const currentDate = new Date(thisWeekInfo[i]);
    const currentDay = WEEK_DAYS[i];

    const nowInfo: ScheduleSummary = {
      date: thisWeekInfo[i],
      day: currentDay,
      lectures: [],
    };

    for (const schedule of scheduleInfo) {
      const createdDate = new Date(schedule.lectureCreatedAt);
      const endDate = schedule.lectureEndDate
        ? new Date(schedule.lectureEndDate)
        : null;

      const isOngoing =
        (!endDate || currentDate <= endDate) && currentDate >= createdDate;

      const isCorrectDay = schedule.lectureDays.includes(currentDay);

      if (isOngoing && isCorrectDay) {
        nowInfo.lectures.push(schedule);
      }
    }

    nowInfo.lectures.sort(sortSchedule);
    result.push(nowInfo);
  }

  return result;
}

export async function getMonthlyScheduleInfo(
  month: string,
): Promise<ScheduleSummary[] | []> {
  const result: ScheduleSummary[] = [];
  const thisMonthInfo = getMonth(convertKoreanTime(new Date(month)));
  const scheduleInfo = (await getInProgressSchedule()) || [];

  for (let i = 0; i < thisMonthInfo.length; i++) {
    const currentDate = new Date(thisMonthInfo[i]);
    const currentDay = WEEK_DAYS[currentDate.getDay()];

    const nowInfo: ScheduleSummary = {
      date: thisMonthInfo[i],
      day: currentDay,
      lectures: [],
    };

    for (const schedule of scheduleInfo) {
      const createdDate = new Date(schedule.lectureCreatedAt);
      const endDate = schedule.lectureEndDate
        ? new Date(schedule.lectureEndDate)
        : null;

      const isOngoing =
        (!endDate || currentDate <= endDate) && currentDate >= createdDate;

      const isCorrectDay = schedule.lectureDays.includes(currentDay);

      if (isOngoing && isCorrectDay) {
        nowInfo.lectures.push(schedule);
      }
    }

    nowInfo.lectures.sort(sortSchedule);
    result.push(nowInfo);
  }

  return result;
}

export async function getTodayScheduleCount(): Promise<number> {
  const scheduleInfo = await getWeeklyScheduleInfo();
  const today = getToday();
  const todayString = `${today.getFullYear()}.${(today.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${today.getDate().toString().padStart(2, '0')}`;

  const todaySchedule = scheduleInfo.find((s) => s.date === todayString);

  return todaySchedule?.lectures.length || 0;
}
