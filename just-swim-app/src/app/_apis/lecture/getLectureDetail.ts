'use server';

import { notFound } from 'next/navigation';

import { LectureDetailProps } from '@types';
import { Fetch } from '@utils';

export async function getLectureDetail(
  lectureId: number,
): Promise<LectureDetailProps | null> {
  const result = await Fetch<{ success: boolean; data: LectureDetailProps }>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/lecture/${lectureId}`,
    header: {
      json: true,
      credential: true,
    },
  });

  if (result.success) {
    return result.data;
  } else {
    return notFound();
  }
}
