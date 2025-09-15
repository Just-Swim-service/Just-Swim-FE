'use server';

import api from '../api';
import { HTTP_METHODS } from '@data';
import { NotificationList, NotificationFilterOptions } from '@types';

/**
 * 알림 목록 조회
 */
export async function getNotifications(
  options?: NotificationFilterOptions,
): Promise<any> {
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

  const response = await api(url, HTTP_METHODS.GET);
  return response.data;
}
