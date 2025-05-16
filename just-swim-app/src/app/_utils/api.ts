'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function Fetch<T>({
  url,
  method = 'GET',
  header = { json: false },
  body = null,
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  header?: { json?: boolean };
  body?: Object | null;
}): Promise<T> {
  const accessToken = cookies().get('authorization')?.value || '';
  const refreshToken = cookies().get('refreshToken')?.value || '';

  if (!refreshToken) {
    return redirect('/signin');
  }

  const doRequest = async (token: string): Promise<Response> => {
    return await fetch(url, {
      method,
      headers: {
        ...(header.json ? { 'Content-Type': 'application/json' } : {}),
        Cookie: `authorization=${token}; refreshToken=${refreshToken}`,
      },
      credentials: 'include',
      body: body ? JSON.stringify(body) : null,
    });
  };

  let response = await doRequest(accessToken);

  if (response.status === 401) {
    try {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `refreshToken=${refreshToken}`,
          },
          credentials: 'include',
        },
      );

      if (!refreshRes.ok) {
        return redirect('/signin');
      }

      const refreshData = await refreshRes.json();
      const newAccessToken = refreshData?.accessToken;
      if (!newAccessToken) {
        return redirect('/signin');
      }

      response = await doRequest(newAccessToken);
    } catch (e) {
      console.error('refresh 실패:', e);
      return redirect('/signin');
    }
  }

  if (!response.ok) {
    console.error(`API 응답 실패: ${response.status}`);
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  try {
    return await response.json();
  } catch (error) {
    console.error('🔥 JSON 파싱 실패:', error);
    throw new Error('Error parsing response');
  }
}
