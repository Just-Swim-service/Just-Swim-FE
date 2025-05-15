'use server';

import { HTTP_METHODS_TYPE } from '@types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type Response<T> = {
  status: number;
  data: T;
};

const base = process.env.NEXT_PUBLIC_API_URL!;

const api = async <T>(
  url: string,
  method: HTTP_METHODS_TYPE,
  options?: RequestInit,
): Promise<Response<T>> => {
  const authorization = cookies().get('authorization')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Cookie: `authorization=${authorization}; refreshToken=${refreshToken}`,
    ...(options?.headers || {}),
  };

  const defaultOptions: RequestInit = {
    method,
    headers: defaultHeaders,
    body: options?.body,
    credentials: 'include',
  };

  const requestOnce = async (): Promise<Response<T>> => {
    const response = await fetch(`${base}${url}`, defaultOptions);
    const data = await response.json();
    return { status: response.status, data };
  };

  const res = await requestOnce();

  if (res.status === 401) {
    try {
      // 1. refresh 요청
      const refreshRes = await fetch(`${base}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      // 2. refresh 실패 → 로그아웃 or 리디렉션
      if (!refreshRes.ok) {
        redirect('/signin'); // refreshToken도 만료된 경우
      }

      // 3. refresh 성공 → 원래 요청 재시도
      const retriedRes = await requestOnce();
      return retriedRes;
    } catch (err) {
      redirect('/signin'); // 예외 발생 시에도 로그인 페이지로
    }
  }

  return res;
};

export default api;
