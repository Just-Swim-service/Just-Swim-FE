'use server';

import { unstable_cache } from 'next/cache';

import { ProfileProps } from '@types';
import { Fetch } from '@utils';
import { notFound } from 'next/navigation';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/user`;

async function getMyProfile(): Promise<ProfileProps> { 
  const result = await Fetch<{ success: boolean; data: ProfileProps }>({
    url: `${URL}/myProfile`,
    header: {
      token: true,
      credential: true,
    }
  });

  if (result.success) {
    return result.data;
  } else {
    return notFound();
  }
}

export const getCachedMyProfile = unstable_cache(getMyProfile, ['my-profile'], {
  tags: ['my-profile'],
});
