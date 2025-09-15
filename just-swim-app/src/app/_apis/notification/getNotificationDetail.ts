'use server';

import api from '../api';
import { HTTP_METHODS } from '@data';
import { NotificationResponse } from '@types';

/**
 * 알림 상세 조회
 */
export async function getNotificationDetail(
  notificationId: number,
): Promise<any> {
  const response = await api(
    `/notification/${notificationId}`,
    HTTP_METHODS.GET,
  );
  return response.data;
}
