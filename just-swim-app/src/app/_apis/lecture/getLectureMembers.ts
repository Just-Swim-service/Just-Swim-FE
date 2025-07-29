import { Fetch } from '@utils';

export async function getLectureMembers(
  lectureId: string,
): Promise<{ success: boolean; message: string; data: any } | null> {
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
    console.error(`강의 멤버 목록 조회 실패: lectureId ${lectureId}`);
    return null;
  }
}
