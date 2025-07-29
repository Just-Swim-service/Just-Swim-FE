'use server';

import { redirect } from 'next/navigation';

import { getInProgressSchedule, createLecture, updateLecture } from '@apis';
import { LectureBasicProps } from '@types';

export async function formAction(
  data: LectureBasicProps,
  type: 'add' | 'modify',
  id: string,
) {
  const schedules =
    (await getInProgressSchedule())?.filter(
      (s) => !(type === 'modify' && s.lectureId === id),
    ) || [];

  const errors = {
    title: '',
    duplicate: '',
  };
  let valid = true;

  const [inputStart, inputEnd] = data.lectureTime
    .replace('~', '-')
    .split('-')
    .map((t) => parseInt(t.split(':').join('')));

  for (const schedule of schedules) {
    if (data.lectureTitle === schedule.lectureTitle) {
      valid = false;
      errors.title = '중복된 강의명이 존재합니다.';
    }

    const [targetStart, targetEnd] = schedule.lectureTime
      .split('-')
      .map((t) => parseInt(t.split(':').join('')));

    const isOverlapping = inputStart < targetEnd && inputEnd > targetStart;

    // 문자열을 문자 배열로 변환
    const inputDays = data.lectureDays.split('');
    const targetDays = schedule.lectureDays.split('');

    const hasOverlappingDay = inputDays.some((day) => targetDays.includes(day));

    if (hasOverlappingDay && isOverlapping) {
      valid = false;
      errors.duplicate = '같은 일정으로 등록된 수업이 있습니다.';
    }

    if (!valid) break;
  }

  if (!valid) {
    return errors;
  }

  if (type === 'modify') {
    const result = await updateLecture(data, id);

    if (result.success) {
      redirect(`/schedule`);
    } else {
      console.error('강의 수정 실패');
      return { error: '강의 수정에 실패했습니다.' };
    }
  } else {
    const result = await createLecture(data);

    if (result.success) {
      redirect(`/schedule/add/complete/${result.data.lectureId}`);
    } else {
      console.error('강의 생성 실패');
      return { error: '강의 생성에 실패했습니다.' };
    }
  }
}
