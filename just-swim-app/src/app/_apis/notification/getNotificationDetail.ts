'use server';

import api from '../api';
import { HTTP_METHODS_TYPE } from '@types';
import { NotificationResponse } from '@types';

/**
 * 알림 상세 조회
 */
export const getNotificationDetail = async (
  notificationId: number,
): Promise<NotificationResponse> => {
  const response = await api<NotificationResponse>(
    `/notification/${notificationId}`,
    'GET' as HTTP_METHODS_TYPE,
  );

  if (!response.ok) {
    throw new Error('알림 상세 조회에 실패했습니다.');
  }

  return response.data;
};
