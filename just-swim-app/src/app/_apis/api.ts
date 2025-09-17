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
  console.log(`🔔 [API] 요청 시작: ${method} ${url}`);

  const cookieStore = cookies();
  const accessToken = cookieStore.get('authorization')?.value || '';
  console.log(`🔔 [API] accessToken 존재 여부:`, !!accessToken);

  const buildHeaders = (token: string): HeadersInit => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  });

  const doRequest = async (): Promise<Response> => {
    console.log(`🔔 [API] 실제 요청 실행: ${base}${url}`);
    return await fetch(`${base}${url}`, {
      method,
      headers: buildHeaders(accessToken),
      body: options?.body,
      credentials: 'include',
    });
  };

  let response = await doRequest();
  console.log(`🔔 [API] 첫 번째 응답 상태:`, response.status);

  // 토큰 만료 시 refreshToken으로 갱신 시도
  if (response.status === 401) {
    console.log('🔔 [API] 401 에러 발생, 토큰 갱신 시도');

    const refreshResponse = await fetch(`${base}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    console.log(`🔔 [API] 토큰 갱신 응답 상태:`, refreshResponse.status);

    if (refreshResponse.ok) {
      console.log('🔔 [API] 토큰 갱신 성공, 재요청 실행');
      // refresh 성공했으면 재요청
      response = await doRequest();
      console.log(`🔔 [API] 재요청 응답 상태:`, response.status);
    } else {
      console.log('🔔 [API] 토큰 갱신 실패, 로그아웃 처리');
      // refresh 실패 시 로그아웃 처리
      cookieStore.set('authorization', '', { expires: new Date(0) });
      cookieStore.set('refreshToken', '', { expires: new Date(0) });

      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
  }

  const data = await response.json();
  console.log(`🔔 [API] 최종 응답:`, {
    status: response.status,
    ok: response.ok,
    data,
  });
  return { status: response.status, ok: response.ok, data };
};

export default api;
