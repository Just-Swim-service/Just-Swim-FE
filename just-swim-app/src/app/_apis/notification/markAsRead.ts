'use server';

import { Fetch } from '@utils';

/**
 * 알림 읽음 처리
 */
export async function markAsRead(notificationId: number): Promise<{
  success: boolean;
  message: string;
}> {
  const result = await Fetch<{
    success: boolean;
    message: string;
  }>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/notification/${notificationId}/read`,
    method: 'PATCH',
    header: {
      json: true,
      credential: true,
    },
  });

  return result;
}
