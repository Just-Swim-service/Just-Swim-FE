'use server';

import { Fetch } from '@utils';

/**
 * 알림 삭제
 */
export async function deleteNotification(notificationId: number): Promise<{
  success: boolean;
  message: string;
}> {
  const result = await Fetch<{
    success: boolean;
    message: string;
  }>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/notification/${notificationId}`,
    method: 'DELETE',
    header: {
      json: true,
      credential: true,
    },
  });

  return result;
}
