'use server';

import api from '../api';
import { HTTP_METHODS_TYPE } from '@types';
import { NotificationList, NotificationFilterOptions } from '@types';

/**
 * 알림 목록 조회
 */
export const getNotifications = async (
  options?: NotificationFilterOptions,
): Promise<NotificationList> => {
  const params = new URLSearchParams();

  if (options?.page) {
    params.append('page', options.page.toString());
  }
  if (options?.pageSize) {
    params.append('pageSize', options.pageSize.toString());
  }
  if (options?.status) {
    params.append('status', options.status);
  }
  if (options?.type) {
    params.append('type', options.type);
  }

  const queryString = params.toString();
  const url = queryString ? `/notification?${queryString}` : '/notification';

  const response = await api<NotificationList>(url, 'GET' as HTTP_METHODS_TYPE);

  if (!response.ok) {
    console.error('알림 목록 조회 실패:', response.status, response.data);
    throw new Error(`알림 목록 조회에 실패했습니다. (${response.status})`);
  }

  return response.data;
};
