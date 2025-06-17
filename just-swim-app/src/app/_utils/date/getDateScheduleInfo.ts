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

function normalizeDate(date: string | Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getWeeklyScheduleInfo(): Promise<ScheduleSummary[] | []> {
  const result: ScheduleSummary[] = [];
  const thisWeekInfo = getThisWeek();
  const scheduleInfo = (await getInProgressSchedule()) || [];

  for (let i = 0; i < thisWeekInfo.length; i++) {
    const targetDate = normalizeDate(thisWeekInfo[i]);

    const nowInfo: ScheduleSummary = {
      date: thisWeekInfo[i],
      day: WEEK_DAYS[i],
      lectures: [],
    };

    for (const schedule of scheduleInfo) {
      const endDate = schedule.lectureEndDate
        ? normalizeDate(schedule.lectureEndDate)
        : null;
      const createdAt = normalizeDate(schedule.lectureCreatedAt);

      if (endDate && targetDate > endDate) {
        continue;
      }

      if (targetDate < createdAt) {
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
    const targetDate = normalizeDate(thisMonthInfo[i]);

    const nowInfo: ScheduleSummary = {
      date: thisMonthInfo[i],
      day: WEEK_DAYS[i % 7],
      lectures: [],
    };

    for (const schedule of scheduleInfo) {
      const endDate = schedule.lectureEndDate
        ? normalizeDate(schedule.lectureEndDate)
        : null;
      const createdAt = normalizeDate(schedule.lectureCreatedAt);

      if (endDate && targetDate > endDate) {
        continue;
      }

      if (targetDate < createdAt) {
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
