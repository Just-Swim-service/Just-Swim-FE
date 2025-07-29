'use server';

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
    console.error(`강의 상세 정보 조회 실패: lectureId ${lectureId}`);
    return null;
  }
}
