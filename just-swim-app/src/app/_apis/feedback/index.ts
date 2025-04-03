import { notFound } from 'next/navigation';

import { FeedbackProps } from '@types';
import { Fetch } from '@utils';
import api from '../api';

// import { unstable_cache } from 'next/cache';

const URL = `${process.env.NEXT_PUBLIC_API_URL}/feedback`;

// async function getFeedback() {
//   const response = await fetch(URL, {
//     headers: {
//       Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
//     },
//   });
//   const json = await response.json();
//   return json.data;
// }

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
    feedbackImage: data.files?.map((file: any) => file.fileURL),
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
    feedbackImage: data.files?.map((file: any) => file.fileURL),
  };
  return await api(`/feedback/${id}`, 'PATCH', {
    body: JSON.stringify(updateValue),
  });
}

// _apis 폴더 내부로 이동
async function getFeedback(): Promise<FeedbackProps[] | null> {
  const result = await Fetch<{ success: boolean; data: FeedbackProps[] }>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/feedback`,
    header: {
      token: true,
      json: true,
      credential: true,
    },
  });
  if (result.success) {
    return result.data;
  } else {
    return notFound();
  }
}

// const getCachedFeedback = unstable_cache(getFeedback, ['feedback-list'], {
//   tags: ['feedback'],
//   revalidate: 60,
// });

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

// const getCachedSortedFeedback = unstable_cache(
//   getSortedFeedback,
//   ['sorted-feedback-list'],
//   {
//     tags: ['feedback'],
//     revalidate: 60,
//   },
// );

// 피드백 상세
async function getFeedbackDetail(id: string): Promise<FeedbackProps[] | null> {
  const result = await Fetch<{ success: boolean; data: FeedbackProps[] }>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/feedback/${id}`,
    header: {
      token: true,
      json: true,
      credential: true,
    },
  });

  if (result.success) {
    return result.data;
  } else {
    return notFound();
  }
}

export {
  getFeedback,
  postFeedback,
  getSortedFeedback,
  getFeedbackDetail,
  updateFeedback,
};
