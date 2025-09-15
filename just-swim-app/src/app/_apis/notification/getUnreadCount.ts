'use server';

import api from '../api';
import { HTTP_METHODS } from '@data';
import { UnreadCountResponse } from '@types';

/**
 * 읽지 않은 알림 개수 조회
 */
export async function getUnreadCount(): Promise<any> {
  const response = await api('/notification/unread/count', HTTP_METHODS.GET);
  return response.data;
}
