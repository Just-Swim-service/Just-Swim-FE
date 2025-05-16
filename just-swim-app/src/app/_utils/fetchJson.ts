'use server';

import { cookies } from 'next/headers';

export async function fetchJson<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'API 요청 실패');
  }

  return res.json();
}
