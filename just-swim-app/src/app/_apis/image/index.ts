'use server';

import { Fetch } from '@utils';
import { notFound } from 'next/navigation';

const URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export async function getProfilePresignedURL(name: string): Promise<string[]> { 
  const result = await Fetch<{ success: boolean; data: string[] }>({
    url: `${URL}/user/profileImage/presignedUrl`,
    method: 'POST',
    header: {
      token: true,
      credential: true,
    },
    body: {
      'profileImage': name
    }
  });

  if (result.success) {
    return result.data;
  } else {
    return notFound();
  }
}

export async function getFeedbackPresignedURL(files: string[]): Promise<{ fileName: string, presignedUrl: string }[]> {
  const result = await Fetch<{ success: boolean; data: { fileName: string, presignedUrl: string }[] }>({
    url: `${URL}/feedback/feedbackImage/presignedUrl`,
    method: 'POST',
    header: {
      token: true,
      credential: true,
      json: true,
    },
    body: {
      'files': files
    }
  });

  if (result.success) {
    return result.data;
  } else {
    return notFound();
  }
}