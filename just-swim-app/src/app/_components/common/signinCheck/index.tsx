'use client';

import { useEffect } from 'react';

export function SigninCheck() {
  useEffect(() => {
    const REFRESH_INTERVAL = 1000 * 60 * 110;

    const interval = setInterval(async () => {
      try {
        console.log('주기적으로 accessToken 갱신 시도');
        const refreshRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            method: 'POST',
            credentials: 'include',
          },
        );

        if (!refreshRes.ok) {
          console.log('Refresh 실패. 로그인 페이지로 이동합니다.');
          window.location.href = '/signin';
        } else {
          console.log('Refresh 성공. 세션 연장.');
        }
      } catch (err) {
        console.error('Silent Refresh 에러:', err);
        window.location.href = '/signin';
      }
    }, REFRESH_INTERVAL);

    // 컴포넌트 언마운트 시 clear
    return () => clearInterval(interval);
  }, []);

  return null;
}
