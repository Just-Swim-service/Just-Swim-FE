'use server';

import { HTTP_METHODS_TYPE } from '@types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
  const refreshToken = cookieStore.get('refreshToken')?.value || '';

  const buildHeaders = (token: string): HeadersInit => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  });

  const doRequest = async (token: string): Promise<ApiResponse<T>> => {
    const response = await fetch(`${base}${url}`, {
      method,
      headers: buildHeaders(token),
      body: options?.body,
      credentials: 'include',
    });

    const data = await response.json();
    return { status: response.status, ok: response.ok, data };
  };

  let res = await doRequest(accessToken);

  const isUnauthorized =
    res.status === 401 ||
    (typeof res.data === 'object' &&
      (res.data as any)?.success === false &&
      (res.data as any)?.message?.includes('로그인이 필요한 기능입니다.'));

  if (isUnauthorized) {
    try {
      const refreshRes = await fetch('/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const refreshData = await refreshRes.json();
      const newAccessToken = refreshData?.accessToken;

      if (!refreshRes.ok || !newAccessToken) {
        redirect('/signin');
      }

      redirect('/');
    } catch (e) {
      console.error('refreshToken 실패:', e);
      redirect('/signin');
    }
  }

  return res;
};

export default api;
