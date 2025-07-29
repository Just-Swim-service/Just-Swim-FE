import { Fetch } from '@utils';
import { notFound } from 'next/navigation';

export async function getLectureMembers(
  lectureId: string,
): Promise<{ success: boolean; message: string; data: any }> {
  try {
    const result = await Fetch<{ success: boolean; data: any }>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/lecture/memberList/${lectureId}`,
      header: {
        json: true,
        credential: true,
      },
    });

    if (result.success) {
      return result.data;
    } else {
      console.error('수업 멤버 목록 가져오기 실패');
      return {
        success: false,
        message: '수업 멤버 목록을 가져올 수 없습니다',
        data: [],
      };
    }
  } catch (error) {
    console.error('수업 멤버 목록 가져오기 실패:', error);
    return {
      success: false,
      message: '수업 멤버 목록을 가져올 수 없습니다',
      data: [],
    };
  }
}
