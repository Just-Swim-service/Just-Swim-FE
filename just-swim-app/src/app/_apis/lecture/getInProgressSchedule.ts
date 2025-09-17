'use server';

import { LectureProps } from '@types';
import { Fetch } from '@utils';

export async function getInProgressSchedule(): Promise<LectureProps[] | []> {
  console.log('🔔 [getInProgressSchedule] 함수 호출됨');
  console.log(
    '🔔 [getInProgressSchedule] NEXT_PUBLIC_API_URL:',
    process.env.NEXT_PUBLIC_API_URL,
  );

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const fullUrl = `${apiUrl}/lecture/schedule`;
  console.log('🔔 [getInProgressSchedule] 요청 URL:', fullUrl);

  try {
    const result = await Fetch<{ success: boolean; data: LectureProps[] }>({
      url: fullUrl,
      header: {
        json: true,
        credential: true,
      },
    });

    console.log('🔔 [getInProgressSchedule] 응답 결과:', result);

    if (result.success) {
      return result.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('🔔 [getInProgressSchedule] 에러 발생:', error);
    return [];
  }
}
