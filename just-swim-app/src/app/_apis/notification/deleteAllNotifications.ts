'use server';

import api from '../api';
import { HTTP_METHODS_TYPE } from '@types';

/**
 * 모든 알림 삭제
 */
export const deleteAllNotifications = async (): Promise<void> => {
  const response = await api<{ message: string }>(
    '/notification',
    'DELETE' as HTTP_METHODS_TYPE,
  );

  if (!response.ok) {
    throw new Error('모든 알림 삭제에 실패했습니다.');
  }
};
