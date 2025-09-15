'use server';

import api from '../api';
import { HTTP_METHODS_TYPE } from '@types';

/**
 * 모든 알림 읽음 처리
 */
export const markAllAsRead = async (): Promise<void> => {
  const response = await api<{ message: string }>(
    '/notification/read-all',
    'PATCH' as HTTP_METHODS_TYPE,
  );

  if (!response.ok) {
    throw new Error('모든 알림 읽음 처리에 실패했습니다.');
  }
};
