'use server';

import { HTTP_METHODS, HTTP_STATUS } from '@data';

const OAUTH_API_PATH = 'api/Oauth';

// TODO: url 상수화 하기
// TODO: handleSignUp 으로 이름 바꾸기
export const handleSignUp = async (param: string) => {
  const response = await fetch(
    `${process.env.API_PATH}/${OAUTH_API_PATH}/${param}`,
    {
      method: HTTP_METHODS.GET,
    },
  );

  if (response.status === HTTP_STATUS.OK) {
    return response.url as string;
  }
  //   }
};
