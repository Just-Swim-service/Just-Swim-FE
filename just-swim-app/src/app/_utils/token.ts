'use server';

import { cookies } from 'next/headers';
import Cookies from 'js-cookie';

export const setTokenInCookies = (token: string) => {
  cookies().set('token', token);

  return token;
};

export const getTokenInCookies = () => {
  const token = cookies().get('token')?.value;

  return token || false;
};

export const removeTokenInCookies = () => {
  // 서버 사이드에서 쿠키 삭제
  cookies().set('authorization', '', {
    expires: new Date(0),
  });

  cookies().set('refreshToken', '', {
    expires: new Date(0),
  });

  return;
};

// 클라이언트 사이드에서 쿠키 삭제
export const removeTokenInCookiesClient = () => {
  Cookies.remove('authorization');
  Cookies.remove('refreshToken');
};
