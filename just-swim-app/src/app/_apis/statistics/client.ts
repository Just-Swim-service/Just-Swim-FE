'use client';

// 클라이언트 사이드에서 사용하는 API 함수
// 다른 API들과 동일하게 fetchJson을 사용합니다.

import { fetchJson } from '@utils';
import type { StudentDashboard, InstructorDashboard } from './index';

// 수강생 대시보드 (클라이언트 사이드)
export async function getCustomerDashboardClient() {
  try {
    const data = await fetchJson<{
      success: boolean;
      message: string;
      data: StudentDashboard;
    }>('/statistics/customer/dashboard');

    return {
      status: 200,
      ok: true,
      data: data,
    };
  } catch (error: any) {
    return {
      status: error.status || 500,
      ok: false,
      data: {
        success: false,
        message: error.message || '대시보드 정보를 불러오는데 실패했습니다.',
        data: null as any,
      },
    };
  }
}

// 강사 대시보드 (클라이언트 사이드)
export async function getInstructorDashboardClient() {
  try {
    const data = await fetchJson<{
      success: boolean;
      message: string;
      data: InstructorDashboard;
    }>('/statistics/instructor/dashboard');

    return {
      status: 200,
      ok: true,
      data: data,
    };
  } catch (error: any) {
    return {
      status: error.status || 500,
      ok: false,
      data: {
        success: false,
        message: error.message || '대시보드 정보를 불러오는데 실패했습니다.',
        data: null as any,
      },
    };
  }
}
