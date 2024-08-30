'use server';

import { revalidateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { createLecture, getCachedInProgressSchedule, updateLecture } from "@apis";
import { LectureBasicProps } from "@types";

export async function formAction(data: LectureBasicProps, type: 'add' | 'modify', id: string) {
  const schedules = await getCachedInProgressSchedule() || [];

  const errors = {
    title: '', 
    duplicate: ''
  }
  let valid = true;
  const [inputStart, inputEnd] = data.lectureTime.split('~').map(t => parseInt(t.split(':').join('')));

  for (const schedule of schedules) {
    if (data.lectureTitle === schedule.lectureTitle) {
      valid = false;
      errors.title = '중복된 강의명이 존재합니다.';
    }
    
    const [targetStart, targetEnd] = schedule.lectureTime.split('-').map(t => parseInt(t.split(':').join('')));
    
    for (const day of data.lectureDays) {
      if (schedule.lectureDays.includes(day) && ((inputStart >= targetStart && inputStart <= targetEnd) || (inputEnd >= targetStart && inputEnd <= targetEnd))) {
        valid = false;
        errors.duplicate = '같은 일정으로 등록된 수업이 있습니다.';
      }
    }
  }

  if (!valid) {
    return errors;
  }

  if (type === 'modify') {
    const result = await updateLecture(data, id);

    if (result.success) {
      revalidateTag('schedule');
      revalidateTag(`lecture-detail`);
      redirect(`/schedule`);
    } else {
      return notFound();
    }
  } else {
    const result = await createLecture(data);

    if (result.success) {
      revalidateTag('schedule');
      redirect(`/schedule/add/complete/${result.data.lectureId}`);
    } else {
      return notFound();
    }
  }
}