'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { FeedbackProps } from '@types';
import { getFeedbackDetail } from '@apis';

import NoProfile from '@/_assets/images/no_profile.png';
import Person from '@/_assets/svg/person.svg';
import Class from '@/_assets/svg/class.svg';
import Group from '@/_assets/svg/group.svg';
import { IconCalendar } from '@assets';

import styled from './styles.module.scss';

export function CustomerFeedbackCard({ feedback }: { feedback: FeedbackProps }) {
  const router = useRouter();

  const goToFeedbackDetail = (feedbackId: string) => {
    router.push(`feedback/feedbackDetail/${feedbackId}`);
  };

  const [feedbackDetail, setFeedbackDetail] = useState(null);

  useEffect(() => {
    const getDetail = async () => {
      const result = await getFeedbackDetail(feedback.feedbackId);

      // @ts-ignore
      setFeedbackDetail(result.feedback[0]);
    };

    getDetail();
  }, [feedback.feedbackId]);

  return (
    <div
      className={styled.container}
      onClick={() => goToFeedbackDetail(feedback.feedbackId)}>
      <div className={styled.header}>
        <div className={styled.instructor_info}>
          <div className={styled.instructor_image}>
            <Image
              src={
                // @ts-ignore
                feedbackDetail?.instructor?.instructorProfileImage || NoProfile
              }
              // @ts-ignore
              alt={`${feedbackDetail?.instructor?.instructorName}`}
              width={20}
              height={20}
              priority
            />
          </div>
          <div className={styled.instructor_name}>
            {/* @ts-ignore */}
            <p>{`${feedback?.instructor?.instructorName} 강사`}</p>
          </div>
        </div>
      </div>
      <div className={styled.content}>
        <div className={styled.main_content}>
          <div className={styled.detail}>
            <p>{feedback.feedbackContent}</p>
          </div>
          {
            // @ts-ignore
            feedbackDetail?.images[0]?.imagePath && (
              <div className={styled.feedback_image}>
                <Image
                  // @ts-ignore
                  src={feedbackDetail?.images[0]?.imagePath}
                  // @ts-ignore
                  alt={`feedback image`}
                  width={52}
                  height={52}
                />
              </div>
            )
          }
        </div>
      </div>
      <div className={styled.extra}>
        {feedback.feedbackType === 'personal' ? (
          <div className={styled.extra_container}>
            <div className={styled.class}>
              <Class width={16} height={16} fill={'#5c5e62'} />
              <p>{feedback.lectureTitle}</p>
            </div>
            <div className={styled.feedback_date}>
              <IconCalendar width={16} height={16} fill={'#5c5e62'} />
              <p>{`${parseInt(feedback.feedbackDate.split('.')[1])}월 ${parseInt(feedback.feedbackDate.split('.')[2])}일`}</p>
            </div>
            <div className={styled.type}>
              <Person width={16} height={16} fill={'#5c5e62'} />
              <p>개별 메시지</p>
            </div>
          </div>
        ) : (
          <div className={styled.extra_container}>
            <div className={styled.class}>
              <Class width={16} height={16} fill={'#5c5e62'} />
              <p>{feedback.lectureTitle}</p>
            </div>
            <div className={styled.feedback_date}>
              <IconCalendar width={16} height={16} fill={'#5c5e62'} />
              <p>{`${parseInt(feedback.feedbackDate.split('.')[1])}월 ${parseInt(feedback.feedbackDate.split('.')[2])}일`}</p>
            </div>
            <div className={styled.type}>
              <Group width={16} height={16} fill={'#5c5e62'} />
              <p>단체 메시지</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
