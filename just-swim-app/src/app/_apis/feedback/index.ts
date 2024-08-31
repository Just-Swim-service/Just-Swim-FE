import { FeedbackProps } from '@/_types/typeFeedback';
import { getTokenInCookies } from '@utils';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
// import { unstable_cache } from 'next/cache';

const URL = `${process.env.NEXT_PUBLIC_DB_HOST}/feedback`;

// async function getFeedback() {
//   const response = await fetch(URL, {
//     headers: {
//       Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
//     },
//   });
//   const json = await response.json();
//   return json.data;
// }

// @ts-ignore
async function postFeedback(data, type, target) {
  const authorizationToken = getTokenInCookies();

  let value = {
    feedbackType: type,
    feedbackDate: data.date,
    feedbackLink: data.link,
    feedbackContent: data.content,
    feedbackTarget: target,
  };

  // console.log('val', value);
  let formData = new FormData();
  formData.append('feedbackDto', JSON.stringify(value));

  if (data.file) {
    Array.from(data.file).forEach((el, i) => {
      // console.log(el);
      // @ts-ignore
      formData.append('files', el);
    });
  }

  formData.forEach((value, key) => {
    console.log(value, key);
  });

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedback`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authorizationToken}`,
    },
    body: formData,
  });

  const json = await response.json();
  return json;
}

// 이 부분은 무시해도 좋음
async function Fetch<T>({
  url,
  method = 'GET',
  header = {
    token: false,
    json: false,
    credential: false,
  },
  body = null,
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELsETE';
  header?: {
    token?: boolean;
    json?: boolean;
    credential?: boolean;
  };
  body?: Object | null;
}): Promise<T> {
  const authorizationToken = await getTokenInCookies();

  console.log('token: ', authorizationToken);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': header.json ? 'application/json' : '',
        Authorization: header.token ? `Bearer ${authorizationToken}` : '',
        credentials: header.credential ? 'include' : '',
      },
      body: body && JSON.stringify(body),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    return notFound();
  }
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

// 피드백 사셍
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

export { getFeedback, postFeedback, getSortedFeedback, getFeedbackDetail };
