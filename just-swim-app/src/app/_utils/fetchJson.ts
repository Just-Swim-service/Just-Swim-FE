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
      const errorBody = await response.json().catch(() => ({}));
      const error = new Error(errorBody.message || 'API 요청 실패') as any;
      error.status = response.status; // ✅ 추가
      error.body = errorBody; // ✅ 선택 사항 (상세 디버깅 시 유용)
      throw error;
    }

    return response.json();
  }
}
