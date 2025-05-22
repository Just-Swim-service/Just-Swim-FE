'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function Fetch<T>({
  url,
  method = 'GET',
  header = {
    json: false,
    credential: false,
    formData: false,
  },
  body = null,
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  header?: {
    json?: boolean;
    credential?: boolean;
    formData?: boolean;
  };
  body?: Object | null;
}): Promise<T> {
  const accessToken = cookies().get('authorization')?.value || '';
  const refreshToken = cookies().get('refreshToken')?.value || '';

  // 최초 cookie header
  let cookieHeader = `authorization=${accessToken}; refreshToken=${refreshToken}`;

  const buildHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};
    if (header.json) headers['Content-Type'] = 'application/json';
    headers['Cookie'] = cookieHeader;
    return headers;
  };

  const doRequest = async (): Promise<{
    status: number;
    ok: boolean;
    data: T;
  }> => {
    const res = await fetch(url, {
      method,
      headers: buildHeaders(),
      credentials: header.credential ? 'include' : 'same-origin',
      body: body ? JSON.stringify(body) : null,
    });

    const json = await res.json();
    return { status: res.status, ok: res.ok, data: json };
  };

  let response = await doRequest();

  const isUnauthorized =
    response.status === 401 ||
    (typeof response.data === 'object' &&
      (response.data as any)?.success === false &&
      (response.data as any)?.message?.includes('로그인이 필요한 기능입니다.'));

  if (isUnauthorized) {
    try {
      const refreshRes = await fetch('/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!refreshRes.ok) {
        redirect('/signin');
      }

      const refreshData = await refreshRes.json();
      const newAccessToken = refreshData?.accessToken;
      if (!newAccessToken) {
        redirect('/signin');
      }

      // 새 토큰으로 header 교체
      cookieHeader = `authorization=${newAccessToken}; refreshToken=${refreshToken}`;

      // 새 토큰으로 재요청
      response = await doRequest();
    } catch (err) {
      console.error('❌ refresh 실패 또는 네트워크 오류:', err);
      redirect('/signin');
    }
  }

  // 이 시점까지 왔다면 성공한 응답
  return response.data;
}
