import { notFound } from 'next/navigation';

import { FeedbackProps } from '@types';
import { Fetch } from '@utils';

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
  let value = {
    feedbackType: type,
    feedbackDate: data.date,
    feedbackLink: data.link,
    feedbackContent: data.content,
    feedbackTarget: target,
  };

  let formData = new FormData();

  formData.append('feedbackDto', JSON.stringify(value));

  if (data.file) {
    Array.from(data.file).forEach((el, i) => {
      // console.log(el);
      // @ts-ignore
      formData.append('files', el);
    });
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedback`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
    body: formData,
  });

  const json = await response.json();
  return json;
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
    // return result.data;
    return [
      {
        "feedbackId": "1",
        "feedbackDate": "2024.05.22",
        "feedbackType": "group",
        "feedbackContent": "회원님! 오늘 자세는 좋았으나 마지막 스퍼트가 부족해 보였어요 호흡하실 때에도 팔 각도를 조정해 주시면...",
        "lectureTitle": "아침 2반",
        "feedbackCreatedAt": '2024.08.13',
        "members": [
          {
            "memberUserId": "2",
            "memberProfileImage": "http://k.kakaocdn.net/dn/d3UHmi/btsH8xClKxG/jGQI0gBeKrlOkneK7KYIbK/img_640x640.jpg",
            "memberNickname": "홍길동"
          }
        ]
      },
      {
        "feedbackId": "2",
        "feedbackDate": "2024.04.22",
        "feedbackType": "personal",
        "feedbackContent": "회원님! 오늘 자세는 좋았으나 마지막 스퍼트가 부족해 보였어요 호흡하실 때에도 팔 각도를 조정해 주시면...",
        "lectureTitle": "아침 1반",
        "feedbackCreatedAt": '2024.08.13',
        "members": [
          {
            "memberUserId": "2",
            "memberProfileImage": "http://k.kakaocdn.net/dn/d3UHmi/btsH8xClKxG/jGQI0gBeKrlOkneK7KYIbK/img_640x640.jpg",
            "memberNickname": "이홍길"
          }
        ]
      }
    ];
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
  // const result = await Fetch<{ success: boolean; data: FeedbackProps[] }>({
  //   url: `${process.env.NEXT_PUBLIC_API_URL}/feedback/${id}`,
  //   header: {
  //     token: true,
  //     json: true,
  //     credential: true,
  //   },
  // });

  // if (result.success) {
  //   return result.data;
  //   return result.data;
  // } else {
  //   return notFound();
  // }

  return {
    // @ts-ignore
    "feedback": [
      {
        "feedbackId": "18",
        "feedbackType": "group",
        "feedbackDate": "2024.04.22",
        "feedbackContent": "회원님! 오늘 자세는 좋았으나 마지막 스퍼트가 부족해 보였어요 호흡하실 때에도 팔 각도를 조정해 주시면...",
        "feedbackLink": "URL",
        "instructor": {
          "instructorUserId": "1",
          "instructorName": "김수영",
          "instructorProfileImage": "http://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R640x640"
        },
        "images": [
          {
            "imagePath": "https://s3.ap-northeast-2.amazonaws.com/just-swim-bucket/feedback/1/1718800708147-6.png"
          }
        ]
      }
    ],
    "feedbackTargetList": [
      {
        "lectureTitle": "asdf",
        "memberUserId": "2",
        "memberNickname": "홍길동",
        "memberProfileImage": "asdf"
      },
      {
        "lectureTitle": "asdf",
        "memberUserId": "3",
        "memberNickname": "홍길순",
        "memberProfileImage": "asdf"
      }
    ]
  };
}

export { getFeedback, postFeedback, getSortedFeedback, getFeedbackDetail };
