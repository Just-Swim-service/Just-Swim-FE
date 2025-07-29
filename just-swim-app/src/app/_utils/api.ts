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
