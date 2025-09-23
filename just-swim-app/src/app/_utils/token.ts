'use server';

import { cookies } from 'next/headers';
import Cookies from 'js-cookie';

export const setTokenInCookies = (token: string) => {
  cookies().set('authorization', token);

  return token;
};

export const getTokenInCookies = () => {
  const token = cookies().get('authorization')?.value;

  return token || false;
};

export const removeTokenInCookies = () => {
  // 서버 사이드에서 쿠키 직접 삭제 - BE와 동일한 옵션 사용
  cookies().delete('authorization');
  cookies().delete('refreshToken');
  return;
};
