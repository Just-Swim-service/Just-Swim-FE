'use server';

import { cookies } from 'next/headers';

export async function fetchJson<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = cookies().get('authorization')?.value || '';
  const refreshToken = cookies().get('refreshToken')?.value || '';

  console.log(accessToken, refreshToken);

  const cookieHeader = `authorization=${accessToken || ''}; refreshToken=${refreshToken || ''}`;

  const doRequest = async (): Promise<Response> => {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
        ...(options.headers || {}),
      },
      credentials: 'include',
      ...options,
    });

    console.log('✅ doRequest response status:', response.status);
    console.log('✅ doRequest response:', response);

    return response;
  };

  let res = await doRequest();

  if (res.status === 401) {
    try {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieHeader,
          },
          credentials: 'include',
        },
      );

      if (!refreshRes.ok) {
        throw new Error('로그인이 필요합니다.');
      }

      // refresh 후 다시 쿠키로 요청
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
