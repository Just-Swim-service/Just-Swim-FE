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

      const refreshData = await refreshRes.json();
      const newAccessToken = refreshData?.accessToken;

      if (!refreshRes.ok || !newAccessToken) {
        redirect('/signin');
      }

      redirect('/');
    } catch (err) {
      console.error('❌ refreshToken 실패 또는 네트워크 오류:', err);
      redirect('/signin');
    }
  }

  return response.data;
}
