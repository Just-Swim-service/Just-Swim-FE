'use server';

import { UpdateNotificationRequest } from '@types';
import { Fetch } from '@utils';

/**
 * 알림 수정
 */
export async function updateNotification(
  notificationId: number,
  data: UpdateNotificationRequest,
): Promise<{
  success: boolean;
  message: string;
  data: any;
}> {
  const result = await Fetch<{
    success: boolean;
    message: string;
    data: any;
  }>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/notification/${notificationId}`,
    method: 'PATCH',
    body: data,
    header: {
      json: true,
      credential: true,
    },
  });

  return result;
}
