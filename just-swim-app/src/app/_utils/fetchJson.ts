'use server';

import { cookies } from 'next/headers';

export async function fetchJson<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = cookies().get('authorization')?.value || '';
  const refreshToken = cookies().get('refreshToken')?.value || '';
  const cookieHeader = `authorization=${accessToken}; refreshToken=${refreshToken}`;

  const doRequest = async (): Promise<Response> => {
    return await fetch(endpoint, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
        ...(options.headers || {}),
      },
      ...options,
    });
  };

  let res = await doRequest();

  if (res.status === 401) {
    try {
      const refresh = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieHeader,
          },
        },
      );

      if (!refresh.ok) {
        throw new Error('로그인이 필요합니다.');
      }

      // refresh 성공 후 원래 요청 재시도
      res = await doRequest();
    } catch (err) {
      throw new Error('로그인이 필요합니다.');
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'API 요청 실패');
  }

  return res.json();
}
