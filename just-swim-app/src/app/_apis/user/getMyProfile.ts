'use server';

import { notFound } from 'next/navigation';

import { ProfileProps } from '@types';
import { Fetch } from '@utils';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/user`;

export async function getMyProfile(): Promise<ProfileProps> {
  const result = await Fetch<{ success: boolean; data: ProfileProps }>({
    url: `${URL}/myProfile`,
    header: {
      credential: true,
    },
  });

  if (result.success) {
    return result.data;
  } else {
    return notFound();
  }
}
