'use client';

// 클라이언트 사이드에서 사용하는 API 함수
// 토큰 갱신을 자동으로 처리합니다.

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/statistics`;

type ApiResponse<T> = {
  status: number;
  ok: boolean;
  data: T;
};

async function clientApi<T>(
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const doRequest = async (): Promise<Response> => {
    return await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      credentials: 'include',
      ...options,
    });
  };

  let response = await doRequest();

  // 토큰 만료 시 refreshToken으로 갱신 시도
  if (response.status === 401) {
    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
      {
        method: 'POST',
        credentials: 'include',
      },
    );

    if (refreshResponse.ok) {
      // refresh 성공했으면 재요청
      response = await doRequest();
    } else {
      // refresh 실패 시 로그인 페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
      throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API 요청 실패');
  }

  const data = await response.json();
  // 백엔드 응답: { success: boolean, message: string, data: T }
  return { status: response.status, ok: response.ok, data };
}

// 수강생 대시보드 (클라이언트 사이드)
export async function getCustomerDashboardClient() {
  const response = await clientApi<{
    success: boolean;
    message: string;
    data: import('./index').StudentDashboard;
  }>(`${BASE_URL}/customer/dashboard`, 'GET');
  
  // 백엔드 응답 구조에 맞게 변환
  return {
    status: response.status,
    ok: response.ok,
    data: response.data,
  };
}

// 강사 대시보드 (클라이언트 사이드)
export async function getInstructorDashboardClient() {
  const response = await clientApi<{
    success: boolean;
    message: string;
    data: import('./index').InstructorDashboard;
  }>(`${BASE_URL}/instructor/dashboard`, 'GET');
  
  // 백엔드 응답 구조에 맞게 변환
  return {
    status: response.status,
    ok: response.ok,
    data: response.data,
  };
}

