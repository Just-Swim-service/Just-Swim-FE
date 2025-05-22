export async function fetchJson<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const doRequest = async (): Promise<Response> => {
    return await fetch(endpoint, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      credentials: 'include',
      ...options,
    });
  };

  if (typeof window !== 'undefined') {
    // ✅ CSR
    let res = await doRequest();

    if (res.status === 401) {
      // accessToken 만료 → refresh 시도
      const refresh = await fetch('/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!refresh.ok) {
        window.location.href = '/signin';
        throw new Error('세션이 만료되었습니다');
      }

      res = await doRequest(); // 새 토큰으로 재요청
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'API 요청 실패');
    }

    return res.json();
  } else {
    // ✅ SSR
    const { cookies } = await import('next/headers');
    const accessToken = cookies().get('authorization')?.value || '';
    const refreshToken = cookies().get('refreshToken')?.value || '';
    let cookieHeader = `authorization=${accessToken}; refreshToken=${refreshToken}`;

    const doSSRRequest = async (): Promise<{ res: Response; json: any }> => {
      const res = await fetch(endpoint, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
          ...(options.headers || {}),
        },
        ...options,
      });
      const json = await res.json().catch(() => ({}));
      return { res, json };
    };

    let { res, json } = await doSSRRequest();

    if (
      res.status === 401 ||
      (json?.success === false && json?.message?.includes('로그인이'))
    ) {
      const refresh = await fetch('/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!refresh.ok) {
        const { redirect } = await import('next/navigation');
        redirect('/signin');
      }

      const refreshed = await refresh.json();
      const newAccessToken = refreshed?.accessToken;
      if (!newAccessToken) {
        const { redirect } = await import('next/navigation');
        redirect('/signin');
      }

      // 새 토큰으로 헤더 교체
      cookieHeader = `authorization=${newAccessToken}; refreshToken=${refreshToken}`;
      ({ res, json } = await doSSRRequest());
    }

    if (!res.ok) {
      const error = new Error(json?.message || 'API 요청 실패') as any;
      error.status = res.status;
      error.body = json;
      throw error;
    }

    return json;
  }
}
