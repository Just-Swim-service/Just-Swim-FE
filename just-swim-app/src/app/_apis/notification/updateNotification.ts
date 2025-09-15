'use server';

import api from '../api';
import { HTTP_METHODS_TYPE } from '@types';
import { UpdateNotificationRequest, NotificationResponse } from '@types';

/**
 * 알림 수정
 */
export const updateNotification = async (
  notificationId: number,
  data: UpdateNotificationRequest,
): Promise<NotificationResponse> => {
  const response = await api<NotificationResponse>(
    `/notification/${notificationId}`,
    'PATCH' as HTTP_METHODS_TYPE,
    {
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error('알림 수정에 실패했습니다.');
  }

  return response.data;
};
