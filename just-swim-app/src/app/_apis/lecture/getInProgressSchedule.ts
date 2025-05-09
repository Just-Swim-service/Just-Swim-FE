'use server';

import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';

import { LectureProps } from '@types';
import { Fetch } from '@utils';

async function getInProgressSchedule(): Promise<LectureProps[] | null> {
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
    return notFound();
  }
}

export const getCachedInProgressSchedule = unstable_cache(
  async () => {
    const data = await getInProgressSchedule();
    if (!data) {
      return [];
    }
    return data;
  },
  ['in-progress-schedule'],
  {
    tags: ['schedule'],
    revalidate: 60,
  },
);
