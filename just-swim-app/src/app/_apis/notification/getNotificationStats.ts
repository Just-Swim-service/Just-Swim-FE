'use server';

import api from '../api';
import { HTTP_METHODS } from '@data';
import { NotificationStats } from '@types';

/**
 * 알림 통계 조회
 */
export async function getNotificationStats(): Promise<any> {
  const response = await api('/notification/stats', HTTP_METHODS.GET);
  return response.data;
}
