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
  const authorization = cookies().get('authorization')?.value || '';
  const refreshToken = cookies().get('refreshToken')?.value || '';

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(authorization ? { Authorization: `Bearer ${authorization}` } : {}),
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

  let res = await requestOnce();
  console.log(res);

  if (res.status === 401) {
    try {
      const refreshRes = await fetch(`${base}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(refreshToken ? { Cookie: `refreshToken=${refreshToken}` } : {}),
        },
        credentials: 'include',
      });

      if (!refreshRes.ok) {
        redirect('/signin');
      }

      res = await requestOnce(); // 재요청
    } catch (err) {
      redirect('/signin');
    }
  }

  return res;
};

export default api;
