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
      const refresh = await fetch('/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!refresh.ok) {
        window.location.href = '/signin'; // ✅ 이건 브라우저니까 redirect OK
        throw new Error('세션이 만료되었습니다');
      }

      // refresh 성공 후 잠시 대기하여 쿠키가 업데이트되도록 함
      await new Promise((resolve) => setTimeout(resolve, 100));

      res = await doRequest(); // refresh 성공했으면 재요청
      
      // 재요청 후에도 401이면 다시 refresh 시도 (최대 1회)
      if (res.status === 401) {
        const retryRefresh = await fetch('/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (retryRefresh.ok) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          res = await doRequest();
        } else {
          window.location.href = '/signin';
          throw new Error('세션이 만료되었습니다');
        }
      }
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
    const cookieHeader = `authorization=${accessToken}; refreshToken=${refreshToken}`;

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

    // ❌ SSR에서는 Silent Refresh 안 한다
    // 그냥 에러를 던져서 클라이언트에서 처리하게 한다
    if (!res.ok) {
      const error = new Error(json?.message || 'API 요청 실패') as any;
      error.status = res.status;
      error.body = json;
      throw error;
    }

    return json;
  }
}
