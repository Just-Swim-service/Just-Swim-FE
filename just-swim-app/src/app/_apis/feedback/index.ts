import { notFound } from 'next/navigation';

import { FeedbackProps } from '@types';
import { Fetch } from '@utils';
import api from '../api';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/feedback`;

interface FeedbackValue {
  feedbackType: string;
  feedbackDate: string;
  feedbackLink: string;
  feedbackContent: string;
  feedbackTarget: string;
  feedbackImage: string[];
}

interface UpdateFeedbackValue {
  feedbackDate?: string;
  feedbackLink?: string;
  feedbackContent?: string;
  feedbackImage?: string[];
}
// @ts-ignore
async function postFeedback(data, target) {
  const value: FeedbackValue = {
    feedbackType: data.type,
    feedbackDate: data.date,
    feedbackLink: data.link,
    feedbackContent: data.content,
    feedbackTarget: target,
    feedbackImage: data.files?.map((file: any) => ({
      filePath: file.filePath || file.fileURL,
      fileType: file.fileType || file.mediaType || 'image',
      fileName: file.fileName || file.name || '',
      fileSize: file.fileSize || file.size || 0,
      duration: file.duration ?? null,
      thumbnailPath: file.thumbnailPath ?? null,
    })),
  };
  return await api('/feedback', 'POST', {
    body: JSON.stringify(value),
  });
}
// @ts-ignore
async function updateFeedback(data, id) {
  const updateValue: UpdateFeedbackValue = {
    feedbackDate: data.date,
    feedbackLink: data.link,
    feedbackContent: data.content,
    feedbackImage: data.files?.map((file: any) => ({
      filePath: file.filePath || file.fileURL,
      fileType: file.fileType || file.mediaType || 'image',
      fileName: file.fileName || file.name || '',
      fileSize: file.fileSize || file.size || 0,
      duration: file.duration ?? null,
      thumbnailPath: file.thumbnailPath ?? null,
    })),
  };
  return await api(`/feedback/${id}`, 'PATCH', {
    body: JSON.stringify(updateValue),
  });
}

// _apis 폴더 내부로 이동
async function getFeedback(): Promise<FeedbackProps[] | null> {
  try {
    const result = await Fetch<{ success: boolean; data: FeedbackProps[] }>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/feedback`,
      header: {
        json: true,
        credential: true,
      },
    });
    if (result.success) {
      return result.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('피드백 데이터 가져오기 실패:', error);
    return [];
  }
}

// _utils 폴더 내부로 이동
// 최신순으로 정렬, 날짜가 같을 경우 id 역순으로 정렬
function sortFeedback(a: FeedbackProps, b: FeedbackProps) {
  const aTime = new Date(a.feedbackCreatedAt);
  const bTime = new Date(b.feedbackCreatedAt);

  if (aTime < bTime) {
    return 1;
  } else if (aTime === bTime) {
    return parseInt(a.feedbackId) - parseInt(b.feedbackId);
  } else {
    return -1;
  }
}

// _utils 폴더 내부 등으로 이동
// 나는 _utils 폴더 내부에 뒀음
async function getSortedFeedback(): Promise<FeedbackProps[] | null> {
  const result = (await getFeedback()) || [];

  result.sort(sortFeedback);
  return result;
}

// 피드백 상세
async function getFeedbackDetail(id: string): Promise<FeedbackProps[]> {
  try {
    const result = await Fetch<{ success: boolean; data: FeedbackProps[] }>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/feedback/${id}`,
      header: {
        json: true,
        credential: true,
      },
    });

    if (result.success) {
      return result.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('피드백 상세 데이터 가져오기 실패:', error);
    return [];
  }
}

export {
  getFeedback,
  postFeedback,
  getSortedFeedback,
  getFeedbackDetail,
  updateFeedback,
};
