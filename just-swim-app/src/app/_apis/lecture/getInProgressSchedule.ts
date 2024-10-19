'use server';

import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';

import { LectureProps } from '@types';
import { Fetch } from '@utils';

async function getInProgressSchedule(): Promise<LectureProps[] | null> {
  const result = await Fetch<{ success: boolean; data: LectureProps[] }>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/lecture/schedule`,
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
          "lectureId": "66",
          "lectureTitle": "tedsafas",
          "lectureContent": "tesf",
          "lectureTime": "16:00-17:00",
          "lectureDays": "일",
          "lectureLocation": "강동구 실외 수영장",
          "lectureColor": "#14ABFF",
          "lectureQRCode": "https://just-swim-bucket.s3.ap-northeast-2.amazonaws.com/qrcodes/66.png",
          "lectureEndDate": "2024.10.30",
          "members": []
      },
      {
          "lectureId": "67",
          "lectureTitle": "tedsafas",
          "lectureContent": "tesf",
          "lectureTime": "16:00-17:00",
          "lectureDays": "토",
          "lectureLocation": "강동구 실외 수영장",
          "lectureColor": "#14ABFF",
          "lectureQRCode": "https://just-swim-bucket.s3.ap-northeast-2.amazonaws.com/qrcodes/67.png",
          "lectureEndDate": "2024.10.30",
          "members": []
      },
      {
          "lectureId": "68",
          "lectureTitle": "tedsafas",
          "lectureContent": "tesf",
          "lectureTime": "12:00-13:00",
          "lectureDays": "월",
          "lectureLocation": "강동구 실외 수영장",
          "lectureColor": "#14ABFF",
          "lectureQRCode": "https://just-swim-bucket.s3.ap-northeast-2.amazonaws.com/qrcodes/68.png",
          "lectureEndDate": "2024.10.30",
          "members": []
      }
    ]
  } else {
    return notFound();
  }
}

export const getCachedInProgressSchedule = unstable_cache(
  getInProgressSchedule,
  ['in-progress-schedule'],
  {
    tags: ['schedule'],
    revalidate: 60,
  },
);
