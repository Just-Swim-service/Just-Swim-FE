'use server';

import { cookies } from 'next/headers';

export const getUserSignUp = async (param: string) => {
  // 토큰 있는지 확인
  const authorizationToken = cookies().get('token');

  if (!authorizationToken) {
    try {
      const response = await fetch(
        `${process.env.API_PATH}/api/Oauth/${param}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return response.url;
    } catch (error) {
      // 처리 필요
      console.error('에러: ', error);
    }
  } else {
    return;
  }
};

//   console.log('cookieStore: ', cookieStore);
