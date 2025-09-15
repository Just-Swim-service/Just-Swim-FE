'use server';

import api from '../api';
import { HTTP_METHODS_TYPE } from '@types';
import { NotificationStats } from '@types';

/**
 * 알림 통계 조회
 */
export const getNotificationStats = async (): Promise<NotificationStats> => {
  const response = await api<NotificationStats>(
    '/notification/stats',
    'GET' as HTTP_METHODS_TYPE,
  );

  if (!response.ok) {
    console.error('알림 통계 조회 실패:', response.status, response.data);
    throw new Error(`알림 통계 조회에 실패했습니다. (${response.status})`);
  }

  return response.data;
};
