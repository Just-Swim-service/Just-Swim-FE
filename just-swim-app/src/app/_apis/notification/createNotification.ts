'use server';

import api from '../api';
import { HTTP_METHODS_TYPE } from '@types';
import { CreateNotificationRequest, NotificationResponse } from '@types';

/**
 * 알림 생성
 */
export const createNotification = async (
  data: CreateNotificationRequest,
): Promise<NotificationResponse> => {
  const response = await api<NotificationResponse>(
    '/notification',
    'POST' as HTTP_METHODS_TYPE,
    {
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error('알림 생성에 실패했습니다.');
  }

  return response.data;
};
