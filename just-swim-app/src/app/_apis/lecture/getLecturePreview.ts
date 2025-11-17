'use server';

import { Fetch } from '@utils';

export async function getLecturePreview(
  lectureIdOrToken: number | string,
  isToken: boolean = false,
) {
  try {
    const url = isToken
      ? `${process.env.NEXT_PUBLIC_API_URL}/lecture/preview?token=${encodeURIComponent(lectureIdOrToken as string)}`
      : `${process.env.NEXT_PUBLIC_API_URL}/lecture/${lectureIdOrToken}/preview`;

    const result = await Fetch<{
      success: boolean;
      message: string;
      data: {
        lectureId: number;
        lectureTitle: string;
        lectureContent: string;
        lectureTime: string;
        lectureDays: string;
        lectureLocation: string;
        lectureEndDate: string;
        instructorName: string;
        instructorProfileImage: string;
      };
    }>({
      url,
      header: {
        json: true,
        credential: false, // 미리보기는 인증 필요 없음
      },
    });

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || '강의 정보를 불러올 수 없습니다.');
    }
  } catch (error) {
    console.error('강의 미리보기 조회 실패:', error);
    throw error;
  }
}

