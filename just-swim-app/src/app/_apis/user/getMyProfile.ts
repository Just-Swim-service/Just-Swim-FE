'use server';

import { notFound } from 'next/navigation';

import { ProfileProps } from '@types';
import { Fetch } from '@utils';

const URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/user`;

export async function getMyProfile(): Promise<ProfileProps> {
  console.log('🔔 [getMyProfile] 함수 호출됨');
  console.log(
    '🔔 [getMyProfile] NEXT_PUBLIC_API_URL:',
    process.env.NEXT_PUBLIC_API_URL,
  );
  console.log('🔔 [getMyProfile] 요청 URL:', `${URL}/myProfile`);

  try {
    const result = await Fetch<{ success: boolean; data: ProfileProps }>({
      url: `${URL}/myProfile`,
      header: {
        credential: true,
      },
    });

    console.log('🔔 [getMyProfile] 응답 결과:', result);

    if (result.success) {
      return result.data;
    } else {
      console.error('🔔 [getMyProfile] 사용자 프로필 가져오기 실패');
      throw new Error('사용자 프로필을 가져올 수 없습니다');
    }
  } catch (error) {
    console.error('🔔 [getMyProfile] 사용자 프로필 가져오기 실패:', error);
    throw error;
  }
}
