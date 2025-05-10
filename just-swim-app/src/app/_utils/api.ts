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
  const headers: Record<string, string> = {};

  if (header.json) {
    headers['Content-Type'] = 'application/json';
  }

  const token = cookies().get('authorization')?.value;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    credentials: header.credential ? 'include' : 'same-origin',
    body: body ? JSON.stringify(body) : null,
  });

  if (response.status === 401) {
    redirect('/signin');
  }

  if (!response.ok) {
    console.error(` API 응답 실패: ${response.status}`);
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  try {
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('🔥 JSON 파싱 실패:', error);
    throw new Error('Error parsing response');
  }
}
