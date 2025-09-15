'use server';

import api from '../api';
import { HTTP_METHODS_TYPE } from '@types';

/**
 * 알림 읽음 처리
 */
export const markAsRead = async (notificationId: number): Promise<void> => {
  const response = await api<{ message: string }>(
    `/notification/${notificationId}/read`,
    'PATCH' as HTTP_METHODS_TYPE,
  );

  if (!response.ok) {
    throw new Error('알림 읽음 처리에 실패했습니다.');
  }
};
