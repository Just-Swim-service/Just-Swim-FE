'use server';

import { HTTP_METHODS_TYPE } from '@types';
import { cookies } from 'next/headers';

type ApiResponse<T> = {
  status: number;
  ok: boolean;
  data: T;
};

const base = process.env.NEXT_PUBLIC_API_URL!;

const api = async <T>(
  url: string,
  method: HTTP_METHODS_TYPE,
  options?: RequestInit,
): Promise<ApiResponse<T>> => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('authorization')?.value || '';

  const buildHeaders = (token: string): HeadersInit => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  });

  const doRequest = async (): Promise<Response> => {
    return await fetch(`${base}${url}`, {
      method,
      headers: buildHeaders(accessToken),
      body: options?.body,
      credentials: 'include',
    });
  };

  let response = await doRequest();

  // 토큰 만료 시 refreshToken으로 갱신 시도
  if (response.status === 401) {
    const refreshResponse = await fetch(`${base}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshResponse.ok) {
      // refresh 성공했으면 재요청
      response = await doRequest();
    } else {
      // refresh 실패 시 로그아웃 처리
      cookieStore.set('authorization', '', { expires: new Date(0) });
      cookieStore.set('refreshToken', '', { expires: new Date(0) });

      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
  }

  const data = await response.json();
  return { status: response.status, ok: response.ok, data };
};

export default api;
