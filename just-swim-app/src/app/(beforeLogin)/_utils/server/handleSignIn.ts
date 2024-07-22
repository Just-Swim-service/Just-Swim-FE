'use server';

import { getMyProfile } from '@/_apis/users.ts';
import { getSignUp } from '@apis';
import { OnBoardingType } from '@data';
import { cookies } from 'next/headers';

// props type
export const handleSignIn = async (param: string) => {
  const authorizationToken = cookies().get('token')?.value;

  if (authorizationToken) {
    // 쿠키에 토큰 있을 때, 유효한지 서버와 체크해봐야한다. - 프로필 조회 체크
    const response = await getMyProfile();
    if (response.ok) {
      // type 체크 후 type 없으면 type 체크 페이지, 있으면 홉 페이지로 이동
      // TODO: 상수화 하기
      return { data: OnBoardingType.SIGNIN, url: '/signup/type' };
    }
  }
  try {
    // TODO: useGetSignUp 으로 에러 처리 로직까지 있는 hook 만들기?
    const response = await getSignUp(param);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    return { data: OnBoardingType.SIGNUP, url: response.url };
  } catch (error) {
    // 처리 필요
  }
};
