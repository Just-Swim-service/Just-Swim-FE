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
  // 서버 사이드에서 쿠키 삭제 - 백엔드와 동일한 옵션 사용
  cookies().set('authorization', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: '.just-swim.kr',
    path: '/',
    expires: new Date(0),
  });

  cookies().set('refreshToken', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: '.just-swim.kr',
    path: '/',
    expires: new Date(0),
  });

  return;
};
// 클라이언트 사이드에서 쿠키 삭제
export const removeTokenInCookiesClient = () => {
  Cookies.remove('authorization', {
    domain: '.just-swim.kr',
    path: '/',
  });
  Cookies.remove('refreshToken', {
    domain: '.just-swim.kr',
    path: '/',
  });
};
