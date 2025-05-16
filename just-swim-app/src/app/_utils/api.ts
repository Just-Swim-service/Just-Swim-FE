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
  const accessToken = cookies().get('authorization')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  // token 처리
  const cookieHeader = `authorization=${accessToken || ''}; refreshToken=${refreshToken || ''}`;

  const buildHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};
    if (header.json) headers['Content-Type'] = 'application/json';
    headers['Cookie'] = cookieHeader;
    return headers;
  };

  const doRequest = async (): Promise<Response> => {
    return await fetch(url, {
      method,
      headers: buildHeaders(),
      credentials: header.credential ? 'include' : 'same-origin',
      body: body ? JSON.stringify(body) : null,
    });
  };

  let response = await doRequest();

  if (response.status === 401) {
    try {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookieHeader,
          },
          credentials: 'include',
        },
      );

      console.log(refreshRes);

      if (!refreshRes.ok) {
        redirect('/signin');
      }

      response = await doRequest(); // accessToken 갱신 후 재요청
    } catch (e) {
      console.error('refreshToken 만료 또는 네트워크 오류:', e);
      redirect('/signin');
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
