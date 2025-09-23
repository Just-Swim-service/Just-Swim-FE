'use client';

import Cookies from 'js-cookie';

// 클라이언트 사이드에서만 사용되는 쿠키 삭제 함수
export const removeClientCookies = () => {
  try {
    // 모든 가능한 조합으로 쿠키 삭제 시도
    const domains = ['.just-swim.kr', 'just-swim.kr', window.location.hostname];
    const paths = ['/', ''];

    domains.forEach((domain) => {
      paths.forEach((path) => {
        // authorization 쿠키 삭제
        Cookies.remove('authorization', { domain, path });
        Cookies.remove('authorization', { domain, path, secure: true });
        Cookies.remove('authorization', { domain, path, sameSite: 'none' });

        // refreshToken 쿠키 삭제
        Cookies.remove('refreshToken', { domain, path });
        Cookies.remove('refreshToken', { domain, path, secure: true });
        Cookies.remove('refreshToken', { domain, path, sameSite: 'none' });
      });
    });

    // 기본 삭제 (옵션 없이)
    Cookies.remove('authorization');
    Cookies.remove('refreshToken');

    console.log('클라이언트 쿠키 삭제 완료');
  } catch (error) {
    console.error('클라이언트 쿠키 삭제 중 오류:', error);
  }
};

// 쿠키 존재 여부 확인 함수
export const checkCookiesExist = () => {
  const authExists = !!Cookies.get('authorization');
  const refreshExists = !!Cookies.get('refreshToken');

  console.log('쿠키 존재 여부:', {
    authorization: authExists,
    refreshToken: refreshExists,
  });

  return { authExists, refreshExists };
};
