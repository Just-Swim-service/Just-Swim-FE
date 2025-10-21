'use server';

import { Fetch } from '@utils';
import { notFound } from 'next/navigation';

const URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export async function getProfilePresignedURL(name: string): Promise<string[]> {
  try {
    const result = await Fetch<{ success: boolean; data: string[] }>({
      url: `${URL}/user/profileImage/presignedUrl`,
      method: 'POST',
      header: {
        credential: true,
        json: true,
      },
      body: {
        profileImage: name,
      },
    });

    if (result.success) {
      return result.data;
    } else {
      console.error('프로필 이미지 presigned URL 가져오기 실패');
      return [];
    }
  } catch (error) {
    console.error('프로필 이미지 presigned URL 가져오기 실패:', error);
    return [];
  }
}

export async function getFeedbackPresignedURL(
  files: string[],
): Promise<{ fileName: string; presignedUrl: string; contentType: string }[]> {
  try {
    const result = await Fetch<{
      success: boolean;
      data: { fileName: string; presignedUrl: string; contentType: string }[];
    }>({
      url: `${URL}/feedback/feedbackImage/presignedUrl`,
      method: 'POST',
      header: {
        credential: true,
        json: true,
      },
      body: {
        files: files,
      },
    });

    if (result.success) {
      return result.data;
    } else {
      console.error('피드백 이미지 presigned URL 가져오기 실패');
      return [];
    }
  } catch (error) {
    console.error('피드백 이미지 presigned URL 가져오기 실패:', error);
    return [];
  }
}

export async function getCommunityPresignedURL(files: string[]): Promise<
  {
    fileName: string;
    presignedUrl: string;
    contentType: string;
    fileType: string;
  }[]
> {
  try {
    const result = await Fetch<{
      success: boolean;
      data: {
        fileName: string;
        presignedUrl: string;
        contentType: string;
        fileType: string;
      }[];
    }>({
      url: `${URL}/community/presigned-url`,
      method: 'POST',
      header: {
        credential: true,
        json: true,
      },
      body: {
        files: files,
      },
    });

    if (result.success) {
      return result.data;
    } else {
      console.error('커뮤니티 이미지 presigned URL 가져오기 실패');
      return [];
    }
  } catch (error) {
    console.error('커뮤니티 이미지 presigned URL 가져오기 실패:', error);
    return [];
  }
}

export async function deleteFeedbackImageFromS3(fileURL: string) {
  try {
    const result = await Fetch<{ success: boolean; data: string }>({
      url: `${URL}/image`,
      method: 'DELETE',
      header: {
        credential: true,
        json: true,
      },
      body: { fileURL },
    });

    if (result.success) {
      return result.data;
    } else {
      console.error('피드백 이미지 삭제 실패');
      return null;
    }
  } catch (error) {
    console.error('피드백 이미지 삭제 실패:', error);
    return null;
  }
}
