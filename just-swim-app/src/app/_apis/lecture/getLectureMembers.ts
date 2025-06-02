'use server';

import { cookies } from 'next/headers';

export async function getLectureMembers(
  lectureId: string,
): Promise<{ success: boolean; message: string; data: any }> {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/lecture/memberList/${lectureId}`;
  const authorizationToken = cookies().get('token')?.value;

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Authorization: authorizationToken ? `Bearer ${authorizationToken}` : '',
        'Content-Type': 'application/json',
        token: 'true',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching lecture members:', error);
    return { success: false, message: 'Failed to fetch data', data: null };
  }
}
