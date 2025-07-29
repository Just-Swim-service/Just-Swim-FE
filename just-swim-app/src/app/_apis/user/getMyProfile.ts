'use server';

import { notFound } from 'next/navigation';

import { ProfileProps } from '@types';
import { Fetch } from '@utils';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/user`;

export async function getMyProfile(): Promise<ProfileProps> {
  try {
    const result = await Fetch<{ success: boolean; data: ProfileProps }>({
      url: `${URL}/myProfile`,
      header: {
        credential: true,
      },
    });

    if (result.success) {
      return result.data;
    } else {
      console.error('사용자 프로필 가져오기 실패');
      throw new Error('사용자 프로필을 가져올 수 없습니다');
    }
  } catch (error) {
    console.error('사용자 프로필 가져오기 실패:', error);
    throw error;
  }
}
