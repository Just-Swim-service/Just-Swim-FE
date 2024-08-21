import { notFound } from 'next/navigation';
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

async function postFeedback(data, type, target) {
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
      formData.append('files', el);
    });
  }

  formData.forEach((value, key) => {
    console.log(value, key);
  });

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
    body: formData,
  });

  const json = await response.json();
  return json;
}

// _types 폴더 내부로 이동
export interface FeedbackProps {
  feedbackId: string;
  feedbackType: string;
  feedbackDate: string;
  feedbackContent: string;
  lectureTitle: string;
  members: {
    memberUserId: string;
    memberProfileImage: string;
    // swagger 보니까 nickname이 넘어오는데 name이 넘어와야 할 것 같음
    // 현재 null로 넘어오기 때문에 확인 요망
    memberNickname: string | null;
  }[];
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
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': header.json ? 'application/json' : '',
        Authorization: header.token
          ? `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
          : '',
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
    url: `${process.env.NEXT_PUBLIC_DB_HOST}/feedback`,
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

export { getFeedback, postFeedback, getSortedFeedback };
