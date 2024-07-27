'use server';

import { getMyProfile } from '@/_apis/users.ts';
import { getSignUp } from '@apis';
import { HTTP_METHODS, HTTP_STATUS, OnBoardingType } from '@data';
import { cookies } from 'next/headers';

const OAUTH_API_PATH = 'api/Oauth';

// TODO: url 상수화 하기
export const handleSignIn = async (param: string) => {
  const authorizationToken = cookies().get('token')?.value;

  if (authorizationToken) {
    const { status, data } = await getMyProfile();

    if (status === HTTP_STATUS.OK) {
      return { data: OnBoardingType.SIGNIN, url: '/signup/type' };
    }
  } else {
    const response = await fetch(
      `${process.env.API_PATH}/${OAUTH_API_PATH}/${param}`,
      {
        method: HTTP_METHODS.GET,
      },
    );

    if (response.status === HTTP_STATUS.OK) {
      // 토큰이 있을 때는 어떤 값오는지 확인하고 조건 추가해야할 듯
      return { data: OnBoardingType.SIGNUP, url: response.url };
    }
  }
};
