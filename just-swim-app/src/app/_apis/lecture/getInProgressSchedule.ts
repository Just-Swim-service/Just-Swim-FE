'use server';

import { LectureProps } from '@types';
import { Fetch } from '@utils';

export async function getInProgressSchedule(): Promise<LectureProps[] | []> {
  const result = await Fetch<{ success: boolean; data: LectureProps[] }>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/lecture/schedule`,
    header: {
      json: true,
      credential: true,
    },
  });

  if (result.success) {
    return result.data;
  } else {
    return [];
  }
}
