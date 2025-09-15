'use server';

import { Fetch } from '@utils';

/**
 * 모든 알림 삭제
 */
export async function deleteAllNotifications(): Promise<{
  success: boolean;
  message: string;
}> {
  const result = await Fetch<{
    success: boolean;
    message: string;
  }>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/notification`,
    method: 'DELETE',
    header: {
      json: true,
      credential: true,
    },
  });

  return result;
}
