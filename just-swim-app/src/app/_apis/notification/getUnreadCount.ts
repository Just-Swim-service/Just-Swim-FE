'use server';

import api from '../api';
import { HTTP_METHODS_TYPE } from '@types';
import { UnreadCountResponse } from '@types';

/**
 * 읽지 않은 알림 개수 조회
 */
export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const response = await api<UnreadCountResponse>(
    '/notification/unread/count',
    'GET' as HTTP_METHODS_TYPE,
  );

  if (!response.ok) {
    throw new Error('읽지 않은 알림 개수 조회에 실패했습니다.');
  }

  return response.data;
};
