'use server';

import { cookies } from 'next/headers';

export async function fetchJson<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const authorization = cookies().get('authorization')?.value || '';
  const refreshToken = cookies().get('refreshToken')?.value || '';

  const doRequest = async (): Promise<Response> => {
    return await fetch(endpoint, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization ? { Authorization: `Bearer ${authorization}` } : {}),
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
          },
        },
      );

      if (!refresh.ok) {
        console.error('[fetchJson] Refresh 실패');
        throw new Error('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.');
      }

      // refresh 성공 후 원래 요청 재시도
      res = await doRequest();

      if (res.status === 401) {
        console.error('[fetchJson] Refresh 후에도 401 발생');
        throw new Error('다시 로그인 해주세요.');
      }
    } catch (err) {
      throw new Error('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.');
    }
  }

  if (!res.ok) {
    let errorMessage = `API 요청 실패: ${res.status} ${endpoint}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // ignore parse error
    }
    console.error('[fetchJson Error]', errorMessage);
    throw new Error(errorMessage);
  }

  return res.json();
}
