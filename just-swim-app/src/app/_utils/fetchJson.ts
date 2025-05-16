export async function fetchJson<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (typeof window !== 'undefined') {
    // CSR (클라이언트)
    return await fetch(endpoint, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      credentials: 'include',
      ...options,
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'API 요청 실패');
      }
      return res.json();
    });
  } else {
    // SSR (서버)
    const { cookies } = await import('next/headers');
    const accessToken = cookies().get('authorization')?.value || '';
    const refreshToken = cookies().get('refreshToken')?.value || '';

    const cookieHeader = `authorization=${accessToken}; refreshToken=${refreshToken}`;

    const response = await fetch(endpoint, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'API 요청 실패');
    }

    return response.json();
  }
}
