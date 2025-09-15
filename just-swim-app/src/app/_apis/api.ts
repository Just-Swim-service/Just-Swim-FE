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
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json; charset=utf-8',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  });

  const response = await fetch(`${base}${url}`, {
    method,
    headers: buildHeaders(accessToken),
    body: options?.body,
    credentials: 'include',
  });

  const data = await response.json();
  return { status: response.status, ok: response.ok, data };
};

export default api;
