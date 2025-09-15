'use server';

import api from '../api';
import { HTTP_METHODS } from '@data';
import { CreateNotificationRequest, NotificationResponse } from '@types';

/**
 * 알림 생성
 */
export async function createNotification(
  data: CreateNotificationRequest,
): Promise<any> {
  const response = await api('/notification', HTTP_METHODS.POST, {
    body: JSON.stringify(data),
  });
  return response.data;
}
