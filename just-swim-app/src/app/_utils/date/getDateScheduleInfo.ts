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
    const nowInfo: ScheduleSummary = {
      date: thisWeekInfo[i],
      day: WEEK_DAYS[i],
      lectures: [],
    };

    for (const schedule of scheduleInfo) {
      if (
        schedule.lectureEndDate &&
        new Date(thisWeekInfo[i]) > new Date(schedule.lectureEndDate)
      ) {
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

export async function getMonthlyScheduleInfo(
  month: string,
): Promise<ScheduleSummary[] | []> {
  const result: ScheduleSummary[] = [];
  const thisMonthInfo = getMonth(convertKoreanTime(new Date(month)));
  const scheduleInfo = (await getInProgressSchedule()) || [];

  for (let i = 0; i < thisMonthInfo.length; i++) {
    const nowInfo: ScheduleSummary = {
      date: thisMonthInfo[i],
      day: WEEK_DAYS[i % 7],
      lectures: [],
    };

    for (const schedule of scheduleInfo) {
      if (
        schedule.lectureEndDate &&
        new Date(thisMonthInfo[i]) > new Date(schedule.lectureEndDate)
      ) {
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

export async function getTodayScheduleCount(): Promise<number> {
  const scheduleInfo = await getWeeklyScheduleInfo();
  const today = getToday();
  return scheduleInfo[today.getDay()]?.lectures.length || 0;
}
