'use server';

import { getSignUp } from '@apis';
import { cookies } from 'next/headers';

// props type
export const userSignUp = async (param: string) => {
  const authorizationToken = cookies().get('token');

  if (!authorizationToken) {
    try {
      const response = await getSignUp(param);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return response.url;
    } catch (error) {
      // 처리 필요
      console.error('에러: ', error);
    }
  } else {
    return console.log('성공');
  }
  // type 체크 후 type 없으면 type 체크 페이지, 있으면 홉 페이지로 이동
};
