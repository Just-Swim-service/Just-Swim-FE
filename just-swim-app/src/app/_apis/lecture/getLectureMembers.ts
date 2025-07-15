'use server';

import { Fetch } from '@utils';
import { notFound } from 'next/navigation';

export async function getLectureMembers(
  lectureId: string,
): Promise<{ success: boolean; message: string; data: any }> {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/lecture/memberList/${lectureId}`;

  const result = await Fetch<{ success: boolean; data: any }>({
    url: API_URL,
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
