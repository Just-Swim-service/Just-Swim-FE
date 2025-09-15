'use server';

import api from '../api';
import { HTTP_METHODS_TYPE } from '@types';

/**
 * 알림 삭제
 */
export const deleteNotification = async (
  notificationId: number,
): Promise<void> => {
  const response = await api<{ message: string }>(
    `/notification/${notificationId}`,
    'DELETE' as HTTP_METHODS_TYPE,
  );

  if (!response.ok) {
    throw new Error('알림 삭제에 실패했습니다.');
  }
};
