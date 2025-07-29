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

  return response.data;
}

/**
 * API 응답을 안전하게 처리하는 함수
 * @param apiCall API 호출 함수
 * @param fallbackValue 실패 시 반환할 기본값
 * @returns API 응답 또는 기본값
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  fallbackValue: T,
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    console.error('API 호출 실패:', error);
    return fallbackValue;
  }
}

/**
 * API 응답의 success 필드를 확인하여 안전하게 데이터를 반환하는 함수
 * @param result API 응답 결과
 * @param fallbackValue 실패 시 반환할 기본값
 * @returns 성공 시 데이터, 실패 시 기본값
 */
export function safeApiResponse<T>(
  result: { success: boolean; data: T } | null,
  fallbackValue: T,
): T {
  if (result && result.success) {
    return result.data;
  }
  return fallbackValue;
}
