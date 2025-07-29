'use server';

import { ProfileProps } from '@types';
import { Fetch } from '@utils';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/user`;

export async function getMyProfile(): Promise<ProfileProps | null> {
  const result = await Fetch<{ success: boolean; data: ProfileProps }>({
    url: `${URL}/myProfile`,
    header: {
      credential: true,
    },
  });

  if (result.success) {
    return result.data;
  } else {
    console.error('사용자 프로필 조회 실패');
    return null;
  }
}
